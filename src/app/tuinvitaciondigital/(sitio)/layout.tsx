import Link from "next/link";
import { SITE_URL } from "@/lib/site";
import { WHATSAPP } from "@/lib/invitaciones";

/**
 * La barra y el pie de Tu Invitación Digital. Viven en el grupo (sitio) y no
 * en el layout de arriba a propósito: las demos de /demo tienen que verse como
 * la invitación de verdad, sin chrome alrededor.
 */
export default function SitioLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="tid-fondo" aria-hidden="true" />

      <div className="tid-capa">
        <header className="tid-barra">
          <div className="tid-marco tid-barra__interior">
            <Link href="/tuinvitaciondigital" className="tid-logo">
              <span className="tid-logo__marca tid-display">Tu Invitación</span>
              <span className="tid-logo__cola tid-display tid-cursiva">digital</span>
            </Link>

            <nav className="tid-barra__nav" aria-label="Secciones">
              <Link href="/tuinvitaciondigital#disenos">Diseños</Link>
              <Link href="/tuinvitaciondigital#incluye">Qué incluye</Link>
              <Link href="/tuinvitaciondigital#precios">Precios</Link>
              <Link href="/tuinvitaciondigital#preguntas">Preguntas</Link>
            </nav>

            <a
              className="tid-boton tid-boton--lleno tid-barra__cta"
              href={WHATSAPP}
              target="_blank"
              rel="noopener noreferrer"
            >
              Escribinos
            </a>
          </div>
        </header>

        <main>{children}</main>

        <footer className="tid-pie">
          <div className="tid-marco">
            <div className="tid-filete" />
            <div className="tid-pie__interior">
              <div>
                <p className="tid-display tid-pie__marca">
                  Tu Invitación <span className="tid-cursiva">digital</span>
                </p>
                <p className="tid-nota tid-pie__lugar">Córdoba, Argentina</p>
              </div>

              <nav className="tid-pie__nav" aria-label="Enlaces del pie">
                <Link href="/tuinvitaciondigital/bodas">Casamientos</Link>
                <Link href="/tuinvitaciondigital/cumples">Quince años</Link>
                <a href={WHATSAPP} target="_blank" rel="noopener noreferrer">
                  WhatsApp
                </a>
              </nav>
            </div>

            <p className="tid-nota tid-pie__firma">
              Un producto de{" "}
              <a href={SITE_URL} className="tid-pie__enlace">
                MYB Digitals
              </a>
            </p>
          </div>
        </footer>
      </div>
    </>
  );
}
