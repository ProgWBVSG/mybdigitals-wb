"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import { 
  ArrowRight, Globe,
  ChevronDown, Sparkles, Send,
  Briefcase, Zap, Shield, CheckCircle2
} from "lucide-react";
import OrbitScene from "@/components/OrbitScene";
import ScrollJourney from "@/components/ScrollJourney";

// Animations
const fadeIn = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" as const } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
};

// FAQS DATA
const faqs = [
  {
    question: "¿Esto reemplazará a mi equipo actual?",
    answer: "No. La IA se encarga de lo repetitivo (responder FAQs, filtrar clientes, tareas operativas), permitiendo que tu equipo se enfoque en el trabajo estratégico y en el cierre de ventas de alto valor."
  },
  {
    question: "¿Cuánto tardan en implementar el Asistente o la Web?",
    answer: "Nuestra metodología es ágil. Un producto digital (Landing o Agente Básico) puede estar activo en 10 a 14 días. Sistemas complejos o ecosistemas integrados conllevan entre 3 a 5 semanas de desarrollo y testing."
  },
  {
    question: "¿Mis clientes sabrán que hablan con una IA?",
    answer: "Diseñamos la IA con una personalidad adaptada a tu marca. Puedes elegir transparentarlo, o bien configurarlo con una 'voz' tan humana (human-like) que la transición sea completamente natural y fluida."
  },
  {
    question: "¿Necesito conocimientos técnicos?",
    answer: "Absolutamente ninguno. Nosotros diseñamos, integramos y conectamos todo nuestro stack. Te entregamos un ecosistema llave en mano y el mantenimiento activo se encarga de todo el soporte técnico futuro."
  }
];

