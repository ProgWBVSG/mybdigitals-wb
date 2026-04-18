"use client";

import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { CheckCircle2, MonitorSmartphone, Search, ArrowRight, Code, Zap, Database, MessageSquare, Lock, Layout, Shield, Server, GitMerge, LineChart, Users, Globe, TrendingUp } from "lucide-react";
import Link from "next/link";
import { useEffect, useState, useRef } from "react";

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

const ChatSimulation = () => {
  return (
    <div className="w-full h-full bg-[#0a0a0a] border border-white/10 rounded-2xl p-4 flex flex-col font-sans relative overflow-hidden group">
       <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-[50px] rounded-full pointer-events-none transition-opacity duration-500 group-hover:opacity-100 opacity-50"></div>
       <div className="flex items-center gap-3 border-b border-white/5 pb-3 mb-4">
          <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center p-1.5 shrink-0">
             <MessageSquare className="w-full h-full text-primary" />
          </div>
          <div>
             <div className="text-white text-[10px] font-bold">Asistente Virtual IA</div>
             <div className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-emerald-500 text-[8px]">En línea (24/7)</span>
             </div>
          </div>
       </div>

       <div className="flex-1 flex flex-col gap-3 relative z-10 w-full overflow-hidden">
          <div className="flex items-start gap-2 max-w-[85%] self-end">
             <div className="bg-white/10 text-white text-[8px] p-2 rounded-xl rounded-tr-none border border-white/5">
                Hola, quiero saber precios de sus servicios.
             </div>
          </div>
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, repeat: Infinity, repeatDelay: 5 }}
            className="flex items-start gap-2 max-w-[85%]">
             <div className="bg-primary/10 text-gray-200 text-[8px] p-2 rounded-xl rounded-tl-none border border-primary/20">
                ¡Hola! Claro que sí. Tenemos planes desde $400 USD que incluyen web, asistente como yo y automatizaciones. ¿Para qué negocio lo necesitas?
             </div>
          </motion.div>
       </div>

       <div className="mt-auto pt-3 border-t border-white/5">
          <div className="w-full h-6 bg-white/5 rounded-full flex items-center px-3">
             <div className="w-1 h-3 bg-white/30 animate-pulse"></div>
          </div>
       </div>
    </div>
  );
};

const DashboardSimulation = () => {
    return (
        <div className="w-full h-full bg-[#0a0a0a] border border-white/10 rounded-2xl p-4 flex flex-col font-sans relative overflow-hidden group hover:border-blue-500/30 transition-colors">
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-500/20 blur-[50px] rounded-full pointer-events-none transition-opacity duration-500 group-hover:opacity-100 opacity-50"></div>
            
            <div className="flex justify-between items-center mb-4 relative z-10">
                <div className="text-white text-[10px] font-bold">Flujo de Leads</div>
                <div className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full text-[6px] font-bold flex items-center gap-1">
                   <TrendingUp className="w-2 h-2" /> +34% Hoy
                </div>
            </div>

            <div className="flex gap-2 h-12 items-end border-b border-white/10 pb-1 mb-4 relative z-10">
                {[30, 45, 25, 60, 40, 70, 55, 80].map((h, i) => (
                    <motion.div 
                        key={i}
                        className="w-full bg-gradient-to-t from-blue-500/20 to-blue-500/80 rounded-t-sm"
                        style={{ height: `${h}%` }}
                        initial={{ height: "10%" }}
                        whileInView={{ height: `${h}%` }}
                        transition={{ duration: 0.5, delay: i * 0.1 }}
                    />
                ))}
            </div>

            <div className="space-y-2 relative z-10 w-full overflow-hidden flex-1">
                {[
                    { name: "Juan P.", status: "Agendado", color: "bg-emerald-500", source: "Google Ads" },
                    { name: "Maria L.", status: "Consultando", color: "bg-yellow-500", source: "Organico" },
                    { name: "Carlos D.", status: "Evaluando", color: "bg-blue-500", source: "Facebook" }
                ].map((lead, i) => (
                    <motion.div 
                       initial={{ opacity: 0, x: -10 }}
                       whileInView={{ opacity: 1, x: 0 }}
                       transition={{ delay: 0.2 + (i*0.1) }}
                       key={i} className="flex justify-between items-center bg-white/5 p-2 rounded-lg border border-white/5">
                        <div className="flex items-center gap-2">
                           <div className={`w-1.5 h-1.5 rounded-full ${lead.color}`}></div>
                           <span className="text-white text-[8px] font-medium">{lead.name}</span>
                        </div>
                        <span className="text-gray-400 text-[6px]">{lead.source}</span>
                    </motion.div>
                ))}
            </div>
        </div>
    )
}

