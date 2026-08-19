import * as cheerio from "cheerio";
import { SIGNAL_BY_ID } from "../registry";
import { SEVERITY_WEIGHT, type CrawlContext, type Finding } from "../types";

/** Contexto que recibe cada detector: el crawl más el DOM ya parseado. */
export interface DetectorInput extends CrawlContext {
  $: cheerio.CheerioAPI;
  html: string;
  /** HTML en minúsculas, para búsquedas case-insensitive baratas. */
  lower: string;
}

export type Detector = (input: DetectorInput) => Finding | null;

/** Construye un hallazgo a partir del id de la señal en el registro. */
export function flag(id: string, detail: string, evidence: string[] = []): Finding {
  const def = SIGNAL_BY_ID.get(id);
  if (!def) throw new Error(`Señal desconocida: ${id}`);
  return {
    ...def,
    weight: SEVERITY_WEIGHT[def.severity],
    detail,
    evidence: evidence.filter(Boolean).slice(0, 6).map((e) => trim(e, 160)),
  };
}

export function trim(text: string, max: number): string {
  const clean = text.replace(/\s+/g, " ").trim();
  return clean.length > max ? `${clean.slice(0, max - 1)}…` : clean;
}

/** Cuenta ocurrencias de un regex global sin quedarse sin memoria. */
export function countMatches(text: string, re: RegExp): string[] {
  const matches = text.match(re);
  return matches ? matches : [];
}

/** Texto de la etiqueta title de un HTML suelto. */
export function titleOf(html: string): string | null {
  const m = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  return m ? m[1].replace(/\s+/g, " ").trim() : null;
}

/** Contenido de una meta name/property de un HTML suelto. */
export function metaOf(html: string, name: string): string | null {
  const re = new RegExp(
    `<meta[^>]+(?:name|property)=["']${name}["'][^>]*content=["']([^"']*)["']`,
    "i",
  );
  const alt = new RegExp(
    `<meta[^>]+content=["']([^"']*)["'][^>]*(?:name|property)=["']${name}["']`,
    "i",
  );
  const m = html.match(re) ?? html.match(alt);
  return m ? m[1].trim() : null;
}

/** Similitud aproximada entre dos strings (0 a 1), por tokens compartidos. */
export function similarity(a: string, b: string): number {
  const ta = new Set(a.toLowerCase().split(/\W+/).filter(Boolean));
  const tb = new Set(b.toLowerCase().split(/\W+/).filter(Boolean));
  if (!ta.size || !tb.size) return 0;
  let shared = 0;
  ta.forEach((t) => {
    if (tb.has(t)) shared += 1;
  });
  return shared / Math.max(ta.size, tb.size);
}

/**
 * Un HTML sin contenido legible: el cascaron de una SPA sin SSR.
 *
 * El umbral es bajo a proposito. Una pagina real, por corta que sea, pasa los
 * 150 caracteres; un cascaron ronda los 50. Con 400 se marcaban como vacias
 * paginas chicas pero completas.
 */
export function sinContenidoLegible($: cheerio.CheerioAPI, visibleText: string): boolean {
  const root = $("#root, #app, #__nuxt, [data-reactroot]").first();
  const contenedorVacio = root.length > 0 && root.text().trim().length < 40;
  return visibleText.length < 150 || (contenedorVacio && visibleText.length < 400);
}

export function kb(bytes: number): string {
  return `${Math.round(bytes / 1024)} KB`;
}
