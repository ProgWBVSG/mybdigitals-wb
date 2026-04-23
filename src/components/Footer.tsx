"use client";

import Link from "next/link";
import { Instagram, MessageCircle, Zap, ArrowUpRight } from "lucide-react";

const NAV_LINKS = [
  {
    title: "Servicios Web",
    links: [
      { label: "Landing Page", href: "/servicios/web/landing-page" },
      { label: "Presencia Digital", href: "/servicios/web/presencia-digital" },
      { label: "Invitaciones Digitales", href: "/servicios/web/invitaciones" },
    ],
  },
  {
    title: "IA & Automatización",
    links: [
      { label: "Automatizaciones", href: "/servicios/automatizaciones" },
      { label: "Agentes IA", href: "/servicios/automatizaciones" },
    ],
  },
  {
    title: "Empresa",
    links: [
      { label: "Inicio", href: "/" },
      { label: "Iniciar Proyecto", href: "https://wa.me/543515555123" },
    ],
  },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="w-full bg-[#030303] border-t border-white/[0.06] text-white font-sans relative overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-10 py-16 md:py-20 relative z-10">

        {/* Top row */}
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 mb-16">

          {/* Brand */}
          <div className="lg:w-[320px] shrink-0 flex flex-col gap-5">
            <Link href="/" className="inline-flex items-center gap-2 group w-fit">
              <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center shadow-[0_0_14px_rgba(195,216,9,0.4)]">
                <Zap className="w-4 h-4 text-black fill-black" />
              </div>
              <span className="font-black text-xl tracking-tight">
                MYB <span className="text-primary">DIGITALS</span>
              </span>
            </Link>

            <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
              Escalamos negocios con Inteligencia Artificial y Desarrollo Web Premium. Tu ecosistema digital, siempre activo.
            </p>

            {/* Social */}
            <div className="flex items-center gap-3 mt-1">
              <a
                href="https://www.instagram.com/mybdigitals_ok"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram de MYB Digitals"
                className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/[0.03] hover:bg-white/[0.07] hover:border-primary/30 transition-all text-sm font-semibold text-gray-300 hover:text-white group"
              >
                <Instagram className="w-4 h-4 text-pink-400 group-hover:text-pink-300 transition-colors" />
                @mybdigitals_ok
                <ArrowUpRight className="w-3 h-3 opacity-50 group-hover:opacity-100 transition-opacity" />
              </a>
            </div>

            {/* WhatsApp CTA */}
            <a
              href="https://wa.me/543515555123?text=Hola,%20me%20comunico%20desde%20la%20web%20de%20MYB%20Digitals."
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Contactar por WhatsApp"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#25D366]/10 border border-[#25D366]/20 text-[#25D366] text-sm font-bold hover:bg-[#25D366]/20 transition-colors w-fit"
            >
              <MessageCircle className="w-4 h-4" />
              Escribinos por WhatsApp
            </a>
          </div>

          {/* Nav columns */}
          <div className="flex-1 grid grid-cols-2 sm:grid-cols-3 gap-8">
            {NAV_LINKS.map((col) => (
              <div key={col.title}>
                <p className="text-[11px] font-bold uppercase tracking-widest text-primary mb-4">
                  {col.title}
                </p>
                <ul className="flex flex-col gap-2.5">
                  {col.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-gray-400 hover:text-white text-sm transition-colors hover:translate-x-0.5 inline-block"
                        {...(link.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />

        {/* Bottom row */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 text-xs text-gray-600">
          <p>© {year} MYB Digitals. Todos los derechos reservados.</p>
          <p className="text-gray-700">
            Hecho con <span className="text-primary">♥</span> en Argentina 🇦🇷
          </p>
        </div>

      </div>
    </footer>
  );
}
