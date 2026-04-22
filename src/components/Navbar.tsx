"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useState, useRef, useEffect, useCallback } from "react";
import { ArrowRight, ChevronDown, Menu, X, Sparkles } from "lucide-react";

import { usePathname } from "next/navigation";

const webLinks = [
  { href: "/servicios/web/presencia-digital", label: "Presencia Digital Premium" },
  { href: "/servicios/web/landing-page", label: "Landing Pages" },
  { href: "/servicios/web/invitaciones", label: "Invitaciones Digitales" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [webOpen, setWebOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === "Escape") {
      setWebOpen(false);
      setMobileOpen(false);
    }
  }, []);

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

  useEffect(() => {
    const onResize = () => { if (window.innerWidth >= 768) setMobileOpen(false); };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  if (pathname?.includes("/demo/")) return null;

  return (
    <>
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" as const }}
        className="fixed top-4 left-1/2 -translate-x-1/2 w-[92%] md:w-auto md:min-w-[700px] flex justify-between items-center px-3 py-3 pr-4 z-50 bg-[#050505]/70 backdrop-blur-2xl border border-white/10 rounded-full shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
        role="banner"
      >
        {/* Logo */}
        <Link href="/" className="text-xl font-black tracking-tighter flex items-center gap-2" aria-label="MYB Digitals — inicio">
          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center border border-primary/30 overflow-hidden relative">
            <Image
              src="/myb-robot.png"
              alt="Logo MYB Digitals"
              fill
              sizes="40px"
              priority
              className="object-contain p-1"
            />
          </div>
          <span className="text-white hidden md:block">MYB</span> 
          <span className="text-primary font-medium hidden md:block">DIGITALS</span>
        </Link>

        {/* Desktop Nav */}
        <nav
          className="hidden md:flex gap-8 items-center font-medium mx-auto px-6"
          aria-label="Navegación principal"
        >
          <Link href="/" className="text-[13px] tracking-wide text-gray-300 hover:text-white transition-colors duration-200 font-semibold">
            Inicio
          </Link>

          <div className="relative group" ref={dropdownRef}>
            <button
              onClick={() => setWebOpen(!webOpen)}
              onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setWebOpen(!webOpen); } }}
              aria-haspopup="true"
              aria-expanded={webOpen}
              aria-controls="web-menu"
              className="text-[13px] tracking-wide text-gray-300 hover:text-white transition-colors duration-200 cursor-pointer flex items-center gap-1 font-semibold"
            >
              Soluciones Web
              <motion.span
                animate={{ rotate: webOpen ? 180 : 0 }}
                transition={{ duration: 0.2 }}
                className="inline-flex"
              >
                <ChevronDown size={14} aria-hidden="true" />
              </motion.span>
            </button>

            <AnimatePresence>
              {webOpen && (
                <motion.div
                  id="web-menu"
                  role="menu"
                  initial={{ opacity: 0, y: 10, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.96 }}
                  transition={{ duration: 0.2, ease: "easeOut" as const }}
                  className="absolute top-[200%] left-1/2 -translate-x-1/2 w-64 bg-[#0a0a0a]/90 backdrop-blur-2xl border border-white/10 rounded-2xl overflow-hidden flex flex-col shadow-[0_30px_60px_rgba(0,0,0,0.6)] p-2"
                >
                  <div className="px-3 pb-2 pt-2">
                     <p className="text-[10px] uppercase tracking-widest font-black text-primary/80 mb-2 px-1">Ecosistemas</p>
                     {webLinks.map((link) => (
                       <Link
                         key={link.href}
                         href={link.href}
                         role="menuitem"
                         onClick={() => setWebOpen(false)}
                         className="flex flex-col text-sm font-semibold text-white hover:bg-white/5 p-3 rounded-xl transition-all duration-150 group/item"
                       >
                         {link.label}
                       </Link>
                     ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <Link href="/servicios/automatizaciones" className="text-[13px] tracking-wide text-gray-300 hover:text-white transition-colors duration-200 font-semibold flex items-center gap-1.5">
            Agentes IA <Sparkles className="w-3 h-3 text-primary" />
          </Link>
        </nav>

        {/* CTA Desktop */}
        <Link
          href="https://wa.me/543515555123"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Agendar sesión en WhatsApp"
          className="hidden md:flex bg-white text-black px-6 py-2.5 rounded-full font-bold text-[13px] hover:scale-105 hover:bg-primary transition-all duration-300 gap-2 items-center shadow-[0_0_20px_rgba(255,255,255,0.1)]"
        >
          Iniciar Proyecto <ArrowRight size={14} aria-hidden="true" />
        </Link>

        {/* Mobile Hamburger */}
        <div className="flex md:hidden items-center gap-4">
           {/* Mobile Quick CTA */}
           <Link
             href="https://wa.me/543515555123"
             className="bg-primary text-black px-4 py-2 rounded-full font-bold text-xs"
           >
             Contactar
           </Link>
           <button
             onClick={() => setMobileOpen(true)}
             aria-label="Abrir menú"
             className="flex items-center justify-center w-10 h-10 rounded-full bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all duration-200"
           >
             <Menu size={18} aria-hidden="true" />
           </button>
        </div>
      </motion.header>

      {/* MOBILE MENU FULLSCREEN */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-md md:hidden"
          >
             <motion.div 
               initial={{ opacity: 0, scale: 0.95, y: 20 }}
               animate={{ opacity: 1, scale: 1, y: 0 }}
               exit={{ opacity: 0, scale: 0.95, y: 20 }}
               transition={{ duration: 0.3, ease: "easeOut" }}
               className="absolute inset-4 top-20 bottom-10 bg-[#0a0a0a] border border-white/10 rounded-[3rem] p-6 flex flex-col shadow-2xl overflow-y-auto"
             >
                <div className="flex justify-between items-center mb-8 border-b border-white/5 pb-6">
                    <span className="font-black text-xl text-white">MYB <span className="text-primary">DIGITALS</span></span>
                    <button
                      onClick={() => setMobileOpen(false)}
                      className="w-10 h-10 bg-white/5 rounded-full flex justify-center items-center text-white"
                    >
                       <X size={20} />
                    </button>
                </div>

                <nav className="flex flex-col gap-2 flex-1">
                   <Link href="/" onClick={() => setMobileOpen(false)} className="text-2xl font-black text-white py-4 border-b border-white/5">Inicio</Link>
                   
                   <div className="py-4 border-b border-white/5">
                      <span className="text-[10px] uppercase font-black tracking-widest text-primary/80 mb-4 block">Ecosistemas Web</span>
                      <div className="flex flex-col gap-4 pl-4">
                         {webLinks.map((link) => (
                           <Link key={link.href} href={link.href} onClick={() => setMobileOpen(false)} className="text-xl font-bold text-gray-300 hover:text-primary transition-colors">
                              {link.label}
                           </Link>
                         ))}
                      </div>
                   </div>

                   <Link href="/servicios/automatizaciones" onClick={() => setMobileOpen(false)} className="text-2xl font-black text-white py-4 flex items-center gap-3">
                      Agentes IA <Sparkles className="w-5 h-5 text-primary" />
                   </Link>
                </nav>

                <div className="mt-8">
                   <Link
                     href="https://wa.me/543515555123"
                     onClick={() => setMobileOpen(false)}
                     className="w-full flex justify-center items-center gap-2 bg-primary text-black font-black text-lg py-5 rounded-full hover:scale-105 transition-transform"
                   >
                     Agendar Sesión <ArrowRight size={20} />
                   </Link>
                </div>
             </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
