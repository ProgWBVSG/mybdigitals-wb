import * as cheerio from "cheerio";
import JSZip from "jszip";
import { AnalyzeError, extractVisibleText } from "./fetcher";
import type { AssetInfo, CrawlContext, PageSnapshot } from "./types";

/** Archivo subido, ya leído a memoria. */
export interface UploadedFile {
  name: string;
  bytes: Uint8Array;
}

const MAX_TOTAL_BYTES = 12 * 1024 * 1024;
const MAX_FILES = 400;

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

/** Señales que dependen de la red y nunca se pueden juzgar desde archivos. */
const NETWORK_ONLY = [23, 32];

function decode(bytes: Uint8Array): string {
  return new TextDecoder("utf-8", { fatal: false }).decode(bytes);
}

function snapshot(name: string, bytes: Uint8Array): PageSnapshot {
  return {
    url: `archivo://${name}`,
    finalUrl: `archivo://${name}`,
    status: 200,
    ok: true,
    contentType: "text/html",
    headers: {},
    body: decode(bytes),
    bytes: bytes.byteLength,
    ms: 0,
  };
}

/** Descomprime los ZIP y devuelve la lista plana de archivos. */
export async function expandUploads(files: UploadedFile[]): Promise<UploadedFile[]> {
  const out: UploadedFile[] = [];
  for (const file of files) {
    if (!/\.zip$/i.test(file.name)) {
      out.push(file);
      continue;
    }
    const zip = await JSZip.loadAsync(file.bytes);
    const entries = Object.values(zip.files).filter((e) => !e.dir);
    for (const entry of entries.slice(0, MAX_FILES)) {
      // Se ignora lo que no aporta al análisis para no llenar la memoria.
      if (!/\.(html?|css|js|mjs|txt|xml|json|map|ico|svg|png|jpe?g|webp|avif)$/i.test(entry.name)) continue;
      if (/^__MACOSX\//.test(entry.name)) continue;
      out.push({ name: entry.name, bytes: await entry.async("uint8array") });
    }
  }
  const total = out.reduce((n, f) => n + f.bytes.byteLength, 0);
  if (total > MAX_TOTAL_BYTES) {
    throw new AnalyzeError("Los archivos superan los 12 MB. Subí solo el HTML, el CSS y el JS.");
  }
  return out;
}

/** Profundidad de una ruta dentro del ZIP, para elegir el index más cercano a la raíz. */
function depth(name: string): number {
  return name.split("/").length;
}

/**
 * Arma el mismo CrawlContext que produce el crawler de red, pero a partir de
 * archivos subidos. Lo que no se puede comprobar se marca en `unavailable`
 * para que no penalice el puntaje ni aparezca como problema.
 */
export async function buildContextFromFiles(raw: UploadedFile[]): Promise<CrawlContext> {
  const files = await expandUploads(raw);
  const htmls = files.filter((f) => /\.html?$/i.test(f.name));
  if (!htmls.length) {
    throw new AnalyzeError("No se encontró ningún archivo .html en lo que subiste.");
  }

  const entry =
    htmls
      .filter((f) => /(^|\/)index\.html?$/i.test(f.name))
      .sort((a, b) => depth(a.name) - depth(b.name))[0] ??
    [...htmls].sort((a, b) => b.bytes.byteLength - a.bytes.byteLength)[0];

  const find = (re: RegExp) => files.find((f) => re.test(f.name));
  const findHtml = (re: RegExp) => htmls.find((f) => f !== entry && re.test(f.name));

  const notFoundFile = findHtml(/404/i);
  const termsFile = findHtml(/term|condicion|legal/i);
  const privacyFile = findHtml(/privac/i);
  const secondaryFile = htmls.find(
    (f) => f !== entry && f !== notFoundFile && f !== termsFile && f !== privacyFile,
  );

  const robotsFile = find(/(^|\/)robots\.txt$/i);
  const sitemapFile = find(/sitemap.*\.xml$/i);
  const llmsFile = find(/(^|\/)llms?\.txt$/i);
  const faviconFile = find(/(^|\/)(favicon|icon|apple-touch-icon)[^/]*\.(ico|png|svg)$/i);

  // --- Assets: peso real, sourcemaps y endpoints de IA -----------------------
  const mapNames = new Set(files.filter((f) => /\.map$/i.test(f.name)).map((f) => f.name));
  const assets: AssetInfo[] = files
    .filter((f) => /\.(js|mjs|css)$/i.test(f.name))
    .map((f) => {
      const isJs = /\.(js|mjs)$/i.test(f.name);
      const text = isJs ? decode(f.bytes) : "";
      return {
        url: `archivo://${f.name}`,
        kind: isJs ? "js" : "css",
        bytes: f.bytes.byteLength,
        status: 200,
        sourcemapExposed: mapNames.has(`${f.name}.map`),
        aiEndpoints: isJs ? AI_ENDPOINTS.filter((e) => text.includes(e)) : [],
      };
    });

  const home = snapshot(entry.name, entry.bytes);
  const $ = cheerio.load(home.body);

  // --- Enlaces: en archivos, lo relativo es interno y lo absoluto externo ----
  const internalLinks: string[] = [];
  const externalLinks: string[] = [];
  $("a[href]").each((_, el) => {
    const href = $(el).attr("href");
    if (!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:")) return;
    if (/^https?:\/\//i.test(href)) externalLinks.push(href);
    else internalLinks.push(`https://archivos.local/${href.replace(/^\.?\//, "")}`);
  });

  // --- Qué se puede comprobar con este material -----------------------------
  const unavailable = new Set<number>(NETWORK_ONLY);
  const isBundle = files.length > 3;
  const hasJs = assets.some((a) => a.kind === "js");

  if (!isBundle) {
    // Un HTML suelto no dice nada sobre archivos que viven en la raíz del sitio.
    [4, 6, 8, 17, 18, 19].forEach((c) => unavailable.add(c));
  } else {
    if (!robotsFile) unavailable.add(18);
    if (!faviconFile && !$('link[rel~="icon"]').length) unavailable.add(4);
  }
  if (htmls.length < 2) [12, 39].forEach((c) => unavailable.add(c));
  if (!hasJs) [22, 24, 33].forEach((c) => unavailable.add(c));
  if (!isBundle) unavailable.add(42);

  return {
    input: raw.map((f) => f.name).join(", "),
    base: new URL("https://archivos.local/"),
    home,
    secondary: secondaryFile ? snapshot(secondaryFile.name, secondaryFile.bytes) : null,
    legal: {
      terms: termsFile ? snapshot(termsFile.name, termsFile.bytes) : null,
      privacy: privacyFile ? snapshot(privacyFile.name, privacyFile.bytes) : null,
    },
    robots: robotsFile ? snapshot(robotsFile.name, robotsFile.bytes) : null,
    sitemap: sitemapFile ? snapshot(sitemapFile.name, sitemapFile.bytes) : null,
    llms: llmsFile ? snapshot(llmsFile.name, llmsFile.bytes) : null,
    notFound: notFoundFile ? snapshot(notFoundFile.name, notFoundFile.bytes) : null,
    favicon: faviconFile ? snapshot(faviconFile.name, faviconFile.bytes) : null,
    assets,
    totalJsBytes: assets.filter((a) => a.kind === "js").reduce((n, a) => n + a.bytes, 0),
    brokenAssets: [],
    internalLinks,
    externalLinks,
    visibleText: extractVisibleText($),
    fetchMs: 0,
    source: "files",
    unavailable: [...unavailable],
  };
}
