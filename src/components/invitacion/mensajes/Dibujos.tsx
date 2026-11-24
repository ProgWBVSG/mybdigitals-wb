/**
 * Los objetos del estilo Mensajes. Son cosas (un palo con malvaviscos, un pin),
 * no personas: los objetos simples sí van por código; las personas no.
 */

/**
 * Tres malvaviscos en un palo. Se tuestan solos: del blanco al dorado, de a
 * uno, empezando por la punta. Es el "listo" de la confirmación.
 */
export function Malvavisco() {
  return (
    <svg className="mj-malv" viewBox="0 0 160 96" role="img" aria-label="Un palo con tres malvaviscos tostándose">
      <g transform="rotate(-18 80 54)">
        <line x1="6" y1="54" x2="150" y2="54" className="mj-malv__palo" />
        {[0, 1, 2].map((i) => (
          <rect
            key={i}
            x={72 + i * 26}
            y="38"
            width="22"
            height="32"
            rx="9"
            className="mj-malv__pieza"
            style={{ "--i": 2 - i } as React.CSSProperties}
          />
        ))}
      </g>
    </svg>
  );
}

/* ── Íconos de línea ──
   Un solo trazo, el mismo grosor en todos. Dibujados a mano: no se mezclan con
   los de una librería. */

type Props = { className?: string };

const base = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

export const IconPin = ({ className }: Props) => (
  <svg {...base} className={className}>
    <path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11Z" />
    <circle cx="12" cy="10" r="2.3" />
  </svg>
);

export const IconReloj = ({ className }: Props) => (
  <svg {...base} className={className}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 7.5V12l3 2" />
  </svg>
);

export const IconCalendario = ({ className }: Props) => (
  <svg {...base} className={className}>
    <rect x="4" y="5.5" width="16" height="14.5" rx="2.5" />
    <path d="M4 10h16M8.5 3.5v4M15.5 3.5v4" />
  </svg>
);

export const IconCopiar = ({ className }: Props) => (
  <svg {...base} className={className}>
    <rect x="8.5" y="8.5" width="11" height="11" rx="2.3" />
    <path d="M15.5 8.5V6.8a2.3 2.3 0 0 0-2.3-2.3H6.8a2.3 2.3 0 0 0-2.3 2.3v6.4a2.3 2.3 0 0 0 2.3 2.3h1.7" />
  </svg>
);

export const IconAbajo = ({ className }: Props) => (
  <svg {...base} className={className}>
    <path d="M12 5v13M6.5 12.5 12 18l5.5-5.5" />
  </svg>
);

/** El corazón de la reacción que cuelga de una foto. Relleno, no de línea. */
export const IconCorazon = ({ className }: Props) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
    <path
      d="M12 20.5s-7.5-4.6-7.5-10.2A4.3 4.3 0 0 1 12 7.6a4.3 4.3 0 0 1 7.5 2.7c0 5.6-7.5 10.2-7.5 10.2Z"
      fill="currentColor"
    />
  </svg>
);

/** Dos tildes: "recibido", en la respuesta del invitado. */
export const IconTildes = ({ className }: Props) => (
  <svg {...base} strokeWidth={2} className={className}>
    <path d="m2.5 12.5 4 4 8-9M11.5 15.5l1 1 8.5-9.5" />
  </svg>
);
