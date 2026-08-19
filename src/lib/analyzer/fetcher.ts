import * as cheerio from "cheerio";
import { lookup } from "node:dns/promises";
import { isIP } from "node:net";
import type { AssetInfo, CrawlContext, PageSnapshot } from "./types";

const UA =
  "Mozilla/5.0 (compatible; SlopCheck/1.0; +https://github.com/) AppleWebKit/537.36 Chrome/124 Safari/537.36";

const PAGE_TIMEOUT_MS = 9000;
const ASSET_TIMEOUT_MS = 7000;
/** Corte de lectura de body para no volar la memoria en assets enormes. */
const MAX_BODY_BYTES = 3_000_000;

/** Hosts privados/locales que no se permiten (evita SSRF contra la red interna). */
const BLOCKED_HOST = /^(localhost|127\.|0\.|10\.|192\.168\.|169\.254\.|172\.(1[6-9]|2\d|3[01])\.|\[?::1\]?)/i;

export class AnalyzeError extends Error {}

/** Rangos reservados: loopback, red privada, link-local y compartidos. */
function isPrivateAddress(ip: string): boolean {
  if (isIP(ip) === 6) {
    const v6 = ip.toLowerCase();
    if (v6 === "::1" || v6 === "::") return true;
    if (/^(fc|fd|fe8|fe9|fea|feb)/.test(v6)) return true;
    // IPv4 mapeada dentro de IPv6.
    const mapped = v6.match(/::ffff:(\d+\.\d+\.\d+\.\d+)$/);
    return mapped ? isPrivateAddress(mapped[1]) : false;
  }
  const [a, b] = ip.split(".").map(Number);
  if (a === 10 || a === 127 || a === 0) return true;
  if (a === 172 && b >= 16 && b <= 31) return true;
  if (a === 192 && b === 168) return true;
  if (a === 169 && b === 254) return true;
  if (a === 100 && b >= 64 && b <= 127) return true;
  return false;
}

/**
 * Un dominio público puede resolver a una IP interna. Se comprueba la
 * resolución real antes de pedir nada, y otra vez si hubo redirección.
 */
async function assertPublicHost(hostname: string): Promise<void> {
  if (isIP(hostname)) {
    if (isPrivateAddress(hostname)) throw new AnalyzeError("Esa dirección apunta a una red privada.");
    return;
  }
  let addresses: { address: string }[];
  try {
    addresses = await lookup(hostname, { all: true });
  } catch {
    throw new AnalyzeError(`No se pudo resolver ${hostname}. Revisá que el dominio exista.`);
  }
  if (addresses.some((a) => isPrivateAddress(a.address))) {
    throw new AnalyzeError("Ese dominio resuelve a una red privada y no se puede analizar.");
  }
}

/** Normaliza lo que pegó el usuario a una URL http(s) válida y pública. */
export function normalizeUrl(input: string): URL {
  const raw = input.trim();
  if (!raw) throw new AnalyzeError("Pegá una URL para analizar.");
  // Un esquema distinto de http(s) se rechaza acá: si no, al anteponer
  // https:// el mensaje de error terminaba siendo el equivocado.
  const scheme = raw.match(/^([a-z][a-z0-9+.-]*):\/\//i)?.[1].toLowerCase();
  if (scheme && scheme !== "http" && scheme !== "https") {
    throw new AnalyzeError("Solo se pueden analizar URLs http o https.");
  }
  const withProtocol = scheme ? raw : `https://${raw}`;
  let url: URL;
  try {
    url = new URL(withProtocol);
  } catch {
    throw new AnalyzeError("Esa URL no es válida.");
  }
  if (url.protocol !== "http:" && url.protocol !== "https:") {
    throw new AnalyzeError("Solo se pueden analizar URLs http o https.");
  }
  if (BLOCKED_HOST.test(url.hostname) || !url.hostname.includes(".")) {
    throw new AnalyzeError("No se pueden analizar direcciones locales o privadas.");
  }
  return url;
}

/** GET con timeout que nunca tira: los errores viajan dentro del snapshot. */
export async function fetchPage(url: string, timeout = PAGE_TIMEOUT_MS): Promise<PageSnapshot> {
  const started = Date.now();
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);
  try {
    const res = await fetch(url, {
      redirect: "follow",
      signal: controller.signal,
      headers: {
        "user-agent": UA,
        accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "accept-language": "es-ES,es;q=0.9,en;q=0.8",
      },
      cache: "no-store",
    });
    const buf = await res.arrayBuffer();
    const sliced = buf.byteLength > MAX_BODY_BYTES ? buf.slice(0, MAX_BODY_BYTES) : buf;
    const body = new TextDecoder("utf-8", { fatal: false }).decode(sliced);
    const headers: Record<string, string> = {};
    res.headers.forEach((v, k) => {
      headers[k.toLowerCase()] = v;
    });
    return {
      url,
      finalUrl: res.url || url,
      status: res.status,
      ok: res.ok,
      contentType: headers["content-type"] ?? "",
      headers,
      body,
      bytes: buf.byteLength,
      ms: Date.now() - started,
    };
  } catch (err) {
    return {
      url,
      finalUrl: url,
      status: 0,
      ok: false,
      contentType: "",
      headers: {},
      body: "",
      bytes: 0,
      ms: Date.now() - started,
      error: err instanceof Error ? err.message : "fetch failed",
    };
  } finally {
    clearTimeout(timer);
  }
}

