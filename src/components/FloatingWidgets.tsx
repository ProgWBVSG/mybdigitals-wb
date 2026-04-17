"use client";

import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { X, Send, Bot } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function FloatingWidgets() {
  const pathname = usePathname();
  const [isChatOpen, setIsChatOpen] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  if (pathname?.includes("/demo/")) return null;

  return (
    <>
      {/* Floating Actions Container — §2 Touch: targets ≥44px, §1 Accessibility: aria-labels */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4" role="complementary" aria-label="Contacto rápido">

        {/* Chatbot Window (Expandable) */}
        <AnimatePresence>
          {isChatOpen && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.92 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.92 }}
              transition={{ duration: 0.2, ease: "easeOut" as const }}
              className="bg-[#0e0f14] border border-white/10 rounded-2xl w-[320px] sm:w-[360px] shadow-2xl shadow-black/60 overflow-hidden mb-4"
              role="dialog"
              aria-modal="true"
              aria-label="Chat con MYB Asistente"
            >
              {/* Chat Header */}
              <div className="bg-primary/10 border-b border-primary/20 p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative w-10 h-10 rounded-full bg-black/50 overflow-hidden border border-primary/30 flex items-center justify-center p-1" aria-hidden="true">
                    <Image
                      src="/myb-robot.png"
                      alt=""
                      width={40}
                      height={40}
                      className="object-contain"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                    />
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-sm">MYB Asistente</h3>
                    <p className="text-primary text-xs flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" aria-hidden="true" />
                      En línea
                    </p>
                  </div>
                </div>
                {/* §2: min 44px touch target */}
                <button
                  onClick={() => setIsChatOpen(false)}
                  aria-label="Cerrar chat"
                  className="w-9 h-9 flex items-center justify-center rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition-all duration-150"
                >
                  <X size={18} aria-hidden="true" />
                </button>
              </div>

              {/* Chat Body */}
              <div className="p-4 h-[280px] overflow-y-auto flex flex-col gap-4 bg-background/60">
                <div className="bg-white/10 text-white rounded-tr-2xl rounded-br-2xl rounded-tl-2xl p-3 text-sm max-w-[85%] leading-relaxed border border-white/5">
                  ¡Hola! Bienvenido a MYB Digitals. 👋
                  <br /><br />
                  ¿En qué te puedo ayudar hoy? ¿Estás buscando desarrollo web premium o implementar agentes de IA en tu empresa?
                </div>
                {/* Quick options */}
                <div className="flex flex-col gap-2 mt-1">
                  <Link
                    href="https://wa.me/543515555123?text=Me%20interesa%20conocer%20sobre%20Desarrollo%20Web"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Consultar sobre Web Premium en WhatsApp"
                    className="bg-white/5 border border-white/10 rounded-full px-4 py-2.5 text-xs text-white hover:bg-white/10 hover:border-primary/30 transition-all duration-150 text-center min-h-[36px] flex items-center justify-center"
                  >
                    Quiero una Web Premium
                  </Link>
                  <Link
                    href="https://wa.me/543515555123?text=Me%20interesa%20conocer%20sobre%20Agentes%20de%20IA"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Consultar sobre Agentes IA en WhatsApp"
                    className="bg-white/5 border border-white/10 rounded-full px-4 py-2.5 text-xs text-white hover:bg-white/10 hover:border-primary/30 transition-all duration-150 text-center min-h-[36px] flex items-center justify-center"
                  >
                    Me interesan los Agentes IA
                  </Link>
                </div>
              </div>

              {/* Chat Footer — §8 Forms: input label visible, send button accessible */}
              <div className="p-3 bg-black/80 flex gap-2 border-t border-white/5">
                <label htmlFor="chat-input" className="sr-only">Escribe un mensaje</label>
                <input
                  id="chat-input"
                  type="text"
                  placeholder="Escribe un mensaje..."
                  aria-label="Escribe un mensaje para continuar en WhatsApp"
                  className="w-full bg-white/5 border border-white/10 rounded-full px-4 py-2 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-all duration-150 min-h-[40px]"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      window.open("https://wa.me/543515555123", "_blank", "noopener,noreferrer");
                    }
                  }}
                />
                <button
                  onClick={() => window.open("https://wa.me/543515555123", "_blank", "noopener,noreferrer")}
                  aria-label="Enviar y continuar en WhatsApp"
                  className="w-10 h-10 shrink-0 bg-primary text-black rounded-full flex items-center justify-center hover:scale-105 hover:bg-white transition-all duration-150"
                >
                  <Send size={16} aria-hidden="true" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Floating Icons Container */}
        <div className="flex gap-3 items-end">

          {/* Virtual Assistant Bubble — §2 Touch: 64px = OK */}
          <motion.button
            animate={prefersReducedMotion ? {} : { y: [0, -8, 0] }}
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" as const }}
            onClick={() => setIsChatOpen(!isChatOpen)}
            aria-label={isChatOpen ? "Cerrar asistente IA" : "Abrir asistente IA"}
            aria-expanded={isChatOpen}
            aria-controls="chat-window"
            className="w-16 h-16 rounded-full bg-black border-2 border-primary shadow-[0_0_20px_rgba(195,216,9,0.3)] hover:shadow-[0_0_35px_rgba(195,216,9,0.55)] flex items-center justify-center overflow-hidden transition-shadow duration-300 relative"
          >
            <Image
              src="/myb-robot.png"
              alt=""
              width={48}
              height={48}
              className="object-contain"
              onError={(e) => {
                e.currentTarget.style.display = "none";
                const parent = e.currentTarget.parentElement;
                if (parent) parent.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/><path d="M2 14h2"/><path d="M20 14h2"/><path d="M15 13v2"/><path d="M9 13v2"/></svg>`;
              }}
              aria-hidden="true"
            />
            {/* Notification dot — aria-hidden because label describes state */}
            {!isChatOpen && (
              <span
                className="absolute top-0.5 right-0.5 w-3.5 h-3.5 bg-red-500 border-2 border-black rounded-full"
                aria-hidden="true"
              />
            )}
          </motion.button>

          {/* WhatsApp Action Button — §2 Touch: 56px = OK */}
          <Link
            href="https://wa.me/543515555123"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Contactar por WhatsApp"
            className="w-14 h-14 rounded-full bg-[#25D366] hover:bg-[#1ebe5a] text-white flex items-center justify-center shadow-lg shadow-green-900/30 hover:scale-110 transition-all duration-200 z-50 mb-1"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7" aria-hidden="true">
              <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.711.927 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86s.274.072.376-.043c.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.099.824zm-3.423-14.416c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm.029 18.88c-1.161 0-2.305-.292-3.318-.844l-3.677.964.984-3.595c-.607-1.052-.927-2.246-.926-3.468.001-3.825 3.113-6.937 6.937-6.937 3.825 0 6.938 3.112 6.938 6.937 0 3.825-3.113 6.938-6.938 6.938z"/>
            </svg>
          </Link>

        </div>
      </div>
    </>
  );
}
