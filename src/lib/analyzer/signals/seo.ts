import { flag, metaOf, similarity, titleOf, trim, type Detector } from "./helpers";

/** Señal 5 — jerarquía de encabezados rota. */
const h1Problem: Detector = ({ $ }) => {
  const h1s = $("h1");
  if (h1s.length === 1) return null;
  if (h1s.length === 0) {
    return flag("h1-problem", "La página no tiene ningún H1: no hay titular principal declarado.");
  }
  return flag(
    "h1-problem",
    `La página tiene ${h1s.length} H1. Debería haber uno solo.`,
    h1s.toArray().map((el) => $(el).text()),
  );
};

/** Señal 6 — páginas legales inexistentes. */
const noLegalPages: Detector = ({ legal }) => {
  const missing: string[] = [];
  if (!legal.terms) missing.push("términos y condiciones");
  if (!legal.privacy) missing.push("política de privacidad");
  if (!missing.length) return null;
  return flag(
    "no-legal-pages",
    missing.length === 2
      ? "No se encontró ni términos y condiciones ni política de privacidad."
      : `No se encontró la página de ${missing[0]}.`,
  );
};

/** Señal 12 y 39 — títulos y descripciones repetidos entre páginas. */
const duplicateTitles: Detector = ({ home, secondary }) => {
  if (!secondary) return null;
  const a = titleOf(home.body);
  const b = titleOf(secondary.body);
  if (!a || !b) return null;
  if (a.trim().toLowerCase() !== b.trim().toLowerCase()) return null;
  return flag(
    "duplicate-titles",
    "La home y otra página interna comparten exactamente el mismo <title>.",
    [`Home: "${trim(a, 90)}"`, `${new URL(secondary.finalUrl).pathname}: "${trim(b, 90)}"`],
  );
};

const nearDuplicateMeta: Detector = ({ home, secondary }) => {
  if (!secondary) return null;
  const ta = titleOf(home.body) ?? "";
  const tb = titleOf(secondary.body) ?? "";
  const da = metaOf(home.body, "description") ?? "";
  const db = metaOf(secondary.body, "description") ?? "";

  const titleSim = ta && tb ? similarity(ta, tb) : 0;
  const descSim = da && db ? similarity(da, db) : 0;
  // El caso idéntico ya lo cubre la señal 12; acá interesa el "casi idéntico".
  if (titleSim === 1 && ta === tb) return null;
  if (titleSim < 0.75 && descSim < 0.85) return null;

  const evidence: string[] = [];
  if (titleSim >= 0.75) evidence.push(`Títulos ${Math.round(titleSim * 100)}% iguales`, `"${trim(ta, 80)}" / "${trim(tb, 80)}"`);
  if (descSim >= 0.85) evidence.push(`Descripciones ${Math.round(descSim * 100)}% iguales`);
  return flag("duplicate-urls", "Dos páginas del sitio se pisan entre sí en título o descripción.", evidence);
};

/** Señal 13 — sin meta description. */
const noMetaDescription: Detector = ({ html }) => {
  const desc = metaOf(html, "description");
  if (desc && desc.length >= 30) return null;
  return flag(
    "no-meta-description",
    desc ? `La meta description tiene solo ${desc.length} caracteres.` : "La página no tiene meta description.",
    desc ? [desc] : [],
  );
};

/** Señal 14 — sin imagen Open Graph. */
const noOgImage: Detector = ({ html, $ }) => {
  const og = metaOf(html, "og:image") ?? $('meta[property="og:image"]').attr("content") ?? null;
  const tw = metaOf(html, "twitter:image");
  if (og || tw) return null;
  const otherOg = $('meta[property^="og:"]').length;
  return flag(
    "no-og-image",
    otherOg
      ? "Hay etiquetas Open Graph pero falta og:image, así que el link compartido se ve sin imagen."
      : "No hay ninguna etiqueta Open Graph: el link compartido aparece sin imagen ni descripción.",
  );
};

/** Señal 15 — sin JSON-LD. */
const noStructuredData: Detector = ({ $ }) => {
  const blocks = $('script[type="application/ld+json"]');
  if (blocks.length > 0) return null;
  const microdata = $("[itemscope]").length;
  if (microdata > 0) return null;
  return flag("no-structured-data", "No hay ningún bloque JSON-LD ni microdatos en la página.");
};

/** Señal 38 — hay structured data pero no el schema del negocio. */
const noSpecificSchema: Detector = ({ $ }) => {
  const blocks = $('script[type="application/ld+json"]').toArray();
  if (!blocks.length) return null; // lo cubre la señal 15
  const raw = blocks.map((el) => $(el).text()).join(" ");
  const types = [...raw.matchAll(/"@type"\s*:\s*"([^"]+)"/g)].map((m) => m[1]);
  const meaningful = types.filter((t) =>
    /Organization|LocalBusiness|Person|Product|Article|BlogPosting|FAQPage|Service|Course|Event|BreadcrumbList/i.test(t),
  );
  if (meaningful.length) return null;
  return flag(
    "no-specific-schema",
    `Hay JSON-LD pero solo con tipos genéricos (${[...new Set(types)].join(", ") || "sin @type"}).`,
    [...new Set(types)],
  );
};

