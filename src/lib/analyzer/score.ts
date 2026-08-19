import { SIGNALS } from "./registry";
import { CATEGORY_LABEL, SEVERITY_WEIGHT, type Category, type Finding } from "./types";

/**
 * El puntaje responde una pregunta concreta: ¿parece hecha con IA?
 *
 * Por eso las señales se separan en dos ejes. Las de autoría son las que
 * delatan que el contenido y la estructura salieron de un generador. Las de
 * higiene dicen que la web está mal terminada, algo que también le pasa a
 * sitios escritos a mano. Mezclarlas hacía que un HTML artesanal puntuara
 * igual que una plantilla sin tocar.
 */
export const AUTHORSHIP_CODES = new Set([
  1, // rótulos genéricos de sección
  2, // exceso de emojis
  3, // itálicas decorativas
  7, // guiones largos
  9, // view-source vacío
  10, // Vite + React para todo
  11, // testimonios inventados
  25, // solución en 3 partes
  26, // frases típicas de IA
  27, // placeholders sin completar
  28, // comentarios de generador
  29, // estructura visual genérica
  30, // clases de generador
  31, // meta generator
  32, // dominio del hosting
  41, // sopa de clases
  43, // imágenes de stock
  45, // restos de plantilla
]);

/** Penalización de autoría a la que el eje toca fondo. */
const AUTHORSHIP_SATURATION = 26;
/** Penalización de higiene a la que ese eje toca fondo. */
const HYGIENE_SATURATION = 30;

/** Cuánto puede bajar el puntaje cada eje, sobre los 9 puntos de recorrido. */
const AUTHORSHIP_WEIGHT = 7.5;
const HYGIENE_WEIGHT = 2.5;

export interface ScoreResult {
  score: number;
  penalty: number;
  maxPenalty: number;
  authorshipPenalty: number;
  hygienePenalty: number;
  verdict: string;
  summary: string;
}

/** Suma de pesos de las señales de un grupo, descontando las no comprobables. */
function saturationFor(codes: (code: number) => boolean, base: number, unavailable: number[]): number {
  const skipped = SIGNALS.filter((s) => codes(s.code) && unavailable.includes(s.code)).reduce(
    (n, s) => n + SEVERITY_WEIGHT[s.severity],
    0,
  );
  const total = SIGNALS.filter((s) => codes(s.code)).reduce((n, s) => n + SEVERITY_WEIGHT[s.severity], 0);
  // Si no se pudo comprobar parte del grupo, el umbral baja en la misma
  // proporción: así no se premia la falta de información.
  return Math.max(6, base * ((total - skipped) / total));
}

/**
 * Convierte los hallazgos en un puntaje de 1 a 10.
 * El eje de autoría manda: puede restar 7,5 puntos, contra 2,5 del de higiene.
 */
export interface ScoreOptions {
  /** Señales que no se pudieron comprobar y que además reducen el umbral. */
  shrinkable?: number[];
}

export function computeScore(findings: Finding[], options: ScoreOptions = {}): ScoreResult {
  const unavailable = options.shrinkable ?? [];
  const authorship = findings.filter((f) => AUTHORSHIP_CODES.has(f.code));
  const hygiene = findings.filter((f) => !AUTHORSHIP_CODES.has(f.code));

  const authorshipPenalty = authorship.reduce((n, f) => n + f.weight, 0);
  const hygienePenalty = hygiene.reduce((n, f) => n + f.weight, 0);

  const authorshipNorm = Math.min(
    1,
    authorshipPenalty / saturationFor((c) => AUTHORSHIP_CODES.has(c), AUTHORSHIP_SATURATION, unavailable),
  );
  const hygieneNorm = Math.min(
    1,
    hygienePenalty / saturationFor((c) => !AUTHORSHIP_CODES.has(c), HYGIENE_SATURATION, unavailable),
  );

  const raw = 10 - AUTHORSHIP_WEIGHT * authorshipNorm - HYGIENE_WEIGHT * hygieneNorm;
  const score = Math.max(1, Math.min(10, Math.round(raw * 10) / 10));

  return {
    score,
    penalty: authorshipPenalty + hygienePenalty,
    maxPenalty: AUTHORSHIP_SATURATION + HYGIENE_SATURATION,
    authorshipPenalty,
    hygienePenalty,
    verdict: verdictFor(score, authorshipNorm, hygieneNorm),
    summary: summaryFor(findings, authorship, hygiene, authorshipNorm, hygieneNorm),
  };
}

function verdictFor(score: number, authorshipNorm: number, hygieneNorm: number): string {
  // Caso propio: nada delata generación automática, pero la web está a medio hacer.
  if (authorshipNorm < 0.1 && hygieneNorm > 0.75) return "Escrita por una persona, pero sin terminar";
  if (authorshipNorm < 0.1) return "Sin marcas de generación automática";
  if (score >= 9) return "Parece hecha por una persona";
  if (score >= 7.5) return "Mayormente humana, con detalles de plantilla";
  if (score >= 5.5) return "Mezcla: se le nota la plantilla";
  if (score >= 3.5) return "Parece generada con IA";
  if (score >= 2) return "Parece generada con IA y sin revisar";
  return "Generada y publicada sin tocar nada";
}

function summaryFor(
  findings: Finding[],
  authorship: Finding[],
  hygiene: Finding[],
  authorshipNorm: number,
  hygieneNorm: number,
): string {
  if (!findings.length) {
    return "No se disparó ninguna de las 45 señales. Ni el contenido ni la implementación muestran patrones de generación automática.";
  }

  const partes = [`${findings.length} señal${findings.length === 1 ? "" : "es"} detectadas`];
  partes.push(`${authorship.length} de autoría`);
  partes.push(`${hygiene.length} de implementación`);
  const conteo = `${partes.join(", ")}.`;

  if (authorshipNorm < 0.1 && hygieneNorm > 0.75) {
    return `${conteo} No hay marcas de generación automática en el texto ni en la estructura: lo que falla es el terminado técnico, y eso baja poco el puntaje porque no dice nada sobre quién la escribió.`;
  }
  if (authorshipNorm < 0.15) {
    return `${conteo} Casi nada apunta a un generador. Lo que aparece son detalles de implementación, que pesan poco en este puntaje.`;
  }
  if (authorshipNorm < 0.45) {
    return `${conteo} Hay marcas sueltas de plantilla conviviendo con decisiones propias: se nota de dónde salió la base, pero alguien la trabajó después.`;
  }
  if (authorshipNorm < 0.8) {
    const top = authorship
      .slice(0, 3)
      .map((f) => f.title.toLowerCase())
      .join(", ");
    return `${conteo} El patrón de generación está claro en ${top}.`;
  }
  return `${conteo} La estructura, el copy y el estilo salieron de una plantilla y nadie los revisó después de generarlos.`;
}

/** Agrupa los hallazgos por categoría para el informe. */
export function groupByCategory(findings: Finding[]) {
  const order: Category[] = ["ia", "contenido", "diseno", "seo", "tecnico", "performance", "accesibilidad"];
  return order
    .map((category) => ({
      category,
      label: CATEGORY_LABEL[category],
      findings: findings.filter((f) => f.category === category),
    }))
    .filter((g) => g.findings.length > 0);
}