const FlowSimulation = () => {
    return (
        <div className="w-full h-full bg-[#0a0a0a] border border-white/10 rounded-2xl p-6 flex flex-col font-sans relative overflow-hidden group items-center justify-center hover:border-purple-500/30 transition-colors">
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-purple-500/20 blur-[60px] rounded-full pointer-events-none transition-opacity duration-500 group-hover:opacity-100 opacity-50"></div>
             
             <div className="flex flex-col items-center gap-3 w-full relative z-10">
                 {/* Top node */}
                 <motion.div 
                    whileHover={{ scale: 1.05 }}
                    className="w-full bg-white/5 border border-white/10 p-2 rounded-lg text-center flex flex-col items-center gap-1 shadow-lg backdrop-blur-md">
                     <Users className="w-3 h-3 text-white" />
                     <span className="text-[7px] text-white font-bold">Tráfico Web</span>
                 </motion.div>
                 
                 {/* Line connection */}
                 <div className="h-4 w-px bg-gradient-to-b from-white/30 to-purple-500/50 relative">
                     <motion.div 
                       animate={{ y: [0, 16, 0] }} 
                       transition={{ repeat: Infinity, duration: 2 }} 
                       className="absolute left-[-2px] w-1.5 h-1.5 bg-purple-500 rounded-full blur-[1px]"></motion.div>
                 </div>

                 {/* Middle Split */}
                 <div className="w-full flex justify-between gap-2">
                     <motion.div whileHover={{ scale: 1.05 }} className="w-1/2 bg-white/5 border border-purple-500/20 p-2 rounded-lg text-center flex flex-col items-center gap-1 shadow-lg bg-purple-500/5">
                         <MessageSquare className="w-3 h-3 text-purple-400" />
                         <span className="text-[7px] text-white font-bold">Asistente IA</span>
                     </motion.div>
                     <motion.div whileHover={{ scale: 1.05 }} className="w-1/2 bg-white/5 border border-white/10 p-2 rounded-lg text-center flex flex-col items-center gap-1 shadow-lg">
                         <Layout className="w-3 h-3 text-white" />
                         <span className="text-[7px] text-white font-bold">Formulario Auto</span>
                     </motion.div>
                 </div>

                 {/* Focus Line */}
                 <div className="w-full flex justify-center -mt-2.5">
                     <div className="h-4 w-px border-l-2 border-dashed border-white/20 relative z-0"></div>
                 </div>

                 {/* Bottom node */}
                 <motion.div 
                    initial={{ backgroundColor: "rgba(255,255,255,0.05)" }}
                    whileInView={{ backgroundColor: "rgba(168,85,247,0.15)", borderColor: "rgba(168,85,247,0.5)" }}
                    transition={{ repeat: Infinity, duration: 2, repeatType: "reverse" }}
                    className="w-full bg-white/5 border border-white/10 p-2 rounded-lg text-center flex flex-col items-center gap-1 relative z-10 shadow-[0_0_15px_rgba(168,85,247,0.2)]">
                     <Database className="w-3 h-3 text-purple-400" />
                     <span className="text-[7px] text-purple-400 font-bold">CRM & Leads Acumulados</span>
                 </motion.div>
             </div>
        </div>
    )
}


