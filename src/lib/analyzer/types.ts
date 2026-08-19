/**
 * Tipos compartidos por todo el motor de análisis.
 */

/** Categorías con las que se agrupan los hallazgos en el informe. */
export type Category =
  | "ia"
  | "contenido"
  | "seo"
  | "tecnico"
  | "performance"
  | "accesibilidad"
  | "diseno";

export const CATEGORY_LABEL: Record<Category, string> = {
  ia: "Señales de IA",
  contenido: "Contenido y copy",
  seo: "SEO técnico",
  tecnico: "Implementación técnica",
  performance: "Performance",
  accesibilidad: "Accesibilidad",
  diseno: "Diseño y estructura",
};

/** Gravedad de una señal. Define cuánto pesa en el score. */
export type Severity = "baja" | "media" | "alta" | "critica";

export const SEVERITY_WEIGHT: Record<Severity, number> = {
  baja: 1,
  media: 2,
  alta: 4,
  critica: 6,
};

/** Definición estática de una señal detectable. */
export interface SignalDef {
  /** Número de la señal en la lista original del brief (1-45). */
  code: number;
  id: string;
  title: string;
  category: Category;
  severity: Severity;
  /** Por qué esto delata una web hecha por IA o mal implementada. */
  why: string;
  /** Cómo se arregla. Alimenta el prompt a medida. */
  fix: string;
}

/** Señal efectivamente detectada en la web analizada. */
export interface Finding extends SignalDef {
  weight: number;
  /** Explicación concreta de lo que se encontró en ESTA web. */
  detail: string;
  /** Fragmentos reales encontrados (máx. 6, recortados). */
  evidence: string[];
}

/** Resultado de descargar una URL. */
export interface PageSnapshot {
  url: string;
  finalUrl: string;
  status: number;
  ok: boolean;
  contentType: string;
  headers: Record<string, string>;
  body: string;
  bytes: number;
  ms: number;
  error?: string;
}

/** Info de un asset (JS/CSS) referenciado por la home. */
export interface AssetInfo {
  url: string;
  kind: "js" | "css";
  bytes: number;
  status: number;
  /** true si existe el .map público. */
  sourcemapExposed: boolean;
  /** Endpoints de IA encontrados dentro del bundle. */
  aiEndpoints: string[];
}

/** Todo lo que el crawler juntó antes de correr los detectores. */
export interface CrawlContext {
  input: string;
  base: URL;
  home: PageSnapshot;
  /** Segunda página interna (para comparar títulos/descripciones). */
  secondary: PageSnapshot | null;
  legal: { terms: PageSnapshot | null; privacy: PageSnapshot | null };
  robots: PageSnapshot | null;
  sitemap: PageSnapshot | null;
  llms: PageSnapshot | null;
  notFound: PageSnapshot | null;
  favicon: PageSnapshot | null;
  assets: AssetInfo[];
  totalJsBytes: number;
  brokenAssets: string[];
  internalLinks: string[];
  externalLinks: string[];
  visibleText: string;
  fetchMs: number;
  /** De dónde salió el material analizado. */
  source: "url" | "files";
  /**
   * Códigos de señal que no se pueden evaluar con este material.
   * Sus hallazgos se descartan y salen del denominador del score.
   */
  unavailable: number[];
}

/** Payload final que consume la UI. */
export interface AnalysisResult {
  url: string;
  mode: "url" | "files";
  /** Señales que no se pudieron comprobar. */
  skipped: { code: number; title: string }[];
  /**
   * true si el servidor devolvió un HTML sin contenido legible (SPA sin SSR).
   * En ese caso no se puede juzgar el texto ni la estructura.
   */
  contentBlind: boolean;
  finalUrl: string;
  analyzedAt: string;
  score: number;
  verdict: string;
  summary: string;
  penalty: number;
  maxPenalty: number;
  /** Penalización de las señales que delatan generación automática. */
  authorshipPenalty: number;
  /** Penalización de las señales de terminado técnico. */
  hygienePenalty: number;
  findings: Finding[];
  passed: { code: number; title: string; category: Category }[];
  byCategory: { category: Category; label: string; findings: Finding[] }[];
  prompt: string;
  meta: {
    title: string | null;
    description: string | null;
    jsBytes: number;
    pagesFetched: number;
    ms: number;
  };
}
