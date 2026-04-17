"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, MessageCircle, PartyPopper, Crown, Music } from "lucide-react";
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
          {/* Notch overlay */}
          <div className="absolute top-0 inset-x-0 z-20 flex justify-center pt-2 pb-1 bg-gradient-to-b from-black/40 to-transparent">
            <div style={{ width: 50, height: 12, borderRadius: 6, background: "#000" }} aria-hidden="true" />
          </div>

          {/* Hero Section (Photo or Icon) - Takes up top 45% */}
          {d.photo ? (
            <div style={{ position: "relative", height: "45%", width: "100%", overflow: "hidden" }}>
              <Image
                src={d.photo}
                alt={d.label}
                fill
                className="object-cover"
                sizes="160px"
              />
            </div>
          ) : (
            <div style={{ height: "45%", width: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.02)", borderBottom: "1px solid rgba(0,0,0,0.03)" }}>
              {d.icon}
            </div>
          )}

          {/* Bottom Section - Dynamic align and typography */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: alignItems, padding: "18px 14px 12px", width: "100%" }}>
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
                lineHeight: 1.2
              }}
            >
              {d.n1}
            </span>
            
            <span 
              style={{ 
                fontFamily: "Georgia, serif", 
                color: "gray", 
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
              <div style={{ display: "flex", gap: 6, marginTop: "auto", alignSelf: "center" }}>
                {d.cnt.map((n, j) => (
                  <div key={j} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <p style={{ color: d.text, fontSize: 13, fontWeight: 300, textAlign: "center", lineHeight: 1 }}>{n}</p>
                    <p style={{ color: "#a0a0a0", fontSize: 5, textAlign: "center", textTransform: "uppercase", marginTop: 2 }}>{["días","hs","min","seg"][j]}</p>
                  </div>
                ))}
              </div>
            )}
            {!d.cnt && (
               <div style={{ marginTop: "auto", borderTop: `1px solid ${d.accent}40`, paddingTop: 8, width: "100%" }}>
                  <p style={{ color: d.text, fontSize: 7, textAlign: "center", fontStyle: "italic" }}>S A V E  -  T H E  -  D A T E</p>
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
            <div style={{ width: 14, height: 14, borderRadius: "50%", border: "1px solid rgba(255,255,255,0.8)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div style={{ width: "4px", height: "1px", background: "rgba(255,255,255,0.8)" }} />
            </div>
            <p style={{ fontSize: 9, color: d.bg === "#ffffff" ? "#fff" : "rgba(255,255,255,0.9)", fontWeight: 600, letterSpacing: "0.05em" }}>RSVP</p>
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

export default function CumplesPage() {
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