const BackgroundTechElements = () => {
   return (
       <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
          {/* Rising bar charts background */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-full h-full flex items-end justify-between gap-1 opacity-[0.02]">
             {[40, 60, 30, 80, 50, 90, 70, 100, 85, 45, 75, 55, 95].map((h, i) => (
                 <motion.div
                    key={i}
                    initial={{ height: "0%" }}
                    animate={{ height: [`${h}%`, `${h - 15}%`, `${h}%`] }}
                    transition={{ duration: 5 + (i % 4), repeat: Infinity, ease: "easeInOut" }}
                    className="flex-1 bg-gradient-to-t from-primary to-primary/20 mix-blend-screen rounded-t-lg"
                 />
             ))}
          </div>
       </div>
   )
}


export default function PresenciaDigitalPage() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start end", "end start"] });

  return (
    <main className="flex min-h-dvh flex-col bg-[#030303] text-white pt-28 pb-20 overflow-hidden relative selection:bg-primary/30 selection:text-white font-sans">
      
      {/* Background Complex Gradients */}
      <div className="fixed inset-0 -z-20 w-screen h-screen">
          <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-primary/5 blur-[120px] rounded-full mix-blend-screen pointer-events-none" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-emerald-500/5 blur-[150px] rounded-full mix-blend-screen pointer-events-none" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,#030303_100%)] pointer-events-none" />
          {/* Subtle noise pattern can be simulated with background-image if needed, but omitted for simplicity and performance */}
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 w-full relative z-10" ref={containerRef}>
        
        {/* HERO SECTION (SaaS Elite Style) */}
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="min-h-[70vh] flex flex-col items-center justify-center text-center mt-10 md:mt-20 mb-32 relative"
        >
          <BackgroundTechElements />

          {/* Subtle glow behind title */}
          <motion.div 
             initial={{ opacity: 0, scale: 0.8 }}
             animate={{ opacity: 1, scale: 1 }}
             transition={{ duration: 1.5, ease: "easeOut" }}
             className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[800px] aspect-square bg-primary/10 blur-[150px] rounded-full -z-10" 
          />

          <motion.div variants={fadeIn} className="inline-flex items-center gap-2 mb-8 px-5 py-2.5 rounded-full border border-primary/20 bg-primary/5 backdrop-blur-xl shadow-[0_0_20px_rgba(195,216,9,0.1)]">
            <Zap className="text-primary w-4 h-4 fill-primary/20" />
            <span className="text-[10px] md:text-xs font-bold text-primary tracking-[0.15em] uppercase">Ecosistema Digital Inteligente</span>
          </motion.div>
          
          <motion.h1 variants={fadeIn} className="text-[3.5rem] leading-[0.95] md:text-[6rem] lg:text-[8rem] xl:text-[9rem] font-black tracking-tighter mb-8 text-center max-w-[1200px] mx-auto flex flex-col items-center">
             <span className="text-white block">CONVIERTE TRÁFICO</span>
             <span className="text-transparent bg-clip-text bg-gradient-to-b from-primary via-primary/80 to-emerald-600 block italic border-b-8 border-primary/20 pb-2">EN OPORTUNIDADES.</span>
          </motion.h1>
          
          <motion.p variants={fadeIn} className="text-lg md:text-2xl text-gray-400 max-w-3xl text-center text-balance leading-relaxed mb-12 font-light">
            No hacemos simples "páginas web". Instalamos una <span className="text-white font-medium">máquina de adquisición B2B</span> con Inteligencia Artificial, recolección de leads automatizada e infraestructura de alto rendimiento.
          </motion.p>

          <motion.div variants={fadeIn} className="flex flex-col sm:flex-row gap-4 items-center justify-center w-full max-w-lg mx-auto">
             <Link 
                href="#planes" 
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 min-h-[60px] bg-primary text-black px-10 py-4 rounded-full font-bold text-lg hover:bg-white hover:scale-105 transition-all duration-300 focus:outline-none shadow-[0_0_30px_rgba(195,216,9,0.3)] hover:shadow-[0_0_40px_rgba(255,255,255,0.4)]"
             >
                Ver Solución de $400 <ArrowRight className="w-5 h-5" />
             </Link>
             <Link 
                href="https://wa.me/543515555123?text=Hola,%20necesito%20elevar%20mi%20presencia%20digital%20para%20conseguir%20m%C3%A1s%20clientes." 
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center min-h-[60px] bg-transparent text-white border border-white/20 px-8 py-4 rounded-full font-bold hover:bg-white/5 transition-all duration-300 focus:outline-none backdrop-blur-md"
             >
                Agendar Sesión Inicial
             </Link>
          </motion.div>
          
          {/* Trusted Badges */}
          <motion.div variants={fadeIn} className="mt-24 pt-10 border-t border-white/5 w-full flex flex-col items-center relative z-10">
             <p className="text-[10px] uppercase tracking-widest text-gray-500 mb-6 font-bold">Stack Tecnológico B2B</p>
             <div className="flex flex-wrap justify-center gap-6 md:gap-8 opacity-70 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-500 items-center">
                <div className="flex items-center gap-2 font-bold text-white text-xs md:text-sm"><Code className="w-4 h-4" /> Next.js 15</div>
                <div className="flex items-center gap-2 font-bold text-white text-xs md:text-sm"><Database className="w-4 h-4" /> Supabase</div>
                <div className="flex items-center gap-2 font-bold text-white text-xs md:text-sm"><MessageSquare className="w-4 h-4" /> OpenAI</div>
                <div className="flex items-center gap-2 font-bold text-white text-xs md:text-sm"><GitMerge className="w-4 h-4" /> Make</div>
                <div className="flex items-center gap-2 font-bold text-white text-xs md:text-sm"><Server className="w-4 h-4" /> Vercel</div>
                <div className="flex items-center gap-2 font-bold text-white text-xs md:text-sm"><Shield className="w-4 h-4" /> SSL 256-bit</div>
             </div>
          </motion.div>
        </motion.div>

        {/* CORE ARCHITECTURE MODULES (Bento Box Glassmorphism) */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="mb-40"
        >
          <div className="text-center mb-16 md:mb-24">
             <h2 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 tracking-tight">
                El Diferenciador <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-emerald-400 italic">MYB.</span>
             </h2>
             <p className="text-gray-400 text-lg max-w-2xl mx-auto text-balance">
                Cualquiera puede usar una plantilla. Nosotros arquitectamos tu plataforma B2B/B2C para maximizar la recolección de datos y escalar con Inteligencia Artificial.
             </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[400px]">
             
             {/* MAIN CARD: AI Chatbot */}
             <motion.div variants={fadeIn} className="md:col-span-2 bg-[#0c0c0c] border border-white/10 hover:border-primary/30 rounded-[2.5rem] p-8 md:p-12 relative overflow-hidden group flex flex-col md:flex-row gap-8 items-center justify-between shadow-2xl transition-colors duration-500">
                 <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none group-hover:from-primary/10 transition-colors duration-500"></div>
                 <div className="md:w-1/2 relative z-10 flex flex-col justify-center h-full text-center md:text-left">
                     <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-6 mx-auto md:mx-0 shadow-[0_0_15px_rgba(195,216,9,0.2)]">
                         <MessageSquare className="w-6 h-6 text-primary" />
                     </div>
                     <h3 className="text-2xl md:text-4xl font-bold mb-4 text-white leading-tight">Asistente Virtual IA <br className="hidden md:block"/>24/7</h3>
                     <p className="text-gray-400 text-sm md:text-base">Mientras duermes, tu Agente IA entrenado interactúa, responde dudas técnicas, captura emails y califica prospectos automáticamente sin costo de personal.</p>
                 </div>
                 <div className="md:w-1/2 w-full h-[220px] md:h-[280px] relative z-10 pt-4 md:pt-0">
                     <ChatSimulation />
                 </div>
             </motion.div>

             {/* SECONDARY CARD 1: Lead Capture */}
             <motion.div variants={fadeIn} className="bg-[#0c0c0c] border border-white/10 hover:border-blue-500/30 rounded-[2.5rem] p-8 relative overflow-hidden group flex flex-col justify-between shadow-2xl transition-colors duration-500">
                 <div className="absolute inset-0 bg-gradient-to-bl from-blue-500/5 to-transparent pointer-events-none group-hover:from-blue-500/10 transition-colors duration-500"></div>
                 <div className="relative z-10 mb-4 h-[160px]">
                     <DashboardSimulation />
                 </div>
                 <div className="relative z-10">
                     <h3 className="text-xl md:text-2xl font-bold mb-2 text-white">Captación de Leads</h3>
                     <p className="text-gray-400 text-[13px] leading-relaxed">Formularios optimizados para alta conversión conectados directo a tu embudo.</p>
                 </div>
             </motion.div>

             {/* SECONDARY CARD 2: Automations */}
             <motion.div variants={fadeIn} className="bg-[#0c0c0c] border border-white/10 hover:border-purple-500/30 rounded-[2.5rem] p-8 relative overflow-hidden group flex flex-col justify-between shadow-2xl transition-colors duration-500">
                 <div className="absolute inset-0 bg-gradient-to-tl from-purple-500/5 to-transparent pointer-events-none group-hover:from-purple-500/10 transition-colors duration-500"></div>
                 <div className="relative z-10">
                     <h3 className="text-xl md:text-2xl font-bold mb-2 text-white">Automatizaciones*</h3>
                     <p className="text-gray-400 text-[13px] leading-relaxed mb-4">¿Alguien completa un registro? Enviamos notificaciones y actualizamos tu CRM en milisegundos.</p>
                 </div>
                 <div className="relative z-10 h-[170px]">
                     <FlowSimulation />
                 </div>
             </motion.div>

             {/* SECONDARY CARD 3: SEO + Speed */}
             <motion.div variants={fadeIn} className="md:col-span-2 bg-[#0c0c0c] border border-white/10 hover:border-emerald-500/30 rounded-[2.5rem] p-8 md:p-12 relative overflow-hidden group flex flex-col md:flex-row gap-8 items-center justify-between shadow-2xl transition-colors duration-500">
                 <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/5 to-transparent pointer-events-none group-hover:from-emerald-500/10 transition-colors duration-500"></div>
                 <div className="w-full md:w-3/5 text-center md:text-left relative z-10">
                     <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-6 mx-auto md:mx-0 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                         <Globe className="w-6 h-6 text-emerald-500" />
                     </div>
                     <h3 className="text-2xl md:text-4xl font-bold mb-4 text-white">SEO Pro & Tráfico Orgánico</h3>
                     <p className="text-gray-400 text-sm md:text-base">Arquitectura amigable para Google, carga en menos de 1 segundo (Next.js) y configuración avanzada para dominar los resultados de búsqueda. El Dominio y Hosting por un año ya están incluidos.</p>
                 </div>
                 <div className="w-full md:w-2/5 relative z-10 grid grid-cols-2 gap-4">
                     <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col items-center justify-center text-center hover:bg-white/10 transition-colors">
                         <Server className="w-8 h-8 text-white/50 mb-3" />
                         <div className="text-white font-bold text-2xl">Cloud</div>
                         <div className="text-gray-500 text-[10px] uppercase tracking-wider font-bold mt-1">Hosting Elite</div>
                     </div>
                     <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col items-center justify-center text-center hover:bg-white/10 transition-colors">
                         <Shield className="w-8 h-8 text-emerald-500 mb-3 drop-shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                         <div className="text-emerald-500 font-bold text-2xl">SSL V2</div>
                         <div className="text-gray-500 text-[10px] uppercase tracking-wider font-bold mt-1">Seguridad Máxima</div>
                     </div>
                 </div>
             </motion.div>

          </div>
          <p className="text-center text-gray-500/70 font-medium text-[10px] mt-8 uppercase tracking-widest">*Nota: Herramientas complejas de envíos masivos o API externas pueden requerir licencias operativas del cliente gestionables aparte.</p>
        </motion.div>


        {/* PRICING CARD ELITE (The $400 Offer) */}
        <motion.div 
          id="planes"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="mb-40 flex flex-col items-center"
        >
          <div className="max-w-[950px] w-full relative">
             {/* Glow surround */}
             <div className="absolute inset-0 bg-primary/20 blur-[120px] rounded-[4rem] pointer-events-none -z-10" />
             
             {/* Border animated gradient wrapper */}
             <div className="absolute -inset-[2px] bg-gradient-to-b from-primary/50 via-primary/10 to-[#030303] rounded-[3rem] -z-10" />

             <div className="bg-[#050505] rounded-[3rem] p-8 md:p-14 md:py-16 relative overflow-hidden flex flex-col lg:flex-row gap-12 lg:gap-16 justify-between isolate">
                
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#ffffff_2px,transparent_2px)] [background-size:32px_32px] pointer-events-none"></div>

                <div className="lg:w-[45%] flex flex-col justify-center">
                   <div className="inline-flex items-center gap-2 mb-6">
                      <div className="px-4 py-1.5 rounded-full bg-white/10 text-white text-[10px] font-bold uppercase tracking-widest backdrop-blur-md border border-white/20 flex items-center gap-2">
                         <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                         Máquina de Ventas B2B
                      </div>
                   </div>
                   <h2 className="text-5xl md:text-6xl font-black mb-6 leading-tight">Presencia<br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-primary">Digital Pro.</span></h2>
                   
                   <div className="flex flex-col mb-8 border-b border-white/10 pb-8">
                      <div className="flex items-start gap-2">
                          <span className="text-7xl md:text-[6rem] font-black tracking-tighter leading-none text-white">$400</span>
                          <span className="text-xl text-primary font-bold mt-2">USD</span>
                      </div>
                      <span className="text-gray-500 font-medium text-sm mt-3 uppercase tracking-wider">Inversión única y definitiva por la infraestructura.</span>
                   </div>
                   
                   <p className="text-gray-300 text-base md:text-lg leading-relaxed mb-10 font-light">
                       El estándar para empresarios serios. Olvídate de los constructores lentos de los 2010s; invierte en infraestructura propia y tecnología IA que recolecta clientes y escala tu facturación todos los días. Diseñada para lucir de 100 Millones.
                   </p>

                   <Link 
                     href="https://wa.me/543515555123?text=Hola,%20quiero%20la%20m%C3%A1quina%20de%20captaci%C3%B3n%20y%20presencia%20digital%20para%20mi%20negocio." 
                     target="_blank"
                     rel="noopener noreferrer"
                     className="group relative w-full inline-flex items-center justify-center gap-3 bg-white text-black px-8 py-5 rounded-full font-black text-lg hover:bg-primary transition-all duration-300 min-h-[60px] shadow-[0_0_30px_rgba(255,255,255,0.15)] hover:shadow-[0_0_40px_rgba(195,216,9,0.3)] hover:scale-[1.02]"
                   >
                     Solicitar Implementación Ahora
                     <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                   </Link>
                </div>

                <div className="lg:w-[55%] flex flex-col pt-4 lg:pt-0 border-t border-white/10 lg:border-t-0 lg:border-l lg:pl-16">
                   <h3 className="text-xl md:text-2xl font-bold mb-8 text-white flex items-center gap-3">
                       <CheckCircle2 className="text-emerald-500 w-6 h-6" /> ¿Qué incluye tu ecosistema?
                   </h3>
                   <div className="flex flex-col gap-6 text-left mb-6">
                      {[
                         { title: "Sesión Diagnóstica Estratégica", desc: "Formulario/Llamada inicial para mapear exactamente tus dolores, deseos comerciales y embudo.", icon: <Users className="w-5 h-5 text-gray-400" /> },
                         { title: "Dashboard de Recolección de Leads", desc: "Formularios de alta conversión integrados en la web.", icon: <Database className="w-5 h-5 text-blue-400" /> },
                         { title: "Asistente Virtual IA (24/7)", desc: "Un bot inteligente entrenado con tu info para que recoja mails e interactúe por ti.", icon: <MessageSquare className="w-5 h-5 text-primary" /> },
                         { title: "Automatizaciones de Flujo", desc: "Integración básica que notifica a WhatsApp, Drive o CRM al instante que un cliente se registra.", icon: <Zap className="w-5 h-5 text-purple-400" /> },
                         { title: "Diseño UX/UI Premium 10X", desc: "Un diseño 'jaw-dropping' (Hará que tu competencia se vea vieja instantáneamente).", icon: <MonitorSmartphone className="w-5 h-5 text-orange-400" /> },
                         { title: "Infraestructura Elite de 1 Año", desc: "Hosting Vercel Cloud, Dominio Corporativo y Certificado SSL V2 incluidos.", icon: <Globe className="w-5 h-5 text-emerald-400" /> },
                         { title: "SEO Pro Integrado", desc: "Configuración meta, schema y analíticas para escalar posiciones orgánicamente.", icon: <Search className="w-5 h-5 text-indigo-400" /> },
                      ].map((item, idx) => (
                         <div key={idx} className="flex items-start gap-4 p-3 rounded-2xl hover:bg-white/5 transition-colors -mx-3 border border-transparent hover:border-white/5">
                            <div className="shrink-0 mt-1 bg-white/5 p-2 rounded-xl">{item.icon}</div>
                            <div>
                                <h4 className="text-white font-bold text-sm mb-1">{item.title}</h4>
                                <p className="text-gray-400 text-xs md:text-[13px] leading-relaxed">{item.desc}</p>
                            </div>
                         </div>
                      ))}
                   </div>
                </div>

             </div>
          </div>
        </motion.div>

        {/* FEEDSPRING STYLE MASSIVE FOOTER CTA */}
        <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="w-full mt-20 md:mt-40 rounded-t-[3rem] md:rounded-t-[5rem] overflow-hidden relative isolate px-4 py-24 md:py-40 bg-black border-t border-white/5 shadow-[0_-50px_100px_rgba(0,0,0,0.8)]"
        >
            {/* Background glowing massive radial */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-primary/20 blur-[200px] rounded-[100%] pointer-events-none -z-10 animate-pulse"></div>
            
            <div className="max-w-[1200px] mx-auto text-center flex flex-col items-center relative z-10">
                <motion.div variants={fadeIn} className="mb-6 flex space-x-2">
                   <span className="px-4 py-1.5 rounded-full bg-white/10 text-white font-bold text-xs md:text-sm border border-white/20 backdrop-blur-md">Ventas B2B</span>
                   <span className="px-4 py-1.5 rounded-full bg-primary/10 text-primary font-bold text-xs md:text-sm border border-primary/30 backdrop-blur-md">Escala Rápido</span>
                </motion.div>
                
                <motion.h2 variants={fadeIn} className="text-6xl md:text-[8rem] lg:text-[11rem] font-black tracking-tighter text-white leading-[0.9] mb-8 md:mb-12 uppercase drop-shadow-2xl">
                    Tu negocio <br/>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-emerald-500 block italic">NO PARA.</span>
                </motion.h2>

                <motion.p variants={fadeIn} className="text-gray-400 text-lg md:text-3xl max-w-3xl mx-auto font-medium leading-relaxed mb-16 text-balance">
                    Desarrollamos vendedores incansables, <strong className="text-white">100% operativos a toda hora</strong>, enfocados exclusivamente en tu retorno de inversión.
                </motion.p>

                <motion.div variants={fadeIn}>
                  <Link 
                      href="https://wa.me/543515555123?text=Hola,%20quiero%20conocer%20c%C3%B3mo%20una%20presencia%20digital%20automatizada%20con%20IA%20ayuda%20a%20mi%20negocio." 
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-4 bg-white text-black px-10 py-6 md:px-14 md:py-8 rounded-full font-black text-xl md:text-3xl hover:bg-primary transition-all duration-300 hover:scale-[1.05] shadow-[0_0_50px_rgba(255,255,255,0.2)] hover:shadow-[0_0_80px_rgba(195,216,9,0.5)] group"
                  >
                      Empezar Proyecto Ahora <ArrowRight className="w-8 h-8 md:w-10 md:h-10 group-hover:translate-x-2 transition-transform" />
                  </Link>
                </motion.div>
            </div>
        </motion.div>

      </div>
    </main>
  );
}
