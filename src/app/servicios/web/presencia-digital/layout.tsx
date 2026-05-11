import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Agencia de Desarrollo Web Premium en Córdoba | Landing Pages & E-Commerce",
  description: "Construimos sistemas y páginas web de alta conversión en Córdoba. Expertos en Next.js, tiendas online y ecosistemas digitales que escalan tu negocio.",
  keywords: ["desarrollo web premium córdoba", "agencia web córdoba", "diseño web profesional", "crear landing page argentina", "tiendas online córdoba", "nextjs development"],
  openGraph: {
    title: "Agencia de Desarrollo Web Premium en Córdoba | Landing Pages & E-Commerce",
    description: "Construimos sistemas y páginas web de alta conversión en Córdoba. Expertos en Next.js, tiendas online y ecosistemas digitales.",
    type: "website",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
