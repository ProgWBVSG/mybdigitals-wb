"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, MessageCircle, PartyPopper, Crown, Music, Camera, Gamepad2, CheckCircle, Image as ImageIcon, MapPin, Ticket, Gift, Sparkles } from "lucide-react";
import Image from "next/image";

const WA_LINK =
  "https://wa.me/543515555123?text=Hola!%20quiero%20ver%20dise%C3%B1os%20de%20invitaci%C3%B3n%20para%20mis%2015%20a%C3%B1os";

const designs = [
  {
    id: 1, label: "Fiesta Neón",
    n1: "MÍA", date: "10 . 12 . 2025",
    photo: "https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&w=600&q=80",
    bg: "#09090b", accent: "#a855f7", text: "#fafafa",
    cnt: ["45","12","30","00"],
    font: "Arial, sans-serif", align: "center", textCase: "uppercase", tracking: "0.2em"
  },
  {
    id: 2, label: "Boho Chic",
    n1: "Delfina", date: "24 . 05 . 2025",
    photo: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=600&q=80",
    bg: "#ffffff", accent: "#eaac8b", text: "#1a1a1a",
    cnt: ["88","10","15","40"],
    font: "Georgia, serif", align: "flex-start", textCase: "capitalize", tracking: "0.05em"
  },
  {
    id: 3, label: "Golden Sweet",
    n1: "Valentina", date: "15 Agosto",
    icon: <Crown size={42} strokeWidth={1.2} color="#eab308" />,
    bg: "#fefce8", accent: "#eab308", text: "#713f12",
    cnt: null, // Sin contador para romper esquema visual
    font: "Palatino, serif", align: "center", textCase: "uppercase", tracking: "0.15em"
  },
  {
    id: 4, label: "Gala Rosa",
    n1: "Camila's 15", date: "20 Sep 2025",
    photo: "https://images.unsplash.com/photo-1516054575922-f0b8eeadec1a?auto=format&fit=crop&w=600&q=80",
    bg: "#fff1f2", accent: "#f43f5e", text: "#881337",
    cnt: ["60","14","20","10"],
    font: "Courier New, monospace", align: "flex-end", textCase: "uppercase", tracking: "0.05em"
  },
  {
    id: 5, label: "Urbano",
    n1: "Martina", date: "05 . 02 . 2026",
    photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=600&q=80",
    bg: "#f8fafc", accent: "#3b82f6", text: "#0f172a",
    cnt: ["22","09","10","05"],
    font: "Trebuchet MS, sans-serif", align: "center", textCase: "lowercase", tracking: "0.15em"
  },
  {
    id: 6, label: "DJ Party",
    n1: "L U N A", date: "18 Octubre",
    icon: <Music size={42} strokeWidth={1} color="#818cf8" />,
    bg: "#eef2ff", accent: "#818cf8", text: "#312e81",
    cnt: ["150","16","05","50"],
    font: "Inter, sans-serif", align: "center", textCase: "uppercase", tracking: "0.3em"
  },
  {
    id: 7, label: "Balloons Pop",
    n1: "Sol", date: "12 Enero 2026",
    icon: <PartyPopper size={42} strokeWidth={1} color="#db2777" />,
    bg: "#fdf2f8", accent: "#db2777", text: "#831843",
    cnt: null, // Minimalista
    font: "Georgia, serif", align: "flex-start", textCase: "capitalize", tracking: "0.05em"
  },
  {
    id: 8, label: "Aesthetic",
    n1: "Renata's XV", date: "28 . 11 . 2025",
    photo: "https://images.unsplash.com/photo-1532453288672-3a27e9be9efd?auto=format&fit=crop&w=600&q=80",
    bg: "#ffffff", accent: "#ea580c", text: "#1a1a1a",
    cnt: ["190","20","15","00"],
    font: "Arial, sans-serif", align: "center", textCase: "uppercase", tracking: "0.1em"
  },
];

type D = typeof designs[0];

