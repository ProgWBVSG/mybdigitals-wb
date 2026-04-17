"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Bot, Network, Cpu, Clock, MessageSquareText, Layers, ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

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

export default function AutomationsPage() {
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
            <Cpu className="text-primary w-4 h-4" />
            <span className="text-xs font-semibold text-gray-300 tracking-wider">INTELIGENCIA ARTIFICIAL APLICADA</span>
          </motion.div>
          
          <motion.h1 variants={fadeIn} className="text-5xl md:text-7xl font-black tracking-tighter mb-6 text-balance text-white leading-tight">
            Automatizaciones <br className="hidden md:block"/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-lime-300 to-emerald-400 italic">Autónomas</span>
          </motion.h1>
          
          <motion.p variants={fadeIn} className="text-lg md:text-xl text-gray-300 max-w-2xl text-center text-balance leading-relaxed">
            Sistemas inteligentes que clonan tu conocimiento, atienden a tus clientes 24/7 y cualifican leads sin intervención humana. Multiplica el rendimiento de tu equipo por cien.
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
             { icon: <MessageSquareText />, title: "Bots de WhatsApp", desc: "Asistentes de IA que leen, razonan y responden mensajes de WhatsApp en tiempo real." },
             { icon: <Clock />, title: "Disponibilidad 24/7", desc: "No pierdas ventas de madrugada. Tu IA atiende simultáneamente a miles de personas sin descansar." },
             { icon: <Network />, title: "Conexión Omnicanal", desc: "Integración completa con CRMs (HubSpot, Salesforce), Google Sheets, Calendly y más." }
          ].map((feature, i) => (
            <motion.div key={i} variants={fadeIn} className="bg-white/5 border border-white/10 p-8 rounded-[2rem] hover:bg-white/10 transition-colors group">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
              <p className="text-gray-300 text-sm leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Deep Dive Section */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="bg-black/60 border border-white/10 rounded-[3rem] p-8 md:p-16 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 blur-[130px] rounded-full pointer-events-none" />
          
          <div className="grid md:grid-cols-2 gap-12 items-center relative z-10">
            <motion.div variants={fadeIn} className="order-2 md:order-1 relative">
                {/* AI Chat Interface Mockup */}
                <div className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col gap-4 backdrop-blur-md relative z-10 scale-[0.98] rotate-2">
                  <div className="flex justify-between items-center border-b border-white/10 pb-4 mb-2">
                    <div className="flex gap-3 items-center">
                      <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center shrink-0 border border-primary/30">
                        <Bot size={20} className="text-primary"/>
                      </div>
                      <div>
                        <h4 className="text-white font-bold text-sm">Operador IA de Ventas</h4>
                        <span className="text-[10px] text-green-400 flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-400"/> Online</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-3 items-end opacity-90">
                    <div className="bg-white/10 rounded-xl rounded-bl-sm p-4 text-sm text-gray-300 w-fit max-w-[85%] border border-white/5">
                      Hola, analicé tus gastos del mes. ¿Quieres que agende una reunión técnica con el equipo o te envío el reporte en PDF?
                    </div>
                  </div>
                  <div className="flex justify-end opacity-90">
                    <div className="bg-primary text-black font-medium rounded-xl rounded-br-sm p-4 text-sm w-fit max-w-[85%]">
                      Enviámelo en PDF y pasame también opciones de Lunes a Jueves.
                    </div>
                  </div>
                  <div className="flex gap-3 items-end opacity-90">
                    <div className="bg-white/10 rounded-xl rounded-bl-sm p-4 text-sm text-gray-300 w-fit max-w-[85%] border border-white/5">
                      ¡Enviado! 📄 Y aquí tienes el enlace para agendar con prioridad técnica la próxima semana: [Link]
                    </div>
                  </div>
                </div>
                
                {/* Decorative Elements */}
                <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-gradient-to-br from-primary to-emerald-400 blur-[80px] z-0 opacity-40"/>
            </motion.div>

            <motion.div variants={fadeIn} className="order-1 md:order-2 space-y-6 md:pl-10">
              <h2 className="text-3xl md:text-5xl font-black text-white mb-2 leading-tight">
                El fin de lo <br />
                <span className="text-primary italic">manual.</span>
              </h2>
              <p className="text-gray-300 text-lg mb-8">
                Desarrollamos redes neuronales acopladas al flujo de tu negocio. Si una tarea es repetitiva, predecible y se basa en datos, un Agente de IA entrenado a medida puede hacerla mejor, más rápido y sin margen de error.
              </p>
              
              <ul className="space-y-4 mb-8">
                {[
                  "Extracción e interpretación de bases de datos",
                  "Atención al cliente Human-like (voces y texto natural)",
                  "Procesamiento autónomo de carritos abandonados",
                  "Auditorías automáticas sobre datos internos"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-gray-300">
                    <Bot className="text-primary w-5 h-5 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <Link 
                href="https://wa.me/543515555123" 
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Agendar auditoría IA gratuita por WhatsApp"
                className="inline-flex items-center gap-2 bg-primary text-black px-8 py-4 rounded-full font-bold hover:bg-white transition-colors min-h-[52px]"
              >
                Auditoría IA Gratuita <ArrowRight size={18} aria-hidden="true" />
              </Link>
            </motion.div>
          </div>
        </motion.div>

      </div>
    </main>
  );
}
