import type { Metadata } from "next";
import { urlDe } from "@/lib/site";

/* La página es un componente de cliente y no puede exportar metadata, así que
   se declara acá. El título y la descripción nombran a los fundadores: es lo
   que Google muestra cuando alguien busca quién está detrás de MYB Digitals. */
export const metadata: Metadata = {
  title: "Nosotros: Benjamín Vidal y Matías König, fundadores",
  description:
    "MYB Digitals la fundaron Benjamín Vidal y Matías König en Córdoba, Argentina. Somos una agencia de desarrollo web y automatización con IA, transparente, rápida y enfocada en hacer crecer tu negocio.",
  alternates: { canonical: "/nosotros" },
  openGraph: {
    type: "website",
    locale: "es_AR",
    url: urlDe("/nosotros"),
    siteName: "MYB Digitals",
    title: "Nosotros: Benjamín Vidal y Matías König, fundadores de MYB Digitals",
    description:
      "Los dos fundadores de MYB Digitals: Benjamín Vidal en estrategia y consultoría, Matías König en ingeniería web e IA.",
  },
};

export default function NosotrosLayout({ children }: { children: React.ReactNode }) {
  return children;
}
