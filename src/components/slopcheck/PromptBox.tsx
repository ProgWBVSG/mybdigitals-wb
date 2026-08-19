"use client";

import { useEffect, useState } from "react";

/** El prompt a medida, con copiado al portapapeles y descarga en .md. */
export function PromptBox({ prompt }: { prompt: string }) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const id = setTimeout(() => setCopied(false), 2200);
    return () => clearTimeout(id);
  }, [copied]);

  async function copiar() {
    try {
      await navigator.clipboard.writeText(prompt);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="block">
      <h3>Prompt a medida</h3>
      <div className="prompt-head">
        <div>
          <strong>Copiá esto y pegalo en tu IA.</strong>
          <p>
            Está armado con los problemas que se encontraron en tu página, con su evidencia y con los
            entregables que hacen falta para resolverlos.
          </p>
        </div>
        <button type="button" className="btn-ghost" onClick={copiar}>
          {copied ? "Copiado" : "Copiar prompt"}
        </button>
      </div>
      <div className="prompt-box">
        <pre>{prompt}</pre>
      </div>
      {copied && (
        <p className="copied" role="status">
          Listo, ya está en el portapapeles.
        </p>
      )}
    </div>
  );
}
