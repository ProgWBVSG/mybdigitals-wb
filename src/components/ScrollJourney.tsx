"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, MotionValue } from "framer-motion";
import { Bot, Globe, TrendingUp, CheckCircle2 } from "lucide-react";

/* ─────────────────────────────────────
   SOLO 3 etapas positivas (sin rojo)
───────────────────────────────────── */
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
    title: "IA que trabaja por vos",
    subtitle: "Automatización Inteligente",
    desc: "Agentes autónomos que cualifican leads, responden clientes en WhatsApp y envían reportes solos. Tu operación escala sin sumar personal.",
    Icon: Bot,
    accentA: "#C3D809",
    accentB: "#00d084",
    items: [
      "Agente IA en WhatsApp y Web",
      "Flujos n8n / Make sin fricción",
      "CRM y dashboards sincronizados",
      "Reportes diarios automáticos",
    ],
  },
  {
    step: "02",
    title: "Tu web como vendedor",
    subtitle: "Desarrollo Web de Élite",
    desc: "Sitios Next.js que cargan en milisegundos, ranquean en Google y convierten visitas en clientes. No una plantilla — una máquina de conversión.",
    Icon: Globe,
    accentA: "#0099ff",
    accentB: "#00e0ff",
    items: [
      "Landings de alta conversión",
      "Webs corporativas y portafolios",
      "SEO técnico desde la arquitectura",
      "E-commerce e invitaciones digitales",
    ],
  },
  {
    step: "03",
    title: "Resultados reales",
    subtitle: "Tu empresa en 90 días",
    desc: "Un ecosistema completo que trabaja solo. Más ventas, menos fricción operativa y una presencia que nadie de tu industria puede ignorar.",
    Icon: TrendingUp,
    accentA: "#a855f7",
    accentB: "#ec4899",
    items: [
      "10x ROI promedio por cliente",
      "80% menos horas manuales",
      "Presencia digital de nivel enterprise",
      "Escalás sin incorporar más personal",
    ],
  },
];

const N = STAGES.length;