/** Devuelve el snapshot solo si respondió 200 con contenido. */
function okOrNull(p: PageSnapshot): PageSnapshot | null {
  return p.ok && p.body.trim().length > 0 ? p : null;
}

const AI_ENDPOINTS = [
  "api.openai.com",
  "api.anthropic.com",
  "generativelanguage.googleapis.com",
  "api.x.ai",
  "api.mistral.ai",
  "api.cohere.ai",
  "api.groq.com",
  "openrouter.ai/api",
  "api.deepseek.com",
];

/** Descarga un asset, mide su peso y busca sourcemap y endpoints de IA. */
async function inspectAsset(url: string, kind: "js" | "css"): Promise<AssetInfo> {
  const res = await fetchPage(url, ASSET_TIMEOUT_MS);
  const info: AssetInfo = {
    url,
    kind,
    bytes: res.bytes,
    status: res.status,
    sourcemapExposed: false,
    aiEndpoints: [],
  };
  if (!res.ok) return info;

  if (kind === "js") {
    info.aiEndpoints = AI_ENDPOINTS.filter((e) => res.body.includes(e));
  }

  // El comentario //# sourceMappingURL no alcanza: hay que confirmar que el .map se sirve.
  const match = res.body.match(/[#@]\s*sourceMappingURL=([^\s*'"]+)/);
  if (match && !match[1].startsWith("data:")) {
    try {
      const mapUrl = new URL(match[1], url).toString();
      const map = await fetchPage(mapUrl, ASSET_TIMEOUT_MS);
      info.sourcemapExposed = map.ok && map.body.includes('"sources"');
    } catch {
      /* URL de sourcemap inválida: no cuenta como expuesto */
    }
  }
  return info;
}

/** Texto visible de la página, sin scripts, estilos ni etiquetas. */
export function extractVisibleText($: cheerio.CheerioAPI): string {
  const clone = $.root().clone();
  clone.find("script, style, noscript, svg, template").remove();
  return clone.text().replace(/\s+/g, " ").trim();
}

/** Rutas típicas donde vive cada página legal, en español e inglés. */
const TERMS_PATHS = ["/terminos", "/terms", "/legal"];
const PRIVACY_PATHS = ["/privacidad", "/privacy", "/privacy-policy"];

/** Busca en los enlaces de la home una página que matchee las palabras dadas. */
function findLinkByWords(links: string[], words: RegExp): string | null {
  return links.find((l) => words.test(l)) ?? null;
}

/**
 * Descarga la home y todo lo que rodea al sitio (robots, sitemap, llms.txt,
 * legales, un 404 provocado, una segunda página interna y los assets del head).
 */
export async function crawl(input: string): Promise<CrawlContext> {
  const started = Date.now();
  const base = normalizeUrl(input);
  await assertPublicHost(base.hostname);

  const home = await fetchPage(base.toString());
  if (!home.ok && home.status === 0) {
    throw new AnalyzeError(
      `No se pudo acceder a ${base.hostname}. Revisá que la URL exista y que el sitio esté online.`,
    );
  }
  if (home.status >= 400) {
    throw new AnalyzeError(`El sitio respondió ${home.status}. Probá con la URL exacta de la home.`);
  }
  if (!/html/i.test(home.contentType) && !/<html/i.test(home.body)) {
    throw new AnalyzeError("Esa URL no devuelve una página HTML.");
  }
  // La redirección pudo llevar a otro host: se vuelve a validar.
  const finalHost = new URL(home.finalUrl).hostname;
  if (finalHost !== base.hostname) await assertPublicHost(finalHost);

  const origin = new URL(home.finalUrl).origin;
  const $ = cheerio.load(home.body);

  // --- Enlaces internos y externos -----------------------------------------
  const internal = new Set<string>();
  const external = new Set<string>();
  $("a[href]").each((_, el) => {
    const href = $(el).attr("href");
    if (!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:")) return;
    try {
      const abs = new URL(href, home.finalUrl);
      if (abs.origin === origin) {
        abs.hash = "";
        internal.add(abs.toString());
      } else if (abs.protocol.startsWith("http")) {
        external.add(abs.toString());
      }
    } catch {
      /* href roto: se ignora */
    }
  });
  const internalLinks = [...internal];

  // --- Assets del documento ------------------------------------------------
  const assetUrls: { url: string; kind: "js" | "css" }[] = [];
  $("script[src]").each((_, el) => {
    const src = $(el).attr("src");
    if (!src) return;
    try {
      assetUrls.push({ url: new URL(src, home.finalUrl).toString(), kind: "js" });
    } catch {
      /* src roto */
    }
  });
  $('link[rel="stylesheet"][href]').each((_, el) => {
    const href = $(el).attr("href");
    if (!href) return;
    try {
      assetUrls.push({ url: new URL(href, home.finalUrl).toString(), kind: "css" });
    } catch {
      /* href roto */
    }
  });

  // --- Página legal: primero por enlace real, si no por ruta típica ---------
  const termsHref = findLinkByWords(internalLinks, /term|condicion|legal/i);
  const privacyHref = findLinkByWords(internalLinks, /privac/i);

  // --- Segunda página interna para comparar título y descripción -----------
  const secondaryHref =
    internalLinks.find(
      (l) => l !== home.finalUrl && l !== `${origin}/` && !/privac|term|condicion|legal|cookie/i.test(l),
    ) ?? null;

  const notFoundUrl = `${origin}/slopcheck-404-${Math.random().toString(36).slice(2, 8)}`;

  const [robots, sitemapXml, llms, llm, notFound, secondary, termsPage, privacyPage] = await Promise.all([
    fetchPage(`${origin}/robots.txt`),
    fetchPage(`${origin}/sitemap.xml`),
    fetchPage(`${origin}/llms.txt`),
    fetchPage(`${origin}/llm.txt`),
    fetchPage(notFoundUrl),
    secondaryHref ? fetchPage(secondaryHref) : Promise.resolve(null),
    termsHref ? fetchPage(termsHref) : probePaths(origin, TERMS_PATHS),
    privacyHref ? fetchPage(privacyHref) : probePaths(origin, PRIVACY_PATHS),
  ]);

  // --- Favicon: declarado en el head o el /favicon.ico por defecto ----------
  const declaredIcon = $('link[rel~="icon"], link[rel="shortcut icon"], link[rel="apple-touch-icon"]').attr("href");
  let favicon: PageSnapshot | null = null;
  try {
    const iconUrl = declaredIcon
      ? new URL(declaredIcon, home.finalUrl).toString()
      : `${origin}/favicon.ico`;
    if (declaredIcon?.startsWith("data:")) {
      favicon = { ...home, url: iconUrl, body: "", bytes: 1, status: 200, ok: true };
    } else {
      favicon = await fetchPage(iconUrl, ASSET_TIMEOUT_MS);
    }
  } catch {
    favicon = null;
  }

  // Los assets se inspeccionan en paralelo pero acotados, para no colgar el request.
  const assets = await Promise.all(assetUrls.slice(0, 14).map((a) => inspectAsset(a.url, a.kind)));

  // El sitemap puede no estar en /sitemap.xml: si robots.txt declara otra ruta, se sigue.
  let sitemapOk = okOrNull(sitemapXml);
  if (!sitemapOk && robots.ok) {
    const declared = robots.body.match(/sitemap:\s*(https?:\/\/\S+)/i)?.[1];
    if (declared) sitemapOk = okOrNull(await fetchPage(declared, ASSET_TIMEOUT_MS));
  }

  return {
    input,
    base: new URL(home.finalUrl),
    home,
    secondary: secondary && secondary.ok ? secondary : null,
    legal: { terms: termsPage && termsPage.ok ? termsPage : null, privacy: privacyPage && privacyPage.ok ? privacyPage : null },
    robots: okOrNull(robots),
    sitemap: sitemapOk,
    llms: okOrNull(llms) ?? okOrNull(llm),
    notFound,
    favicon,
    assets,
    totalJsBytes: assets.filter((a) => a.kind === "js").reduce((n, a) => n + a.bytes, 0),
    brokenAssets: assets.filter((a) => a.status >= 400 || a.status === 0).map((a) => a.url),
    internalLinks,
    externalLinks: [...external],
    visibleText: extractVisibleText($),
    fetchMs: Date.now() - started,
    source: "url",
    unavailable: [],
  };
}

/** Prueba varias rutas candidatas y devuelve la primera que responde 200. */
async function probePaths(origin: string, paths: string[]): Promise<PageSnapshot | null> {
  const results = await Promise.all(paths.map((p) => fetchPage(`${origin}${p}`, ASSET_TIMEOUT_MS)));
  return results.find((r) => r.ok && r.body.trim().length > 200) ?? null;
}
