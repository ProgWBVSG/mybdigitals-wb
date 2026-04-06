"use client";

import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useState, useEffect } from "react";
import { 
  ArrowRight, 
  Bot, 
  Zap, 
  Network, 
  Code2,
  Cpu,
  Globe,
  CheckCircle2,
  ChevronDown,
  Sparkles,
  ChevronRight,
  Send,
  Loader2
} from "lucide-react";
import Image from "next/image";

const fadeIn = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" as const } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15
    }
  }
};

// FAQS DATA
const faqs = [
  {
    question: "¿Cuánto tardan en implementar un Asistente de IA?",
    answer: "Dependiendo de la complejidad y los canales (WhatsApp, Web, CRM), un agente básico operativo puede estar listo en 7-14 días con entrenamiento personalizado sobre los datos de tu empresa."
  },
  {
    question: "¿Necesito conocimientos técnicos para usar estos servicios?",
    answer: "Absolutamente no. Nosotros diseñamos, integramos y conectamos todo. Te entregamos un dashboard llave en mano y un asistente funcionando de forma autónoma."
  },
  {
    question: "¿Esto reemplazará a mi equipo de ventas?",
    answer: "La IA filtra prospectos, responde FAQS 24/7 y cualifica leads. Tu equipo de ventas solo intervendrá cuando el cliente ya esté listo para pagar o agendar, ahorrando 80% de horas operativas."
  },
  {
    question: "¿Qué tecnologías usan para desarrollo Web?",
    answer: "Desarrollamos con el ecosistema más moderno y rápido del mundo: Next.js, React, Tailwind CSS y Framer Motion, garantizando SEO técnico perfecto y velocidades de carga instantáneas."
  }
];

