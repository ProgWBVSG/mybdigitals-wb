"use client";

import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { X, Send, Bot, RefreshCcw } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useRef, useEffect } from "react";

type Option = {
  label: string;
  action: string;
  waText?: string;
};

type Message = {
  id: string;
  text: string;
  isBot: boolean;
  options?: Option[];
};

const INITIAL_MESSAGES: Message[] = [
  {
    id: "init",
    text: "¡Hola! Bienvenido a MYB Digitals. 👋\n\n¿En qué te podemos ayudar hoy? Selecciona un área de servicio para guiarte:",
    isBot: true,
    options: [
      { label: "🌐 Sitios y Páginas Web", action: "web_menu" },
      { label: "💌 Invitaciones Web", action: "invitaciones_menu" },
      { label: "🤖 Agentes IA y Automatizaciones", action: "ia_menu" },
      { label: "💰 Consultar Precios", action: "precios_menu" }
    ]
  }
];

export default function FloatingWidgets() {
  const pathname = usePathname();
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  // Auto-scroll al último mensaje
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping, isChatOpen]);

  if (pathname?.includes("/demo/")) return null;

  const handleSendToWhatsApp = (text: string) => {
    const defaultText = "Hola, me comunico desde la web de MYB Digitals.";
    const url = `https://wa.me/543515555123?text=${encodeURIComponent(text || defaultText)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleOptionClick = (option: Option) => {
    // Agrega el mensaje del usuario
    const userMsg: Message = { id: Date.now().toString(), text: option.label, isBot: false };
    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    // Simula retraso de escritura
    setTimeout(() => {
      setIsTyping(false);
      let botResponse = "";
      let newOptions: Option[] | undefined = undefined;

      switch (option.action) {
        case "web_menu":
          botResponse = "Diseñamos ecosistemas con un enfoque estricto en conversión. Contamos con 2 servicios top. ¿Cuál resuena más con vos?";
          newOptions = [
            { label: "Landing Page ($200 USD)", action: "web_landing", waText: "Me interesa el plan Landing Page de $200 USD." },
            { label: "Presencia Corporativa ($400 USD)", action: "web_presencia", waText: "Me interesa el plan de Presencia Digital de $400 USD." },
            { label: "⬅️ Volver al menú principal", action: "start" }
          ];
          break;
        case "web_landing":
          botResponse = "La Landing Page es ideal para un producto o servicio específico. Incluye copywriting, diseño de alto impacto y embudo de conversión listo en 5 a 10 días. ¿Querés agendar una llamada o chatear ahora mismo por WhatsApp?";
          newOptions = [
             { label: "📲 Consultar por WhatsApp", action: "link_wa", waText: option.waText },
             { label: "⬅️ Volver atrás", action: "web_menu" }
          ];
          break;
        case "web_presencia":
          botResponse = "El plan Presencia Digital es para marcas que necesitan autoridad de nivel Silicon Valley. Sitio multipágina, portafolios, integración con IA y SEO. ¿Hablamos para armarte un presupuesto a medida?";
          newOptions = [
             { label: "📲 Chatear por WhatsApp", action: "link_wa", waText: option.waText },
             { label: "⬅️ Volver atrás", action: "web_menu" }
          ];
          break;
        case "invitaciones_menu":
          botResponse = "¡Qué excelente noticia! Transformamos eventos en experiencias VIP. Invitaciones interactivas con cuenta regresiva, GPS y confirmación (RSVP) automatizada en Excel. ¿Qué tipo de evento estás planeando?";
          newOptions = [
            { label: "💍 Casamiento / Boda", action: "inv_bodas" },
            { label: "🎉 Mis 15 Años", action: "inv_15s" },
            { label: "👶 Baby Shower / Otro", action: "inv_otro" },
            { label: "⬅️ Menú principal", action: "start" }
          ];
          break;
        case "inv_bodas":
        case "inv_15s":
        case "inv_otro":
          botResponse = "El precio All-Inclusive (todo incluido) es de $68.999 ARS pago único. Recibís la invitación en 3 días hábiles, cobramos un 50% de seña para reservar fecha de diseño y el otro 50% al entregar. ¿Arrancamos?";
          newOptions = [
             { label: "📲 Cotizar por WhatsApp", action: "link_wa", waText: `Hola! Quiero reservar una invitación web para ${option.label}` },
             { label: "⬅️ Volver", action: "invitaciones_menu" }
          ];
          break;
        case "ia_menu":
          botResponse = "Nuestros Agentes conversacionales o Automatizaciones te devuelven tiempo y evitan que pierdas clientes. Podemos crear un bot que responda preguntas repetitivas o cargue datos directo a tu Excel. ¿En qué perdés mucho tiempo hoy?";
          newOptions = [
             { label: "📲 Escribirle mi problema al experto", action: "link_wa", waText: "Hola, me interesa implementar Inteligencia Artificial o automatizar tareas de mi negocio." },
             { label: "⬅️ Menú principal", action: "start" }
          ];
          break;
        case "precios_menu":
          botResponse = "Resumen rápido:\n• Invitaciones Eventos: $68.999 ARS\n• Landing Pages Web: $200 USD\n• Webs Ecosistema Pro: $400 USD\n• Agentes IA: Costo variable\n\n¿Qué paquete querías arrancar?";
          newOptions = [
             { label: "📲 Quiero charlar por WhatsApp", action: "link_wa", waText: "Hola, vi sus precios en el chat de la web y quería consultar para arrancar un proyecto." },
             { label: "⬅️ Menú principal", action: "start" }
          ];
          break;
        case "start":
          botResponse = INITIAL_MESSAGES[0].text;
          newOptions = INITIAL_MESSAGES[0].options;
          break;
        case "link_wa":
          handleSendToWhatsApp(option.waText || "Hola, me comunico tras hablar con su bot temporal en la web.");
          return; // No se añade mensaje nuevo del bot
      }

      if (botResponse) {
        setMessages((prev) => [...prev, { id: Date.now().toString(), text: botResponse, isBot: true, options: newOptions }]);
      }
    }, 800);
  };

  const handleTextInput = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim()) return;

    const userText = inputText.trim();
    setInputText("");
    
    setMessages((prev) => [...prev, { id: Date.now().toString(), text: userText, isBot: false }]);
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      setMessages((prev) => [
        ...prev, 
        { 
          id: Date.now().toString(), 
          text: "¡Interesante! Como Asistente virtual estoy entrenado para derivarte al área correcta de nuestro catálogo, pero las consultas específicas personalizadas las contestan los fundadores (humanos).\n\n¿Querés enviarles tu consulta directo al celular o preferís volver al menú de opciones?", 
          isBot: true,
          options: [
             { label: "📲 Derivar por WhatsApp ahora", action: "link_wa", waText: `Hola equipo, les escribo por lo siguiente: "${userText}"` },
             { label: "📋 Volver a consultar el menú", action: "start" }
          ]
        }
      ]);
    }, 1000);
  };

  const resetChat = () => {
    setMessages(INITIAL_MESSAGES);
  };

  return (
    <>
      {/* Floating Actions Container */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4" role="complementary" aria-label="Contacto rápido">

        {/* Chatbot Window */}
        <AnimatePresence>
          {isChatOpen && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.92 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.92 }}
              transition={{ duration: 0.2, ease: "easeOut" as const }}
              className="bg-[#0e0f14] border border-white/10 rounded-2xl w-[340px] sm:w-[380px] shadow-2xl shadow-black/80 overflow-hidden mb-4 flex flex-col max-h-[550px]"
              role="dialog"
              aria-modal="true"
              aria-label="Chat con MYB Asistente"
            >
              {/* Chat Header */}
              <div className="bg-primary/5 border-b border-white/10 p-4 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3">
                  <div className="relative w-10 h-10 rounded-full bg-black/50 overflow-hidden border border-primary/30 flex items-center justify-center p-1" aria-hidden="true">
                    <Image
                      src="/myb-robot.png"
                      alt=""
                      width={40}
                      height={40}
                      className="object-contain"
                      onError={(e) => { e.currentTarget.style.display = "none"; }}
                    />
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-sm">MYB Asistente</h3>
                    <p className="text-primary text-[10px] flex items-center gap-1 uppercase tracking-widest font-bold">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" aria-hidden="true" />
                      En línea
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-1">
                   <button
                     onClick={resetChat}
                     aria-label="Reiniciar chat"
                     className="w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition-all duration-150"
                   >
                     <RefreshCcw size={14} aria-hidden="true" />
                   </button>
                   <button
                     onClick={() => setIsChatOpen(false)}
                     aria-label="Cerrar chat"
                     className="w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition-all duration-150"
                   >
                     <X size={18} aria-hidden="true" />
                   </button>
                </div>
              </div>

              {/* Chat Body */}
              <div ref={scrollRef} className="p-4 flex-1 min-h-[300px] overflow-y-auto flex flex-col gap-4 bg-[#0a0a0a] scroll-smooth">
                {messages.map((msg, idx) => (
                  <motion.div 
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex flex-col ${msg.isBot ? "items-start" : "items-end"} w-full`}
                  >
                     <div className={`text-[13px] leading-relaxed p-3 ${msg.isBot ? "bg-white/10 text-white rounded-2xl rounded-tl-sm border border-white/5" : "bg-primary/20 text-white rounded-2xl rounded-tr-sm border border-primary/20"} max-w-[85%] whitespace-pre-wrap`}>
                        {msg.text}
                     </div>

                     {/* Predefined Options for the bot message (only show options for the LAST bot message) */}
                     {msg.isBot && msg.options && idx === messages.length - 1 && (
                        <motion.div 
                           initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
                           className="flex flex-col gap-2 mt-3 w-full pl-1">
                           {msg.options.map((opt, i) => (
                              <button
                                 key={i}
                                 onClick={() => handleOptionClick(opt)}
                                 className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-left text-white hover:bg-primary hover:text-black hover:border-primary transition-all duration-200"
                              >
                                 {opt.label}
                              </button>
                           ))}
                        </motion.div>
                     )}
                  </motion.div>
                ))}

                {/* Typing indicators */}
                {isTyping && (
                   <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-start">
                      <div className="bg-white/5 p-3 rounded-2xl rounded-tl-sm border border-white/5 flex gap-1 items-center h-10 px-4">
                          <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></span>
                          <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></span>
                          <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></span>
                      </div>
                   </motion.div>
                )}
              </div>

              {/* Chat Footer - Removed Input */}
              <div className="p-3 bg-[#0e0f14] flex gap-2 border-t border-white/10 shrink-0 justify-center">
                  <span className="text-[10px] text-gray-500 font-medium uppercase tracking-widest flex items-center gap-1">
                      <Bot size={12} /> Respuestas automáticas guiadas
                  </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Floating Icons Container */}
        <div className="flex gap-3 items-end">
          {/* Virtual Assistant Bubble */}
          <motion.button
            animate={prefersReducedMotion ? {} : { y: [0, -8, 0] }}
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" as const }}
            onClick={() => setIsChatOpen(!isChatOpen)}
            aria-label={isChatOpen ? "Cerrar asistente IA" : "Abrir asistente IA"}
            aria-expanded={isChatOpen}
            aria-controls="chat-window"
            className="w-16 h-16 rounded-full bg-black border-2 border-primary shadow-[0_0_20px_rgba(195,216,9,0.3)] hover:shadow-[0_0_35px_rgba(195,216,9,0.55)] flex items-center justify-center overflow-hidden transition-shadow duration-300 relative group"
          >
             <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <Image
              src="/myb-robot.png"
              alt=""
              width={48}
              height={48}
              className="object-contain relative z-10"
              onError={(e) => {
                e.currentTarget.style.display = "none";
                const parent = e.currentTarget.parentElement;
                if (parent) parent.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/><path d="M2 14h2"/><path d="M20 14h2"/><path d="M15 13v2"/><path d="M9 13v2"/></svg>`;
              }}
              aria-hidden="true"
            />
            {/* Notification dot */}
            {!isChatOpen && (
              <span
                className="absolute top-0 right-0 w-4 h-4 bg-red-500 border-2 border-black rounded-full shadow-[0_0_10px_rgba(239,68,68,0.8)] z-20"
                aria-hidden="true"
              />
            )}
          </motion.button>

          {/* WhatsApp Action Button */}
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
