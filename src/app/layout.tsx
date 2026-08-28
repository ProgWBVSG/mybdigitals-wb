import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import FloatingWidgets from "@/components/FloatingWidgets";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CustomCursor from "@/components/CustomCursor";
import HideSiteChrome from "@/components/HideSiteChrome";
import { SITE_URL } from "@/lib/site";

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
  metadataBase: new URL(SITE_URL),
  title: {
    default: "MYB Digitals | Agencia Web & Automatizaciones con IA en Córdoba",
    template: "%s | MYB Digitals"
  },
  description: "Agencia líder en Córdoba de Desarrollo Web Premium y Automatización con Inteligencia Artificial. Escalamos empresas con agentes IA, chatbots y landing pages de alta conversión.",
  keywords: ["agencia de automatizaciones córdoba", "agencia web córdoba", "desarrollo web premium", "chatbots con IA", "agencia de inteligencia artificial", "automatización de procesos", "diseño web córdoba", "landing pages"],
  authors: [{ name: "MYB Digitals", url: SITE_URL }],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "MYB Digitals | Agencia Web & Automatizaciones con IA en Córdoba",
    description: "Escalamos negocios mediante Automatización de IA y Desarrollo Web Premium. Desde Córdoba, Argentina para el mundo.",
    url: SITE_URL,
    siteName: "MYB Digitals",
    type: "website",
    locale: "es_AR",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
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
        <HideSiteChrome>
          <CustomCursor />
          <Navbar />
        </HideSiteChrome>
        <div id="main-content" tabIndex={-1}>
          {children}
        </div>
        <HideSiteChrome>
          <Footer />
          <FloatingWidgets />
        </HideSiteChrome>
      </body>
    </html>
  );
}
