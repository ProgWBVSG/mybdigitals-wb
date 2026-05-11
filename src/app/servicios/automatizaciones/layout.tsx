import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Agencia de Automatizaciones con IA en Córdoba | Chatbots y Bots",
  description: "Especialistas en automatización de empresas en Córdoba. Creamos bots de WhatsApp, asistentes de inteligencia artificial y optimización de flujos de trabajo.",
  keywords: ["agencia de automatizaciones córdoba", "chatbots para empresas córdoba", "bots de whatsapp argentina", "inteligencia artificial para negocios", "automatización de procesos", "IA córdoba"],
  openGraph: {
    title: "Agencia de Automatizaciones con IA en Córdoba | Chatbots y Bots",
    description: "Especialistas en automatización de empresas en Córdoba. Creamos bots de WhatsApp, asistentes de inteligencia artificial y optimización de flujos de trabajo.",
    type: "website",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
