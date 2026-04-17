"use client";

import { motion } from "framer-motion";
import { CheckCircle2, TrendingUp, Target, MousePointerClick, ArrowRight, Zap, Layout, Globe, Lock, Mail, Users, CreditCard } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

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

const DesktopFrame = ({ index, children }: { index: number, children: React.ReactNode }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 50 }}
      animate={mounted ? { opacity: 1, y: [0, index % 2 === 0 ? -15 : 15, 0] } : { opacity: 1, y: 0 }}
      transition={{ 
        opacity: { duration: 0.8, delay: index * 0.2 },
        y: { repeat: Infinity, duration: 5 + (index%4), ease: "easeInOut" }
      }}
      className="relative w-[340px] sm:w-[500px] lg:w-[600px] shrink-0 aspect-[16/10] sm:aspect-[16/9] rounded-xl border border-white/20 bg-black shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col group will-change-transform"
    >
      {/* Chrome Desktop Window Header */}
      <div className="h-6 sm:h-8 bg-[#2d2d2d] flex items-center px-4 gap-2 shrink-0 border-b border-black">
        <div className="w-2 sm:w-3 h-2 sm:h-3 rounded-full bg-[#ff5f56]"></div>
        <div className="w-2 sm:w-3 h-2 sm:h-3 rounded-full bg-[#ffbd2e]"></div>
        <div className="w-2 sm:w-3 h-2 sm:h-3 rounded-full bg-[#27c93f]"></div>
      </div>
      
      {/* Real-like Web Page Content */}
      <div className="relative flex-1 w-full h-full overflow-hidden bg-white">
        {children}
        {/* Transparent overlay so users can't click internal mock elements */}
        <div className="absolute inset-0 z-50 cursor-default"></div>
      </div>
    </motion.div>
  );
};

const MockupSaaS = () => (
  <div className="w-full h-full bg-[#0b0f19] flex flex-col relative overflow-hidden text-left font-sans">
    <div className="absolute top-[-50%] right-[-10%] w-[80%] h-[150%] bg-blue-500/10 blur-[80px] rounded-full pointer-events-none"></div>
    {/* Navbar */}
    <div className="flex justify-between items-center p-3 border-b border-white/10 shrink-0 relative z-10 w-full">
      <div className="font-bold text-white text-[10px] sm:text-xs flex items-center gap-1.5"><div className="w-3 h-3 bg-blue-500 rounded-sm"></div> DataSync</div>
      <div className="flex gap-3 sm:gap-6 items-center">
        <div className="hidden sm:block w-10 h-1.5 bg-white/20 rounded-full"></div>
        <div className="hidden sm:block w-10 h-1.5 bg-white/20 rounded-full"></div>
        <div className="px-3 py-1 bg-blue-500 rounded text-white text-[8px] sm:text-[10px] font-bold">Probar Gratis</div>
      </div>
    </div>
    {/* Hero */}
    <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-8 text-center relative z-10 w-full mb-4">
      <div className="px-2 py-0.5 border border-blue-500/30 bg-blue-500/10 rounded-full text-blue-400 text-[6px] sm:text-[8px] font-bold uppercase tracking-wider mb-2">Nueva v2.0 Lanzada</div>
      <h1 className="text-white font-extrabold text-base sm:text-3xl max-w-[250px] sm:max-w-md mb-2 sm:mb-4 leading-tight">Escala tu base de datos sin <span className="text-blue-400">dolores de cabeza.</span></h1>
      <p className="text-gray-400 text-[8px] sm:text-xs max-w-[200px] sm:max-w-xs mb-4 sm:mb-6">Conecta todas tus herramientas sin escribir una sola línea de código. Escalabilidad infinita y sin configuraciones.</p>
      <div className="flex gap-2 sm:gap-4">
        <div className="px-4 py-1.5 sm:px-6 sm:py-2.5 bg-white text-black text-[8px] sm:text-[10px] font-bold rounded shadow-lg shadow-white/10">Empezar a Crear</div>
        <div className="px-4 py-1.5 sm:px-6 sm:py-2.5 border border-white/20 text-white text-[8px] sm:text-[10px] font-bold rounded">Leer los Docs</div>
      </div>
    </div>
  </div>
);

