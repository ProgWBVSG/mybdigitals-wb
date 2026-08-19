import { extractVisibleText } from "../fetcher";
import { flag, kb, sinContenidoLegible, trim, type Detector } from "./helpers";
import * as cheerio from "cheerio";

/** Señal 4 — sin favicon servido. */
const noFavicon: Detector = ({ favicon, $ }) => {
  const declared = $('link[rel~="icon"], link[rel="shortcut icon"], link[rel="apple-touch-icon"]').length > 0;
  const served = Boolean(favicon?.ok && favicon.bytes > 0);
  if (served) return null;
  return flag(
    "no-favicon",
    declared
      ? "El head declara un favicon pero el archivo no se sirve (responde error o está vacío)."
      : "No hay favicon declarado en el head ni /favicon.ico servido.",
    favicon ? [`${favicon.url} → ${favicon.status || "sin respuesta"}`] : [],
  );
};

/** Señal 8 — 404 por defecto. */
const noCustom404: Detector = ({ notFound }) => {
  if (!notFound) return null;

  // Un 200 en una URL inexistente es peor: soft-404 del SPA.
  if (notFound.status === 200) {
    return flag(
      "no-custom-404",
      "Una URL inexistente responde 200 en vez de 404 (soft 404). El sitio devuelve la misma página para cualquier ruta.",
      [notFound.url],
    );
  }
  if (notFound.status !== 404) return null;

  const $404 = cheerio.load(notFound.body);
  const text = extractVisibleText($404);
  const DEFAULT_404 =
    /^(404|not found|404 not found|this page could not be found|nginx|apache|cannot get|error)/i;

  // Lo que distingue a una 404 propia no es su largo (suelen ser cortas) sino
  // que ofrezca salida: navegacion, enlaces de vuelta, el layout del sitio.
  const links = $404("a[href]").length;
  const ofreceSalida = links >= 2 || $404("header, nav, footer").length > 0;
  const esLaDelFramework = DEFAULT_404.test(text.trim()) && links < 2;
  if (ofreceSalida && text.length >= 60 && !esLaDelFramework) return null;

  return flag(
    "no-custom-404",
    ofreceSalida
      ? `La 404 casi no tiene contenido propio: ${text.length} caracteres.`
      : `La 404 es la generica del framework o del servidor: ${text.length} caracteres y ${links} enlaces, sin forma de volver.`,
    [trim(text, 120) || `${notFound.status} sin contenido`],
  );
};