export default function Home() {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [chatStep, setChatStep] = useState(0);

  // Chatbot Simulation Logic
  useEffect(() => {
    const timer1 = setTimeout(() => setChatStep(1), 2000);
    const timer2 = setTimeout(() => setChatStep(2), 4500);
    const timer3 = setTimeout(() => setChatStep(3), 6000);
    return () => { clearTimeout(timer1); clearTimeout(timer2); clearTimeout(timer3); };
  }, []);

  return (
    <main className="flex min-h-[200vh] flex-col overflow-hidden bg-background text-foreground bg-mesh">
      
      {/* Navbar moved to Layout */}

      {/* Hero Section OVERSİZED & BENTO */}
      <section className="relative w-full pt-44 pb-20 px-4 md:px-10 flex flex-col items-center justify-start min-h-[95vh]">
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="relative z-10 w-full max-w-7xl mx-auto flex flex-col items-center"
        >
          <motion.div variants={fadeIn} className="inline-flex items-center gap-3 mb-8 px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-md">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
            </span>
            <span className="text-xs font-semibold text-gray-300 tracking-wider">AGENCIA NEXT-GEN IA & WEB</span>
          </motion.div>
          
          <motion.h1 
            variants={fadeIn} 
            className="text-6xl md:text-[7rem] font-bold tracking-tighter mb-6 text-center text-balance leading-[0.95] text-white"
          >
            Escalamos negocios <br className="hidden md:block"/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-lime-300 to-emerald-400 italic font-medium pr-4">con IA y Software.</span>
          </motion.h1>
          
          <motion.p variants={fadeIn} className="text-lg md:text-xl text-gray-400 max-w-2xl text-center mb-16 text-balance leading-relaxed">
            Sistemas automatizados por IA y experiencias web de vanguardia. Diseñado para empresas que buscan dejar atrás las operaciones manuales y multiplicar su facturación.
          </motion.p>
          
          {/* Bento Grid Preview Hero */}
          <motion.div variants={fadeIn} className="w-full grid grid-cols-1 md:grid-cols-4 gap-4 auto-rows-min max-w-5xl">
             
             {/* Main Hero Card - Virtual Assistant Mockup */}
             <div className="md:col-span-2 md:row-span-2 rounded-[2rem] bg-gradient-to-br from-white/5 to-white/[0.01] border border-white/10 overflow-hidden relative p-8 flex flex-col justify-end min-h-[350px] group shadow-2xl">
               <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-primary/20 blur-[100px] group-hover:bg-primary/30 transition-all rounded-full pointer-events-none" />
               <div className="mb-auto z-10 flex justify-between items-start">
                 <div>
                   <h3 className="text-white text-2xl font-bold tracking-tight mb-2 flex items-center gap-2"><Bot className="text-primary"/> Agente de Cierre IA</h3>
                   <p className="text-gray-400 text-sm max-w-sm">Este asistente convierte leads en WhatsApp mientras duermes. Integración 100% autónoma.</p>
                 </div>
                 <Link href="/servicios/automatizaciones" className="hidden md:flex items-center gap-2 text-xs font-bold text-primary hover:text-white transition-colors bg-white/5 border border-white/10 px-4 py-2 rounded-full backdrop-blur-md">
                   Ver Servicio <ArrowRight size={14}/>
                 </Link>
               </div>
               
               {/* Chat UI Mockup */}
               <div className="relative z-10 w-full bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col gap-3 mt-8 backdrop-blur-md">
                 <div className="flex gap-3 items-end">
                   <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                     <Bot size={16} className="text-primary"/>
                   </div>
                   <div className="bg-white/10 rounded-tr-2xl rounded-br-2xl rounded-tl-2xl p-3 text-sm text-gray-300 w-fit">
                     ¡Hola! ¿Buscás automatizar tu negocio o hacer una web?
                   </div>
                 </div>
                 <AnimatePresence>
                   {chatStep >= 1 && (
                     <motion.div initial={{opacity:0, y:10}} animate={{opacity:1,y:0}} className="flex gap-3 justify-end items-end">
                       <div className="bg-primary text-black rounded-tl-2xl rounded-bl-2xl rounded-tr-2xl p-3 text-sm font-medium w-fit">
                         Me interesa la automatización de WhatsApp.
                       </div>
                     </motion.div>
                   )}
                   {chatStep >= 2 && (
                     <motion.div initial={{opacity:0, y:10}} animate={{opacity:1,y:0}} className="flex gap-3 items-end">
                        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                          <Bot size={16} className="text-primary"/>
                        </div>
                        {chatStep === 2 ? (
                          <div className="bg-white/10 rounded-tr-2xl rounded-br-2xl rounded-tl-2xl p-3 text-sm text-gray-300 w-fit flex gap-1">
                             <motion.span animate={{opacity:[0.2,1,0.2]}} transition={{repeat:Infinity, duration:1.4}} className="w-1.5 h-1.5 bg-gray-400 rounded-full"/>
                             <motion.span animate={{opacity:[0.2,1,0.2]}} transition={{repeat:Infinity, duration:1.4, delay:0.2}} className="w-1.5 h-1.5 bg-gray-400 rounded-full"/>
                             <motion.span animate={{opacity:[0.2,1,0.2]}} transition={{repeat:Infinity, duration:1.4, delay:0.4}} className="w-1.5 h-1.5 bg-gray-400 rounded-full"/>
                          </div>
                        ) : (
                          <div className="bg-white/10 rounded-tr-2xl rounded-br-2xl rounded-tl-2xl p-3 text-sm text-gray-300 w-fit">
                            ¡Excelente! Puedo conectarte con un asesor en 3 segundos o enviarte nuestro PDF de casos de éxito. ¿Qué prefieres?
                          </div>
                        )}
                     </motion.div>
                   )}
                 </AnimatePresence>
               </div>
             </div>

             {/* Small Bento 1 */}
             <div className="md:col-span-1 md:row-span-1 rounded-[2rem] bg-white/5 border border-white/10 p-6 flex flex-col justify-between group overflow-hidden relative">
               <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent pointer-events-none z-0" />
               <Globe className="text-white/50 mb-4 z-10 group-hover:text-white transition-colors" size={32} />
               <div className="z-10">
                 <h4 className="text-white font-bold text-lg mb-1">Web Development</h4>
                 <p className="text-gray-400 text-xs mb-3">High-performance Next.js</p>
                 <Link href="/servicios/web/presencia-digital" className="text-xs font-bold text-white hover:text-primary transition-colors flex items-center gap-1 group-hover:underline">
                   Ver Servicios <ArrowRight size={12}/>
                 </Link>
               </div>
             </div>

             {/* Small Bento 2 */}
             <div className="md:col-span-1 md:row-span-1 rounded-[2rem] bg-gradient-to-br from-primary to-emerald-400 p-6 flex flex-col justify-between text-black relative select-none">
               <ArrowRight className="absolute top-6 right-6" size={24} />
               <div className="mt-8">
                 <h4 className="font-black text-2xl leading-tight mb-2">Multiplica<br/>tus Leads</h4>
                 <Link href="https://wa.me/543515555123" target="_blank" className="text-sm font-bold opacity-80 hover:opacity-100 flex items-center gap-1">Empezar hoy <ChevronRight size={14}/></Link>
               </div>
             </div>

             {/* Bottom Wide Bento */}
             <div className="md:col-span-2 md:row-span-1 rounded-[2rem] bg-white/5 border border-white/10 p-6 flex items-center justify-between overflow-hidden relative">
                <div className="flex flex-col z-10">
                  <span className="text-4xl font-black text-white mb-1">10x</span>
                  <span className="text-sm text-gray-400 font-medium tracking-wide">ROI Promedio en Automatizaciones</span>
                </div>
                <div className="w-32 h-20 bg-white/10 rounded-xl relative overflow-hidden flex items-end gap-1 p-2 pt-8 z-10">
                   {[40, 60, 45, 80, 100].map((h, i) => (
                     <motion.div 
                       key={i} 
                       initial={{ height: 0 }} 
                       animate={{ height: `${h}%` }} 
                       transition={{ delay: 0.5 + (i * 0.1), duration: 0.8 }}
                       className={`w-full rounded-t-sm ${i === 4 ? 'bg-primary' : 'bg-white/20'}`} 
                     />
                   ))}
                </div>
             </div>

          </motion.div>
        </motion.div>
      </section>

      {/* INFINITE MARQUEE */}
      <section className="w-full py-8 bg-primary text-black border-y border-white/10 -rotate-2 scale-105 my-20 font-black text-2xl uppercase tracking-widest overflow-hidden whitespace-nowrap flex group">
        <div className="animate-scroll flex gap-8 items-center shrink-0 w-[200%]">
           {Array(8).fill("").map((_, i) => (
             <span key={i} className="flex gap-8 items-center">
               <span>Inteligencia Artificial</span> <Sparkles size={24}/>
               <span className="text-black/50">Next.js Development</span> <Sparkles size={24}/>
               <span>Sistemas Autónomos</span> <Sparkles size={24}/>
               <span className="text-black/50">High-End Design</span> <Sparkles size={24}/>
             </span>
           ))}
        </div>
      </section>

      {/* FAQS SECTION */}
      <section id="faqs" className="w-full py-32 px-4 md:px-10 max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black tracking-tight text-white mb-4">Cero Fricciones. <br className="md:hidden"/><span className="text-primary italic font-medium">Respuestas Claras.</span></h2>
          <p className="text-gray-400">Todo lo que necesitas saber antes de dar el salto cuántico en tu empresa.</p>
        </div>

        <div className="flex flex-col gap-4">
          {faqs.map((faq, idx) => {
            const isActive = activeFaq === idx;
            return (
              <motion.div 
                key={idx}
                initial={false}
                animate={{ backgroundColor: isActive ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.02)" }}
                className="border border-white/10 rounded-2xl overflow-hidden cursor-pointer"
                onClick={() => setActiveFaq(isActive ? null : idx)}
              >
                <div className="p-6 md:p-8 flex justify-between items-center">
                  <h3 className="text-lg md:text-xl font-bold text-white pr-4">{faq.question}</h3>
                  <motion.div animate={{ rotate: isActive ? 180 : 0 }} className="p-2 bg-white/5 rounded-full shrink-0">
                    <ChevronDown size={20} className="text-primary" />
                  </motion.div>
                </div>
                <AnimatePresence>
                  {isActive && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 md:px-8 pb-8 pt-0 text-gray-400 leading-relaxed border-t border-white/5 mt-2 pt-4">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )
          })}
        </div>
      </section>

      {/* Footer CTA */}
      <section className="w-full py-32 px-4 relative overflow-hidden flex flex-col items-center justify-center border-t border-white/5 mt-auto">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,rgba(195,216,9,0.1)_0%,transparent_60%)] pointer-events-none" />
        <h2 className="text-5xl md:text-7xl font-black text-center text-white mb-8 relative z-10 tracking-tighter">
          Construye tu <br/><span className="text-primary">Futuro Autónomo.</span>
        </h2>
        <Link 
          href="https://wa.me/543515555123" 
          target="_blank"
          className="group relative bg-white text-black px-10 py-5 rounded-full font-bold text-lg overflow-hidden transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_40px_rgba(195,216,9,0.4)] flex items-center justify-center gap-3 z-10 hover:bg-primary"
        >
          <span className="relative z-10 flex items-center gap-2">
            Iniciar Proyecto <Send size={20} />
          </span>
        </Link>
      </section>
      
      {/* Real Footer */}
      <footer className="w-full py-8 text-center text-sm font-medium tracking-wide text-gray-600 border-t border-white/5 bg-background relative z-10">
        © {new Date().getFullYear()} MYB Digitals Agency. CRAFTED FOR EXCELLENCE.
      </footer>
    </main>
  );
}