/* ─────────────────────────────────────
   Sub-componente: cada diapositiva
   → aislado para no violar reglas de hooks
───────────────────────────────────── */
function StageSlide({
  stage,
  prog,
  index,
}: {
  stage: Stage;
  prog: MotionValue<number>;
  index: number;
}) {
  /* entrada / salida en ángulos suaves para no trabar */
  const s = index / N;
  const m = (index + 0.5) / N;
  const e = (index + 1) / N;
  const buf = 0.08;

  const rotY = useTransform(prog, [s, m, e], [14, 0, -14]);
  const tz   = useTransform(prog, [s, m, e], [-280, 0, -280]);
  const op   = useTransform(prog, [s, s + buf, e - buf, e], [0, 1, 1, 0]);
  const sc   = useTransform(prog, [s, m, e], [0.88, 1, 0.88]);

  const { Icon } = stage;

  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center px-4 md:px-10"
      style={{
        rotateY: rotY,
        translateZ: tz,
        opacity: op,
        scale: sc,
        willChange: "transform, opacity",
        backfaceVisibility: "hidden",
      }}
    >
      <div className="w-full max-w-5xl">
        <div
          className="relative rounded-[2rem] border border-white/[0.07] overflow-hidden p-8 md:p-12"
          style={{
            background: `linear-gradient(140deg, ${stage.accentA}14 0%, ${stage.accentB}08 50%, rgba(7,8,12,0.97) 100%)`,
            boxShadow: `0 0 80px ${stage.accentA}14, 0 24px 60px rgba(0,0,0,0.5)`,
          }}
        >
          {/* Glow blob */}
          <div
            className="absolute -top-24 -right-24 w-72 h-72 rounded-full blur-[90px] opacity-20 pointer-events-none"
            style={{ background: `radial-gradient(circle, ${stage.accentA}, transparent 70%)` }}
          />

          <div className="relative z-10 flex flex-col md:flex-row gap-8 md:gap-12 items-start">
            {/* Número + icono */}
            <div className="flex-shrink-0">
              <span
                className="block text-[80px] leading-none font-black select-none mb-4"
                style={{ color: `${stage.accentA}20` }}
              >
                {stage.step}
              </span>
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center border border-white/10"
                style={{
                  background: `linear-gradient(135deg, ${stage.accentA}25, ${stage.accentB}15)`,
                  color: stage.accentA,
                }}
              >
                <Icon size={30} />
              </div>
            </div>

            {/* Texto */}
            <div className="flex-1 min-w-0">
              <p
                className="text-[11px] font-bold tracking-[0.3em] uppercase mb-3"
                style={{ color: stage.accentA }}
              >
                {stage.subtitle}
              </p>
              <h3 className="text-3xl md:text-4xl font-black text-white mb-4 leading-[1.08]">
                {stage.title}
              </h3>
              <p className="text-gray-400 text-base md:text-lg leading-relaxed mb-7 max-w-2xl">
                {stage.desc}
              </p>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {stage.items.map((item, j) => (
                  <li key={j} className="flex items-start gap-2.5 text-sm text-gray-300 leading-snug">
                    <CheckCircle2
                      size={14}
                      className="mt-0.5 flex-shrink-0"
                      style={{ color: stage.accentA }}
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Línea decorativa */}
          <div
            className="absolute bottom-0 left-10 right-10 h-[1px]"
            style={{
              background: `linear-gradient(90deg, transparent, ${stage.accentA}50 50%, transparent)`,
            }}
          />
        </div>
      </div>
    </motion.div>
  );
}

/* ─────────────────────────────────────
   Sub-componente: punto del timeline
───────────────────────────────────── */
function Dot({
  prog,
  index,
  accent,
}: {
  prog: MotionValue<number>;
  index: number;
  accent: string;
}) {
  const s = index / N;
  const e = (index + 1) / N;
  const active = useTransform(prog, [s, (s + e) / 2, e], [0, 1, 0]);
  const sc = useTransform(active, [0, 1], [1, 1.5]);

  return (
    <motion.div
      style={{ scale: sc }}
      className="w-3 h-3 rounded-full border border-white/20 relative"
    >
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{ backgroundColor: accent, opacity: active }}
      />
    </motion.div>
  );
}

/* ─────────────────────────────────────
   COMPONENTE PRINCIPAL
───────────────────────────────────── */
export default function ScrollJourney() {
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  const barH = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section
      ref={ref}
      id="solucion"
      style={{ height: `${N * 100}vh` }}
      className="relative"
    >
      {/* Sticky viewport */}
      <div
        className="sticky top-0 h-screen overflow-hidden bg-background"
        style={{
          perspective: "1400px",
          perspectiveOrigin: "50% 45%",
        }}
      >
        {/* Label superior */}
        <div className="absolute top-6 inset-x-0 z-30 text-center pointer-events-none">
          <span className="text-[10px] font-bold text-primary/40 tracking-[0.4em] uppercase">
            Lo que construimos para vos · Scroll ↓
          </span>
        </div>

        {/* Diapositivas 3D */}
        <div className="absolute inset-0" style={{ transformStyle: "preserve-3d" }}>
          {STAGES.map((stage, i) => (
            <StageSlide key={i} stage={stage} prog={scrollYProgress} index={i} />
          ))}
        </div>

        {/* Timeline vertical */}
        <div className="absolute right-6 md:right-10 top-1/2 -translate-y-1/2 z-30 flex flex-col items-center gap-4 pointer-events-none">
          <div className="relative w-[1px] h-32 bg-white/10">
            <motion.div
              className="absolute top-0 left-0 right-0 bg-primary"
              style={{ height: barH }}
            />
          </div>
          {STAGES.map((stage, i) => (
            <Dot key={i} prog={scrollYProgress} index={i} accent={stage.accentA} />
          ))}
          <div className="w-[1px] h-8 bg-white/10" />
        </div>

        {/* Instrucción scroll */}
        <div className="absolute bottom-5 left-6 md:left-10 z-30 pointer-events-none">
          <span className="text-[9px] text-white/15 font-mono tracking-[0.25em] uppercase">
            Scroll to explore
          </span>
        </div>
      </div>
    </section>
  );
}