const MockupPets = () => (
  <div className="w-full h-full bg-[#faf9f6] flex flex-col relative overflow-hidden text-left font-sans">
    {/* Decorative shape */}
    <div className="absolute top-0 right-0 w-2/5 h-full bg-orange-100/50 rounded-l-[40px] sm:rounded-l-[80px]"></div>
    {/* Navbar */}
    <div className="flex justify-between items-center p-3 sm:px-6 sm:py-4 shrink-0 relative z-10 w-full">
      <div className="font-black text-slate-800 text-[10px] sm:text-sm tracking-tighter leading-none flex items-center gap-1.5">
        <svg className="w-3 h-3 sm:w-4 sm:h-4 text-orange-500" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2c-5.33 0-8 3.48-8 6.07 0 2 1.63 4 3 6.93 1.09 2.34 2.22 5 2.22 7h5.56c0-2 1.13-4.66 2.22-7 1.37-2.93 3-4.93 3-6.93C20 5.48 17.33 2 12 2zm-2.5 13c-.83 0-1.5-.67-1.5-1.5S8.67 12 9.5 12s1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm5 0c-.83 0-1.5-.67-1.5-1.5S13.67 12 14.5 12s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/></svg> 
        Pata<span className="text-orange-500">Feliz</span>
      </div>
      <div className="px-3 sm:px-4 py-1 sm:py-1.5 bg-orange-500 rounded-full text-white text-[8px] sm:text-[10px] font-bold">Agendar Paseo</div>
    </div>
    {/* Hero */}
    <div className="flex-1 flex items-center p-4 sm:p-8 relative z-10 w-full">
      <div className="w-[55%] sm:w-1/2 pr-2 sm:pr-4">
        <h1 className="text-slate-800 font-extrabold text-sm sm:text-3xl mb-2 sm:mb-4 leading-tight">Diversión garantizada <br className="hidden sm:block" /> para tu mejor amigo</h1>
        <p className="text-slate-500 text-[7px] sm:text-xs mb-4 sm:mb-6 leading-relaxed">Adiestramiento en positivo, paseos activos y guardería premium para que tu mascota sea inmensamente feliz.</p>
        <div className="inline-flex px-4 py-1.5 sm:px-6 sm:py-2.5 bg-orange-500 text-white text-[8px] sm:text-[11px] font-bold rounded-full shadow-lg shadow-orange-500/30 uppercase tracking-wide">Nuestros Servicios</div>
      </div>
      <div className="w-[45%] sm:w-1/2 flex justify-center items-center pl-2">
        {/* Pseudo image replacement */}
        <div className="w-full aspect-[4/3] sm:aspect-square max-w-[160px] sm:max-w-[220px] bg-slate-200 rounded-2xl sm:rounded-[2rem] overflow-hidden relative shadow-2xl">
           <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1505628346881-b72b27e84530?q=80&w=400&auto=format&fit=crop')] bg-cover bg-center"></div>
           <div className="absolute inset-x-0 bottom-0 top-1/2 bg-gradient-to-t from-black/60 to-transparent"></div>
           <div className="absolute bottom-2 sm:bottom-4 left-2 sm:left-4">
             <div className="text-white font-bold text-[7px] sm:text-[11px] leading-tight">Clases Grupales</div>
             <div className="text-orange-300 font-medium text-[5px] sm:text-[9px] mt-1">Ver detalles →</div>
           </div>
        </div>
      </div>
    </div>
  </div>
);