/** Señal 9 — el HTML llega vacío y todo lo pinta el JS. */
const emptyViewSource: Detector = ({ $, visibleText, home }) => {
  const bodyText = visibleText.length;
  const rootDiv = $("#root, #app, #__nuxt, [data-reactroot]").first();
  const hasEmptyRoot = rootDiv.length > 0 && rootDiv.text().trim().length < 40;
  if (!sinContenidoLegible($, visibleText)) return null;
  return flag(
    "empty-view-source",
    `El HTML que devuelve el servidor trae solo ${bodyText} caracteres de texto${
      hasEmptyRoot ? ` y un contenedor raíz (#${rootDiv.attr("id")}) vacío` : ""
    }. Todo el contenido se pinta con JavaScript.`,
    [`${kb(home.bytes)} de HTML, ${bodyText} caracteres de texto visible`],
  );
};

/** Señal 10 — build de Vite + React sirviendo todo el sitio. */
const viteReactSpa: Detector = ({ html, assets, $ }) => {
  const viteHints = [
    /\/assets\/index-[A-Za-z0-9_-]{6,}\.js/.test(html) && "bundle /assets/index-[hash].js de Vite",
    /type="module"[^>]*crossorigin/.test(html) && "script type=module crossorigin",
    /vite/i.test(html) && "referencia a vite en el HTML",
    assets.some((a) => /@vite|vite\/client|__vite/.test(a.url)) && "cliente de Vite",
  ].filter(Boolean) as string[];

  const reactHints = [
    /data-reactroot|react-dom|_reactListening/i.test(html) && "React en el HTML",
    $("#root").length > 0 && "contenedor #root",
  ].filter(Boolean) as string[];

  if (viteHints.length < 1 || reactHints.length < 1) return null;
  // Next/Remix/Astro tienen su propio marcador y no cuentan como SPA de Vite.
  if (/__NEXT_DATA__|_next\/static|astro-island|remix/i.test(html)) return null;

  return flag(
    "vite-react-spa",
    "El sitio entero se sirve como una SPA de Vite + React, sin render en servidor.",
    [...viteHints, ...reactHints],
  );
};

/** Señal 22 — sourcemaps accesibles en producción. */
const exposedSourcemaps: Detector = ({ assets }) => {
  const exposed = assets.filter((a) => a.sourcemapExposed);
  if (!exposed.length) return null;
  return flag(
    "exposed-sourcemaps",
    `${exposed.length} archivo(s) publican su sourcemap: cualquiera puede leer el código fuente original.`,
    exposed.map((a) => `${a.url}.map`),
  );
};

/** Señal 23 — recursos que devuelven error (errores garantizados en consola). */
const consoleErrors: Detector = ({ brokenAssets, $, base }) => {
  const broken = [...brokenAssets];

  // Referencias vacías o rotas que también rompen en consola.
  $("img[src=''], script[src=''], link[href='']").each((_, el) => {
    broken.push(`<${el.tagName}> con src/href vacío`);
  });
  $("img[src*='undefined']").each((_, el) => {
    broken.push(`imagen con src inválido: ${$(el).attr("src")}`);
  });

  if (!broken.length) return null;
  return flag(
    "console-errors",
    `${broken.length} recurso(s) referenciados por la página no cargan. Eso son errores garantizados en la consola de ${base.hostname}.`,
    broken,
  );
};

/** Señal 32 — publicado en el subdominio del hosting. */
const genericHosting: Detector = ({ base }) => {
  const host = base.hostname.toLowerCase();
  const platforms = [
    "vercel.app", "netlify.app", "web.app", "firebaseapp.com", "github.io", "pages.dev",
    "render.com", "onrender.com", "replit.app", "repl.co", "lovable.app", "bolt.host",
    "framer.website", "webflow.io", "wixsite.com", "myshopify.com", "surge.sh", "glitch.me",
    "streamlit.app", "herokuapp.com",
  ];
  const match = platforms.find((p) => host === p || host.endsWith(`.${p}`));
  if (!match) return null;
  return flag(
    "generic-hosting",
    `El sitio vive en ${host}, un subdominio de ${match}, sin dominio propio.`,
    [host],
  );
};

/** Señal 33 — el bundle del cliente llama directo a una API de IA. */
const aiApiCalls: Detector = ({ assets, html }) => {
  const fromAssets = assets.flatMap((a) => a.aiEndpoints.map((e) => `${e} (en ${new URL(a.url).pathname})`));
  const inline = ["api.openai.com", "api.anthropic.com", "generativelanguage.googleapis.com", "api.x.ai"].filter((e) =>
    html.includes(e),
  );
  const all = [...new Set([...fromAssets, ...inline])];
  if (!all.length) return null;

  // Una key en el cliente eleva el problema de "mala práctica" a "fuga".
  const keyLeak = /(sk-[A-Za-z0-9]{20,}|sk-ant-[A-Za-z0-9-]{20,}|AIza[0-9A-Za-z_-]{30,})/.exec(html);
  return flag(
    "ai-api-calls",
    keyLeak
      ? "El código del cliente llama a una API de IA y además hay algo con forma de API key en el HTML."
      : "El código que se descarga en el navegador llama directo a una API de IA.",
    all,
  );
};

/** Señal 24 — peso de JavaScript. */
const hugeJsBundle: Detector = ({ totalJsBytes, assets }) => {
  // Se mide el JS ya descomprimido, así que el umbral va alto:
  // 900 KB sin comprimir son unos 280 KB en la red.
  const THRESHOLD = 900 * 1024;
  if (totalJsBytes < THRESHOLD) return null;
  const top = [...assets]
    .filter((a) => a.kind === "js")
    .sort((a, b) => b.bytes - a.bytes)
    .slice(0, 4)
    .map((a) => `${new URL(a.url).pathname} — ${kb(a.bytes)}`);
  return flag(
    "huge-js-bundle",
    `La home descarga ${kb(totalJsBytes)} de JavaScript en ${
      assets.filter((a) => a.kind === "js").length
    } archivos, sin comprimir. Por encima de 900 KB ya se nota en móvil.`,
    top,
  );
};

/** Señal 37 — indicadores de performance pobre medibles sin navegador. */
const poorPerformance: Detector = ({ home, $, assets }) => {
  const problems: string[] = [];

  if (home.ms > 2500) problems.push(`el HTML tardó ${home.ms} ms en responder`);
  if (home.bytes > 400 * 1024) problems.push(`el HTML pesa ${kb(home.bytes)}`);

  const imgs = $("img").toArray();
  const noDims = imgs.filter((el) => !$(el).attr("width") || !$(el).attr("height"));
  if (imgs.length >= 4 && noDims.length / imgs.length > 0.6) {
    problems.push(`${noDims.length} de ${imgs.length} imágenes sin width/height (provocan CLS)`);
  }
  const noLazy = imgs.filter((el) => !$(el).attr("loading"));
  if (imgs.length >= 8 && noLazy.length / imgs.length > 0.8) {
    problems.push(`${noLazy.length} imágenes sin lazy loading`);
  }
  const legacyFormats = imgs.filter((el) => /\.(jpe?g|png)(\?|$)/i.test($(el).attr("src") ?? ""));
  if (legacyFormats.length >= 6) {
    problems.push(`${legacyFormats.length} imágenes en JPG/PNG sin formato moderno`);
  }
  const renderBlocking = assets.filter((a) => a.kind === "css").length;
  if (renderBlocking >= 5) problems.push(`${renderBlocking} hojas de estilo bloqueando el render`);
  const hasHeaders = Object.keys(home.headers).length > 0;
  if (hasHeaders && !home.headers["content-encoding"]) {
    problems.push("el HTML se sirve sin compresión (gzip/brotli)");
  }

  if (problems.length < 2) return null;
  return flag("poor-performance", `Indicadores de carga por debajo de lo aceptable: ${problems.length} problemas.`, problems);
};

export const tecnicoDetectors: Detector[] = [
  noFavicon,
  noCustom404,
  emptyViewSource,
  viteReactSpa,
  exposedSourcemaps,
  consoleErrors,
  genericHosting,
  aiApiCalls,
  hugeJsBundle,
  poorPerformance,
];
