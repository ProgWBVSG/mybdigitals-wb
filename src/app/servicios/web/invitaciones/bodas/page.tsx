"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, MessageCircle, Heart, Camera, Gamepad2, CheckCircle, Image as ImageIcon, MapPin, Ticket, Gift, Sparkles } from "lucide-react";
import Image from "next/image";

const WA_LINK =
  "https://wa.me/543515555123?text=Hola!%20quiero%20ver%20dise%C3%B1os%20de%20invitaci%C3%B3n%20para%20mi%20casamiento";

const features = [
  { title: "Álbum Colaborativo", desc: "Tus invitados escanean un QR en la boda para subir sus fotos a un álbum en vivo.", icon: Camera },
  { title: "Dress Code & Gifts", desc: "Reglas de estilo y módulo de Mesa de Regalos con cuenta bancaria para tu luna de miel.", icon: Gift },
  { title: "RSVP Inteligente", desc: "Gestión de confirmaciones, opciones vegetarianas, sin TACC y lista de canciones pedidas.", icon: CheckCircle },
  { title: "Minijuego de Trivia", desc: "¿Quién conoce mejor a los novios? Rompehielo ideal mientras esperan la cena.", icon: Gamepad2 },
  { title: "Carrusel 3D Inmersivo", desc: "Muestra tu book preboda con transiciones y animaciones fluidas 3D increíbles.", icon: ImageIcon },
  { title: "GPS & Cuenta Regresiva", desc: "Mapa directo al salón o iglesia y el reloj midiendo cada segundo para dar el Sí.", icon: MapPin },
  { title: "Ticket VIP Personalizado", desc: "La invitación reconoce el nombre o la familia y les da una bienvenida personalizada.", icon: Ticket },
  { title: "Música Automática", desc: "Esa canción que los identifica suena ni bien abren la tarjeta para entrar en clima.", icon: Sparkles },
];

// Mezcla perfecta: Diseños fotográficos probados + Diseños minimalistas botánicos para los que no tenían foto.
const designs = [
  {
    id: 1, label: "Golden Dusk",
    n1: "Marti & Tomi", date: "15 de Noviembre",
    photo: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80",
    bg: "#ffffff", accent: "#d4af37", text: "#1a1a1a",
    cnt: ["45","12","30","00"],
    font: "Georgia, serif", align: "center", textCase: "uppercase", tracking: "0.15em",
    isMinimalist: false
  },
  {
    id: 2, label: "Ocean Breeze",
    n1: "JULIETA Y MARCOS", date: "22 . 03 . 2026",
    photo: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=600&q=80",
    bg: "#f0f4f8", accent: "#60a5fa", text: "#0f172a",
    cnt: ["120","08","15","40"],
    font: "Arial, sans-serif", align: "flex-start", textCase: "uppercase", tracking: "0.05em",
    isMinimalist: false
  },
  {
    // ROTO PREVIAMENTE -> Nuevo diseño Botánico Acuarela "Lisa & Hernán"
    id: 3, label: "Acuarela Verde",
    n1: "LISA & HERNÁN", date: "NOS CASAMOS",
    bgImage: "https://images.unsplash.com/photo-1596431940984-7eaf9bd80de5?auto=format&fit=crop&w=600&q=80",
    bg: "#fdfbf7", accent: "#4b5548", text: "#4b5548",
    font: "Geist Sans, sans-serif", align: "center", textCase: "uppercase", tracking: "0.2em",
    isMinimalist: true, layoutTemplate: "leaves"
  },
  {
    id: 4, label: "Brindis Gris",
    n1: "Candela & Elías", date: "08 Junio 2025",
    photo: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=600&q=80",
    bg: "#f3f4f6", accent: "#9ca3af", text: "#111827",
    cnt: ["87","11","37","14"],
    font: "Courier New, monospace", align: "center", textCase: "capitalize", tracking: "0.1em",
    isMinimalist: false
  },
  {
    id: 5, label: "Sunset Boho",
    n1: "GEORGINA & JOAQUÍN", date: "30 Agosto 2025",
    photo: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=600&q=80",
    bg: "#fff6f5", accent: "#f0a58f", text: "#4a2c26",
    cnt: null, // "Reserva la fecha"
    font: "Palatino, serif", align: "center", textCase: "uppercase", tracking: "0.05em",
    isMinimalist: false
  },
  {
    // ROTO PREVIAMENTE -> Nuevo diseño Monograma Floral "Stefi y Nico"
    id: 6, label: "Monograma Elegante",
    n1: "STEFI Y NICO", date: "NOS CASAMOS",
    bgImage: "https://images.unsplash.com/photo-1579549321487-3cb83e5a5960?auto=format&fit=crop&w=600&q=80", 
    bg: "#ffffff", accent: "#611a28", text: "#611a28",
    font: "Georgia, serif", align: "center", textCase: "uppercase", tracking: "0.1em",
    isMinimalist: true, layoutTemplate: "monogram", monogram: ["S", "N"]
  },
  {
    // ROTO PREVIAMENTE -> Nuevo diseño Lavanda "Anto & Fer"
    id: 7, label: "Lavanda Clásica",
    n1: "ANTO & FER", date: "NOS CASAMOS",
    bgImage: "https://images.unsplash.com/photo-1543362143-6c84b1ebac1d?auto=format&fit=crop&w=600&q=80",
    bg: "#fcfcff", accent: "#a78bfa", text: "#4a4a4f",
    font: "Arial, sans-serif", align: "center", textCase: "uppercase", tracking: "0.2em",
    isMinimalist: true, layoutTemplate: "lavender"
  },
  {
    id: 8, label: "Minimal Chic",
    n1: "Valentina & Lucas", date: "11 de Octubre",
    photo: "https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=600&q=80",
    bg: "#fafafa", accent: "#cbd5e1", text: "#334155",
    cnt: ["66","10","22","09"],
    font: "Arial, sans-serif", align: "flex-end", textCase: "capitalize", tracking: "0.05em",
    isMinimalist: false
  },
];

