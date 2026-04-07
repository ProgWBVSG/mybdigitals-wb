"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

/* ─── Datos del dashboard simulado ─────────────────────── */
const METRICS = [
  { label: "Leads hoy",       value: "38",   change: "+12%", color: "#C3D809" },
  { label: "Conversión",      value: "24%",  change: "+5%",  color: "#00c8ff" },
  { label: "Agente IA resp.", value: "1.2s", change: "avg",  color: "#a855f7" },
];

const FLOW_NODES = [
  { label: "Lead entra",    x: 10,  y: 32, dot: "#C3D809" },
  { label: "IA califica",  x: 38,  y: 32, dot: "#00c8ff" },
  { label: "WhatsApp",     x: 66,  y: 32, dot: "#a855f7" },
  { label: "Cierre",       x: 90,  y: 32, dot: "#C3D809" },
];

const NOTIFICATIONS = [
  { text: "🔥 Nuevo lead desde la web",   delay: 0    },
  { text: "✅ Agente IA respondió en 0.8s", delay: 2.5  },
  { text: "💰 Conversión registrada",     delay: 5    },
];

export default function HeroVisual() {
  const containerRef = useRef<HTMLDivElement>(null);

  /* Tilt reactivo al mouse – CSS transition, sin RAF pesado */
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const handleMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width  - 0.5) * 12; // -6 a 6 deg
      const y = ((e.clientY - rect.top)  / rect.height - 0.5) * -8;  // -4 a 4 deg
      el.style.transform = `perspective(1200px) rotateX(${y}deg) rotateY(${x}deg)`;
    };
    const handleLeave = () => {
      el.style.transform = "perspective(1200px) rotateX(4deg) rotateY(-6deg)";
    };
    window.addEventListener("mousemove", handleMove);
    el.addEventListener("mouseleave", handleLeave);
    return () => {
      window.removeEventListener("mousemove", handleMove);
      el.removeEventListener("mouseleave", handleLeave);
    };
  }, []);

  return (
    <div className="relative w-full h-full flex items-center justify-center select-none">

      {/* Laptop / browser flotante ─── */}
      <motion.div
        ref={containerRef}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: "easeOut" as const }}
        style={{
          transform: "perspective(1200px) rotateX(4deg) rotateY(-6deg)",
          transition: "transform 0.15s ease-out",
          transformStyle: "preserve-3d",
          willChange: "transform",
        }}
        className="relative w-[90%] max-w-[520px]"
      >
        {/* ─── Pantalla (browser) ─── */}
        <div
          className="rounded-t-2xl overflow-hidden border border-white/10"
          style={{ background: "#0d0f14", boxShadow: "0 0 60px rgba(195,216,9,0.08)" }}
        >
          {/* Barra de URL */}
          <div className="flex items-center gap-2 px-4 py-3 border-b border-white/[0.06] bg-white/[0.02]">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-400/70" />
            <span className="w-2.5 h-2.5 rounded-full bg-green-500/70" />
            <div className="flex-1 mx-3 h-6 rounded-lg bg-white/[0.04] border border-white/[0.06] flex items-center px-3">
              <span className="text-[10px] text-gray-500 font-mono">mybdigitals.com</span>
              <span className="ml-auto">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-green-400">
                  <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8z"/>
                  <path d="m9 12 2 2 4-4"/>
                </svg>
              </span>
            </div>
          </div>

          {/* Contenido del dashboard */}
          <div className="p-5 space-y-4">

            {/* Título del dashboard simulado */}
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] font-bold text-white/40 tracking-widest uppercase">Panel de Control · IA Activa</span>
              <span className="flex items-center gap-1.5 text-[10px] text-primary font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-ping inline-block" />
                LIVE
              </span>
            </div>

            {/* Métricas */}
            <div className="grid grid-cols-3 gap-3">
              {METRICS.map((m, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + i * 0.15, duration: 0.5 }}
                  className="rounded-xl p-3 border border-white/[0.06]"
                  style={{ background: `${m.color}0a` }}
                >
                  <p className="text-[9px] text-gray-500 mb-1 uppercase tracking-wider">{m.label}</p>
                  <p className="text-xl font-black text-white leading-none">{m.value}</p>
                  <p className="text-[10px] mt-1 font-semibold" style={{ color: m.color }}>{m.change}</p>
                </motion.div>
              ))}
            </div>

            {/* Flujo de automatización */}
            <div className="rounded-xl border border-white/[0.06] p-4 relative" style={{ background: "rgba(255,255,255,0.015)" }}>
              <p className="text-[9px] text-gray-500 uppercase tracking-widest mb-4">Flujo de Automatización IA</p>
              <div className="relative h-10">
                {/* Línea conectora */}
                <div className="absolute top-1/2 left-[10%] right-[10%] h-[1px] bg-gradient-to-r from-primary/30 via-cyan-400/30 to-primary/30" />
                {/* Línea animada */}
                <motion.div
                  className="absolute top-1/2 left-[10%] h-[1px]"
                  style={{ background: "linear-gradient(90deg, #C3D809, #00c8ff)" }}
                  animate={{ width: ["0%", "80%"] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", repeatDelay: 0.5 }}
                />
                {/* Nodos */}
                {FLOW_NODES.map((node, i) => (
                  <motion.div
                    key={i}
                    className="absolute flex flex-col items-center -translate-x-1/2 -translate-y-1/2"
                    style={{ left: `${node.x}%`, top: "50%" }}
                    animate={{ y: ["-50%", "calc(-50% - 2px)", "-50%"] }}
                    transition={{ duration: 2, delay: i * 0.4, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <div className="w-3 h-3 rounded-full border-2" style={{ borderColor: node.dot, background: `${node.dot}30` }} />
                    <span className="text-[8px] text-gray-500 mt-1.5 whitespace-nowrap">{node.label}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Mini gráfico de conversión */}
            <div className="rounded-xl border border-white/[0.06] p-4" style={{ background: "rgba(195,216,9,0.03)" }}>
              <p className="text-[9px] text-gray-500 uppercase tracking-widest mb-3">Conversión semanal</p>
              <div className="flex items-end gap-1.5 h-10">
                {[30, 45, 38, 60, 52, 75, 88].map((h, i) => (
                  <motion.div
                    key={i}
                    className="flex-1 rounded-sm"
                    style={{ background: i === 6 ? "#C3D809" : "rgba(195,216,9,0.2)" }}
                    initial={{ height: 0 }}
                    animate={{ height: `${h}%` }}
                    transition={{ delay: 0.6 + i * 0.08, duration: 0.5, ease: "easeOut" as const }}
                  />
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* ─── Base del laptop ─── */}
        <div
          className="h-3 rounded-b-xl border-x border-b border-white/10 mx-2"
          style={{ background: "linear-gradient(180deg, #1a1c22, #0d0f14)" }}
        />
        <div
          className="h-1.5 rounded-b-2xl border-x border-b border-white/[0.06] mx-6"
          style={{ background: "#0d0f14" }}
        />
      </motion.div>

      {/* ─── Notificaciones flotantes ─── */}
      {NOTIFICATIONS.map((n, i) => (
        <motion.div
          key={i}
          className="absolute text-[11px] font-semibold text-white bg-white/[0.06] border border-white/10 rounded-full px-3 py-1.5 backdrop-blur-sm pointer-events-none whitespace-nowrap"
          style={{ right: "-10px", top: `${28 + i * 24}%` }}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: [0, 1, 1, 0], x: [20, 0, 0, 20] }}
          transition={{
            duration: 3,
            delay: n.delay + 1.2,
            repeat: Infinity,
            repeatDelay: 7,
            ease: "easeInOut" as const,
          }}
        >
          {n.text}
        </motion.div>
      ))}

      {/* Indicador de estado */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-2 pointer-events-none">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
        </span>
        <span className="text-[10px] font-bold text-primary/60 tracking-[0.2em] uppercase">Sistema activo 24/7</span>
      </div>
    </div>
  );
}
