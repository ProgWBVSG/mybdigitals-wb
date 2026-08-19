import { countMatches, flag, trim, type Detector } from "./helpers";

/** Rótulos funcionales que la IA pone arriba de cada sección. */
const GENERIC_LABELS = [
  "testimonios", "testimonials", "servicios", "services", "features", "funcionalidades",
  "características", "caracteristicas", "faq", "preguntas frecuentes", "precios", "pricing",
  "planes", "cómo funciona", "como funciona", "how it works", "sobre nosotros", "sobre mí",
  "sobre mi", "about us", "about me", "quiénes somos", "quienes somos", "contacto", "contact",
  "beneficios", "benefits", "nuestro proceso", "our process", "el problema", "the problem",
  "la solución", "la solucion", "the solution", "nuestro equipo", "our team", "casos de éxito",
  "portfolio", "portafolio", "blog", "recursos", "resources",
];

/** Señal 1 — cada sección rotulada con su nombre funcional. */
const genericSectionLabels: Detector = ({ $ }) => {
  const hits: string[] = [];

  $("h1, h2, h3").each((_, el) => {
    const text = $(el).text().replace(/\s+/g, " ").trim().toLowerCase();
    if (text.length <= 30 && GENERIC_LABELS.some((l) => text === l || text === `${l}:`)) {
      hits.push($(el).text().trim());
    }
  });

  // "Eyebrows": textos cortos en mayúsculas encima del titular real.
  $("p, span, div").each((_, el) => {
    const $el = $(el);
    if ($el.children().length > 0) return;
    const text = $el.text().trim();
    if (text.length > 24 || text.length < 3) return;
    const isUpper = text === text.toUpperCase() && /[A-ZÁÉÍÓÚÑ]/.test(text);
    if (isUpper && GENERIC_LABELS.includes(text.toLowerCase())) hits.push(text);
  });

  // La navegación de plantilla es el mismo síntoma: los ítems del menú son
  // los nombres funcionales de las secciones, no lo que ofrece el negocio.
  const navItems = $("nav a, header a")
    .toArray()
    .map((el) => $(el).text().replace(/\s+/g, " ").trim())
    .filter((t) => t.length > 2 && t.length <= 24);
  const genericNav = [...new Set(navItems.filter((t) => GENERIC_LABELS.includes(t.toLowerCase())))];
  if (genericNav.length >= 3) hits.push(...genericNav);

  const unique = [...new Set(hits)];
  if (unique.length < 3) return null;
  return flag(
    "generic-section-labels",
    `Hay ${unique.length} secciones rotuladas con su nombre funcional en vez de con un titular con mensaje.`,
    unique,
  );
};

const EMOJI_RE =
  /[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{1F1E6}-\u{1F1FF}\u{2B00}-\u{2BFF}\u{FE0F}]/gu;

/** Señal 2 — exceso de emojis en el contenido. */
const emojiOverload: Detector = ({ visibleText, $ }) => {
  const all = countMatches(visibleText, EMOJI_RE);
  const inHeadings = countMatches($("h1, h2, h3").text(), EMOJI_RE);
  if (all.length < 6 && inHeadings.length < 2) return null;
  const sample = [...new Set(all)].slice(0, 12).join(" ");
  return flag(
    "emoji-overload",
    `Se detectaron ${all.length} emojis en el texto visible${
      inHeadings.length ? `, ${inHeadings.length} de ellos dentro de titulares` : ""
    }.`,
    [sample],
  );
};

/** Señal 7 — guiones largos y dobles guiones dentro de las frases. */
const emDashes: Detector = ({ visibleText }) => {
  // Se capturan palabras a ambos lados para que la evidencia se entienda.
  const em = countMatches(visibleText, /(?:\S+\s){0,2}\S+\s?[—–]\s?\S+(?:\s\S+){0,2}/g);
  const dbl = countMatches(visibleText, /(?:\S+\s){0,2}\S+\s?--\s?\S+(?:\s\S+){0,2}/g);
  const total = em.length + dbl.length;
  // El guion largo aislado es puntuación normal; el patrón aparece al repetirse.
  if (total < 6) return null;
  return flag(
    "em-dashes",
    `${total} usos de guion largo o doble guion dentro de las frases (${em.length} con — o –, ${dbl.length} con --).`,
    [...em.slice(0, 3), ...dbl.slice(0, 3)].map((m) => trim(m, 80)),
  );
};

/** Frases que por sí solas ya delatan texto de modelo. */
const AI_PHRASES_STRONG = [
  "as an ai language model", "as an ai", "i'd be happy to", "certainly!", "delve into",
  "in today's digital landscape", "in today's fast-paced world", "unlock the power of",
  "rich tapestry", "it's important to note that", "revolutionize the way",
  "en el panorama digital actual", "en el mundo digital de hoy", "en el acelerado mundo",
  "desbloquea el poder", "desbloquear el potencial", "sumérgete en el mundo",
  "lleva tu negocio al siguiente nivel", "llevar tu negocio al siguiente nivel",
  "soluciones de vanguardia", "en un mundo cada vez más", "es fundamental destacar",
  "vale la pena mencionar", "como modelo de lenguaje",
];

/**
 * Frases que solas pueden ser copy normal, pero juntas marcan el patrón.
 * Necesitan al menos dos coincidencias para contar.
 */
const AI_PHRASES_WEAK = [
  "game-changer", "game changer", "elevate your", "seamlessly integrate",
  "cutting-edge", "unleash your", "empower your", "harness the power",
  "unlock the future", "join the revolution", "supercharge your",
  "streamline your workflow", "boost your productivity", "to the next level",
  "powered by ai", "the future of",
  "revoluciona la forma", "potencia tu", "impulsa tu negocio", "transforma tu",
  "eleva tu", "la clave del éxito", "en resumen,", "en conclusión,",
  "no es solo una herramienta", "no es solo un producto",
];

