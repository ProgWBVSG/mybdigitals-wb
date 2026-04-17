"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";

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
      <div className="max-w-5xl mx-auto px-5 md:px-10">

        {/* Back */}
        <Link
          href="/servicios/web/invitaciones"
          className="inline-flex items-center gap-2 text-gray-500 text-sm mb-14 hover:text-white transition-colors group"
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