function PhoneCard({ d, i }: { d: D; i: number }) {
  // @ts-ignore
  const alignItems = d.align === "center" ? "center" : d.align === "flex-start" || d.align === "left" ? "flex-start" : "flex-end";

  // ESPECIAL DISEÑO 1: URBANO / NEÓN (PANTALLA COMPLETA)
  if (d.id === 1) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: i * 0.05, duration: 0.6, ease: "easeOut" }}
        className="flex flex-col items-center gap-4 group"
      >
        <Link 
          href={`/servicios/web/invitaciones/demo/${d.id}?t=cumples`} 
          className="block transition-transform duration-300 hover:-translate-y-2 hover:scale-[1.02]"
        >
          <div
            className="relative"
            style={{
              width: 160, height: 320, borderRadius: "1.8rem",
              border: `2px solid ${d.accent}80`,
              boxShadow: `0 0 25px ${d.accent}40, inset 0 0 15px ${d.accent}40`,
              overflow: "hidden", background: "#000",
            }}
          >
            {/* Notch */}
            <div className="absolute top-0 inset-x-0 z-30 flex justify-center pt-2">
              <div style={{ width: 40, height: 10, borderRadius: 5, background: "#000", border: "1px solid #333" }} />
            </div>

            {/* FULL BACKGROUND PHOTO */}
            {d.photo && (
              <div className="absolute inset-0 z-0">
                <Image src={d.photo} alt={d.label} fill className="object-cover opacity-60 mix-blend-luminosity" sizes="160px" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
              </div>
            )}

            {/* NEON CONTENT */}
            <div className="relative z-10 w-full h-full flex flex-col items-center justify-end pb-6 px-3">
              {/* TOP BADGE */}
              <div className="absolute top-8 right-3 px-2 py-1 bg-black/50 backdrop-blur-md rounded border" style={{ borderColor: d.accent }}>
                <span className="text-[6px] font-black text-white tracking-widest uppercase">VIP PASS</span>
              </div>

              {/* HUGE GLOWING TITLE */}
              <div className="text-center mb-4 w-full">
                <span style={{ fontSize: 8, color: "white", letterSpacing: "0.4em", textTransform: "uppercase", display: "block", marginBottom: 2 }}>Mis 15</span>
                <span style={{ 
                  fontFamily: d.font, fontSize: 26, fontWeight: 900, color: d.text, 
                  textTransform: "uppercase", letterSpacing: "0.1em", lineHeight: 1,
                  textShadow: `0 0 10px ${d.accent}, 0 0 20px ${d.accent}, 0 0 40px ${d.accent}` 
                }}
                >
                  {d.n1}
                </span>
                <span style={{ fontSize: 9, color: d.accent, fontWeight: 700, letterSpacing: "0.2em", display: "block", marginTop: 4 }}>
                  {d.date}
                </span>
              </div>

              {/* FLOATING COUNTDOWN NEON STYLE */}
              {d.cnt && (
                <div className="flex gap-2 mb-4">
                  {d.cnt.map((n, j) => (
                    <div key={j} className="flex flex-col items-center justify-center bg-black/60 backdrop-blur-md rounded-lg border" style={{ borderColor: `${d.accent}50`, width: 26, height: 32 }}>
                      <span style={{ color: "white", fontSize: 10, fontWeight: 800 }}>{n}</span>
                      <span style={{ color: d.accent, fontSize: 4, textTransform: "uppercase", fontWeight: 700 }}>{["días","hs","mn","sg"][j]}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* NEON BUTTON */}
              <div className="w-full py-2 rounded-full flex items-center justify-center cursor-pointer" style={{ background: d.accent, boxShadow: `0 0 15px ${d.accent}` }}>
                <span style={{ fontSize: 8, color: "black", fontWeight: 900, letterSpacing: "0.1em" }}>CONFIRMAR ASISTENCIA</span>
              </div>
            </div>
          </div>
        </Link>
        <div className="text-center font-bold text-xs" style={{ color: d.accent }}>
          <span className="animate-pulse mr-1">●</span> {d.label}
        </div>
      </motion.div>
    );
  }

  // DISEÑO ESTÁNDAR PARA EL RESTO (CON MARCA DE AGUA)
  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: i * 0.05, duration: 0.6, ease: "easeOut" }}
      className="flex flex-col items-center gap-4 group"
    >
      <Link 
        href={`/servicios/web/invitaciones/demo/${d.id}?t=cumples`} 
        className="block transition-transform duration-300 hover:-translate-y-2 hover:scale-[1.02]"
        aria-label={`Ver invitación ${d.label}`}
      >
        {/* Phone shell */}
        <div
          className="relative"
          style={{
            width: 160,
            height: 320,
            borderRadius: "1.8rem",
            border: `3px solid #1a1a1a`,
            boxShadow: `0 32px 64px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.05)`,
            overflow: "hidden",
            background: d.bg,
            display: "flex",
            flexDirection: "column"
          }}
        >
          {/* XV Watermark Background */}
          <div className="absolute inset-0 flex items-center justify-center opacity-[0.04] pointer-events-none z-0 overflow-hidden">
             <span className="text-[12rem] font-black tracking-tighter" style={{ color: d.text }}>15</span>
          </div>

          {/* Notch overlay */}
          <div className="absolute top-0 inset-x-0 z-20 flex justify-center pt-2 pb-1 bg-gradient-to-b from-black/40 to-transparent">
            <div style={{ width: 50, height: 12, borderRadius: 6, background: "#000" }} aria-hidden="true" />
          </div>

          {/* Hero Section (Photo or Icon) - Takes up top 45% */}
          {d.photo ? (
            <div style={{ position: "relative", height: "45%", width: "100%", overflow: "hidden" }}>
              <div className="absolute inset-0 z-10 bg-gradient-to-t from-[rgba(0,0,0,0.4)] to-transparent" />
              <Image
                src={d.photo}
                alt={d.label}
                fill
                className="object-cover"
                sizes="160px"
              />
              {/* Cute floating badge for 15s */}
              <div className="absolute top-8 left-3 z-20 bg-white/20 backdrop-blur-md border border-white/40 px-2 py-0.5 rounded-full">
                <span className="text-[6px] font-black text-white tracking-widest uppercase">XV Años</span>
              </div>
            </div>
          ) : (
            <div style={{ position: "relative", height: "45%", width: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.02)", borderBottom: "1px solid rgba(0,0,0,0.03)" }}>
              {d.icon}
               <div className="absolute top-8 left-3 z-20 bg-white/20 backdrop-blur-md border border-white/40 px-2 py-0.5 rounded-full">
                <span className="text-[6px] font-black text-black tracking-widest uppercase">My 15th</span>
              </div>
            </div>
          )}

          {/* Bottom Section - Dynamic align and typography */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: alignItems, padding: "18px 14px 12px", width: "100%", zIndex: 10 }}>
            {/* Added "Mis 15" small title to enforce the birthday vibe */}
            <span style={{ fontSize: 7, color: d.accent, fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 3 }}>
               Mis 15
            </span>
            <span 
              style={{ 
                fontFamily: d.font, 
                fontWeight: 600, 
                color: d.text, 
                fontSize: 10, 
                letterSpacing: d.tracking,
                textAlign: alignItems === "center" ? "center" : alignItems === "flex-start" ? "left" : "right",
                textTransform: d.textCase as any,
                marginBottom: 6,
                lineHeight: 1.1,
              }}
            >
              {d.n1}
            </span>
            
            <span 
              style={{ 
                fontFamily: "Georgia, serif", 
                color: d.text, 
                opacity: 0.6,
                fontSize: 8, 
                letterSpacing: "0.05em",
                marginBottom: d.cnt ? "auto" : 0,
                textAlign: alignItems === "center" ? "center" : alignItems === "flex-start" ? "left" : "right",
              }}
            >
              {d.date}
            </span>

            {/* Conditional Minimalist Countdown */}
            {d.cnt && (
              <div style={{ display: "flex", gap: 6, marginTop: "auto", alignSelf: "center", background: `${d.accent}15`, padding: "4px 8px", borderRadius: 8, border: `1px solid ${d.accent}30` }}>
                {d.cnt.map((n, j) => (
                  <div key={j} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <p style={{ color: d.text, fontSize: 11, fontWeight: 800, textAlign: "center", lineHeight: 1 }}>{n}</p>
                    <p style={{ color: d.text, opacity: 0.5, fontSize: 5, textAlign: "center", textTransform: "uppercase", marginTop: 2 }}>{["días","hs","min","seg"][j]}</p>
                  </div>
                ))}
              </div>
            )}
            {!d.cnt && (
               <div style={{ marginTop: "auto", borderTop: `1px dashed ${d.accent}60`, paddingTop: 8, width: "100%" }}>
                  <p style={{ color: d.text, fontSize: 7, textAlign: "center", fontStyle: "italic", fontWeight: 700 }}>¡Te espero con ansias!</p>
               </div>
            )}
          </div>

          {/* Bottom accented color bar */}
          <div style={{ 
            height: "36px", 
            background: d.accent, 
            width: "100%", 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "space-between",
            padding: "0 14px",
            marginTop: "auto"
          }}>
            <div style={{ display: "flex", gap: 2 }}>
               <span style={{ fontSize: 10 }}>✨</span>
            </div>
            <p style={{ fontSize: 9, color: d.bg === "#ffffff" ? "#fff" : "rgba(255,255,255,0.9)", fontWeight: 800, letterSpacing: "0.1em" }}>CONFIRMAR</p>
          </div>

        </div>
      </Link>

      {/* Label outside the phone */}
      <div className="text-center transition-colors group-hover:text-primary">
        <p className="text-white text-[11px] uppercase tracking-wider font-semibold">{d.label}</p>
      </div>
    </motion.div>
  );
}

