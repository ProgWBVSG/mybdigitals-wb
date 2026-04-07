"use client";

import { motion } from "framer-motion";
import { CheckCircle2, TrendingUp, Target, MousePointerClick, ArrowRight, Zap } from "lucide-react";
import Link from "next/link";

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

export default function LandingPageService() {
  return (
    <main className="flex min-h-screen flex-col bg-background text-foreground bg-mesh pt-32 pb-20">
      <div className="max-w-6xl mx-auto px-4 md:px-10 w-full relative z-10">
        
        {/* Header Section */}
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="mb-20 text-center flex flex-col items-center"
        >
          <motion.div variants={fadeIn} className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-md">
            <Target className="text-primary w-4 h-4" />
            <span className="text-xs font-semibold text-gray-300 tracking-wider">CONVERSIÓN ALTA</span>
          </motion.div>
          
          <motion.h1 variants={fadeIn} className="text-5xl md:text-7xl font-black tracking-tighter mb-6 text-balance text-white leading-tight">
            Landing Pages <br className="hidden md:block"/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-primary italic">Optimizadas</span>
          </motion.h1>
          
          <motion.p variants={fadeIn} className="text-lg md:text-xl text-gray-400 max-w-2xl text-center text-balance leading-relaxed">
            Convertimos tus visitantes en clientes. Diseñamos páginas de aterrizaje con estrategias probadas de neuromarketing, copywriting persuasivo y tiempos de carga instantáneos.
          </motion.p>
        </motion.div>

        {/* Feature Grid */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-24"
        >
          {[
             { icon: <TrendingUp />, title: "Copywriting Persuasivo", desc: "Textos enfocados en vender, derribar objeciones y aumentar tu ROI." },
             { icon: <MousePointerClick />, title: "Llamados a la Acción", desc: "Ubicación estratégica de CTAs para maximizar la tasa de conversión." },
             { icon: <Zap />, title: "Carga Ultrarrápida", desc: "Menos de 1 segundo de carga. No pierdas clientes por lentitud web." }
          ].map((feature, i) => (
            <motion.div key={i} variants={fadeIn} className="bg-white/5 border border-white/10 p-8 rounded-[2rem] hover:bg-white/10 transition-colors group">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Funnel Section */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="bg-black/40 border border-white/10 rounded-[3rem] p-8 md:p-16 relative overflow-hidden"
        >
          <div className="absolute -bottom-1/2 -left-1/4 w-[600px] h-[600px] bg-primary/10 blur-[130px] rounded-full pointer-events-none" />
          
          <div className="grid md:grid-cols-2 gap-12 items-center relative z-10 flex-row-reverse">
            <motion.div variants={fadeIn} className="order-2 md:order-1 space-y-4">
              {[
                "Estructura AIDA (Atención, Interés, Deseo, Acción)",
                "Integración de píxeles (Meta, Google, TikTok)",
                "A/B Testing opcional para escalar campañas",
                "Formularios dinámicos y captura de leads",
                "Conexión con CRM y herramientas de Email Marketing"
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/5">
                  <CheckCircle2 className="text-primary shrink-0" />
                  <span className="text-gray-200 font-medium">{item}</span>
                </div>
              ))}
            </motion.div>

            <motion.div variants={fadeIn} className="order-1 md:order-2 md:pl-10">
              <h2 className="text-3xl md:text-5xl font-black text-white mb-6 leading-tight">
                El motor de tus <br />
                <span className="text-primary italic">campañas.</span>
              </h2>
              <p className="text-gray-400 text-lg mb-8">
                Una mala landing page desperdicia la inversión en anuncios. Nosotros construimos un embudo de ventas que retiene la atención y guía al usuario hacia la compra inevitable.
              </p>
              <Link 
                href="https://wa.me/543515555123" 
                target="_blank"
                className="inline-flex items-center gap-2 bg-white text-black px-8 py-4 rounded-full font-bold hover:bg-primary transition-colors hover:scale-105"
              >
                Crear Mi Embudo <ArrowRight size={18} />
              </Link>
            </motion.div>
          </div>
        </motion.div>

      </div>
    </main>
  );
}
