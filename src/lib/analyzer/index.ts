import * as cheerio from "cheerio";
import { crawl } from "./fetcher";
import { buildContextFromFiles, type UploadedFile } from "./files";
import { buildPrompts } from "./prompt";
import { SIGNALS } from "./registry";
import { computeScore, groupByCategory } from "./score";
import { runDetectors } from "./signals";
import { sinContenidoLegible } from "./signals/helpers";
import type { AnalysisResult, CrawlContext } from "./types";

/**
 * Señales que se leen del contenido renderizado. Si el servidor devuelve un
 * cascarón vacío, no es que estén bien: es que no se pueden mirar.
 */
const CONTENT_DEPENDENT = [1, 2, 3, 7, 11, 21, 25, 26, 27, 29, 30, 34, 35, 36, 41, 43, 44, 45];

export { AnalyzeError, normalizeUrl } from "./fetcher";
export { SIGNALS } from "./registry";
export type { UploadedFile } from "./files";
export * from "./types";

/** Analiza una URL pública. */
export async function analyze(input: string): Promise<AnalysisResult> {
  const started = Date.now();
  return report(await crawl(input), started);
}

/** Analiza los archivos que subió la persona (HTML sueltos o el ZIP del build). */
export async function analyzeFiles(files: UploadedFile[]): Promise<AnalysisResult> {
  const started = Date.now();
  return report(await buildContextFromFiles(files), started);
}

/** Tramo común: correr detectores, puntuar y armar el informe. */
function report(ctx: CrawlContext, started: number): AnalysisResult {
  const $ = cheerio.load(ctx.home.body);
  const findings = runDetectors({
    ...ctx,
    $,
    html: ctx.home.body,
    lower: ctx.home.body.toLowerCase(),
  });

  // Un HTML sin texto no se puede juzgar: se marcan esas señales como no
  // comprobables, pero sin bajar el umbral (sería castigar dos veces lo mismo).
  const contentBlind = sinContenidoLegible($, ctx.visibleText);
  const unavailable = contentBlind
    ? [...new Set([...ctx.unavailable, ...CONTENT_DEPENDENT])]
    : ctx.unavailable;
  const visible = findings.filter((f) => !unavailable.includes(f.code));

  const { score, penalty, maxPenalty, authorshipPenalty, hygienePenalty, verdict, summary } =
    computeScore(visible, { shrinkable: ctx.unavailable });

  const title = $("title").first().text().trim() || null;
  const description = $('meta[name="description"]').attr("content")?.trim() ?? null;

  const failed = new Set(visible.map((f) => f.code));
  const skippedCodes = new Set(unavailable);
  const passed = SIGNALS.filter((s) => !failed.has(s.code) && !skippedCodes.has(s.code)).map((s) => ({
    code: s.code,
    title: s.title,
    category: s.category,
  }));

  const pagesFetched = [
    ctx.home,
    ctx.secondary,
    ctx.legal.terms,
    ctx.legal.privacy,
    ctx.robots,
    ctx.sitemap,
    ctx.llms,
    ctx.notFound,
  ].filter(Boolean).length;

  return {
    url: ctx.input,
    mode: ctx.source,
    finalUrl: ctx.home.finalUrl,
    analyzedAt: new Date().toISOString(),
    score,
    verdict,
    summary,
    penalty,
    maxPenalty,
    authorshipPenalty,
    hygienePenalty,
    findings: visible,
    contentBlind,
    passed,
    skipped: SIGNALS.filter((s) => skippedCodes.has(s.code)).map((s) => ({
      code: s.code,
      title: s.title,
    })),
    byCategory: groupByCategory(findings),
    prompts: buildPrompts({
      url: ctx.source === "url" ? ctx.home.finalUrl : ctx.input,
      title,
      score,
      verdict,
      findings: visible,
    }),
    meta: {
      title,
      description,
      jsBytes: ctx.totalJsBytes,
      pagesFetched,
      ms: Date.now() - started,
    },
  };
}
