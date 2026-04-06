"use client";

import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Bot } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function FloatingWidgets() {
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <>
      {/* WhatsApp Floating Button */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4">
        
        {/* Chatbot Window (Expandable) */}
        <AnimatePresence>
          {isChatOpen && (
            <motion.div 
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.9 }}
              transition={{ duration: 0.2 }}
              className="bg-[#222022] border border-white/10 rounded-2xl w-[320px] sm:w-[350px] shadow-2xl overflow-hidden mb-4"
            >
              {/* Chat Header */}
              <div className="bg-primary/10 border-b border-primary/20 p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative w-10 h-10 rounded-full bg-black/50 overflow-hidden border border-primary/30 flex items-center justify-center p-1">
                     <Image 
                       src="/myb-robot.png" 
                       alt="MYB AI" 
                       width={40} 
                       height={40}
                       className="object-contain"
                       onError={(e) => {
                         // Fallback si la imagen no se carga
                         e.currentTarget.style.display = 'none';
                         e.currentTarget.parentElement?.classList.add('bg-primary');
                       }}
                     />
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-sm">MYB Asistente</h3>
                    <p className="text-primary text-xs flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" /> En línea
                    </p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsChatOpen(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Chat Body */}
              <div className="p-4 h-[300px] overflow-y-auto flex flex-col gap-4 bg-background/50">
                <div className="bg-white/10 text-white rounded-tr-2xl rounded-br-2xl rounded-tl-2xl p-3 text-sm max-w-[85%]">
                  ¡Hola! Bienvenido a MYB Digitals. 👋 
                  <br/><br/>
                  ¿En qué te puedo ayudar hoy? ¿Estás buscando desarrollo web premium o implementar agentes de IA en tu empresa?
                </div>
                {/* Opciones rápidas sugeridas */}
                <div className="flex flex-col gap-2 mt-2">
                  <Link href="https://wa.me/543515555123?text=Me%20interesa%20conocer%20sobre%20Desarrollo%20Web" target="_blank" className="bg-white/5 border border-white/10 rounded-full px-4 py-2 text-xs text-white hover:bg-white/10 transition-colors text-center">
                    Quiero una Web Premium
                  </Link>
                  <Link href="https://wa.me/543515555123?text=Me%20interesa%20conocer%20sobre%20Agentes%20de%20IA" target="_blank" className="bg-white/5 border border-white/10 rounded-full px-4 py-2 text-xs text-white hover:bg-white/10 transition-colors text-center">
                    Me interesan los Agentes IA
                  </Link>
                </div>
              </div>

              {/* Chat Footer */}
              <div className="p-3 bg-black flex gap-2 border-t border-white/5">
                <input 
                  type="text" 
                  placeholder="Escribe un mensaje..."
                  className="w-full bg-white/5 border border-white/10 rounded-full px-4 py-2 text-sm text-white focus:outline-none focus:border-primary/50"
                  onKeyUp={(e) => {
                    if (e.key === 'Enter') {
                      window.open('https://wa.me/543515555123', '_blank');
                    }
                  }}
                />
                <button 
                  onClick={() => window.open('https://wa.me/543515555123', '_blank')}
                  className="w-10 h-10 shrink-0 bg-primary text-black rounded-full flex items-center justify-center hover:scale-105 transition-transform"
                >
                  <Send size={16} />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Floating Icons Container */}
        <div className="flex gap-4 items-end">
          
          {/* Virtual Assistant Bubble (Left, bouncing slowly) */}
          <motion.button
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            onClick={() => setIsChatOpen(!isChatOpen)}
            className="w-16 h-16 rounded-full bg-black border-2 border-primary shadow-[0_0_20px_rgba(195,216,9,0.3)] hover:shadow-[0_0_30px_rgba(195,216,9,0.5)] flex items-center justify-center overflow-hidden transition-all group relative"
          >
             <Image 
               src="/myb-robot.png" 
               alt="Abre chat IA" 
               width={48} 
               height={48}
               className="object-contain"
               onError={(e) => {
                 e.currentTarget.style.display = 'none';
               }}
             />
             {/* Fallback Icon si no carga la imagen */}
             <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-0 [.img-error_&]:opacity-100 bg-primary text-black">
               <Bot size={28} />
             </div>
             
             {/* Notification dot */}
             {!isChatOpen && (
               <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 border-2 border-black rounded-full" />
             )}
          </motion.button>

          {/* WhatsApp Action Button */}
          <Link 
            href="https://wa.me/543515555123" 
            target="_blank"
            className="w-14 h-14 rounded-full bg-green-500 hover:bg-green-400 text-white flex items-center justify-center shadow-lg hover:scale-110 transition-transform z-50 mb-1"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
              <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.711.927 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86s.274.072.376-.043c.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.099.824zm-3.423-14.416c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm.029 18.88c-1.161 0-2.305-.292-3.318-.844l-3.677.964.984-3.595c-.607-1.052-.927-2.246-.926-3.468.001-3.825 3.113-6.937 6.937-6.937 3.825 0 6.938 3.112 6.938 6.937 0 3.825-3.113 6.938-6.938 6.938z"/>
            </svg>
          </Link>

        </div>
      </div>
    </>
  );
}
