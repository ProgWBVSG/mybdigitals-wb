import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import { urlDe } from "@/lib/site";
import "./invitaciones.css";

/* Montserrat, con todo el rango de pesos: los títulos van en 300 y los
   remates en 600, y ese contraste es lo que sostiene la elegancia. */
const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Tu Invitación Digital — invitaciones web para bodas, cumpleaños y eventos",
    template: "%s · Tu Invitación Digital",
  },
  description:
    "Invitaciones digitales interactivas para casamientos, cumpleaños y eventos profesionales. Cuenta regresiva, ubicación con mapa, confirmación de asistencia automática y álbum de fotos. Pago único, entrega en 3 días.",
  keywords: [
    "invitaciones digitales",
    "invitaciones web casamiento",
    "tarjetas digitales cumpleaños",
    "invitaciones para eventos profesionales",
    "confirmación de asistencia online",
  ],
  alternates: { canonical: "/tuinvitaciondigital" },
  openGraph: {
    type: "website",
    locale: "es_AR",
    url: urlDe("/tuinvitaciondigital"),
    siteName: "Tu Invitación Digital",
    title: "Tu Invitación Digital — invitaciones web para bodas, cumpleaños y eventos",
    description:
      "La invitación que tus invitados abren en el celular: cuenta regresiva, mapa, confirmación automática y álbum de fotos compartido.",
  },
};

/**
 * Esta ruta se ve distinta al resto del sitio a propósito: es un producto
 * aparte que comparte dominio. El contenedor .tid aísla sus estilos y el
 * layout raíz oculta la navegación de MYB cuando la ruta empieza con
 * /tuinvitaciondigital.
 *
 * Acá sólo viven la tipografía y los tokens. La barra y el pie los pone el
 * grupo (sitio), para que las demos de /demo se vean como la invitación real:
 * a pantalla completa y sin nada alrededor.
 */
export default function InvitacionesLayout({ children }: { children: React.ReactNode }) {
  return <div className={`tid ${montserrat.variable}`}>{children}</div>;
}
