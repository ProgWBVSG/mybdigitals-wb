"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, MotionValue } from "framer-motion";
import { Bot, Globe, Cpu, TrendingUp, CheckCircle2 } from "lucide-react";

/* ─────────────────────────────────────────────
   DATOS de las 4 etapas del viaje
───────────────────────────────────────────── */
interface Stage {
  step: string;
  title: string;
  subtitle: string;
  desc: string;
  Icon: React.ComponentType<{ size?: number; style?: React.CSSProperties }>;
  accentA: string;
  accentB: string;
  items: string[];
}

const STAGES: Stage[] = [
  {
    step: "01",
    title: "El Problema",
    subtitle: "¿Reconocés esto?",
    desc: "Leads sin respuesta, WhatsApp colapsado, una web que no convierte. Tu equipo trabaja al máximo pero el negocio no escala.",
    Icon: Cpu,
    accentA: "#ff4444",
    accentB: "#ff8800",
    items: [
      "Leads calificados sin seguimiento",
      "Atención manual e inconsistente",
      "Web que no convierte visitas en ventas",
      "Sin datos, sin control, sin sistema",
    ],
  },
  {
    step: "02",
    title: "IA Autónoma",
    subtitle: "Eje A · Automatización Inteligente",
    desc: "Agentes que atienden, cualifican y convierten clientes las 24hs. Tu equipo se libera para lo que realmente importa: cerrar contratos.",
    Icon: Bot,
    accentA: "#C3D809",
    accentB: "#00d084",
    items: [
      "Agente IA para WhatsApp y Web",
      "Flujos automáticos n8n / Make",
      "CRM sincronizado y dashboards live",
      "Reportes autónomos diarios",
    ],
  },
  {
    step: "03",
    title: "Web de Élite",
    subtitle: "Eje B · Presencia Digital",
    desc: "Tu hogar digital diseñado para convertir. Next.js ultrarrápido, SEO técnico y experiencia premium. Una web que trabaja como tu mejor vendedor.",
    Icon: Globe,
    accentA: "#0099ff",
    accentB: "#00e0ff",
    items: [
      "Landing pages de alta conversión",
      "Webs corporativas en Next.js",
      "SEO técnico y posicionamiento",
      "E-commerce e invitaciones digitales",
    ],
  },
  {
    step: "04",
    title: "El Resultado",
    subtitle: "Tu empresa en 90 días",
    desc: "Un ecosistema completo que trabaja solo. Más leads cualificados, una presencia que impresiona y horas libres para crecer estratégicamente.",
    Icon: TrendingUp,
    accentA: "#a855f7",
    accentB: "#ec4899",
    items: [
      "10x ROI promedio por cliente",
      "80% reducción de horas operativas",
      "Presencia digital de nivel enterprise",
      "Escalás sin contratar más personal",
    ],
  },
];

