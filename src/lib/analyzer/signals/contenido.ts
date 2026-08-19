import { countMatches, flag, trim, type Detector } from "./helpers";

/** Palabras que aparecen alrededor de un bloque de testimonios. */
const TESTIMONIAL_HINT = /(testimoni|opinion|reseñ|resen|review|lo que dicen|clientes felices|what our clients|customers say)/i;

/** Cargos vagos que la IA inventa cuando no tiene datos reales. */
const VAGUE_ROLE =
  /\b(ceo|founder|fundador[a]?|director[a]?|manager|emprendedor[a]?|cliente|customer|user|usuari[oa]|marketing manager|product manager|small business owner|dueñ[oa] de negocio)\b/i;

/** Señal 11 — testimonios que no resisten una verificación. */
const fakeTestimonials: Detector = ({ $, visibleText }) => {
  const hasSection =
    TESTIMONIAL_HINT.test($("h1, h2, h3").text()) ||
    $("blockquote").length >= 2 ||
    TESTIMONIAL_HINT.test($("section, div").attr("id") ?? "");
  if (!hasSection) return null;

  const quotes = countMatches(visibleText, /[“"«][^”"»]{40,320}[”"»]/g);
  const blocks = $("blockquote").length;
  if (quotes.length < 2 && blocks < 2) return null;

  const reasons: string[] = [];
  const evidence: string[] = [];

  // Un testimonio real casi siempre trae empresa, cifra o enlace verificable.
  const hasNumbers = /\d+\s?(%|x|€|\$|mil|k\b|horas|días|meses|clientes|ventas)/i.test(visibleText);
  if (!hasNumbers) reasons.push("ninguno menciona un resultado medible");

  const hasCompany = /\b(en|at|de)\s+[A-ZÁÉÍÓÚÑ][A-Za-zÁÉÍÓÚÑáéíóúñ]{2,}\s?(S\.?A\.?|S\.?L\.?|Inc\.?|LLC|Ltd\.?|Studio|Agency|Agencia)?/.test(
    visibleText,
  );
  const rolesOnly = VAGUE_ROLE.test(visibleText) && !hasCompany;
  if (rolesOnly) reasons.push("los cargos son genéricos y no hay empresa identificable");

  // Fotos de stock o avatares generados junto a los testimonios.
  const stockAvatars = $("img")
    .toArray()
    .map((el) => $(el).attr("src") ?? "")
    .filter((src) => /(unsplash|pravatar|randomuser|placehold|picsum|dicebear|ui-avatars)/i.test(src));
  if (stockAvatars.length) {
    reasons.push("las fotos de los testimonios son de stock o avatares generados");
    evidence.push(...stockAvatars.slice(0, 3));
  }

  // Sin enlaces salientes a perfiles reales (LinkedIn, Instagram, Google Reviews).
  const proofLinks = $('a[href*="linkedin"], a[href*="instagram"], a[href*="g.page"], a[href*="trustpilot"]').length;
  if (!proofLinks) reasons.push("no hay ningún enlace a un perfil o reseña verificable");

  // Si la página trae varios nombres y apellidos, los testimonios están firmados.
  const fullNames = countMatches(
    visibleText,
    /\b[A-ZÁÉÍÓÚÑ][a-záéíóúñ]{2,}\s+[A-ZÁÉÍÓÚÑ][a-záéíóúñ]{2,}\b/g,
  );
  if (fullNames.length < 3) reasons.push("los testimonios no están firmados con nombre y apellido");

  // La señal es la más grave del set, así que pide evidencia dura: o hay fotos
  // de stock (prueba directa), o falla prácticamente todo lo verificable.
  const strongEvidence = stockAvatars.length > 0 && reasons.length >= 2;
  if (!strongEvidence && reasons.length < 4) return null;

  evidence.unshift(...quotes.slice(0, 2).map((q) => trim(q, 150)));
  return flag(
    "fake-testimonials",
    `Hay ${Math.max(quotes.length, blocks)} testimonios pero ${reasons.join(", ")}.`,
    evidence,
  );
};

/**
 * Solo patrones que no pueden aparecer en una web terminada.
 * Nada de buscar la palabra "placeholder" (es un atributo HTML legítimo) ni
 * "coming soon" o "example.com" (son copy normal en sitios reales).
 */
const PLACEHOLDER_PATTERNS: { re: RegExp; label: string }[] = [
  { re: /lorem ipsum/i, label: "lorem ipsum" },
  { re: /\[(insert|inserta|insertar|añadir|add|your)[^\]]{0,40}\]/i, label: "[INSERT ...]" },
  { re: /\{\{\s*[a-z_.]{1,30}\s*\}\}/i, label: "{{variable}} sin renderizar" },
  { re: /your (awesome |amazing |great )?(headline|company name|business name|tagline|logo here|text here)/i, label: "your headline / your company name" },
  { re: /\b(tu titular|tu empresa acá|tu empresa aca|nombre de tu empresa|texto aquí|texto aqui|título aquí|titulo aqui)\b/i, label: "tu titular / texto aquí" },
  { re: /\bcta goes here\b|\bbot[oó]n aqu[ií]\b|\bplaceholder text\b/i, label: "CTA goes here" },
  { re: /\b(john doe|jane doe)\b/i, label: "John Doe" },
  { re: /\b(tu@email\.com|test@test\.|email@example\.com|nombre@ejemplo\.)/i, label: "email de prueba" },
];

/**
 * Señal 27 — placeholders que nunca se completaron.
 * Se busca solo en el texto visible: el HTML crudo trae atributos
 * (placeholder=, plantillas de JS) que producían falsos positivos críticos.
 */
const placeholders: Detector = ({ visibleText }) => {
  const haystack = visibleText;
  const found = PLACEHOLDER_PATTERNS.filter((p) => p.re.test(haystack));
  if (!found.length) return null;
  const evidence = found.map((p) => {
    const m = haystack.match(p.re);
    if (!m) return p.label;
    const i = haystack.indexOf(m[0]);
    return trim(haystack.slice(Math.max(0, i - 40), i + m[0].length + 40), 130);
  });
  return flag(
    "placeholders",
    `Quedaron ${found.length} placeholder(s) sin reemplazar en producción: ${found.map((f) => f.label).join(", ")}.`,
    evidence,
  );
};

/** Señal 34 — texto sin ningún dato concreto que lo ancle a la realidad. */
const noSpecifics: Detector = ({ visibleText, externalLinks }) => {
  const text = visibleText;
  if (text.length < 400) return null;

  const numbers = countMatches(text, /\b\d{1,3}(?:[.,]\d{3})*(?:[.,]\d+)?\s?(%|x|€|\$|USD|EUR|k\b|mil|millones)/gi);
  const years = countMatches(text, /\b(19|20)\d{2}\b/g);
  const properNouns = countMatches(text, /\b[A-ZÁÉÍÓÚÑ][a-záéíóúñ]{3,}\s[A-ZÁÉÍÓÚÑ][a-záéíóúñ]{3,}\b/g);
  const sources = externalLinks.filter((l) => !/facebook|instagram|twitter|x\.com|linkedin|tiktok|youtube/i.test(l));

  const missing: string[] = [];
  if (numbers.length < 2) missing.push("no hay cifras concretas");
  if (years.length < 1) missing.push("no hay fechas");
  if (properNouns.length < 2) missing.push("no hay nombres propios");
  if (sources.length < 1) missing.push("no enlaza a ninguna fuente externa");

  if (missing.length < 3) return null;
  return flag(
    "no-specifics",
    `El texto (${Math.round(text.length / 5)} palabras aprox.) no se apoya en nada verificable: ${missing.join(", ")}.`,
    [trim(text.slice(0, 220), 220)],
  );
};

/** Señal 35 — no hay una persona ni una empresa verificable detrás. */
const noEeat: Detector = ({ $, internalLinks, externalLinks, visibleText }) => {
  const missing: string[] = [];

  const hasAbout =
    internalLinks.some((l) => /about|sobre|nosotros|quienes|equipo|team|historia/i.test(l)) ||
    /\b(sobre mí|sobre mi|sobre nosotros|quiénes somos|nuestro equipo)\b/i.test(visibleText);
  if (!hasAbout) missing.push("no hay página ni sección Sobre");

  const socials = externalLinks.filter((l) =>
    /(instagram|linkedin|twitter|x\.com|youtube|tiktok|github|facebook)\.com/i.test(l),
  );
  if (!socials.length) missing.push("no hay redes sociales enlazadas");

  // Foto de persona: una imagen local con alt que nombre a alguien o clases de retrato.
  const humanPhoto = $("img")
    .toArray()
    .some((el) => {
      const alt = ($(el).attr("alt") ?? "").toLowerCase();
      const src = ($(el).attr("src") ?? "").toLowerCase();
      const isStock = /(unsplash|pexels|pixabay|placehold|picsum|pravatar|dicebear)/.test(src);
      return !isStock && /(foto|retrato|portrait|headshot|founder|fundador|equipo|team|ceo)/.test(`${alt} ${src}`);
    });
  if (!humanPhoto) missing.push("no hay foto real de quien está detrás");

  if (missing.length < 2) return null;
  return flag(
    "no-eeat",
    `Faltan señales de autoría verificable: ${missing.join("; ")}.`,
    socials.slice(0, 3),
  );
};

/** Señal 43 — imágenes de stock o de servicios placeholder. */
const stockImages: Detector = ({ $ }) => {
  const srcs = $("img")
    .toArray()
    .map((el) => $(el).attr("src") ?? $(el).attr("data-src") ?? "")
    .filter(Boolean);
  const stock = srcs.filter((s) =>
    /(images\.unsplash|source\.unsplash|pexels\.com|pixabay\.com|placehold\.co|placeholder\.com|picsum\.photos|pravatar|dicebear|ui-avatars|via\.placeholder)/i.test(
      s,
    ),
  );
  if (!stock.length) return null;
  return flag(
    "stock-placeholder-images",
    `${stock.length} de ${srcs.length} imágenes vienen de bancos de stock o de servicios de placeholder.`,
    stock,
  );
};

/** Señal 44 — sin ninguna vía de contacto real. */
const noContact: Detector = ({ $, html, visibleText, internalLinks }) => {
  const email = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/i.test(`${visibleText} ${html.slice(0, 80000)}`);
  const tel = $('a[href^="tel:"]').length > 0 || /(\+\d{1,3}[\s.-]?)?(\(?\d{2,4}\)?[\s.-]?){2,4}\d{2,4}/.test(visibleText);
  const whatsapp = /wa\.me|api\.whatsapp\.com/i.test(html);
  const form = $("form").length > 0;
  const contactPage = internalLinks.some((l) => /contact|contacto|soporte|support|ayuda|help/i.test(l));

  // Un perfil público también es una vía de contacto verificable.
  const social = $('a[href*="linkedin.com"], a[href*="instagram.com"], a[href*="github.com"], a[href*="x.com"], a[href*="twitter.com"]').length > 0;
  const channels = [email, tel, whatsapp, form, contactPage, social].filter(Boolean).length;
  if (channels >= 2) return null;
  const missing = [
    !email && "sin email",
    !social && "sin perfiles públicos enlazados",
    !tel && !whatsapp && "sin teléfono ni WhatsApp",
    !form && "sin formulario",
    !contactPage && "sin página de contacto",
  ].filter(Boolean) as string[];
  return flag("no-contact", `Casi no hay forma de contactar: ${missing.join(", ")}.`);
};

export const contenidoDetectors: Detector[] = [
  fakeTestimonials,
  placeholders,
  noSpecifics,
  noEeat,
  stockImages,
  noContact,
];
