"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useState, useRef, useEffect, useCallback } from "react";
import { ArrowRight, ChevronDown, Menu, X } from "lucide-react";

import { usePathname } from "next/navigation";

const webLinks = [
  { href: "/servicios/web/presencia-digital", label: "Presencia Digital" },
  { href: "/servicios/web/landing-page", label: "Landing Page" },
  { href: "/servicios/web/invitaciones", label: "Web Invitations" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [webOpen, setWebOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // §1 Accessibility: cierra dropdown al presionar Escape
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === "Escape") {
      setWebOpen(false);
      setMobileOpen(false);
    }
  }, []);

  // Cierra dropdown al hacer click fuera
  const handleClickOutside = useCallback((e: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
      setWebOpen(false);
    }
  }, []);

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [handleKeyDown, handleClickOutside]);

  // Cierra mobile menu en resize a desktop
  useEffect(() => {
    const onResize = () => { if (window.innerWidth >= 768) setMobileOpen(false); };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Hide completely if it's a demo
  if (pathname?.includes("/demo/")) return null;

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" as const }}
      className="fixed top-0 w-full flex justify-between items-center px-4 md:px-10 py-5 z-50 bg-background/40 backdrop-blur-xl border-b border-white/5"
      role="banner"
    >
      {/* Logo */}
      <Link href="/" className="text-xl md:text-2xl font-black tracking-tighter flex items-center gap-2" aria-label="MYB Digitals — inicio">
        <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-primary/20 flex items-center justify-center border border-primary/30 overflow-hidden relative">
          <Image
            src="/myb-robot.png"
            alt="Logo MYB Digitals"
            fill
            sizes="40px"
            priority
            className="object-contain p-1"
          />
        </div>
        <span className="text-white">MYB</span> <span className="text-primary/80 font-medium">DIGITALS</span>
      </Link>

      {/* Desktop Nav */}
      <nav
        className="hidden md:flex gap-8 items-center font-medium bg-white/5 px-8 py-3 rounded-full border border-white/10"
        aria-label="Navegación principal"
      >
        <Link href="/" className="text-xs tracking-widest uppercase text-gray-400 hover:text-white transition-colors duration-200">
          Inicio
        </Link>

        {/* §1 Accessibility + §9 Navigation: dropdown con toggle click + keyboard */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setWebOpen(!webOpen)}
            onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setWebOpen(!webOpen); } }}
            aria-haspopup="true"
            aria-expanded={webOpen}
            aria-controls="web-menu"
            className="text-xs tracking-widest uppercase text-gray-400 hover:text-white transition-colors duration-200 cursor-pointer flex items-center gap-1 py-2 -my-2 px-1 -mx-1"
          >
            Web
            <motion.span
              animate={{ rotate: webOpen ? 180 : 0 }}
              transition={{ duration: 0.2 }}
              className="inline-flex"
            >
              <ChevronDown size={12} aria-hidden="true" />
            </motion.span>
          </button>

          <AnimatePresence>
            {webOpen && (
              <motion.div
                id="web-menu"
                role="menu"
                initial={{ opacity: 0, y: -8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.96 }}
                transition={{ duration: 0.18, ease: "easeOut" as const }}
                className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-52 bg-background/98 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden flex flex-col shadow-2xl shadow-black/60"
              >
                {webLinks.map((link, i) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    role="menuitem"
                    onClick={() => setWebOpen(false)}
                    className={`text-xs tracking-wide text-gray-400 hover:text-white hover:bg-white/5 p-3 px-4 transition-all duration-150 ${i < webLinks.length - 1 ? "border-b border-white/5" : ""}`}
                  >
                    {link.label}
                  </Link>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <Link href="/servicios/automatizaciones" className="text-xs tracking-widest uppercase text-gray-400 hover:text-white transition-colors duration-200">
          Automatizaciones IA
        </Link>
      </nav>

      {/* CTA Desktop */}
      <Link
        href="https://wa.me/543515555123"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Agendar sesión en WhatsApp"
        className="hidden md:flex bg-white text-black px-6 py-3 rounded-full font-bold text-sm hover:scale-105 hover:bg-primary transition-all duration-200 gap-2 items-center shadow-lg min-h-[44px]"
      >
        Agendar Sesión <ArrowRight size={16} aria-hidden="true" />
      </Link>

      {/* Mobile hamburger: §2 Touch — mínimo 44px */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        aria-label={mobileOpen ? "Cerrar menú" : "Abrir menú"}
        aria-expanded={mobileOpen}
        aria-controls="mobile-menu"
        className="md:hidden flex items-center justify-center w-11 h-11 rounded-full bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all duration-200"
      >
        <AnimatePresence mode="wait">
          {mobileOpen ? (
            <motion.span key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}>
              <X size={18} aria-hidden="true" />
            </motion.span>
          ) : (
            <motion.span key="menu" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}>
              <Menu size={18} aria-hidden="true" />
            </motion.span>
          )}
        </AnimatePresence>
      </button>

      {/* Mobile Menu Panel */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.25, ease: "easeOut" as const }}
            className="absolute top-full left-0 right-0 bg-background/98 backdrop-blur-xl border-b border-white/10 shadow-2xl md:hidden"
            role="navigation"
            aria-label="Menú móvil"
          >
            <nav className="flex flex-col px-6 py-6 gap-1">
              <Link
                href="/"
                onClick={() => setMobileOpen(false)}
                className="text-sm font-semibold text-gray-300 hover:text-white py-3 border-b border-white/5 transition-colors duration-150"
              >
                Inicio
              </Link>
              <div className="border-b border-white/5">
                <p className="text-[10px] font-bold tracking-widest uppercase text-gray-500 pt-3 pb-1">Web</p>
                {webLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="text-sm text-gray-400 hover:text-white py-2.5 pl-3 block transition-colors duration-150"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
              <Link
                href="/servicios/automatizaciones"
                onClick={() => setMobileOpen(false)}
                className="text-sm font-semibold text-gray-300 hover:text-white py-3 border-b border-white/5 transition-colors duration-150"
              >
                Automatizaciones IA
              </Link>
              <Link
                href="https://wa.me/543515555123"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMobileOpen(false)}
                className="mt-4 flex items-center justify-center gap-2 bg-primary text-black px-6 py-3.5 rounded-full font-bold text-sm hover:bg-white transition-all duration-200 min-h-[44px]"
              >
                Agendar Sesión <ArrowRight size={16} aria-hidden="true" />
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
