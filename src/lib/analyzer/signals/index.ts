import { accesibilidadDetectors } from "./accesibilidad";
import { contenidoDetectors } from "./contenido";
import { disenoDetectors } from "./diseno";
import { iaDetectors } from "./ia";
import { seoDetectors } from "./seo";
import { tecnicoDetectors } from "./tecnico";
import type { Detector, DetectorInput } from "./helpers";
import type { Finding } from "../types";

export const ALL_DETECTORS: Detector[] = [
  ...iaDetectors,
  ...contenidoDetectors,
  ...seoDetectors,
  ...tecnicoDetectors,
  ...disenoDetectors,
  ...accesibilidadDetectors,
];

/**
 * Corre todos los detectores. Si uno falla por un HTML raro, se ignora ese
 * detector en vez de tirar abajo el análisis completo.
 */
export function runDetectors(input: DetectorInput): Finding[] {
  const findings: Finding[] = [];
  for (const detect of ALL_DETECTORS) {
    try {
      const finding = detect(input);
      if (finding) findings.push(finding);
    } catch {
      /* detector que no aplica a este HTML */
    }
  }
  // Sin duplicados por código, sin lo no comprobable, y ordenado por gravedad.
  const seen = new Set<number>();
  const unavailable = new Set(input.unavailable);
  return findings
    .filter((f) => !unavailable.has(f.code))
    .filter((f) => (seen.has(f.code) ? false : (seen.add(f.code), true)))
    .sort((a, b) => b.weight - a.weight || a.code - b.code);
}

export type { Detector, DetectorInput };
