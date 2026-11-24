/**
 * Los objetos del estilo Mensajes. Son cosas (un palo con malvaviscos), no
 * personas: los objetos simples sí van por código; las personas no.
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