type D = typeof designs[0];

function ClassicPhotoPhone({ d }: { d: D }) {
  // @ts-ignore
  const alignItems = d.align === "center" ? "center" : d.align === "flex-start" || d.align === "left" ? "flex-start" : "flex-end";
  return (
    <>
      {/* Mitad superior Fotografía real */}
      <div className="relative w-full overflow-hidden" style={{ height: "45%" }}>
        {d.photo && (
          <Image src={d.photo} alt={d.label} fill className="object-cover" sizes="160px" />
        )}
      </div>

      {/* Mitad inferior Textos (Como al usuario le gustaba) */}
      <div className="w-full flex-1 flex flex-col p-[18px_14px_12px]" style={{ alignItems }}>
        <span 
          style={{ 
            fontFamily: d.font, fontWeight: 600, color: d.text, 
            fontSize: 10, letterSpacing: d.tracking, 
            textAlign: alignItems === "center" ? "center" : alignItems === "flex-start" ? "left" : "right",
            textTransform: d.textCase as any, marginBottom: 6, lineHeight: 1.2
          }}
        >
          {d.n1}
        </span>
        <span 
          style={{ 
            fontFamily: "Georgia, serif", color: "gray", fontSize: 8, letterSpacing: "0.05em",
            marginBottom: d.cnt ? "auto" : 0,
            textAlign: alignItems === "center" ? "center" : alignItems === "flex-start" ? "left" : "right",
          }}
        >
          {d.date}
        </span>

        {/* Cuenta regressiva cuadritos o Save The Date */}
        {d.cnt ? (
          <div className="flex gap-1.5 mt-auto self-center">
            {d.cnt.map((n, j) => (
              <div key={j} className="flex flex-col items-center">
                <p style={{ color: d.text, fontSize: 13, fontWeight: 300, lineHeight: 1 }}>{n}</p>
                <p style={{ color: "#a0a0a0", fontSize: 5, textTransform: "uppercase", marginTop: 2 }}>{["días","hs","min","seg"][j]}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-auto w-full pt-2" style={{ borderTop: `1px solid ${d.accent}40` }}>
            <p style={{ color: d.text, fontSize: 7, textAlign: "center", fontStyle: "italic", textTransform: "uppercase" }}>Reserva la fecha</p>
          </div>
        )}
      </div>

      {/* Franja de Color Inferior */}
      <div className="w-full h-[36px] flex items-center justify-between px-3 mt-auto" style={{ background: d.accent }}>
        <div className="w-3.5 h-3.5 rounded-full border border-white/80 flex items-center justify-center">
          <div className="w-1 h-px bg-white/80" />
        </div>
        <p className="font-semibold tracking-[0.05em] uppercase" style={{ fontSize: 9, color: d.bg === "#ffffff" ? "#fff" : "rgba(255,255,255,0.9)" }}>RSVP</p>
      </div>
    </>
  );
}

function MinimalistBotanicalPhone({ d }: { d: D }) {
  return (
    <>
      {/* Fondo fusionado (acuarela/flores tintadas) */}
      {d.bgImage && (
        <div className="absolute inset-0 opacity-25 mix-blend-multiply flex items-center justify-center pointer-events-none"
             style={{ padding: d.layoutTemplate === "lavender" ? "0 0 50% 0" : "0" }}>
           <Image src={d.bgImage} alt="Decor" fill className="object-cover" sizes="160px" />
        </div>
      )}

      {/* Contenido Minimalista Centrado */}
      <div className="relative z-10 w-full h-full flex flex-col items-center justify-center text-center p-4 gap-3">
        {/* Monograma S N */}
        {d.layoutTemplate === "monogram" && d.monogram && (
          <div className="flex items-center justify-center mb-1 w-full">
             <span style={{ fontSize: 40, fontFamily: "Georgia, serif", color: d.text, marginRight: 8, lineHeight: 1 }}>{d.monogram[0]}</span>
             <div style={{ width: 1, height: 40, background: d.text, opacity: 0.5 }} />
             <span style={{ fontSize: 40, fontFamily: "Georgia, serif", color: d.text, marginLeft: 8, lineHeight: 1 }}>{d.monogram[1]}</span>
          </div>
        )}

        <div className="flex flex-col items-center gap-1.5">
          <h3 style={{ fontFamily: d.font, color: d.text, fontSize: d.layoutTemplate === "monogram" ? 12 : 14, letterSpacing: d.tracking, textTransform: d.textCase as any, lineHeight: 1.1 }}>
            {d.n1}
          </h3>
          <p style={{ fontFamily: "Arial, sans-serif", color: d.text, opacity: 0.6, fontSize: 7, letterSpacing: "0.15em", textTransform: "uppercase" }}>
            {d.date}
          </p>
        </div>

        {/* Botoncito Estilo Pause Abajo a la Derecha */}
        <div className="absolute bottom-4 right-4 w-6 h-6 rounded-full bg-stone-800/80 flex items-center justify-center pointer-events-none">
           <div className="w-1.5 h-1.5 bg-white rounded-sm" />
        </div>
      </div>
    </>
  );
}

function PhoneCard({ d, i }: { d: D; i: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: i * 0.05, duration: 0.6, ease: "easeOut" }}
      className="flex flex-col items-center gap-4 group"
    >
      <Link 
        href={`/servicios/web/invitaciones/demo/${d.id}?t=bodas`}
        className="block transition-transform duration-300 hover:-translate-y-2 hover:scale-[1.02]"
        aria-label={`Ver invitación ${d.label}`}
      >
        <div
          className="relative flex flex-col items-center justify-start overflow-hidden bg-background"
          style={{
            width: 160,
            height: 320,
            borderRadius: "1.8rem",
            border: `3px solid #1a1a1a`,
            boxShadow: `0 32px 64px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.05)`,
            background: d.bg,
          }}
        >
          {/* Notch superior simulado */}
          <div className="absolute top-0 inset-x-0 z-20 flex justify-center pt-2 pb-1 bg-gradient-to-b from-black/20 to-transparent">
            <div style={{ width: 50, height: 12, borderRadius: 6, background: "#000" }} aria-hidden="true" />
          </div>

          {d.isMinimalist ? <MinimalistBotanicalPhone d={d} /> : <ClassicPhotoPhone d={d} />}

        </div>
      </Link>
      
      {/* Label outside the phone */}
      <div className="text-center transition-colors group-hover:text-primary mt-2">
        <p className="text-white text-[11px] uppercase tracking-wider font-semibold">{d.label}</p>
      </div>
    </motion.div>
  );
}
export default function BodasPage() {
  return (
    <main className="min-h-screen bg-background pt-28 pb-24">
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Great+Vibes&display=swap');`}</style>

      {/* ── HERO BANNER (BODAS) ── */}
      <div className="w-full relative flex flex-col items-center overflow-hidden mb-12">
         {/* Top Bar Promocional */}
         <div className="w-full bg-[#f43f5e] py-3 z-30 flex justify-center items-center gap-2 md:gap-4 shadow-sm relative">
           <span className="text-xl md:text-2xl text-white" style={{ fontFamily: "'Great Vibes', cursive" }}>Love is in the air</span>
           <span className="font-bold text-[10px] md:text-xs tracking-widest text-white uppercase ml-2">Promo Bodas</span>
           <a href={WA_LINK} target="_blank" rel="noopener noreferrer" className="text-[10px] md:text-xs text-white border-b border-white/60 pb-0.5 hover:text-rose-200 transition-colors font-semibold">
             (Solicitar)
           </a>
         </div>

         {/* Contenedor Visual (Imagen + Textos) */}
         <div className="relative w-full h-[70vh] min-h-[500px] flex flex-col justify-center items-center px-4">
            {/* Imagen de Fondo (Escala de Grises - Pareja casándose) */}
            <div className="absolute inset-0 w-full h-full z-0">
               <Image 
                  src="https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1920&q=80" 
                  alt="Casamiento Hero Bodas" 
                  fill 
                  className="object-cover object-center grayscale opacity-75" 
               />
               <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/50 to-background" />
            </div>

            {/* Contenido Central */}
            <div className="relative z-20 flex flex-col items-center text-center w-full max-w-5xl mt-8">
               <p className="text-[10px] md:text-xs font-black tracking-[0.3em] uppercase text-zinc-300 mb-6 drop-shadow-md">
                 COLECCIÓN NUPCIAL — INVITACIONES WEB
               </p>
               
               <h1 className="text-[1.8rem] sm:text-4xl md:text-6xl lg:text-[5.5rem] font-black italic uppercase text-white leading-tight tracking-normal mb-6 w-full px-2 whitespace-nowrap" style={{ textShadow: "0 10px 40px rgba(0,0,0,0.8)" }}>
                 El <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-fuchsia-300">amor</span> merece <br /> una <span className="text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-300 to-rose-400">invitación digna</span>
               </h1>
               
               <p className="text-sm md:text-base font-medium tracking-[0.2em] uppercase text-zinc-200 mb-10 mt-2 drop-shadow-md">
                 Porque es uno de los días más importantes de tu vida
               </p>
               
               <a href={WA_LINK} target="_blank" rel="noopener noreferrer" className="bg-[#f43f5e] hover:bg-[#e11d48] text-white px-8 py-4 rounded-md font-bold text-xs uppercase tracking-widest flex items-center gap-3 transition-colors shadow-[0_0_20px_rgba(244,63,94,0.3)]">
                 Reservar nuestra fecha
                 <Heart size={18} fill="currentColor" />
               </a>
            </div>
         </div>
      </div>

      {/* Grid de Funcionalidades */}
      <div className="max-w-6xl mx-auto px-5 md:px-10 mb-24">
         <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-black text-white mb-4">Módulo Nupcial <span className="text-[#f43f5e]">All-Inclusive</span></h2>
            <p className="text-zinc-400 max-w-xl mx-auto">No pagues extras ocultos. Tu invitación viene completamente equipada con <strong className="text-white">todas estas funcionalidades premium</strong> por un precio plano.</p>
         </div>

         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {features.map((f, i) => {
               const Icon = f.icon;
               return (
                 <div key={i} className="bg-white/5 border border-white/5 backdrop-blur-sm rounded-2xl p-6 transition-all hover:-translate-y-1 hover:bg-white/[0.07] hover:border-[#f43f5e]/30 group">
                    <div className="w-12 h-12 rounded-xl bg-black/40 flex items-center justify-center border border-white/10 mb-5 group-hover:bg-[#f43f5e]/10 group-hover:border-[#f43f5e]/50 transition-colors">
                       <Icon size={22} className="text-zinc-400 group-hover:text-[#f43f5e] transition-colors" />
                    </div>
                    <h3 className="text-white font-bold text-lg mb-2">{f.title}</h3>
                    <p className="text-zinc-500 text-sm leading-relaxed">{f.desc}</p>
                 </div>
               )
            })}
         </div>
      </div>

      <div className="max-w-5xl mx-auto px-5 md:px-10 text-center">

        {/* Back */}
        <Link
          href="/servicios/web/invitaciones"
          className="inline-flex items-center gap-2 text-gray-500 text-sm mb-14 hover:text-white transition-colors group mx-auto"
        >
          <ArrowLeft size={15} className="group-hover:-translate-x-1 transition-transform" aria-hidden="true" />
          Volver a Invitaciones
        </Link>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65 }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-rose-500/8 border border-rose-500/20 mb-5">
            <span className="text-xs font-black text-rose-300 tracking-widest uppercase">Colección Bodas</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4 leading-tight tracking-tight">
            Tarjetas de Casamiento<br/>
            <span
              style={{
                background: "linear-gradient(135deg, #f43f5e, #fda4af)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Premium
            </span>
          </h1>
          <p className="text-gray-400 max-w-lg mx-auto text-sm leading-relaxed">
            Una colección ecléctica combinando nuestra tarjetería fotográfica clásica con nuevos diseños editoriales, botánicos y minimalistas. Haz click para ver las Demos.
          </p>
        </motion.div>

        {/* Phone grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-x-8 gap-y-16 justify-items-center mb-24">
          {designs.map((d, i) => (
            <PhoneCard key={d.id} d={d} i={i} />
          ))}
        </div>

      </div>
    </main>
  );
}
