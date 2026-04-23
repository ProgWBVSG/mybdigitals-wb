"use client";

import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { CheckCircle2, MonitorSmartphone, Search, ArrowRight, Code, Zap, Database, MessageSquare, Lock, Layout, Shield, Server, GitMerge, LineChart, Users, Globe, TrendingUp, Eye, Award, ShieldCheck, Compass, MousePointerClick, CalendarClock, Target, Layers, Briefcase, Lightbulb, PenTool, Gauge, Filter, ShoppingCart, BadgeDollarSign, Bot } from "lucide-react";
import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import NicheTypewriter from "@/components/NicheTypewriter";

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

const MethodologySection = () => {
   return (
      <motion.div 
         initial="hidden"
         whileInView="visible"
         viewport={{ once: true, margin: "-100px" }}
         variants={staggerContainer}
         className="w-full flex flex-col items-center mb-40 relative z-10"
      >
         {/* HEADER: ¿Qué hacemos realmente? */}
         <div className="max-w-[1000px] w-full text-center px-4 mb-20">
            <motion.div variants={fadeIn} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-white font-bold text-[10px] md:text-xs tracking-widest uppercase mb-6 backdrop-blur-md">
               <Target className="w-3 h-3 text-primary" /> Filosofía MYB
            </motion.div>
            <motion.h2 variants={fadeIn} className="text-3xl md:text-5xl lg:text-6xl font-black text-white tracking-tighter leading-tight mb-8">
               No hacemos "Páginas Web".<br />
               <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-primary italic pr-2">Construimos Activos Digitales.</span>
            </motion.h2>
            <motion.p variants={fadeIn} className="text-gray-400 text-lg md:text-xl font-light text-balance leading-relaxed">
               Diseñamos y desarrollamos espacios estratégicos pensados para posicionar marcas, ordenar su propuesta de valor y generar consultas orgánicas. <strong>Un sistema que trabaja 24/7 para tu posicionamiento y ventas</strong>, sin depender exclusivamente del algoritmo de las redes sociales.
            </motion.p>
         </div>

         {/* DOS COLUMNAS: Beneficios vs 5 Funciones */}
         <div className="max-w-[1200px] w-full px-4 grid grid-cols-1 lg:grid-cols-12 gap-8 mb-24">
            
            {/* Beneficios */}
            <motion.div variants={fadeIn} className="lg:col-span-5 bg-gradient-to-b from-[#0a0a0a] to-[#050505] rounded-[2rem] border border-white/10 p-8 md:p-10 relative overflow-hidden group">
               <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[80px] rounded-full pointer-events-none group-hover:bg-primary/10 transition-colors duration-500"></div>
               <h3 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
                  <Globe className="w-6 h-6 text-primary" />
                  Beneficios del Ecosistema
               </h3>
               <ul className="space-y-6">
                  {[
                     { text: "Aparecer en los motores de búsqueda (Google).", icon: <Search className="w-5 h-5 text-gray-400" /> },
                     { text: "Centralizar toda tu información en un solo lugar.", icon: <Layers className="w-5 h-5 text-emerald-400" /> },
                     { text: "Generar consultas sin publicar contenido diario.", icon: <CalendarClock className="w-5 h-5 text-blue-400" /> },
                     { text: "Construir posicionamiento y autoridad a largo plazo.", icon: <TrendingUp className="w-5 h-5 text-purple-400" /> },
                     { text: "Filtrar mejor a tus clientes ideales automáticamente.", icon: <Filter className="w-5 h-5 text-primary" /> },
                  ].map((item, i) => (
                     <li key={i} className="flex items-start gap-4">
                        <div className="shrink-0 mt-0.5 bg-white/5 p-2 rounded-lg border border-white/5">{item.icon}</div>
                        <span className="text-gray-300 font-medium leading-relaxed">{item.text}</span>
                     </li>
                  ))}
               </ul>
               <div className="mt-10 p-4 bg-white/5 rounded-xl border border-primary/20 text-center">
                  <span className="text-primary text-sm font-bold uppercase tracking-wider">No reemplaza las redes.</span><br/>
                  <span className="text-gray-300 text-xs mt-1 block">Las potencia y les da dirección estratégica.</span>
               </div>
            </motion.div>

            {/* 5 Funciones Clave */}
            <motion.div variants={fadeIn} className="lg:col-span-7 bg-[#0c0c0c] rounded-[2rem] border border-white/10 p-8 md:p-10 relative overflow-hidden">
               <h3 className="text-2xl font-bold text-white mb-8">Las 5 funciones de una Web Estratégica:</h3>
               <div className="flex flex-col gap-4">
                  {[
                     { title: "Claridad", desc: "En segundos el visitante entiende qué hacés y para quién.", sub: "Home -> Mensaje Claro + CTA", icon: <Eye />, color: "text-blue-400", bg: "bg-blue-400/10", border: "border-blue-400/20" },
                     { title: "Autoridad", desc: "Refuerza tu experiencia y diferenciación en tu nicho.", sub: "Sobre Mí -> Historia + Autoridad", icon: <Award />, color: "text-purple-400", bg: "bg-purple-400/10", border: "border-purple-400/20" },
                     { title: "Confianza", desc: "Testimonios y coherencia visual 100% profesional.", sub: "Servicios -> Qué hacés y para quién", icon: <ShieldCheck />, color: "text-emerald-400", bg: "bg-emerald-400/10", border: "border-emerald-400/20" },
                     { title: "Dirección", desc: "Guía al usuario hacia una acción de compra o registro.", sub: "Secciones -> Prueba Social + CTA", icon: <Compass />, color: "text-orange-400", bg: "bg-orange-400/10", border: "border-orange-400/20" },
                     { title: "Conversión", desc: "Facilita el contacto inmediato integrado al embudo.", sub: "Contacto -> WhatsApp / Formulario", icon: <MousePointerClick />, color: "text-primary", bg: "bg-primary/10", border: "border-primary/20" }
                  ].map((f, i) => (
                     <div key={i} className={`flex items-center gap-4 md:gap-6 p-4 rounded-2xl border ${f.border} bg-white/[0.02] hover:bg-white/5 transition-colors`}>
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${f.bg} ${f.color}`}>
                           {f.icon}
                        </div>
                        <div className="flex-1">
                           <h4 className="text-white font-bold mb-1 flex items-center gap-2">
                              {f.title} <ArrowRight className="w-3 h-3 text-gray-500" /> <span className="text-gray-300 font-normal text-sm md:text-base">{f.desc}</span>
                           </h4>
                           <span className={`text-[10px] md:text-xs font-bold uppercase tracking-widest ${f.color} opacity-80`}>{f.sub}</span>
                        </div>
                     </div>
                  ))}
               </div>
            </motion.div>
         </div>

         {/* QUÉ INCLUYE EL SERVICIO - Bento Box */}
         <div className="max-w-[1200px] w-full px-4 text-center mb-12">
            <h3 className="text-3xl md:text-4xl font-black text-white mb-4">¿Qué incluye el servicio?</h3>
            <p className="text-gray-400 text-lg">Cuatro pilares para una presencia infalible.</p>
         </div>
         
         <div className="max-w-[1200px] w-full px-4 grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <motion.div variants={fadeIn} className="bg-[#050505] border border-white/10 rounded-3xl p-8 hover:border-primary/30 transition-colors group relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-[50px] group-hover:bg-primary/10"></div>
               <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-6 text-primary">
                  <Lightbulb size={24} />
               </div>
               <h4 className="text-xl font-bold text-white mb-4">Estructura Estratégica</h4>
               <ul className="space-y-3 text-gray-400 text-sm">
                  <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" /> Definición de arquitectura web.</li>
                  <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" /> Organización clara de la propuesta de valor.</li>
                  <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" /> Jerarquización estratégica de servicios.</li>
                  <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" /> Redacción estructurada orientada a conversión.</li>
                  <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" /> Integración de llamados a la acción (CTA).</li>
               </ul>
            </motion.div>
            
            <motion.div variants={fadeIn} className="bg-[#050505] border border-white/10 rounded-3xl p-8 hover:border-emerald-500/30 transition-colors group relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 blur-[50px] group-hover:bg-emerald-500/10"></div>
               <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-6 text-emerald-500">
                  <PenTool size={24} />
               </div>
               <h4 className="text-xl font-bold text-white mb-4">Desarrollo y Diseño</h4>
               <ul className="space-y-3 text-gray-400 text-sm">
                  <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" /> Diseño personalizado alineado a tu identidad visual.</li>
                  <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" /> Adaptación estética 100% profesional.</li>
                  <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" /> Diseño responsive (celular, tablet, computadora).</li>
                  <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" /> Optimización máxima de experiencia de usuario (UX).</li>
               </ul>
            </motion.div>

            <motion.div variants={fadeIn} className="bg-[#050505] border border-white/10 rounded-3xl p-8 hover:border-purple-500/30 transition-colors group relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 blur-[50px] group-hover:bg-purple-500/10"></div>
               <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mb-6 text-purple-500">
                  <Server size={24} />
               </div>
               <h4 className="text-xl font-bold text-white mb-4">Infraestructura Técnica</h4>
               <ul className="space-y-3 text-gray-400 text-sm">
                  <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-purple-500 shrink-0 mt-0.5" /> Configuración de Dominio propio.</li>
                  <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-purple-500 shrink-0 mt-0.5" /> Servidores Cloud de alto rendimiento (Hosting).</li>
                  <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-purple-500 shrink-0 mt-0.5" /> Base de datos integrada y Certificado SSL.</li>
                  <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-purple-500 shrink-0 mt-0.5" /> Cuentas de correo empresariales (opcional).</li>
                  <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-purple-500 shrink-0 mt-0.5" /> Optimización básica para buscadores (SEO).</li>
               </ul>
            </motion.div>

            <motion.div variants={fadeIn} className="bg-[#050505] border border-white/10 rounded-3xl p-8 hover:border-blue-500/30 transition-colors group relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 blur-[50px] group-hover:bg-blue-500/10"></div>
               <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-6 text-blue-500">
                  <Gauge size={24} />
               </div>
               <h4 className="text-xl font-bold text-white mb-4">Herramientas de Conversión</h4>
               <ul className="space-y-3 text-gray-400 text-sm">
                  <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" /> Botón directo e inteligente a WhatsApp.</li>
                  <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" /> Formularios de contacto estratégicos.</li>
                  <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" /> Sistema de captación de correos para base de datos.</li>
                  <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" /> Integración con agenda online automatizada.</li>
                  <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" /> Estructura de Testimonios y Preguntas Frecuentes.</li>
               </ul>
            </motion.div>
         </div>
      </motion.div>
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
          
          <motion.h1 variants={fadeIn} className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tighter mb-4 text-center max-w-4xl mx-auto leading-[1.05]">
             <span className="text-white block pb-1">CONVIERTE TRÁFICO EN</span>
             <span className="text-transparent bg-clip-text bg-gradient-to-b from-primary via-primary/80 to-emerald-600 block italic pr-2 pb-[0.1em]">OPORTUNIDADES.</span>
          </motion.h1>

          {/* Animated metric badges */}
          <motion.div
            variants={fadeIn}
            className="flex flex-wrap justify-center gap-3 mb-10"
          >
            {[
              { icon: "⚡", label: "Entrega en 14 días" },
              { icon: "🤖", label: "IA integrada" },
              { icon: "📈", label: "SEO optimizado" },
              { icon: "🔒", label: "SSL + Hosting incluido" },
            ].map((badge, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + i * 0.12, duration: 0.5 }}
                whileHover={{ scale: 1.06, y: -2 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/[0.04] backdrop-blur-md text-sm font-semibold text-gray-200 shadow-[0_0_14px_rgba(195,216,9,0.07)] hover:border-primary/30 hover:bg-primary/5 transition-colors cursor-default"
              >
                <span>{badge.icon}</span>
                {badge.label}
              </motion.span>
            ))}
          </motion.div>
          
          <motion.p variants={fadeIn} className="text-lg md:text-2xl text-gray-400 max-w-3xl text-center text-balance leading-relaxed mb-12 font-light">
            No hacemos simples "páginas web". Instalamos un <span className="text-white font-medium">ecosistema de adquisición de clientes</span> con Inteligencia Artificial, recolección de leads automatizada e infraestructura de alto rendimiento.
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
             <p className="text-[10px] uppercase tracking-widest text-gray-500 mb-6 font-bold">Stack Tecnológico Corporativo</p>
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

        {/* NEW METODOLOGY & PHILOSOPHY SECTION */}
        <MethodologySection />

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
                El Diferenciador <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-emerald-400 italic pr-2">MYB.</span>
             </h2>
             <p className="text-gray-400 text-lg max-w-2xl mx-auto text-balance">
                Cualquiera puede usar una plantilla. Nosotros arquitectamos tu plataforma corporativa para maximizar la recolección de datos y escalar con Inteligencia Artificial.
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

        {/* TYPEWRITER NICHES SHOWCASE */}
        <NicheTypewriter />

        {/* LIVE PORTFOLIO SHOWCASE */}
        <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="w-full py-24 md:py-32 flex flex-col items-center overflow-hidden bg-[#020202] border-y border-white/5 relative isolate mb-40"
        >
             {/* Background glows */}
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-primary/10 blur-[150px] rounded-full pointer-events-none -z-10 animate-pulse"></div>

             <div className="max-w-[1200px] w-full px-4 text-center mb-16 relative z-10">
                <motion.span variants={fadeIn} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-white font-bold text-[10px] md:text-xs tracking-widest uppercase mb-6 backdrop-blur-md">
                   Portafolio en Vivo
                </motion.span>
                <motion.h2 variants={fadeIn} className="text-4xl md:text-5xl lg:text-7xl font-black text-white tracking-tighter leading-none mb-6">
                   PROYECTOS <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-primary italic pr-2">ÉLITE.</span>
                </motion.h2>
                <motion.p variants={fadeIn} className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto font-light text-balance">
                   Ecosistemas digitales que transmiten autoridad corporativa. Renderizados en vivo. <span className="text-white font-medium">Asómate a su interior.</span>
                </motion.p>
             </div>

             {/* Live Marquee */}
             <div className="w-full relative flex overflow-hidden group">
                 {/* Left/Right fading gradients */}
                 <div className="absolute left-0 top-0 bottom-0 w-[80px] md:w-[250px] bg-gradient-to-r from-[#020202] to-transparent z-20 pointer-events-none" />
                 <div className="absolute right-0 top-0 bottom-0 w-[80px] md:w-[250px] bg-gradient-to-l from-[#020202] to-transparent z-20 pointer-events-none" />

                 <div className="flex gap-8 px-4 w-max animate-[scroll-marquee_50s_linear_infinite] hover:[animation-play-state:paused] will-change-transform">
                    {[
                       { name: "Elevare Consulting", url: "https://www.elevareconsultingmg.com/" },
                       { name: "Eneas Coaching", url: "https://eneascoaching.vercel.app/" },
                       { name: "Reinventadas 50+", url: "https://www.reinventadas50.com/" },
                       { name: "Erika Ríos", url: "https://www.erikarios.com.ar/" },
                       // Duplicated for seamless loop
                       { name: "Elevare Consulting", url: "https://www.elevareconsultingmg.com/" },
                       { name: "Eneas Coaching", url: "https://eneascoaching.vercel.app/" },
                       { name: "Reinventadas 50+", url: "https://www.reinventadas50.com/" },
                       { name: "Erika Ríos", url: "https://www.erikarios.com.ar/" },
                    ].map((site, idx) => (
                       <a key={idx} href={site.url} target="_blank" rel="noopener noreferrer" className="relative block w-[300px] h-[220px] md:w-[450px] md:h-[320px] shrink-0 rounded-[1.5rem] border border-white/10 bg-[#050505] overflow-hidden group/card shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex flex-col transition-transform duration-700 hover:scale-[1.03] cursor-pointer">
                           {/* Safari glass bar */}
                           <div className="h-8 md:h-10 bg-[#121212] border-b border-white/10 flex items-center px-4 gap-2 relative z-20 shrink-0">
                               <div className="flex gap-1.5 opacity-60 hover:opacity-100 transition-opacity">
                                  <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
                                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500"></div>
                                  <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
                               </div>
                               <div className="mx-auto bg-black/60 px-4 py-1 rounded-md text-[9px] md:text-[10px] text-gray-300 flex items-center justify-center gap-1.5 w-full max-w-[60%] truncate border border-white/5">
                                 <svg className="w-2.5 h-2.5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
                                 {site.url.replace("https://", "")}
                               </div>
                           </div>

                           {/* Iframe strict 1440p scale wrapper */}
                           <div className="relative flex-1 w-full bg-[#050505] overflow-hidden isolate">
                               <div className="absolute inset-0 bg-black/20 z-10 pointer-events-none group-hover/card:bg-transparent transition-colors duration-500" />
                               <div className="absolute top-0 left-0 w-[1440px] h-[1024px] origin-top-left scale-[0.21] md:scale-[0.312] pointer-events-none opacity-80 group-hover/card:opacity-100 transition-opacity duration-700">
                                   <iframe src={site.url} className="w-full h-full border-none" loading="lazy" />
                               </div>
                           </div>

                           {/* Hover Name Badge */}
                           <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 pointer-events-none opacity-0 group-hover/card:opacity-100 transition-all duration-300 translate-y-4 group-hover/card:translate-y-0">
                               <span className="px-5 py-2.5 rounded-full bg-black/90 backdrop-blur-xl border border-white/10 text-white font-black text-xs md:text-sm whitespace-nowrap shadow-2xl flex items-center gap-2">
                                  {site.name} <ArrowRight className="w-3 h-3 text-primary" />
                               </span>
                           </div>
                       </a>
                    ))}
                 </div>
             </div>
        </motion.div>


        {/* PRICING CARDS */}
        <motion.div 
          id="planes"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="mb-40 flex flex-col items-center gap-16"
        >
          {/* PLAN 1: SERVICIOS */}
          <div className="max-w-[950px] w-full relative">
             <div className="absolute inset-0 bg-primary/20 blur-[120px] rounded-[4rem] pointer-events-none -z-10" />
             <div className="absolute -inset-[2px] bg-gradient-to-b from-primary/50 via-primary/10 to-[#030303] rounded-[3rem] -z-10" />

             <div className="bg-[#050505] rounded-[3rem] p-8 md:p-14 md:py-16 relative overflow-hidden flex flex-col lg:flex-row gap-12 lg:gap-16 justify-between isolate">
                <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#ffffff_2px,transparent_2px)] [background-size:32px_32px] pointer-events-none"></div>

                <div className="lg:w-[45%] flex flex-col justify-center">
                   <div className="inline-flex items-center gap-2 mb-6">
                      <div className="px-4 py-1.5 rounded-full bg-white/10 text-white text-[10px] font-bold uppercase tracking-widest backdrop-blur-md border border-white/20 flex items-center gap-2">
                         <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                         Plataforma Avanzada de Ventas
                      </div>
                   </div>
                   <h2 className="text-5xl md:text-6xl font-black mb-6 leading-tight">Presencia<br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-primary">Digital.</span></h2>
                   
                   <div className="flex flex-col mb-8 border-b border-white/10 pb-8">
                      <div className="flex items-start gap-2">
                          <span className="text-7xl md:text-[6rem] font-black tracking-tighter leading-none text-white">$400</span>
                          <span className="text-xl text-primary font-bold mt-2">USD</span>
                      </div>
                      <span className="text-gray-500 font-medium text-sm mt-3 uppercase tracking-wider">Inversión única por la infraestructura.</span>
                   </div>
                   
                   <p className="text-gray-300 text-base md:text-lg leading-relaxed mb-10 font-light">
                       El estándar para empresarios serios profesionales y prestadores de servicios. Invierte en infraestructura propia y tecnología que recolecta prospectos todos los días.
                   </p>

                   <Link 
                     href="https://wa.me/543515555123?text=Hola,%20quiero%20la%20m%C3%A1quina%20de%20captaci%C3%B3n%20y%20presencia%20digital%20para%20mi%20negocio." 
                     target="_blank"
                     rel="noopener noreferrer"
                     className="group relative w-full inline-flex items-center justify-center gap-3 bg-white text-black px-8 py-5 rounded-full font-black text-lg hover:bg-primary transition-all duration-300 min-h-[60px] shadow-[0_0_30px_rgba(255,255,255,0.15)] hover:shadow-[0_0_40px_rgba(195,216,9,0.3)] hover:scale-[1.02]"
                   >
                     Solicitar Implementación
                     <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                   </Link>
                </div>

                <div className="lg:w-[55%] flex flex-col pt-4 lg:pt-0 border-t border-white/10 lg:border-t-0 lg:border-l lg:pl-16">
                   <h3 className="text-xl md:text-2xl font-bold mb-8 text-white flex items-center gap-3">
                       <CheckCircle2 className="text-emerald-500 w-6 h-6" /> ¿Qué incluye tu ecosistema?
                   </h3>
                   <div className="flex flex-col gap-6 text-left mb-6">
                      {[
                         { title: "Sesión Diagnóstica Estratégica", desc: "Llamada inicial para mapear exactamente tus dolores, embudo y cliente ideal.", icon: <Users className="w-5 h-5 text-gray-400" /> },
                         { title: "Dashboard de Recolección de Leads", desc: "Formularios de alta conversión integrados.", icon: <Database className="w-5 h-5 text-blue-400" /> },
                         { title: "Asistente Virtual IA (24/7)", desc: "Bot inteligente que captura clientes por ti.", icon: <MessageSquare className="w-5 h-5 text-primary" /> },
                         { title: "Automatizaciones de Flujo", desc: "Notifica a tu equipo al instante que un prospecto se registra.", icon: <Zap className="w-5 h-5 text-purple-400" /> },
                         { title: "Diseño UX/UI Profesional", desc: "Arquitectura que posiciona tu marca.", icon: <MonitorSmartphone className="w-5 h-5 text-emerald-400" /> },
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

          {/* PLAN 2: E-COMMERCE / PRODUCTOS */}
          <div className="max-w-[950px] w-full relative">
             <div className="absolute inset-0 bg-orange-500/10 blur-[120px] rounded-[4rem] pointer-events-none -z-10" />
             <div className="absolute -inset-[2px] bg-gradient-to-b from-orange-500/40 via-orange-500/10 to-[#030303] rounded-[3rem] -z-10" />

             <div className="bg-[#050505] rounded-[3rem] p-8 md:p-14 md:py-16 relative overflow-hidden flex flex-col lg:flex-row gap-12 lg:gap-16 justify-between isolate">
                <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#ffffff_2px,transparent_2px)] [background-size:32px_32px] pointer-events-none"></div>

                <div className="lg:w-[45%] flex flex-col justify-center">
                   <div className="inline-flex items-center gap-2 mb-6">
                      <div className="px-4 py-1.5 rounded-full bg-white/10 text-white text-[10px] font-bold uppercase tracking-widest backdrop-blur-md border border-white/20 flex items-center gap-2">
                         <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
                         E-Commerce para Productos
                      </div>
                   </div>
                   <h2 className="text-5xl md:text-6xl font-black mb-6 leading-tight">TiendaIA<br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500">Optimizada.</span></h2>
                   
                   <p className="text-gray-300 text-base md:text-lg leading-relaxed mb-10 font-light">
                       Mejor que las típicas plataformas de pago mensual. Un diseño espectacular, conectado con tu marca, más todo un dashboard interactivo que utiliza estrategias establecidas para enganchar al cliente y asegurar tus ventas.
                   </p>

                   <Link 
                     href="https://wa.me/543515555123?text=Hola,%20tengo%20productos%20y%20quiero%20crear%20mi%20Tienda%20IA%20Optimizada." 
                     target="_blank"
                     rel="noopener noreferrer"
                     className="group relative w-full inline-flex items-center justify-center gap-3 bg-white text-black px-8 py-5 rounded-full font-black text-lg hover:bg-orange-500 hover:text-white transition-all duration-300 min-h-[60px] shadow-[0_0_30px_rgba(255,255,255,0.15)] hover:shadow-[0_0_40px_rgba(249,115,22,0.3)] hover:scale-[1.02]"
                   >
                     Armar mi E-commerce
                     <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                   </Link>
                </div>

                <div className="lg:w-[55%] flex flex-col pt-4 lg:pt-0 border-t border-white/10 lg:border-t-0 lg:border-l lg:pl-16">
                   <h3 className="text-xl md:text-2xl font-bold mb-8 text-white flex items-center gap-3">
                       <ShoppingCart className="text-orange-500 w-6 h-6" /> Lo que incluye tu Tienda
                   </h3>
                   <div className="flex flex-col gap-6 text-left mb-6">
                      {[
                         { title: "Funnels Estratégicos", desc: "Recuperación de carritos abandonados, cross-selling y promociones inteligentes.", icon: <LineChart className="w-5 h-5 text-red-400" /> },
                         { title: "Dashboard Operativo", desc: "Gestión completa de stock, pedidos y catálogo de forma directa.", icon: <Gauge className="w-5 h-5 text-orange-400" /> },
                         { title: "Integración de Pagos Locales", desc: "Conecta MercadoPago u otros sin depender de plataformas restrictivas extras.", icon: <Target className="w-5 h-5 text-green-400" /> },
                         { title: "Asistente de Ventas IA", desc: "Responde dudas al instante (talles, envíos) a las 3 AM y empuja la compra.", icon: <MessageSquare className="w-5 h-5 text-primary" /> },
                         { title: "Diseño Impactante", desc: "Una presentación de producto inmersiva que incrementa el valor percibido.", icon: <PenTool className="w-5 h-5 text-emerald-400" /> },
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

        {/* AUTOMATION INCENTIVE (Subtle Upsell) */}
        <motion.div
           initial="hidden"
           whileInView="visible"
           viewport={{ once: true, margin: "-50px" }}
           variants={fadeIn}
           className="max-w-[700px] mx-auto text-center mb-28 px-6 py-10 rounded-[2rem] bg-gradient-to-b from-white/[0.03] to-transparent border border-white/5 relative overflow-hidden group"
        >
           <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-[2px] bg-gradient-to-r from-transparent via-primary/50 to-transparent group-hover:w-64 transition-all duration-700"></div>
           <Bot className="w-8 h-8 text-primary/70 mx-auto mb-4 opacity-80" />
           <h3 className="text-xl md:text-2xl font-bold text-white mb-3">Tu negocio será Future-Proof.</h3>
           <p className="text-gray-400 text-sm md:text-base leading-relaxed mb-6 font-light text-balance px-4">
             Toda nuestra arquitectura web está construida bajo un estándar de desarrollo corporativo <strong>"AI-Ready"</strong>. Es decir, cuando tu empresa alcance un volumen inmanejable de forma manual...<br className="hidden md:block"/><br className="hidden md:block"/>
             Tu ecosistema estará <span className="text-white font-medium">listo para integrarse</span> y enchufarse a <strong><Link href="/servicios/automatizaciones" className="text-primary hover:text-emerald-400 transition-colors font-medium relative hover:underline underline-offset-4 decoration-primary/50">Agentes de Inteligencia Artificial.</Link></strong> Cuando decidas automatizar al 100% tus procesos, ya tendrás la mejor base armada.
           </p>
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
                   <span className="px-4 py-1.5 rounded-full bg-white/10 text-white font-bold text-xs md:text-sm border border-white/20 backdrop-blur-md">Ventas Inteligentes</span>
                   <span className="px-4 py-1.5 rounded-full bg-primary/10 text-primary font-bold text-xs md:text-sm border border-primary/30 backdrop-blur-md">Escala Rápido</span>
                </motion.div>
                
                <motion.h2 variants={fadeIn} className="text-6xl md:text-[8rem] lg:text-[11rem] font-black tracking-tighter text-white leading-[0.9] mb-8 md:mb-12 uppercase drop-shadow-2xl">
                    Tu negocio <br/>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-emerald-500 block italic pr-2">NO PARA.</span>
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