const MockupAgency = () => (
  <div className="w-full h-full bg-[#111] flex flex-col text-center font-serif relative overflow-hidden">
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] aspect-square bg-amber-500/10 blur-[80px] sm:blur-[120px] rounded-full pointer-events-none"></div>
    {/* Navbar */}
    <div className="flex justify-between items-center px-4 sm:px-8 py-3 sm:py-5 shrink-0 relative z-10 w-full border-b border-white/[0.03]">
      <div className="italic text-amber-500 text-[10px] sm:text-sm">Aura.</div>
      <div className="text-[6px] sm:text-[9px] text-gray-500 uppercase tracking-[0.3em]">Estudios &copy;</div>
    </div>
    {/* Hero */}
    <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-8 relative z-10 w-full mb-2">
      <div className="text-amber-500/80 text-[7px] sm:text-[10px] uppercase tracking-[0.3em] mb-3 sm:mb-6">Agencia de Experiencia Digital</div>
      <h1 className="text-white text-xl sm:text-5xl mb-3 sm:mb-6 tracking-wide font-light leading-tight">Eleva tu Marca<br/>Al Siguiente Nivel</h1>
      <p className="text-gray-400 text-[8px] sm:text-sm max-w-[220px] sm:max-w-md mb-6 sm:mb-10 font-sans font-light leading-relaxed">Experiencias digitales galardonadas para marcas de lujo, clientela exclusiva y visionarios redefiniendo sus industrias.</p>
      <div className="px-5 py-2 sm:px-8 sm:py-3 border border-amber-500/50 text-amber-500 text-[7px] sm:text-[11px] uppercase tracking-widest rounded flex items-center justify-center hover:bg-amber-500 hover:text-black transition-colors font-sans font-bold">Ver Portafolio</div>
    </div>
  </div>
);

const MockupDental = () => (
  <div className="w-full h-full bg-slate-50 flex flex-col font-sans relative overflow-hidden">
    {/* Decorative medical glow */}
    <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[120%] bg-blue-100/50 blur-[60px] rounded-full pointer-events-none"></div>
    <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[120%] bg-cyan-100/50 blur-[60px] rounded-full pointer-events-none"></div>
    
    {/* Navbar */}
    <div className="flex justify-between items-center px-4 sm:px-6 py-3 sm:py-4 shrink-0 relative z-10 w-full bg-white/80 backdrop-blur-md border-b border-slate-200/50">
      <div className="font-sans font-black text-slate-800 text-[10px] sm:text-sm tracking-tight flex items-center gap-1.5">
        <svg className="w-3 h-3 sm:w-5 sm:h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path></svg>
        Sonrisa<span className="text-blue-600 font-light">Perfecta</span>
      </div>
      <div className="flex gap-2 sm:gap-4 items-center">
        <div className="hidden sm:block text-slate-500 font-medium text-[8px] sm:text-[10px]">Tratamientos</div>
        <div className="hidden sm:block text-slate-500 font-medium text-[8px] sm:text-[10px]">Especialistas</div>
        <div className="px-3 sm:px-4 py-1 sm:py-1.5 bg-blue-600 rounded text-white text-[8px] sm:text-[10px] font-bold shadow-md shadow-blue-600/20 cursor-default">Cita Online</div>
      </div>
    </div>
    
    {/* Hero */}
    <div className="flex-1 flex items-center p-4 sm:p-8 relative z-10 w-full space-x-2 sm:space-x-4">
      <div className="w-[55%] sm:w-1/2 flex flex-col justify-center">
        <div className="inline-flex items-center gap-1 sm:gap-2 px-2 py-0.5 sm:px-3 sm:py-1 bg-cyan-50 border border-cyan-100 rounded-full mb-3 sm:mb-5 max-w-max">
          <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-cyan-500 rounded-full animate-pulse"></div>
          <span className="text-cyan-800 text-[6px] sm:text-[8px] font-bold uppercase tracking-wider">Tecnología Láser 3D</span>
        </div>
        <h1 className="text-slate-900 font-extrabold text-xs sm:text-3xl mb-2 sm:mb-4 leading-tight tracking-tight">El arte de diseñar <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">sonrisas perfectas.</span></h1>
        <p className="text-slate-500 text-[6px] sm:text-[10px] mb-4 sm:mb-6 leading-relaxed max-w-[90%]">Especialistas en odontología estética e implantes premium. Entorno relajante, sin dolor y con resultados que cambiarán tu vida desde la primera sesión.</p>
        <div className="flex gap-2">
           <div className="px-4 py-1.5 sm:px-6 sm:py-2.5 bg-slate-900 text-white text-[8px] sm:text-[11px] font-bold rounded-lg shadow-xl shadow-slate-900/20 cursor-default">Ver Tratamientos</div>
        </div>
      </div>
      <div className="w-[45%] sm:w-1/2 flex justify-end items-center relative">
        {/* Floating Patient Review */}
        <div className="absolute top-[-10px] right-2 sm:right-10 bg-white p-1.5 sm:p-3 rounded-xl shadow-xl z-20 flex flex-col gap-1 transform translate-y-4">
           <div className="flex text-yellow-500 text-[6px] sm:text-xs">★★★★★</div>
           <div className="text-slate-800 font-bold text-[5px] sm:text-[8px]">"Increíble clínica"</div>
        </div>
        
        {/* Pseudo image */}
        <div className="w-full aspect-square max-w-[140px] sm:max-w-[240px] bg-slate-200 rounded-2xl sm:rounded-[2rem] overflow-hidden relative shadow-2xl border-4 border-white">
           <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1606811841689-23dfddce3e95?q=80&w=400&auto=format&fit=crop')] bg-cover bg-center"></div>
        </div>
      </div>
    </div>
  </div>
);

