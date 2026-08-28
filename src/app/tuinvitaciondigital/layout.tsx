import type { Metadata } from "next";
import { Fraunces, Karla } from "next/font/google";
import { urlDe } from "@/lib/site";
import "./invitaciones.css";

/* Fraunces aporta la calidez escrita a mano; Karla sostiene la lectura.
   Ninguna de las dos se usa en el resto de mybdigitals.com. */
const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  display: "swap",
  axes: ["SOFT", "WONK", "opsz"],
});

const karla = Karla({
  variable: "--font-karla",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Tu Invitación Digital — invitaciones web para bodas y XV",
    template: "%s · Tu Invitación Digital",
  },
  description:
    "Invitaciones digitales interactivas para casamientos y quince años en Córdoba. Cuenta regresiva, ubicación con GPS, confirmación de asistencia automática y álbum de fotos. Pago único, entrega en 3 días.",
  keywords: [
    "invitaciones digitales",
    "invitaciones web casamiento",
    "tarjetas digitales 15 años",
    "invitaciones interactivas córdoba",
    "confirmación de asistencia online",
  ],
  alternates: { canonical: "/tuinvitaciondigital" },
  openGraph: {
    type: "website",
    locale: "es_AR",
    url: urlDe("/tuinvitaciondigital"),
    siteName: "Tu Invitación Digital",
    title: "Tu Invitación Digital — invitaciones web para bodas y XV",
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
 * Acá sólo viven las tipografías y los tokens. La barra y el pie los pone el
 * grupo (sitio), para que las demos de /demo se vean como la invitación real:
 * a pantalla completa y sin nada alrededor.
 */
export default function InvitacionesLayout({ children }: { children: React.ReactNode }) {
  return <div className={`tid ${fraunces.variable} ${karla.variable}`}>{children}</div>;
}
