import { flag, trim, type Detector } from "./helpers";

/** Señal 3 — itálicas decorativas por todos lados. */
const italicAbuse: Detector = ({ $ }) => {
  const tags = $("em, i:not([class*='icon']):not([class*='fa-']):not([class*='lucide'])").toArray();
  const withText = tags.filter((el) => $(el).text().trim().length > 3);

  // Solo elementos que aplican la utilidad de verdad. Buscar la palabra
  // "italic" en el HTML crudo contaba los bloques de código de una web de docs.
  const utilityItalic = $("[class]").toArray().filter((el) => {
    const cls = ($(el).attr("class") ?? "").split(/\s+/);
    return cls.includes("italic") || cls.includes("font-italic");
  }).length;
  const inlineItalic = $("[style*='italic']").length;

  const total = withText.length + utilityItalic + inlineItalic;
  if (total < 4) return null;
  return flag(
    "italic-abuse",
    `${total} usos de itálica (${withText.length} en etiquetas em/i, ${utilityItalic + inlineItalic} por clase o estilo).`,
    withText.slice(0, 4).map((el) => trim($(el).text(), 90)),
  );
};

const STEP_HINT = /(cómo funciona|como funciona|how it works|el proceso|nuestro proceso|our process|en 3 pasos|paso 1|step 1|la solución|la solucion|the solution|beneficios|benefits)/i;

/** Señal 25 — la solución siempre se explica en exactamente tres bloques. */
const threePartSolution: Detector = ({ $ }) => {
  const trios: string[] = [];

  // Grids declarados de 3 columnas.
  $("[class*='grid-cols-3'], [class*='md:grid-cols-3'], [class*='lg:grid-cols-3']").each((_, el) => {
    const text = trim($(el).text(), 70);
    // Sin texto propio es un grid de layout, no la sección de beneficios.
    if ($(el).children().length === 3 && text.length > 40) {
      trios.push(`grid de 3 columnas con 3 items: "${text}"`);
    }
  });

  // Secciones cuyo titular anuncia proceso/solución y contienen exactamente 3 hijos.
  $("section, div[class*='container'], div[class*='section']").each((_, el) => {
    const $el = $(el);
    const heading = $el.find("h2, h3").first().text();
    if (!heading || !STEP_HINT.test(heading)) return;
    const cards = $el.find("> div > div, > div, article").filter((_i, c) => $(c).text().trim().length > 30);
    if (cards.length === 3) trios.push(`"${trim(heading, 50)}" resuelto en 3 bloques`);
  });

  const unique = [...new Set(trios)];
  if (!unique.length) return null;
  return flag(
    "three-part-solution",
    `La estructura cae en el trío por defecto: ${unique.length} bloque(s) de exactamente 3 partes.`,
    unique,
  );
};

/** Señal 29 — la plantilla completa que devuelve cualquier generador. */
const genericLayout: Detector = ({ $, lower, visibleText }) => {
  const marks: string[] = [];

  if (/bg-gradient-to-[rbl][^"']*(violet|purple|indigo|fuchsia)[^"']*(pink|rose|fuchsia)/.test(lower)) {
    marks.push("hero con gradiente violeta a rosa");
  }
  if ($("[class*='grid-cols-3']").length >= 2) marks.push("varios grids de 3 cards");
  if (/(cómo funciona|como funciona|how it works)/i.test(visibleText) && /paso 1|step 1|01\b/i.test(visibleText)) {
    marks.push("sección 'Cómo funciona' numerada en pasos");
  }
  if (/(precios|pricing|planes)/i.test(visibleText) && /(gratis|free|básico|basic|pro\b|premium|enterprise)/i.test(visibleText)) {
    marks.push("tabla de precios de 3 planes con Básico/Pro/Enterprise");
  }
  if ($("[class*='carousel'], [class*='slider'], [class*='swiper'], [data-carousel]").length > 0) {
    marks.push("slider de testimonios");
  }
  const footerCols = $("footer [class*='grid-cols-4'], footer [class*='md:grid-cols-4']").length;
  if (footerCols > 0) marks.push("footer de 4 columnas");
  if (/(empezá gratis|empieza gratis|get started free|comenzar ahora|start free|prueba gratis)/i.test(visibleText)) {
    marks.push("CTA genérico tipo 'Empezá gratis'");
  }
  if (/faq|preguntas frecuentes/i.test(visibleText) && $("details, [class*='accordion']").length > 0) {
    marks.push("FAQ en acordeón al final");
  }

  if (marks.length < 3) return null;
  return flag(
    "generic-layout",
    `La página reproduce ${marks.length} piezas de la plantilla estándar de landing generada.`,
    marks,
  );
};

/** Señal 41 — la misma cadena de utilidades repetida en vez de componentes. */
const classSoup: Detector = ({ $ }) => {
  const counts = new Map<string, number>();
  $("[class]").each((_, el) => {
    const cls = ($(el).attr("class") ?? "").trim();
    const n = cls.split(/\s+/).filter(Boolean).length;
    if (n >= 15) counts.set(cls, (counts.get(cls) ?? 0) + 1);
  });
  // Umbral alto a propósito: cualquier sitio con utilidades repite cadenas.
  const repeated = [...counts.entries()].filter(([, n]) => n >= 6).sort((a, b) => b[1] - a[1]);
  if (!repeated.length) return null;
  return flag(
    "class-soup",
    `${repeated.length} cadena(s) de clases se repiten literalmente en varios elementos (la más repetida, ${repeated[0][1]} veces). No hay componentes ni tokens.`,
    repeated.slice(0, 3).map(([cls, n]) => `${n}x → ${trim(cls, 120)}`),
  );
};

export const disenoDetectors: Detector[] = [italicAbuse, threePartSolution, genericLayout, classSoup];