export default function LandingPageService() {
  return (
    <main className="flex min-h-dvh flex-col bg-[#07080c] text-white pt-32 pb-20 overflow-hidden relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-[#07080c] to-[#07080c] -z-10" />

      <div className="max-w-6xl mx-auto px-4 md:px-10 w-full relative z-10">
        
        {/* Header Section */}
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="mb-24 text-center flex flex-col items-center"
        >
          <motion.div variants={fadeIn} className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full border border-primary/20 bg-primary/5 backdrop-blur-md">
            <Target className="text-primary w-4 h-4" />
            <span className="text-xs font-bold text-primary tracking-wider uppercase">El Sistema de Ventas Definitivo</span>
          </motion.div>
          
          <motion.h1 variants={fadeIn} className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter mb-6 text-balance text-white leading-tight">
            Más que una <br className="hidden md:block"/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-primary italic">Landing Page.</span>
          </motion.h1>
          
          <motion.p variants={fadeIn} className="text-lg md:text-xl text-gray-300 max-w-2xl text-center text-balance leading-relaxed">
            No diseñamos "folletos digitales". Insertamos el sistema que le falta a tu negocio para incrementar las ventas, conectar con tu audiencia y convertir simples visitantes en clientes listos para comprar.
          </motion.p>

          <motion.div variants={fadeIn} className="mt-10 flex flex-wrap justify-center gap-4">
             <Link 
                href="#planes" 
                className="inline-flex items-center justify-center min-h-[52px] bg-white text-black px-8 py-4 rounded-full font-bold hover:bg-gray-200 transition-colors focus:ring-2 focus:ring-white focus:outline-none"
             >
                Ver Plan y Precios
             </Link>
             <Link 
                href="https://wa.me/543515555123?text=Hola,%20quiero%20mi%20landing%20page%20para%20mi%20negocio." 
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Agendar llamada estratégica por WhatsApp"
                className="inline-flex items-center justify-center min-h-[52px] bg-primary/10 text-primary border border-primary/20 px-8 py-4 rounded-full font-bold hover:bg-primary/20 transition-colors focus:ring-2 focus:ring-primary focus:outline-none"
             >
                Agendar Llamada <ArrowRight className="ml-2 w-5 h-5" aria-hidden="true" />
             </Link>
          </motion.div>
        </motion.div>

        {/* Floating Mockups / Portfolio Simulator Section */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="mb-32 relative"
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-primary/10 blur-[150px] rounded-full pointer-events-none -z-10" />
          
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Diseños <span className="text-primary italic">Premium</span></h2>
            <p className="text-gray-300">Construidos con la psicología del consumidor en mente.</p>
          </div>

          {/* Marquee Row */}
          <div className="relative w-[100vw] -ml-[50vw] left-1/2 overflow-hidden py-14 flex items-center">
             
             {/* Fade gradients on edges */}
             <div className="absolute inset-y-0 left-0 w-12 sm:w-32 bg-gradient-to-r from-[#07080c] to-transparent z-20 pointer-events-none"></div>
             <div className="absolute inset-y-0 right-0 w-12 sm:w-32 bg-gradient-to-l from-[#07080c] to-transparent z-20 pointer-events-none"></div>

             {/* Infinite slider container */}
             <motion.div
               animate={{ x: ["0%", "-50%"] }}
               transition={{
                 repeat: Infinity,
                 ease: "linear",
                 duration: 40,
               }}
               className="flex gap-8 sm:gap-14 w-max px-4 sm:px-8 items-center"
             >
               {/* Primer bloque (Original) */}
               <DesktopFrame index={0}><MockupSaaS /></DesktopFrame>
               <DesktopFrame index={1}><MockupPets /></DesktopFrame>
               <DesktopFrame index={2}><MockupAgency /></DesktopFrame>
               <DesktopFrame index={3}><MockupDental /></DesktopFrame>
               
               {/* Segundo bloque (Copia exacta para loop infinito suave) */}
               <DesktopFrame index={4}><MockupSaaS /></DesktopFrame>
               <DesktopFrame index={5}><MockupPets /></DesktopFrame>
               <DesktopFrame index={6}><MockupAgency /></DesktopFrame>
               <DesktopFrame index={7}><MockupDental /></DesktopFrame>
             </motion.div>
          </div>
        </motion.div>

        {/* Feature Grid */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-32"
        >
          {[
             { icon: <TrendingUp />, title: "Copywriting Persuasivo", desc: "Redactamos textos enfocados en derribar objeciones y aumentar tu ROI de forma medible." },
             { icon: <Users />, title: "Conexión con tu Audiencia", desc: "Diseño empático que habla directamente a los dolores y deseos de tu cliente ideal." },
             { icon: <Zap />, title: "Carga Ultrarrápida", desc: "Arquitectura moderna para asegurar que no pierdas ventas debidas a lentitud web." },
             { icon: <MousePointerClick />, title: "Arquitectura de Conversión", desc: "Trazamos el viaje del usuario poniendo llamadas a la acción donde generan más impacto." },
             { icon: <Globe />, title: "Dominio & Hosting", desc: "Nos encargamos de toda la infraestructura técnica. Tu sitio siempre seguro y disponible." },
             { icon: <Layout />, title: "100% Personalizado", desc: "No usamos plantillas estándar. Creamos una experiencia a la medida de los objetivos de tu marca." },
          ].map((feature, i) => (
            <motion.div key={i} variants={fadeIn} className="bg-white/[0.03] border border-white/[0.08] p-8 rounded-[2rem] hover:bg-white/[0.06] transition-colors group">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
              <p className="text-gray-300 text-sm leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Pricing Section */}
        <motion.div 
          id="planes"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="mb-32 flex flex-col items-center"
        >
          <div className="max-w-3xl w-full bg-[#07080c] relative rounded-[3rem] p-1 border border-primary/30 overflow-hidden">
             {/* Glow overlay */}
             <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-primary/5 pointer-events-none" />
             
             <div className="bg-black/60 backdrop-blur-xl rounded-[2.8rem] p-8 md:p-12 relative z-10 flex flex-col items-center text-center">
                <span className="px-4 py-1.5 rounded-full bg-primary/20 text-primary text-sm font-bold tracking-wide mb-6">
                   IMPLEMENTACIÓN COMPLETA
                </span>
                <h2 className="text-4xl md:text-5xl font-black mb-4">Sistema de Ventas Web</h2>
                <div className="flex items-baseline gap-2 mb-8">
                   <span className="text-5xl md:text-7xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-primary">$200</span>
                   <span className="text-xl text-gray-400 font-medium">USD</span>
                </div>

                <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-semibold mb-8 border border-primary/20">
                   <CreditCard className="w-4 h-4" />
                   60% Adelanto ($120) / 40% Contraentrega ($80)
                </div>

                <div className="grid md:grid-cols-2 gap-4 w-full text-left mb-10 max-w-2xl mx-auto">
                   {[
                      { text: "Sesión inicial (llamada o formulario) para entender tus dolores, deseos y negocio", icon: <Users className="w-5 h-5" /> },
                      { text: "Diseño Premium Profesional (Solución a medida)", icon: <Layout className="w-5 h-5" /> },
                      { text: "Diseño One-Page", icon: <Target className="w-5 h-5" /> },
                      { text: "+5 Secciones Internas Estratégicas", icon: <CheckCircle2 className="w-5 h-5" /> },
                      { text: "Hosting por 1 Año Incluido", icon: <Globe className="w-5 h-5" /> },
                      { text: "Dominio (.com o .com.ar) 1 Año", icon: <Zap className="w-5 h-5" /> },
                      { text: "Certificado de Seguridad SSL", icon: <Lock className="w-5 h-5" /> },
                      { text: "2 Cuentas de Correo Profesional", icon: <Mail className="w-5 h-5" /> },
                      { text: "Integración con WhatsApp/CRM", icon: <MousePointerClick className="w-5 h-5" /> },
                   ].map((item, idx) => (
                      <div key={idx} className="flex items-start gap-3 p-3 rounded-2xl hover:bg-white/[0.02] transition-colors">
                         <div className="text-primary shrink-0 mt-0.5">{item.icon}</div>
                         <span className="text-gray-200 font-medium">{item.text}</span>
                      </div>
                   ))}
                </div>

                <Link 
                  href="https://wa.me/543515555123?text=Hola,%20quiero%20mi%20landing%20page%20para%20mi%20negocio." 
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Contratar Sistema de Ventas Web"
                  className="w-full md:w-auto inline-flex items-center justify-center gap-2 bg-primary text-black px-10 py-5 rounded-full font-bold text-lg hover:bg-[#aabf08] transition-colors hover:scale-105 min-h-[56px] focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-black"
                >
                  <Zap className="w-5 h-5 fill-current" />
                  Iniciar Proyecto Ahora
                </Link>
             </div>
          </div>
        </motion.div>

        {/* Funnel Section / CTA Final */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="bg-white/[0.02] border border-white/[0.08] rounded-[3rem] p-8 md:p-16 relative overflow-hidden flex flex-col items-center text-center max-w-4xl mx-auto"
        >
          <div className="absolute -top-1/2 left-1/4 w-[600px] h-[600px] bg-primary/10 blur-[130px] rounded-full pointer-events-none" />
          
          <motion.div variants={fadeIn} className="relative z-10">
            <h2 className="text-3xl md:text-5xl font-black text-white mb-6 leading-tight">
              ¿Listo para convertir tus <br />
              <span className="text-primary italic">visitantes en clientes?</span>
            </h2>
            <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
              Una mala presencia online desperdicia cada centavo invertido en tráfico. Nosotros construimos un embudo impecable que retiene la atención y guía al usuario directo hacia la compra.
            </p>
            <Link 
              href="https://wa.me/543515555123?text=Hola,%20quiero%20mi%20landing%20page%20para%20mi%20negocio." 
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Contactar a MYB Digitals por WhatsApp"
              className="inline-flex items-center justify-center gap-2 bg-white text-black px-8 py-4 rounded-full font-bold hover:bg-gray-200 transition-colors hover:scale-105 min-h-[52px]"
            >
              Hablemos de tu Proyecto <ArrowRight size={18} aria-hidden="true" />
            </Link>
          </motion.div>
        </motion.div>

      </div>
    </main>
  );
}
