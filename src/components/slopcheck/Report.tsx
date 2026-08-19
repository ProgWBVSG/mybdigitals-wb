import { SIGNALS } from "@/lib/analyzer/registry";
import { CATEGORY_LABEL, type Category } from "@/lib/analyzer/types";
import type { AnalysisResult } from "@/lib/analyzer/types";

/** Informe completo: los problemas agrupados por categoría y lo que pasó limpio. */
export function Report({ data }: { data: AnalysisResult }) {
  if (!data.findings.length) {
    return (
      <div className="block">
        <h3>Informe</h3>
        <p>
          Ninguna de las 45 señales se disparó en {new URL(data.finalUrl).hostname}. Es un resultado poco
          frecuente: revisá igual la sección de abajo para ver qué se comprobó.
        </p>
        <PassedList data={data} />
      </div>
    );
  }

  return (
    <>
      <div className="block">
        <h3>
          Informe · {data.findings.length} problemas en {new URL(data.finalUrl).hostname}
        </h3>

        {data.byCategory.map((grupo) => (
          <div className="cat" key={grupo.category}>
            <div className="cat-head">
              <h4>{grupo.label}</h4>
              <span>
                {grupo.findings.length} {grupo.findings.length === 1 ? "problema" : "problemas"}
              </span>
            </div>

            {grupo.findings.map((f) => (
              <article className="issue" key={f.code}>
                <div className="issue-code">{String(f.code).padStart(2, "0")}</div>
                <div>
                  <h5>
                    {f.title}
                    <span className="sev" data-s={f.severity}>
                      {f.severity}
                    </span>
                  </h5>
                  <p>{f.detail}</p>
                  <p className="why">{f.why}</p>
                  {f.evidence.length > 0 && (
                    <ul className="evidence">
                      {f.evidence.map((e, i) => (
                        <li key={i}>{e}</li>
                      ))}
                    </ul>
                  )}
                  <p className="fix">
                    <b>Arreglo</b>
                    {f.fix}
                  </p>
                </div>
              </article>
            ))}
          </div>
        ))}
      </div>

      <PassedList data={data} />
      <SkippedList data={data} />
    </>
  );
}

/**
 * En modo archivos hay señales que no se pueden juzgar: dependen de lo que
 * sirve el dominio. Se dicen en voz alta para que el puntaje sea legible.
 */
function SkippedList({ data }: { data: AnalysisResult }) {
  if (!data.skipped.length) return null;
  return (
    <div className="block">
      <h3>No se pudo comprobar · {data.skipped.length} señales</h3>
      <p style={{ maxWidth: "62ch", color: "var(--ink-soft)", marginTop: "-0.75rem" }}>
        Estas dependen de lo que sirve el dominio, así que no penalizan el puntaje. Analizá la URL en vivo
        para incluirlas.
      </p>
      <ul className="passed" style={{ marginTop: "1rem" }}>
        {data.skipped.map((s) => (
          <li key={s.code} data-kind="skipped">
            {s.title}
          </li>
        ))}
      </ul>
    </div>
  );
}

/**
 * Resumen de lo comprobado. Se muestra por categoría en vez de listar los
 * títulos: enunciados en negativo ("Sin favicon") se leerían como problemas.
 */
function PassedList({ data }: { data: AnalysisResult }) {
  if (!data.passed.length) return null;

  const total = SIGNALS.length;
  const categorias = (Object.keys(CATEGORY_LABEL) as Category[])
    .map((cat) => {
      const todas = SIGNALS.filter((s) => s.category === cat).length;
      const limpias = data.passed.filter((p) => p.category === cat).length;
      return { cat, todas, limpias };
    })
    .filter((c) => c.todas > 0);

  return (
    <div className="block">
      <h3>
        Comprobaciones limpias · {data.passed.length} de {total}
      </h3>
      <ul className="passed">
        {categorias.map(({ cat, todas, limpias }) => (
          <li key={cat} data-full={limpias === todas}>
            {CATEGORY_LABEL[cat]} · {limpias}/{todas}
          </li>
        ))}
      </ul>
    </div>
  );
}
