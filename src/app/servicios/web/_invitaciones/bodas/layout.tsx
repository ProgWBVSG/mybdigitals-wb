import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Invitaciones de Boda Digitales en Córdoba | Premium & Elegantes",
  description: "Revolucioná tu casamiento con nuestras invitaciones web premium. Interactivas, dinámicas, con panel de invitados y confirmación de asistencia. Diseño exclusivo en Córdoba.",
  keywords: ["invitaciones de boda digitales", "invitaciones web casamiento", "tarjetas digitales casamiento córdoba", "wedding planner córdoba", "invitaciones interactivas", "panel de invitados"],
  openGraph: {
    title: "Invitaciones de Boda Digitales en Córdoba | Premium & Elegantes",
    description: "Revolucioná tu casamiento con nuestras invitaciones web premium. Interactivas, dinámicas y con panel de confirmación de asistencia.",
    type: "website",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