const features = [
  { title: "Álbum Colaborativo", desc: "Tus invitados escanean un QR en la fiesta para subir sus fotos a un álbum en vivo.", icon: Camera },
  { title: "Minijuego de Trivia", desc: "¿Quién conoce mejor a la cumpleañera? Divertí a todos con preguntas personalizadas.", icon: Gamepad2 },
  { title: "RSVP Inteligente", desc: "Gestión de asistencias, opciones vegetarianas, sin TACC y lista de canciones pedidas.", icon: CheckCircle },
  { title: "Carrusel 3D Inmersivo", desc: "Mostrá tu Book de fotos con diseños 3D dinámicos que se mueven con la pantalla.", icon: ImageIcon },
  { title: "Ticket de Entrada VIP", desc: "Tu invitación reconoce el nombre de quién la abre y le da su propia animación VIP.", icon: Ticket },
  { title: "GPS & Cuenta Regresiva", desc: "Navegación directa con Google Maps y reloj en tiempo real para que empiece la magia.", icon: MapPin },
  { title: "Mesa de Regalos Online", desc: "Módulo privado y elegante con CBU/Alias para facilitar tu regalito deseado.", icon: Gift },
  { title: "Dress Code & Música", desc: "Canción de fondo que arranca sola y moodboards para definir las reglas de estilo.", icon: Sparkles },
];

