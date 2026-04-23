"use client";

import Link from "next/link";
import { MessageCircle, Zap, ArrowUpRight } from "lucide-react";

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
                href="https://www.instagram.com/mybdigitals.ai"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram de MYB Digitals"
                className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/[0.03] hover:bg-white/[0.07] hover:border-primary/30 transition-all text-sm font-semibold text-gray-300 hover:text-white group"
              >
                {/* Instagram SVG */}
                <svg className="w-4 h-4 text-pink-400 group-hover:text-pink-300 transition-colors" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
                @mybdigitals.ai
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
