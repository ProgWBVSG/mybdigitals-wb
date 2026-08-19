"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowRight, UploadCloud } from "lucide-react";
import { AetherFlowHero } from "@/components/slopcheck/ui/aether-flow-hero";
import type { AnalysisResult } from "@/lib/analyzer/types";
import { Report } from "./Report";
import { PromptBox } from "./PromptBox";
import { Disclaimer } from "./Disclaimer";

const EJEMPLOS = ["vercel.com", "stripe.com", "basecamp.com"];
const ACCEPT = ".html,.htm,.zip,.css,.js,.txt,.xml";

/** Mensajes que rotan mientras corre el análisis. */
const PASOS = [
  "Leyendo el HTML",
  "Buscando robots.txt, sitemap y llms.txt",
  "Provocando un 404 a ver qué devuelve",
  "Pesando el JavaScript",
  "Leyendo el copy con lupa",
  "Calculando el puntaje",
];

export function Analyzer() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [paso, setPaso] = useState(0);
  const [dragging, setDragging] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!loading) return;
    const id = setInterval(() => setPaso((p) => Math.min(p + 1, PASOS.length - 1)), 1400);
    return () => clearInterval(id);
  }, [loading]);

  async function enviar(body: BodyInit, headers?: HeadersInit) {
    if (loading) return;
    setPaso(0);
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch("/api/slopcheck/analyze", { method: "POST", body, headers });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "No se pudo completar el análisis.");
      setResult(data as AnalysisResult);
      requestAnimationFrame(() =>
        resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }),
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Algo falló. Probá de nuevo.");
    } finally {
      setLoading(false);
    }
  }

  function analizarUrl(value: string) {
    const target = value.trim();
    if (!target) return;
    void enviar(JSON.stringify({ url: target }), { "content-type": "application/json" });
  }

  function analizarArchivos(list: FileList | null) {
    if (!list?.length) return;
    const form = new FormData();
    for (const file of Array.from(list)) form.append("files", file);
    void enviar(form);
  }

  return (
    <>
      <AetherFlowHero
        title="Analizá si tu web parece hecha con IA"
        subtitle="Pegá la URL o soltá los archivos de tu sitio. En segundos tenés el puntaje del 1 al 10, el informe de las 45 señales que la delatan y el prompt para arreglarla."
      >
        <form
          className="analyzer"
          onSubmit={(e) => {
            e.preventDefault();
            analizarUrl(url);
          }}
        >
          <div className="field">
            <label htmlFor="url" style={{ position: "absolute", left: "-9999px" }}>
              URL a analizar
            </label>
            <input
              id="url"
              name="url"
              type="text"
              inputMode="url"
              autoComplete="url"
              spellCheck={false}
              placeholder="tusitio.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              disabled={loading}
            />
            <button className="btn" type="submit" disabled={loading}>
              {loading ? "Analizando…" : "Analizar"}
              {!loading && <ArrowRight aria-hidden="true" />}
            </button>
          </div>

          <input
            ref={fileInput}
            type="file"
            multiple
            accept={ACCEPT}
            hidden
            onChange={(e) => analizarArchivos(e.target.files)}
          />
          <button
            type="button"
            className="dropzone"
            aria-label="Subir los archivos de tu web para analizarlos"
            data-over={dragging}
            onClick={() => fileInput.current?.click()}
            onDragOver={(e) => {
              e.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragging(false);
              analizarArchivos(e.dataTransfer.files);
            }}
          >
            <UploadCloud aria-hidden="true" />
            <span>
              {dragging ? (
                <b>Soltá acá</b>
              ) : (
                <>
                  o soltá <b>los archivos de tu web</b>: HTML, CSS, JS o el ZIP del build
                </>
              )}
            </span>
          </button>

          <div className="samples">
            {EJEMPLOS.map((e) => (
              <button
                key={e}
                type="button"
                className="sample"
                onClick={() => {
                  setUrl(e);
                  analizarUrl(e);
                }}
              >
                {e}
              </button>
            ))}
          </div>

          <p className="analyzer-note">
            No guardamos tu URL ni tus archivos: el análisis corre y se descarta.
          </p>
        </form>

        {error && (
          <p className="error" role="alert">
            {error}
          </p>
        )}

        {loading && (
          <div className="progress" aria-live="polite">
            <span>{PASOS[paso]}…</span>
            <span className="progress-bar" aria-hidden="true">
              <span />
            </span>
          </div>
        )}
      </AetherFlowHero>

      <div className="shell" ref={resultRef}>
        {result && <Resultado data={result} />}
      </div>
    </>
  );
}

/** Tres tramos para colorear las barras sin que el usuario tenga que interpretar. */
function nivelDe(porcentaje: number): "alto" | "medio" | "bajo" {
  if (porcentaje >= 70) return "alto";
  return porcentaje >= 40 ? "medio" : "bajo";
}

function Resultado({ data }: { data: AnalysisResult }) {
  const origen = data.mode === "url" ? new URL(data.finalUrl).hostname : "los archivos subidos";

  return (
    <section className="result" aria-label="Resultado del análisis">
      <div className="verdict">
        <div className="score-col">
          <p className="score">{data.score.toFixed(1)}</p>
          <p className="score-que-mide">
            <span>de 10</span>
            qué tan humana parece
          </p>
        </div>
        <div>
          <h2>{data.verdict}</h2>
          <p>{data.summary}</p>

          {/* La escala se dice en pantalla: sin esto, un 9 se lee como "9 de IA". */}
          <p className="score-escala">
            <b>1</b> generada y publicada sin revisar · <b>10</b> escrita por una persona
          </p>

          {/* Las barras crecen para el mismo lado que el puntaje: mas lleno, mejor. */}
          <dl className="axes">
            <div>
              <dt>Escritura y estructura propias</dt>
              <dd>
                <span className="axis-bar" data-nivel={nivelDe(data.authorshipClean)} aria-hidden="true">
                  <span style={{ width: `${data.authorshipClean}%` }} />
                </span>
                <b>{data.authorshipClean}%</b>
              </dd>
            </div>
            <div>
              <dt>Terminado técnico</dt>
              <dd>
                <span className="axis-bar" data-nivel={nivelDe(data.hygieneClean)} aria-hidden="true">
                  <span style={{ width: `${data.hygieneClean}%` }} />
                </span>
                <b>{data.hygieneClean}%</b>
              </dd>
            </div>
          </dl>

          <div className="facts">
            <span>
              <b>{data.findings.length}</b> problemas
            </span>
            <span>
              <b>{data.passed.length}</b> señales limpias
            </span>
            {data.skipped.length > 0 && (
              <span>
                <b>{data.skipped.length}</b> no comprobables
              </span>
            )}
            <span>
              <b>{Math.round(data.meta.jsBytes / 1024)} KB</b> de JS
            </span>
            <span>
              <b>{(data.meta.ms / 1000).toFixed(1)} s</b> de análisis
            </span>
            <span>
              desde <b>{origen}</b>
            </span>
          </div>
        </div>
      </div>

      {data.contentBlind && (
        <aside className="notice" role="note">
          <strong>No se pudo leer el contenido de esta página.</strong> El servidor devuelve un HTML
          vacío y todo el texto lo pinta el JavaScript en el navegador. Eso ya es un hallazgo en sí
          mismo, pero además deja fuera del análisis las señales que dependen del copy y de la
          estructura. Para evaluarlas, soltá arriba los archivos de tu web.
        </aside>
      )}

      <Report data={data} />
      <PromptBox prompts={data.prompts} />
      <Disclaimer />
    </section>
  );
}
