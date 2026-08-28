import type { Metadata } from "next";
import { urlDe } from "@/lib/site";

export const metadata: Metadata = {
  title: "Invitaciones digitales para casamiento",
  description:
    "Invitaciones web para casamientos en Córdoba: cuenta regresiva, ceremonia y fiesta con mapa, confirmación de asistencia automática y álbum de fotos con QR. Ocho diseños para elegir.",
  keywords: [
    "invitaciones de boda digitales",
    "invitaciones web casamiento",
    "tarjetas digitales casamiento córdoba",
    "confirmación de asistencia online",
    "invitaciones interactivas",
  ],
  alternates: { canonical: "/tuinvitacióndigital/bodas" },
  openGraph: {
    type: "website",
    locale: "es_AR",
    url: urlDe("/tuinvitacióndigital/bodas"),
    title: "Invitaciones digitales para casamiento",
    description:
      "La invitación que tus invitados abren en el celular: cuenta regresiva, mapa, confirmación automática y álbum de fotos compartido.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
