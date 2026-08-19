"use client";

import { useEffect, useState } from "react";
import { AlertTriangle } from "lucide-react";
import type { PromptVariant } from "@/lib/analyzer/types";

/**
 * El prompt viene en tres niveles porque el que reescribe todo puede dejarte
 * una página más limpia y sin identidad. Se muestra primero el que no toca
 * nada visible; el que rehace el diseño lleva advertencia.
 */
export function PromptBox({ prompts }: { prompts: PromptVariant[] }) {
  const [activo, setActivo] = useState(0);
  const [copiado, setCopiado] = useState(false);
  const variante = prompts[activo] ?? prompts[0];

  useEffect(() => {
    if (!copiado) return;
    const id = setTimeout(() => setCopiado(false), 2200);
    return () => clearTimeout(id);
  }, [copiado]);

  async function copiar() {
    try {
      await navigator.clipboard.writeText(variante.text);
      setCopiado(true);
    } catch {
      setCopiado(false);
    }
  }

  return (
    <div className="block">
      <h3>Prompt a medida</h3>

      <p className="prompt-intro">
        Elegí cuánto querés que la IA toque tu página. Cuanto más abajo, más cambia, y más hay que
        revisar lo que devuelve.
      </p>

      {prompts.length > 1 && (
        <div className="niveles" role="tablist" aria-label="Nivel de intervención">
          {prompts.map((p, i) => (
            <button
              key={p.id}
              role="tab"
              type="button"
              aria-selected={i === activo}
              data-riesgo={p.riesgo}
              className="nivel"
              onClick={() => setActivo(i)}
            >
              <span className="nivel-label">{p.label}</span>
              <span className="nivel-summary">{p.summary}</span>
            </button>
          ))}
        </div>
      )}

      {variante.aviso && (
        <p className="nivel-aviso" role="note">
          <AlertTriangle aria-hidden="true" />
          <span>{variante.aviso}</span>
        </p>
      )}

      <div className="prompt-head">
        <div>
          <strong>Copiá esto y pegalo en tu IA.</strong>
          <p>
            Está armado con los problemas que se encontraron en tu página, con su evidencia y con la
            instrucción explícita de no borrar lo que suena a tu marca.
          </p>
        </div>
        <button type="button" className="btn-ghost" onClick={copiar}>
          {copiado ? "Copiado" : "Copiar prompt"}
        </button>
      </div>

      <div className="prompt-box">
        <pre>{variante.text}</pre>
      </div>

      {copiado && (
        <p className="copied" role="status">
          Listo, ya está en el portapapeles.
        </p>
      )}
    </div>
  );
}