/* ─────────────────────────────────────────────
   Cada diapositiva: recibe el MotionValue global
   y calcula SUS propias transformaciones.
   Al ser un componente independiente no viola las
   reglas de hooks.
───────────────────────────────────────────── */
function StageSlide({
  stage,
  prog,
  index,
  total,
}: {
  stage: Stage;
  prog: MotionValue<number>;
  index: number;
  total: number;
}) {
  const s = index / total;
  const m = (index + 0.5) / total;
  const e = (index + 1) / total;
  const buf = 0.06;

  const rotY  = useTransform(prog, [s, m, e], [22, 0, -22]);
  const tz    = useTransform(prog, [s, m, e], [-380, 0, -380]);
  const op    = useTransform(prog, [s, s + buf, e - buf, e], [0, 1, 1, 0]);
  const sc    = useTransform(prog, [s, m, e], [0.82, 1, 0.82]);
  const textY = useTransform(prog, [s, s + buf * 2], [28, 0]);

  const { Icon } = stage;

  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center px-4 md:px-10"
      style={{ rotateY: rotY, translateZ: tz, opacity: op, scale: sc, transformStyle: "preserve-3d" }}
    >
      <div className="w-full max-w-5xl">
        {/* Card principal */}
        <div
          className="relative rounded-[2.5rem] border border-white/[0.08] overflow-hidden p-8 md:p-14"
          style={{
            background: `linear-gradient(145deg, ${stage.accentA}18 0%, ${stage.accentB}0a 50%, rgba(7,8,12,0.97) 100%)`,
            boxShadow: `0 0 100px ${stage.accentA}18, 0 30px 80px rgba(0,0,0,0.5), inset 0 0 80px rgba(0,0,0,0.2)`,
          }}
        >
          {/* Glow top-right */}
          <div
            className="absolute -top-32 -right-32 w-96 h-96 rounded-full blur-[100px] opacity-25 pointer-events-none"
            style={{ background: `radial-gradient(circle, ${stage.accentA}, transparent 70%)` }}
          />

          <motion.div style={{ y: textY }} className="relative z-10 flex flex-col md:flex-row gap-8 md:gap-14 items-start">

            {/* Columna izquierda: número + icono */}
            <div className="flex-shrink-0 flex flex-col items-start gap-5">
              <span
                className="text-[100px] leading-none font-black select-none"
                style={{ color: `${stage.accentA}22` }}
              >
                {stage.step}
              </span>
              <div
                className="w-20 h-20 rounded-2xl flex items-center justify-center border border-white/10"
                style={{
                  background: `linear-gradient(135deg, ${stage.accentA}28, ${stage.accentB}18)`,
                  color: stage.accentA,
                }}
              >
                <Icon size={36} />
              </div>
            </div>

            {/* Columna derecha: texto + lista */}
            <div className="flex-1 min-w-0">
              <p
                className="text-[11px] font-bold tracking-[0.3em] uppercase mb-3"
                style={{ color: stage.accentA }}
              >
                {stage.subtitle}
              </p>
              <h3 className="text-3xl md:text-5xl font-black text-white mb-5 leading-[1.05]">
                {stage.title}
              </h3>
              <p className="text-gray-400 text-lg leading-relaxed mb-8 max-w-2xl">
                {stage.desc}
              </p>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {stage.items.map((item, j) => (
                  <li key={j} className="flex items-start gap-2.5 text-sm text-gray-300 leading-snug">
                    <CheckCircle2 size={15} className="mt-0.5 flex-shrink-0" style={{ color: stage.accentA }} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>

          {/* Línea decorativa inferior */}
          <div
            className="absolute bottom-0 left-8 right-8 h-[1px]"
            style={{ background: `linear-gradient(90deg, transparent, ${stage.accentA}60 50%, transparent)` }}
          />
        </div>
      </div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────
   Punto de la línea de progreso (también es
   un sub-componente para aislar hooks)
───────────────────────────────────────────── */
function TimelineDot({
  prog,
  index,
  total,
  accentA,
}: {
  prog: MotionValue<number>;
  index: number;
  total: number;
  accentA: string;
}) {
  const s = index / total;
  const e = (index + 1) / total;
  const isActive = useTransform(prog, [s, (s + e) / 2, e], [0, 1, 0]);
  const dotScale = useTransform(isActive, [0, 1], [1, 1.6]);

  return (
    <motion.div
      style={{ scale: dotScale }}
      className="w-2.5 h-2.5 rounded-full border-2 border-white/20 flex-shrink-0 transition-colors"
      title={`Etapa ${index + 1}`}
    >
      <motion.div
        className="w-full h-full rounded-full"
        style={{ backgroundColor: accentA, opacity: isActive }}
      />
    </motion.div>
  );
}

/* ─────────────────────────────────────────────
   COMPONENTE PRINCIPAL
───────────────────────────────────────────── */
export default function ScrollJourney() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Barra de progreso
  const barHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section
      ref={containerRef}
      id="solucion"
      style={{ height: `${STAGES.length * 100}vh` }}
      className="relative"
    >
      {/* ── Sticky viewport ── */}
      <div
        className="sticky top-0 h-screen overflow-hidden bg-background"
        style={{ perspective: "1500px", perspectiveOrigin: "50% 45%" }}
      >
        {/* Label superior */}
        <div className="absolute top-7 inset-x-0 z-30 text-center pointer-events-none">
          <span className="text-[10px] font-bold text-primary/40 tracking-[0.4em] uppercase">
            El viaje de tu negocio con MYB · Scroll ↓
          </span>
        </div>

        {/* Diapositivas 3D */}
        <div className="absolute inset-0" style={{ transformStyle: "preserve-3d" }}>
          {STAGES.map((stage, i) => (
            <StageSlide
              key={i}
              stage={stage}
              prog={scrollYProgress}
              index={i}
              total={STAGES.length}
            />
          ))}
        </div>

        {/* ── Timeline vertical (derecha) ── */}
        <div className="absolute right-6 md:right-10 top-1/2 -translate-y-1/2 z-30 flex flex-col items-center gap-5 pointer-events-none">
          <div className="relative w-[1px] h-40 bg-white/10">
            <motion.div
              className="absolute top-0 left-0 right-0 bg-primary"
              style={{ height: barHeight }}
            />
          </div>
          {STAGES.map((stage, i) => (
            <TimelineDot
              key={i}
              prog={scrollYProgress}
              index={i}
              total={STAGES.length}
              accentA={stage.accentA}
            />
          ))}
          <div className="w-[1px] h-8 bg-white/10" />
        </div>

        {/* Instrucción de scroll (bottom left) */}
        <div className="absolute bottom-6 left-6 md:left-10 z-30 pointer-events-none">
          <span className="text-[9px] text-white/15 font-mono tracking-[0.25em]">SCROLL TO EXPLORE</span>
        </div>
      </div>
    </section>
  );
}