export default function Home() {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  return (
    <main className="flex min-h-[200vh] flex-col overflow-hidden bg-background text-foreground bg-mesh">

      {/* ══════════════════════════════════════════════════════
          SECCIÓN 1 – HERO (split: texto izq | 3D der)
      ══════════════════════════════════════════════════════ */}
      <section className="relative w-full min-h-screen flex items-center overflow-hidden pt-28 pb-10">
        {/* Glows de ambiente */}
        <div className="absolute top-1/4 left-1/3 w-[700px] h-[700px] bg-primary/[0.07] blur-[160px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-cyan-500/[0.04] blur-[130px] rounded-full pointer-events-none" />

        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 md:px-10 grid lg:grid-cols-2 gap-6 lg:gap-16 items-center">

          {/* ── Columna IZQUIERDA: texto ── */}
          <motion.div initial="hidden" animate="visible" variants={staggerContainer}>
            <motion.div variants={fadeIn} className="inline-flex items-center gap-3 mb-8 px-5 py-2 rounded-full border border-primary/30 bg-primary/10 backdrop-blur-md shadow-[0_0_15px_rgba(195,216,9,0.2)]">
              <Sparkles className="w-4 h-4 text-primary animate-pulse" />
              <span className="text-xs font-bold text-primary tracking-widest uppercase">Agencia Next-Gen · IA &amp; Web</span>
            </motion.div>

            {/* TÍTULO ORIGINAL RESTAURADO */}
            <motion.h1 variants={fadeIn} className="text-[clamp(3rem,7vw,6rem)] font-bold tracking-tighter mb-6 text-white leading-[0.95]">
              Escalamos negocios{" "}
              <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-lime-300 to-emerald-400 italic font-medium pr-2">
                con IA y Software.
              </span>
            </motion.h1>

            <motion.p variants={fadeIn} className="text-lg text-gray-300 max-w-md mb-10 leading-relaxed">
              Automatizaciones inteligentes y experiencias web de vanguardia. Para empresas que quieren dejar atrás las operaciones manuales y multiplicar su facturación.
            </motion.p>

            <motion.div variants={fadeIn} className="flex flex-col sm:flex-row gap-4">
              <Link
                href="https://wa.me/543515555123" target="_blank" rel="noopener noreferrer"
                aria-label="Contactar por WhatsApp"
                className="group bg-[#25D366] text-white px-8 py-4 rounded-full font-bold text-[15px] shadow-[0_0_24px_rgba(37,211,102,0.4)] hover:shadow-[0_0_45px_rgba(37,211,102,0.7)] hover:scale-105 flex items-center justify-center gap-2 transition-all min-h-[52px]"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 shrink-0" aria-hidden="true">
                  <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.711.927 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86s.274.072.376-.043c.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.099.824zm-3.423-14.416c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm.029 18.88c-1.161 0-2.305-.292-3.318-.844l-3.677.964.984-3.595c-.607-1.052-.927-2.246-.926-3.468.001-3.825 3.113-6.937 6.937-6.937 3.825 0 6.938 3.112 6.938 6.937 0 3.825-3.113 6.938-6.938 6.938z"/>
                </svg>
                Contactar por WhatsApp
              </Link>
              <Link
                href="#solucion"
                className="px-8 py-4 rounded-full font-bold text-[15px] text-white bg-white/5 border border-white/10 hover:bg-white/10 transition-colors backdrop-blur-md flex items-center justify-center min-h-[52px]"
              >
                Ver servicios
              </Link>
            </motion.div>

            {/* Métricas rápidas */}
            <motion.div variants={fadeIn} className="mt-14 flex gap-10 border-t border-white/5 pt-10">
              {[
                { val: "10x",  label: "ROI promedio" },
                { val: "24/7", label: "Agentes IA activos" },
                { val: "14d",  label: "Tiempo de entrega" },
              ].map(({ val, label }) => (
                <div key={label}>
                  <p className="text-3xl font-black text-primary">{val}</p>
                  <p className="text-xs text-gray-500 font-medium mt-1 tracking-wider uppercase">{label}</p>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* ── Columna DERECHA: Neural Network 3D ── */}
          <motion.div
            initial={{ opacity: 0, scale: 0.88 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.1, ease: "easeOut" as const, delay: 0.25 }}
            className="relative h-[480px] lg:h-[640px]"
          >
            {/* Marco glassmorphism */}
            <div className="absolute inset-0 rounded-[2.5rem] bg-white/[0.02] border border-white/[0.07] overflow-hidden shadow-[0_0_80px_rgba(195,216,9,0.06)]">
              {/* Glow interior */}
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(195,216,9,0.05)_0%,transparent_65%)]" />
              {/* Esquinas de esqueleto tipo HUD */}
              <div className="absolute top-4 left-4 w-5 h-5 border-t-2 border-l-2 border-primary/40 rounded-tl-lg" />
              <div className="absolute top-4 right-4 w-5 h-5 border-t-2 border-r-2 border-primary/40 rounded-tr-lg" />
              <div className="absolute bottom-4 left-4 w-5 h-5 border-b-2 border-l-2 border-primary/40 rounded-bl-lg" />
              <div className="absolute bottom-4 right-4 w-5 h-5 border-b-2 border-r-2 border-primary/40 rounded-br-lg" />
              {/* Etiqueta HUD */}
              <div className="absolute top-4 left-1/2 -translate-x-1/2 text-[9px] font-mono text-primary/40 tracking-widest uppercase">MYB // Neural-Net v2</div>
            </div>
            {/* Canvas 3D */}
            <div className="relative w-full h-full">
              <OrbitScene />
            </div>
          </motion.div>

        </div>

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" as const }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 opacity-30"
          aria-hidden="true"
        >
          <span className="text-[10px] uppercase tracking-widest font-bold">Scroll</span>
          <div className="w-[1px] h-10 bg-gradient-to-b from-primary to-transparent" />
        </motion.div>
      </section>


      {/* INFINITE MARQUEE */}
      <section className="w-full py-6 bg-primary text-black font-black text-xl uppercase tracking-widest overflow-hidden whitespace-nowrap flex z-20 shadow-[0_10px_50px_rgba(195,216,9,0.1)]">
        <div className="animate-scroll flex gap-8 items-center shrink-0 w-[200%]">
           {Array(8).fill("").map((_, i) => (
             <span key={i} className="flex gap-8 items-center">
               <span>Inteligencia Artificial</span> <span className="w-2 h-2 rounded-full bg-black"/>
               <span className="text-black/60">Agencias Next-Gen</span> <span className="w-2 h-2 rounded-full bg-black/60"/>
               <span>Automatización de Flujos</span> <span className="w-2 h-2 rounded-full bg-black"/>
               <span className="text-black/60">High-End Web</span> <span className="w-2 h-2 rounded-full bg-black/60"/>
             </span>
           ))}
        </div>
      </section>

      {/* ── SCROLL JOURNEY 3D ── */}
      <ScrollJourney />




      {/* SECCIÓN 4: METODOLOGÍA (CÓMO TRABAJAMOS) */}
      <section className="w-full py-32 px-4 md:px-10 max-w-6xl mx-auto">
        <div className="text-left mb-16 md:mb-24 md:flex items-end justify-between">
          <div>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-4">Nuestra<br/>Metodología.</h2>
            <p className="text-gray-300 text-lg">Tres fases críticas para transformar tu negocio.</p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              num: "01",
              title: "Auditoría Estratégica",
              desc: "Analizamos tus cuellos de botella actuales. No hay dos empresas iguales, por ende, el plan de digitalización y automatización es 100% a medida."
            },
            {
              num: "02",
              title: "Desarrollo y Testing",
              desc: "Arquitectamos tu presencia web y desarrollamos los flujos de inteligencia artificial. Probamos el chatbot y la conversión en entornos estresados."
            },
            {
              num: "03",
              title: "Lanzamiento y Escala",
              desc: "Desplegamos el ecosistema completo en tu entorno vivo. Acompañamos mediante dashboards y retención para optimizar y entrenar constantemente a tus bots."
            }
          ].map((step, i) => (
            <motion.div 
              key={i} initial="hidden" whileInView="visible" viewport={{once:true}}
              variants={{ hidden: { opacity: 0, scale: 0.95 }, visible: { opacity: 1, scale: 1, transition: { delay: i * 0.2, duration: 0.6 }}}}
              className="relative group h-full"
            >
              <div className="text-6xl font-black text-white/5 mb-4 group-hover:text-primary/20 transition-colors absolute -top-8 -left-4 z-0 pointer-events-none">{step.num}</div>
              <div className="relative z-10 pt-4">
                <div className="w-10 h-1bg-white/20 mb-6 rounded-full overflow-hidden">
                  <div className="w-full h-1 bg-gradient-to-r from-primary to-transparent" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">{step.title}</h3>
                <p className="text-gray-300 text-sm leading-relaxed">{step.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* SECCIÓN 5: POR QUÉ ELEGIRNOS (VENTAJA COMPETITIVA Y RTB) */}
      <section className="w-full py-20 px-4 md:px-10 border-t border-white/5">
        <div className="max-w-6xl mx-auto bg-primary text-black rounded-[3rem] p-10 md:p-16 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-12">
           <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white opacity-20 blur-[120px] rounded-full pointer-events-none" />
           <div className="md:w-1/2 relative z-10">
             <h2 className="text-4xl md:text-5xl font-black mb-6 leading-tight">No vendemos webs. Construimos <span className="italic">sistemas.</span></h2>
             <p className="text-black/80 font-medium text-lg leading-relaxed mb-8">
               La mayoría de agencias crean plantillas estáticas y te dejan a la deriva. Nosotros integramos Identidad Web de clase mundial con Cerebros de Inteligencia Artificial. Tu marca no solo será bella: será **inteligentemente letal.**
             </p>
             <Link href="https://wa.me/543515555123" target="_blank" className="inline-flex items-center gap-2 bg-[#25D366] text-white px-8 py-4 rounded-full font-bold hover:bg-white hover:text-[#25D366] hover:scale-105 border-transparent transition-all shadow-[0_0_20px_rgba(37,211,102,0.3)] min-h-[52px]">
               <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 shrink-0" aria-hidden="true"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.711.927 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86s.274.072.376-.043c.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.099.824zm-3.423-14.416c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm.029 18.88c-1.161 0-2.305-.292-3.318-.844l-3.677.964.984-3.595c-.607-1.052-.927-2.246-.926-3.468.001-3.825 3.113-6.937 6.937-6.937 3.825 0 6.938 3.112 6.938 6.937 0 3.825-3.113 6.938-6.938 6.938z"/></svg>
               Contactar por WhatsApp
             </Link>
           </div>
           <div className="md:w-1/2 flex gap-4 flex-wrap justify-end relative z-10">
             {[
               { i: <Shield size={24}/>, t: "Resultados reales sin falsa magia" },
               { i: <Briefcase size={24}/>, t: "Partnership, no solo proveedores" },
               { i: <Zap size={24}/>, t: "ROI de tu tiempo operativo" }
             ].map((badge, i) => (
                <div key={i} className="bg-black/10 backdrop-blur-sm border border-black/10 p-5 rounded-2xl w-full sm:w-[calc(50%-8px)] flex flex-col gap-3">
                  {badge.i}
                  <span className="font-bold text-sm">{badge.t}</span>
                </div>
             ))}
           </div>
        </div>
      </section>

      {/* FAQS SECTION */}
      <section id="faqs" aria-labelledby="faqs-heading" className="w-full py-32 px-4 md:px-10 max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h2 id="faqs-heading" className="text-4xl md:text-5xl font-black tracking-tight text-white mb-4">Cero Fricciones. <br className="md:hidden"/><span className="text-primary italic font-medium">Respuestas Claras.</span></h2>
          <p className="text-gray-300">Todo lo que necesitas saber antes de dar el salto cuántico en tu empresa.</p>
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

      {/* FOOTER CTA */}
      <section className="w-full py-32 px-4 relative overflow-hidden flex flex-col items-center justify-center border-t border-white/5 mt-auto">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,rgba(195,216,9,0.1)_0%,transparent_60%)] pointer-events-none" />
        <h2 className="text-5xl md:text-7xl font-black text-center text-white mb-6 relative z-10 tracking-tighter">
          Construye tu <br/><span className="text-primary">Futuro Autónomo.</span>
        </h2>
        <p className="text-gray-300 mb-10 text-center max-w-lg relative z-10">
          Deja de postergar la profesionalización digital de tu empresa. El momento de escalar libre de estrés es ahora.
        </p>
        <Link 
          href="https://wa.me/543515555123" 
          target="_blank" rel="noopener noreferrer"
          className="group relative bg-[#25D366] text-white px-10 py-5 rounded-full font-bold text-lg overflow-hidden transition-all shadow-[0_0_20px_rgba(37,211,102,0.3)] hover:shadow-[0_0_40px_rgba(37,211,102,0.6)] flex items-center justify-center gap-3 z-10 hover:scale-105 min-h-[52px]"
        >
          <span className="relative z-10 flex items-center gap-2">
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 shrink-0" aria-hidden="true"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.711.927 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86s.274.072.376-.043c.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.099.824zm-3.423-14.416c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm.029 18.88c-1.161 0-2.305-.292-3.318-.844l-3.677.964.984-3.595c-.607-1.052-.927-2.246-.926-3.468.001-3.825 3.113-6.937 6.937-6.937 3.825 0 6.938 3.112 6.938 6.937 0 3.825-3.113 6.938-6.938 6.938z"/></svg>
            Contactar por WhatsApp
          </span>
        </Link>
      </section>
      
      {/* REAL FOOTER */}
      <footer className="w-full py-12 px-6 flex flex-col items-center border-t border-white/5 bg-background relative z-10">
        <div className="w-10 h-10 mb-6 bg-white/5 rounded-full flex items-center justify-center">
           <Globe size={18} className="text-gray-400" />
        </div>
        <p className="text-sm font-medium tracking-wide text-gray-500 mb-2">
          © {new Date().getFullYear()} MYB DIGITALS. TODOS LOS DERECHOS RESERVADOS.
        </p>
        <p className="text-xs text-gray-600 font-light">
          Diseñado y Arquitectado con precisión para marcas que lideran.
        </p>
      </footer>
    </main>
  );
}
