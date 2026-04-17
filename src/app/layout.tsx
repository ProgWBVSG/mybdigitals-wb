import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import FloatingWidgets from "@/components/FloatingWidgets";
import Navbar from "@/components/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  // §3 Performance: font-display swap evita FOIT
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

// §5 Layout: viewport meta – nunca deshabilitar zoom (accesibilidad §1)
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  // NO se deshabilita userScalable (importante para accesibilidad WCAG)
};

export const metadata: Metadata = {
  title: "MYB Digitals | Agencia Web & IA",
  description: "Escalamos negocios mediante Automatización de IA y Desarrollo Web Premium. Agentes inteligentes, landings de alta conversión y presencia digital de clase mundial.",
  keywords: ["agencia digital", "automatización IA", "desarrollo web", "landing page", "chatbot", "WhatsApp bot"],
  authors: [{ name: "MYB Digitals" }],
  // §SEO: Open Graph para redes sociales
  openGraph: {
    title: "MYB Digitals | Agencia Web & IA",
    description: "Escalamos negocios mediante Automatización de IA y Desarrollo Web Premium.",
    type: "website",
    locale: "es_AR",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      data-scroll-behavior="smooth"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased scroll-smooth`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-background text-foreground selection:bg-primary/30" suppressHydrationWarning>
        {/* §1 Accessibility: Skip-link para usuarios de teclado */}
        <a href="#main-content" className="skip-link">
          Saltar al contenido principal
        </a>
        <Navbar />
        <div id="main-content" tabIndex={-1}>
          {children}
        </div>
        <FloatingWidgets />
      </body>
    </html>
  );
}