/** Señal 16 — sin canonical. */
const noCanonical: Detector = ({ $ }) => {
  if ($('link[rel="canonical"]').attr("href")) return null;
  return flag("no-canonical", "La página no declara etiqueta canónica.");
};

/** Señal 17 — sin llms.txt. */
const noLlmsTxt: Detector = ({ llms }) => {
  if (llms) return null;
  return flag("no-llms-txt", "No existe /llms.txt ni /llm.txt en el dominio.");
};

const AI_BOTS = [
  "GPTBot", "ChatGPT-User", "OAI-SearchBot", "ClaudeBot", "anthropic-ai", "Claude-Web",
  "PerplexityBot", "Google-Extended", "CCBot", "Applebot-Extended", "Bytespider", "meta-externalagent",
];

/** Señal 18 — robots.txt bloqueando bots de IA. */
const robotsBlocksAi: Detector = ({ robots }) => {
  if (!robots) return null;
  const lines = robots.body.split(/\r?\n/);
  const blocked: string[] = [];
  let current: string | null = null;
  for (const line of lines) {
    const ua = line.match(/^\s*user-agent:\s*(.+)$/i);
    if (ua) {
      current = ua[1].trim();
      continue;
    }
    const dis = line.match(/^\s*disallow:\s*(.*)$/i);
    if (dis && current) {
      const path = dis[1].trim();
      const isTotal = path === "/" || path === "";
      const matchedBot = AI_BOTS.find((b) => b.toLowerCase() === current!.toLowerCase());
      if (path === "/" && matchedBot) blocked.push(matchedBot);
      else if (isTotal && current === "*" && path === "/") blocked.push("* (todos los bots)");
    }
  }
  const unique = [...new Set(blocked)];
  if (!unique.length) return null;
  return flag(
    "robots-blocks-ai",
    `El robots.txt bloquea ${unique.length} agente(s) relevantes para la visibilidad en IA.`,
    unique,
  );
};

/** Señal 19 — sin sitemap. */
const noSitemap: Detector = ({ sitemap }) => {
  if (sitemap) return null;
  return flag("no-sitemap", "No se encontró /sitemap.xml ni referencia a un sitemap en robots.txt.");
};

/** Señal 40 — sin política de cookies con tracking activo. */
const noCookiePolicy: Detector = ({ html, internalLinks, visibleText }) => {
  const trackers = [
    { re: /googletagmanager\.com|google-analytics\.com|gtag\(/i, label: "Google Analytics / GTM" },
    { re: /connect\.facebook\.net|fbq\(/i, label: "Meta Pixel" },
    { re: /hotjar|clarity\.ms|fullstory|mixpanel|segment\.com/i, label: "herramientas de sesión" },
    { re: /tiktok\.com\/i18n\/pixel|ttq\./i, label: "TikTok Pixel" },
  ].filter((t) => t.re.test(html));
  if (!trackers.length) return null;

  const hasPolicy = internalLinks.some((l) => /cookie/i.test(l)) || /pol[ií]tica de cookies|cookie policy/i.test(visibleText);
  const hasBanner = /cookie[-_ ]?(banner|consent|notice)|consentimiento|aceptar cookies|cookiebot|onetrust|klaro|cookieyes/i.test(html);
  if (hasPolicy && hasBanner) return null;

  const missing = [!hasPolicy && "sin política de cookies", !hasBanner && "sin banner de consentimiento"].filter(
    Boolean,
  ) as string[];
  return flag(
    "no-cookie-policy",
    `El sitio carga ${trackers.map((t) => t.label).join(", ")} y está ${missing.join(" y ")}.`,
    trackers.map((t) => t.label),
  );
};

/** Señal 42 — todo el sitio vive en una sola URL. */
const singlePageOnly: Detector = ({ internalLinks, base, $ }) => {
  const realPages = internalLinks.filter((l) => {
    const p = new URL(l).pathname.replace(/\/$/, "");
    return p !== "" && p !== new URL(base).pathname.replace(/\/$/, "");
  });
  const anchors = $('a[href^="#"]').length;
  if (realPages.length >= 3) return null;
  if (anchors < 3 && realPages.length >= 1) return null;
  return flag(
    "single-page-only",
    `Solo se encontraron ${realPages.length} página(s) internas reales frente a ${anchors} enlaces de ancla.`,
  );
};

export const seoDetectors: Detector[] = [
  h1Problem,
  noLegalPages,
  duplicateTitles,
  nearDuplicateMeta,
  noMetaDescription,
  noOgImage,
  noStructuredData,
  noSpecificSchema,
  noCanonical,
  noLlmsTxt,
  robotsBlocksAi,
  noSitemap,
  noCookiePolicy,
  singlePageOnly,
];
