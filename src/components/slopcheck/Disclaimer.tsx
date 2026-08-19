import { MessageCircle } from "lucide-react";
import { INSTAGRAM_HANDLE, INSTAGRAM_URL } from "@/lib/slopcheck-config";

/**
 * El análisis es heurístico: puede marcar algo que está bien o pasar por alto
 * algo que está mal. Se dice de frente y se ofrece el canal para reportarlo.
 */
export function Disclaimer() {
  return (
    <aside className="disclaimer">
      <p>
        <strong>Esto puede equivocarse, y es normal.</strong> El análisis se apoya en 45 reglas sobre el
        código y el texto de tu página, no en un criterio humano. A veces marca como problema algo que
        decidiste a propósito, o no llega a ver algo que sí está mal.
      </p>
      <p>
        Si ves un error o algo que no te cierra, mandame un mensaje por Instagram con la captura del
        resultado. Con eso ajusto la regla que falló.
      </p>
      <a className="disclaimer-cta" href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer">
        <MessageCircle aria-hidden="true" />
        Reportar en @{INSTAGRAM_HANDLE}
      </a>
    </aside>
  );
}