export default function CumplesPage() {
  return (
    <main className="min-h-screen bg-background pt-28 pb-24">
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Great+Vibes&display=swap');`}</style>

      {/* ── HERO BANNER (15 AÑOS) ── */}
      <div className="w-full relative flex flex-col items-center overflow-hidden mb-16">
         {/* Top Bar Promocional (En flujo normal, empuja el resto abajo) */}
         <div className="w-full bg-[#c0ff00] py-3 z-30 flex justify-center items-center gap-2 md:gap-4 shadow-sm relative">
           <span className="text-xl md:text-2xl text-black" style={{ fontFamily: "'Great Vibes', cursive" }}>Save the date</span>
           <span className="font-bold text-[10px] md:text-xs tracking-widest text-black uppercase ml-2">50% OFF</span>
           <a href={WA_LINK} target="_blank" rel="noopener noreferrer" className="text-[10px] md:text-xs text-black border-b border-black/60 pb-0.5 hover:text-zinc-700 hover:border-zinc-700 transition-colors font-semibold">
             (Clic aquí)
           </a>
         </div>

         {/* Contenedor Visual (Imagen + Textos) */}
         <div className="relative w-full h-[70vh] min-h-[500px] flex flex-col justify-center items-center px-4">
            {/* Imagen de Fondo (Escala de Grises) */}
            <div className="absolute inset-0 w-full h-full z-0">
               <Image 
                  src="https://gregdotel.com/wp-content/uploads/2023/05/15-Carismell_GDP3220_15-anos-jardin-botanico-quinceaneras-republica-dominicana-santo-domingo_Greg-Dotel_1.jpg" 
                  alt="Quinceañera en jardín botánico" 
                  fill 
                  className="object-cover object-top grayscale opacity-80" 
               />
               <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/60 to-background" />
            </div>

            {/* Contenido Central */}
            <div className="relative z-20 flex flex-col items-center text-center w-full max-w-5xl mt-8">
               <p className="text-[10px] md:text-xs font-black tracking-[0.3em] uppercase text-zinc-300 mb-6 drop-shadow-md">
                 LA TARJETA DIGITAL — INVITACIONES WEB
               </p>
               
               <h1 className="text-[1.8rem] sm:text-4xl md:text-6xl lg:text-[5.5rem] font-black italic uppercase text-white leading-tight tracking-normal mb-6 w-full px-2 whitespace-nowrap" style={{ textShadow: "0 10px 40px rgba(0,0,0,0.8)" }}>
                 Tus XV merecen <br /> una invitación única
               </h1>
               
               <p className="text-sm md:text-base font-medium tracking-[0.2em] uppercase text-zinc-200 mb-10 mt-2 drop-shadow-md">
                 Sorprendé a todos desde el primer instante
               </p>
               
               <a href={WA_LINK} target="_blank" rel="noopener noreferrer" className="bg-[#c0ff00] hover:bg-[#a3d900] text-black px-8 py-4 rounded-md font-bold text-xs uppercase tracking-widest flex items-center gap-3 transition-colors shadow-[0_0_20px_rgba(192,255,0,0.3)]">
                 Reservar mi diseño
                 <MessageCircle size={18} />
               </a>
            </div>
         </div>
      </div>

      <div className="max-w-6xl mx-auto px-5 md:px-10 mb-24">
         <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-black text-white mb-4">Un paquete <span className="text-[#c0ff00]">Premium All-Inclusive</span></h2>
            <p className="text-zinc-400 max-w-xl mx-auto">Otras agencias te cobran hasta por agregar una foto. Nosotros armamos tu tarjeta entregándote <strong className="text-white">todo el ecosistema digital</strong> por un precio plano. Sin trampas.</p>
         </div>

         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {features.map((f, i) => {
               const Icon = f.icon;
               return (
                 <div key={i} className="bg-white/5 border border-white/5 backdrop-blur-sm rounded-2xl p-6 transition-all hover:-translate-y-1 hover:bg-white/[0.07] hover:border-[#c0ff00]/30 group">
                    <div className="w-12 h-12 rounded-xl bg-black/40 flex items-center justify-center border border-white/10 mb-5 group-hover:bg-[#c0ff00]/10 group-hover:border-[#c0ff00]/50 transition-colors">
                       <Icon size={22} className="text-zinc-400 group-hover:text-[#c0ff00] transition-colors" />
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
          className="inline-flex items-center justify-center gap-2 text-gray-500 text-sm mb-14 hover:text-white transition-colors group mx-auto"
        >
          <ArrowLeft size={15} className="group-hover:-translate-x-1 transition-transform" aria-hidden="true" />
          Volver a Invitaciones
        </Link>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/8 border border-violet-500/20 mb-5">
            <PartyPopper size={13} className="text-violet-400" aria-hidden="true" />
            <span className="text-xs font-black text-violet-300 tracking-widest uppercase">15s y Cumpleaños</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4 leading-tight">
            Tarjetas para un{" "}
            <span
              style={{
                background: "linear-gradient(135deg, #a78bfa, #f472b6)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Cumple inolvidable
            </span>
          </h1>
          <p className="text-gray-400 max-w-lg mx-auto text-sm leading-relaxed">
            Explorá los estilos más elegidos. <strong className="text-white">Lo adaptamos 100% a la cumpleañera</strong>: desde fotos tipo book, hasta distintas organizaciones de texto y diagramación. 
          </p>
        </motion.div>

        {/* Phone grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-x-6 gap-y-14 justify-items-center mb-24">
          {designs.map((d, i) => (
            <PhoneCard key={d.id} d={d} i={i} />
          ))}
        </div>

      </div>
    </main>
  );
}