/** Señal 26 — vocabulario típico de modelo en el texto visible. */
const aiPhrases: Detector = ({ visibleText }) => {
  const lower = visibleText.toLowerCase();
  const strong = AI_PHRASES_STRONG.filter((p) => lower.includes(p));
  const weak = AI_PHRASES_WEAK.filter((p) => lower.includes(p));
  // Una frase fuerte alcanza; las débiles solo cuentan si se acumulan.
  if (!strong.length && weak.length < 2) return null;
  const found = [...strong, ...weak];
  const evidence = found.slice(0, 5).map((p) => {
    const i = lower.indexOf(p);
    return `…${trim(visibleText.slice(Math.max(0, i - 45), i + p.length + 45), 140)}…`;
  });
  return flag(
    "ai-phrases",
    `${found.length} frase(s) de vocabulario típico de IA en el texto visible: ${found
      .slice(0, 4)
      .map((p) => `"${p}"`)
      .join(", ")}.`,
    evidence,
  );
};

const GENERATOR_COMMENT_RE =
  /(generated (?:by|with)|built with v0|created with lovable|made with lovable|bolt\.new|bolt project|replit|stackblitz|chatgpt|claude|copilot generated|autogenerated|auto-generated)/i;

/** Señal 28 — comentarios de generador olvidados en el HTML. */
const generatorComments: Detector = ({ html }) => {
  const comments = countMatches(html, /<!--[\s\S]{0,400}?-->/g);
  const hits = comments.filter((c) => GENERATOR_COMMENT_RE.test(c));
  if (!hits.length) return null;
  return flag(
    "generator-comments",
    `El HTML conserva ${hits.length} comentario(s) que revelan con qué herramienta se generó el sitio.`,
    hits.map((c) => trim(c, 140)),
  );
};

/** Señal 30 — combinación de clases por defecto de los generadores. */
const generatorClasses: Detector = ({ lower }) => {
  const patterns: { re: RegExp; label: string }[] = [
    { re: /rounded-(?:2xl|3xl)/, label: "rounded-2xl / rounded-3xl" },
    { re: /shadow-(?:md|lg|xl)/, label: "shadow-md / shadow-lg" },
    { re: /lucide[-_]/, label: "íconos lucide" },
    { re: /bg-gradient-to-[rbl]/, label: "bg-gradient-to-*" },
    { re: /from-(?:violet|purple|indigo|fuchsia)-\d{3}/, label: "from-violet/purple-500" },
    { re: /to-(?:pink|rose|fuchsia)-\d{3}/, label: "to-pink/rose-500" },
    { re: /backdrop-blur/, label: "backdrop-blur" },
    { re: /hover:scale-10[05]/, label: "hover:scale-105" },
    { re: /animate-(?:pulse|bounce)/, label: "animate-pulse / animate-bounce" },
  ];
  const found = patterns.filter((p) => p.re.test(lower)).map((p) => p.label);
  // La firma del generador es el gradiente violeta a rosa o los íconos lucide.
  // Sin eso, un puñado de utilidades de Tailwind no dice nada.
  const signature =
    (/from-(?:violet|purple|indigo|fuchsia)-\d{3}/.test(lower) && /to-(?:pink|rose|fuchsia)-\d{3}/.test(lower)) ||
    /lucide[-_]/.test(lower);
  if (!signature || found.length < 5) return null;
  return flag(
    "generator-classes",
    `${found.length} patrones de estilo por defecto de los generadores con Tailwind aparecen juntos en la página.`,
    found,
  );
};

const GENERATOR_META_RE =
  /(v0\.dev|v0 by vercel|lovable|bolt|cursor|replit|framer|webflow|wix|durable|10web|hostinger ai|dorik|typedream|softr|carrd)/i;

/** Señal 31 — la meta generator declara la herramienta. */
const generatorMeta: Detector = ({ $ }) => {
  const gen = $('meta[name="generator"]').attr("content");
  if (!gen || !GENERATOR_META_RE.test(gen)) return null;
  return flag("generator-meta", `El HTML declara que se generó con "${trim(gen, 60)}".`, [
    `<meta name="generator" content="${trim(gen, 80)}">`,
  ]);
};

/** Señal 45 — restos de plantilla en el footer. */
const footerLeftovers: Detector = ({ $ }) => {
  const footer = $("footer").text() || $("body").text().slice(-1200);
  const text = footer.replace(/\s+/g, " ").trim();
  const evidence: string[] = [];

  if (/made with\s*(❤|love|♥|<3)/i.test(text)) evidence.push("Made with ❤");
  if (/(built|powered|created)\s+with\s+(v0|lovable|bolt|replit|framer|webflow|carrd)/i.test(text)) {
    evidence.push("Powered by / Built with <herramienta>");
  }
  if (/(your company|tu empresa|nombre de la empresa|company name|brand name)/i.test(text)) {
    evidence.push("Nombre de marca sin reemplazar");
  }

  const years = countMatches(text, /(?:©|&copy;|copyright)\s*(\d{4})/gi);
  const current = new Date().getFullYear();
  for (const y of years) {
    const n = Number(y.match(/\d{4}/)?.[0]);
    if (n && n < current - 1) evidence.push(`Copyright hardcodeado en ${n}`);
  }

  if (!evidence.length) return null;
  return flag("footer-leftovers", "El footer conserva restos de la plantilla original.", evidence);
};

export const iaDetectors: Detector[] = [
  genericSectionLabels,
  emojiOverload,
  emDashes,
  aiPhrases,
  generatorComments,
  generatorClasses,
  generatorMeta,
  footerLeftovers,
];
