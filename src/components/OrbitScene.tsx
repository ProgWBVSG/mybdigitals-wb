"use client";

import { motion, useAnimation, useAnimate } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Bot, Globe, Cpu, Zap, Code2, Network } from "lucide-react";

// Íconos e etiquetas que orbitan el núcleo
const ORBIT_NODES = [
  { icon: <Bot size={16} />,     label: "AI Agent",      color: "from-primary/80 to-emerald-400/80",  ring: 0, angle: 0   },
  { icon: <Globe size={16} />,   label: "Web",           color: "from-blue-400/80 to-cyan-400/80",    ring: 0, angle: 120 },
  { icon: <Cpu size={16} />,     label: "Automation",    color: "from-primary/80 to-yellow-400/80",   ring: 0, angle: 240 },
  { icon: <Zap size={16} />,     label: "Speed",         color: "from-orange-400/80 to-red-400/80",   ring: 1, angle: 60  },
  { icon: <Code2 size={16} />,   label: "Next.js",       color: "from-purple-400/80 to-blue-400/80",  ring: 1, angle: 180 },
  { icon: <Network size={16} />, label: "Integrations",  color: "from-teal-400/80 to-primary/80",     ring: 1, angle: 300 },
];

const RING_RADII = [140, 220]; // px de radio por anillo
const RING_TILTS  = [15, -20]; // deg de tilt en X
const RING_SPEEDS = [28, 20];  // seg por vuelta

// Partículas flotantes de fondo del canvas
const PARTICLES = Array.from({ length: 28 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: 1 + Math.random() * 2,
  delay: Math.random() * 4,
  duration: 4 + Math.random() * 6,
}));

export default function OrbitScene() {
  const [hovered, setHovered] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const handleMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      setMouse({
        x: ((e.clientX - cx) / (rect.width / 2)) * 8,
        y: ((e.clientY - cy) / (rect.height / 2)) * -8,
      });
    };
    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full flex items-center justify-center select-none"
      style={{ perspective: "900px" }}
    >
      {/* ─── Partículas de fondo ─── */}
      {PARTICLES.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-primary/40"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
          }}
          animate={{ opacity: [0.1, 0.7, 0.1], scale: [1, 1.6, 1] }}
          transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}

      {/* ─── Escena 3D principal ─── */}
      <motion.div
        className="relative"
        style={{ transformStyle: "preserve-3d" }}
        animate={{ rotateX: mouse.y, rotateY: mouse.x }}
        transition={{ type: "spring", stiffness: 60, damping: 18 }}
      >
        {/* Anillos de órbita + nodos */}
        {RING_RADII.map((radius, ringIdx) => (
          <motion.div
            key={ringIdx}
            className="absolute inset-0 flex items-center justify-center"
            style={{
              transformStyle: "preserve-3d",
              transform: `rotateX(${RING_TILTS[ringIdx]}deg)`,
              width: radius * 2,
              height: radius * 2,
              marginLeft: -radius,
              marginTop: -radius,
            }}
            animate={{ rotate: 360 }}
            transition={{ duration: RING_SPEEDS[ringIdx], repeat: Infinity, ease: "linear" }}
          >
            {/* Elipse de la órbita visual */}
            <div
              className="absolute inset-0 rounded-full border border-white/[0.06]"
              style={{ transform: `rotateX(${RING_TILTS[ringIdx] * 2}deg) scaleY(0.38)` }}
            />

            {/* Nodos del anillo */}
            {ORBIT_NODES.filter((n) => n.ring === ringIdx).map((node, ni) => {
              const rad = (node.angle * Math.PI) / 180;
              const nx = radius * Math.cos(rad);
              const ny = radius * Math.sin(rad) * 0.38; // aplana la elipse
              return (
                <motion.div
                  key={ni}
                  className="absolute"
                  style={{ left: "50%", top: "50%", x: nx, y: ny }}
                  // contra-rotación para que los nodos siempre miren al frente
                  animate={{ rotate: -360 }}
                  transition={{ duration: RING_SPEEDS[ringIdx], repeat: Infinity, ease: "linear" }}
                  onMouseEnter={() => setHovered(ringIdx * 10 + ni)}
                  onMouseLeave={() => setHovered(null)}
                >
                  <div
                    className={`
                      relative -translate-x-1/2 -translate-y-1/2 cursor-pointer
                      w-9 h-9 rounded-full bg-gradient-to-br ${node.color}
                      flex items-center justify-center text-white/90
                      shadow-[0_0_14px_rgba(195,216,9,0.35)]
                      border border-white/20
                      transition-all duration-200
                      hover:scale-125 hover:shadow-[0_0_24px_rgba(195,216,9,0.7)]
                    `}
                  >
                    {node.icon}
                    {/* Tooltip */}
                    <span className="absolute -top-7 left-1/2 -translate-x-1/2 text-[10px] font-bold text-primary bg-black/70 px-2 py-0.5 rounded-full opacity-0 hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                      {node.label}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        ))}

        {/* ─── Núcleo central ─── */}
        <motion.div
          className="relative flex items-center justify-center"
          style={{ width: 96, height: 96, marginLeft: -48, marginTop: -48 }}
          animate={{ scale: [1, 1.06, 1] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
        >
          {/* Glow externo */}
          <div className="absolute inset-0 rounded-full bg-primary/30 blur-2xl scale-150 animate-pulse" />
          {/* Ring exterior */}
          <div className="absolute inset-0 rounded-full border-2 border-primary/40 animate-spin" style={{ animationDuration: "8s" }} />
          <div className="absolute inset-2 rounded-full border border-primary/20 animate-spin" style={{ animationDuration: "5s", animationDirection: "reverse" }} />
          {/* Núcleo */}
          <div className="relative w-16 h-16 rounded-full bg-gradient-to-br from-primary via-lime-300 to-emerald-400 flex items-center justify-center shadow-[0_0_40px_rgba(195,216,9,0.6)] z-10">
            <span className="text-black font-black text-xs tracking-widest">MYB</span>
          </div>
        </motion.div>

        {/* ─── Líneas conectoras del núcleo a los nodos (SVG estático) ─── */}
        <svg
          className="absolute pointer-events-none opacity-[0.08]"
          style={{ left: "-300px", top: "-300px", width: "600px", height: "600px" }}
          viewBox="0 0 600 600"
        >
          {[0, 60, 120, 180, 240, 300].map((deg, i) => {
            const r = (deg * Math.PI) / 180;
            const x2 = 300 + 240 * Math.cos(r);
            const y2 = 300 + 240 * Math.sin(r);
            return (
              <line
                key={i}
                x1="300" y1="300"
                x2={x2} y2={y2}
                stroke="#C3D809"
                strokeWidth="0.8"
                strokeDasharray="4 6"
              />
            );
          })}
        </svg>
      </motion.div>

      {/* ─── Texto de estado "live" ─── */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
        </span>
        <span className="text-[10px] font-bold text-primary/70 tracking-[0.2em] uppercase">Sistema activo</span>
      </div>
    </div>
  );
}
