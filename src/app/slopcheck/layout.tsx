import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import Link from "next/link";
import { GradientBackground } from "@/components/slopcheck/ui/gradient-backgrounds";
import { SiteHeader } from "@/components/slopcheck/SiteHeader";
import { INSTAGRAM_HANDLE, INSTAGRAM_URL } from "@/lib/slopcheck-config";
import "./slopcheck.css";

/** SlopCheck usa su propia tipografía, distinta a la del resto del sitio. */
const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "SlopCheck — analizá si tu web parece hecha con IA",
    template: "%s · SlopCheck",
  },
  description:
    "Herramienta gratuita de MYB Digitals. Pegá una URL y obtené un puntaje del 1 al 10, el informe de las 45 señales que delatan una web generada con IA, y un prompt listo para arreglarla.",
  alternates: { canonical: "/slopcheck" },
  openGraph: {
    type: "website",
    locale: "es_AR",
    url: "https://mybdigitals.com/slopcheck",
    siteName: "MYB Digitals",
    title: "SlopCheck — analizá si tu web parece hecha con IA",
    description:
      "45 señales analizadas en segundos: puntaje, informe por categoría y un prompt a medida para corregir tu página.",
  },
};

/**
 * Esta ruta se ve distinta al resto del sitio a propósito: es un producto
 * aparte. El contenedor .slopcheck aísla sus estilos, y el layout raíz oculta
 * la navegación de MYB cuando la ruta empieza con /slopcheck.
 */
export default function SlopcheckLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`slopcheck ${montserrat.variable}`}>
      <GradientBackground />
      <div style={{ position: "relative", zIndex: 1 }}>
        <SiteHeader />
        <main>{children}</main>
        <div className="shell">
          <footer className="footer">
            <p className="footer-note">
              Esta web está hecha con IA, con la intención de ayudar a otros desarrolladores a mejorar
              la suya.
              <span className="footer-by">
                Desarrollado por{" "}
                <a href="https://mybdigitals.com" target="_blank" rel="noopener noreferrer">
                  mybdigitals.com
                </a>
              </span>
            </p>
            <nav aria-label="Enlaces de SlopCheck">
              <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer">
                Reportar un error: @{INSTAGRAM_HANDLE}
              </a>
              <Link href="/slopcheck/metodologia">Metodología</Link>
              <Link href="/slopcheck/terminos">Términos</Link>
              <Link href="/slopcheck/privacidad">Privacidad</Link>
            </nav>
          </footer>
        </div>
      </div>
    </div>
  );
}
