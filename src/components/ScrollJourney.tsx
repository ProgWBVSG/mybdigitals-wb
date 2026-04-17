"use client";

import { motion } from "framer-motion";
import { Bot, Globe, TrendingUp, CheckCircle2 } from "lucide-react";

/* ─── Data ──────────────────────────────────────────────────── */
const STAGES = [
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
    desc: "Sitios Next.js ultrarrápidos, SEO técnico desde la base y experiencia premium. No una plantilla — una máquina de conversión que trabaja 24/7.",
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
    desc: "Un ecosistema completo que trabaja solo. Más ventas, menos fricción y presencia digital que nadie en tu industria puede ignorar.",
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
] as const;

/* ─── 3D Visual: Chat ────────────────────────────────────────── */
function ChatVisual({ accent }: { accent: string }) {
  const msgs = [
    { from: "user", text: "Hola! Quiero automatizar mis consultas 👋" },
    { from: "bot",  text: "¡Perfecto! ¿Cuántas consultas recibís por día?" },
    { from: "user", text: "Unas 50... es agotador de manera manual" },
    { from: "bot",  text: "En 14 días lo resolvemos. ¿Agendamos? 🚀" },
  ];

  return (
    <div className="flex justify-center" style={{ perspective: "900px" }}>
      <motion.div
        animate={{ rotateY: [4, -4, 4], rotateX: [3, -3, 3], y: [0, -12, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        style={{ transformStyle: "preserve-3d" }}
        className="relative w-full max-w-[320px]"
      >
        {/* Floor glow */}
        <div
          aria-hidden="true"
          className="absolute inset-x-8 -bottom-6 h-10 blur-2xl rounded-full opacity-60"
          style={{ background: accent }}
        />
        <div
          className="relative rounded-3xl overflow-hidden"
          style={{
            background: "#0c0d13",
            border: "1px solid rgba(255,255,255,0.07)",
            boxShadow: "0 40px 100px rgba(0,0,0,0.9), 0 0 0 1px rgba(255,255,255,0.04), inset 0 1px 0 rgba(255,255,255,0.06)",
          }}
        >
          {/* Header */}
          <div className="px-5 py-4 flex items-center gap-3" style={{ background: `${accent}10`, borderBottom: `1px solid ${accent}20` }}>
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0" style={{ background: `${accent}20`, border: `1px solid ${accent}35` }}>
              <Bot size={20} style={{ color: accent }} aria-hidden="true" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-bold">MYB IA Agent</p>
              <p className="text-gray-400 text-[11px] flex items-center gap-1.5">
                <motion.span animate={{ opacity: [1, 0.2, 1] }} transition={{ duration: 1.6, repeat: Infinity }}
                  className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block shrink-0" aria-hidden="true" />
                Online · respondiendo ahora mismo
              </p>
            </div>
            <span className="text-[9px] font-black px-2 py-1 rounded-full text-black shrink-0" style={{ background: accent }}>24/7</span>
          </div>
          {/* Messages */}
          <div className="p-4 flex flex-col gap-2.5">
            {msgs.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 + 0.1, duration: 0.4 }}
                className={`flex ${msg.from === "bot" ? "justify-start" : "justify-end"}`}
              >
                <div
                  className="max-w-[86%] rounded-2xl px-3.5 py-2 text-[12px] leading-relaxed"
                  style={msg.from === "bot"
                    ? { background: "rgba(255,255,255,0.07)", color: "#d4d4d8" }
                    : { background: `${accent}22`, color: accent, border: `1px solid ${accent}28` }
                  }
                >
                  {msg.text}
                </div>
              </motion.div>
            ))}
            {/* Typing dots */}
            <motion.div animate={{ opacity: [0, 1, 0] }} transition={{ duration: 2.2, repeat: Infinity, delay: 1 }}
              className="flex gap-1 pl-1" aria-hidden="true">
              {[0, 0.15, 0.3].map((d, j) => (
                <motion.div key={j} animate={{ y: [0, -4, 0] }} transition={{ duration: 0.55, repeat: Infinity, delay: d }}
                  className="w-1.5 h-1.5 rounded-full bg-white/25" />
              ))}
            </motion.div>
          </div>
          {/* Input bar */}
          <div className="px-4 pb-4">
            <div className="bg-white/5 border border-white/8 rounded-2xl px-4 py-2.5 flex items-center gap-2">
              <span className="flex-1 text-[11px] text-gray-600 select-none">Escribe un mensaje...</span>
              <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0" style={{ background: accent }} aria-hidden="true">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="3">
                  <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

/* ─── 3D Visual: Browser ─────────────────────────────────────── */
function WebVisual({ accent }: { accent: string }) {
  return (
    <div className="flex justify-center" style={{ perspective: "900px" }}>
      <motion.div
        animate={{ rotateY: [-5, 5, -5], rotateX: [-3, 3, -3], y: [0, -12, 0] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
        style={{ transformStyle: "preserve-3d" }}
        className="relative w-full max-w-[340px]"
      >
        <div aria-hidden="true" className="absolute inset-x-8 -bottom-6 h-10 blur-2xl rounded-full opacity-60" style={{ background: accent }} />
        <div className="relative rounded-2xl overflow-hidden"
          style={{ background: "#0c0d13", border: "1px solid rgba(255,255,255,0.07)", boxShadow: "0 40px 100px rgba(0,0,0,0.9), 0 0 0 1px rgba(255,255,255,0.04), inset 0 1px 0 rgba(255,255,255,0.06)" }}>
          {/* Browser chrome */}
          <div className="flex items-center gap-2 px-4 py-3 border-b border-white/8" style={{ background: "rgba(255,255,255,0.03)" }}>
            <div className="flex gap-1.5" aria-hidden="true">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
              <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
            </div>
            <div className="flex-1 mx-2 bg-white/8 rounded-full px-3 py-1.5 flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full shrink-0" style={{ background: accent }} aria-hidden="true" />
              <span className="text-[9px] text-gray-500">mybdigitals.com/tu-empresa</span>
            </div>
          </div>
          {/* Page content mockup */}
          <div className="p-5 flex flex-col gap-4" aria-hidden="true">
            <div className="flex items-center justify-between">
              <div className="h-2.5 w-20 rounded-full" style={{ background: `${accent}70` }} />
              <div className="flex gap-2">{[1, 2, 3].map(i => <div key={i} className="h-2 w-10 rounded-full bg-white/12" />)}</div>
            </div>
            <div className="py-4 px-4 rounded-xl border border-white/5" style={{ background: "rgba(255,255,255,0.025)" }}>
              <div className="h-3.5 w-3/4 rounded-full bg-white/60 mb-2.5" />
              <div className="h-2.5 w-1/2 rounded-full bg-white/25 mb-4" />
              <div className="flex gap-2">
                <div className="h-8 w-24 rounded-full" style={{ background: accent }} />
                <div className="h-8 w-20 rounded-full bg-white/8 border border-white/12" />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[{ v: "10x", l: "ROI" }, { v: "14d", l: "Deploy" }, { v: "99%", l: "Uptime" }].map(m => (
                <div key={m.l} className="rounded-xl border border-white/8 py-3 text-center" style={{ background: "rgba(255,255,255,0.04)" }}>
                  <p className="text-[14px] font-black" style={{ color: accent }}>{m.v}</p>
                  <p className="text-[9px] text-gray-500 mt-0.5">{m.l}</p>
                </div>
              ))}
            </div>
          </div>
          <span className="absolute top-3 right-3 text-[9px] font-black px-2 py-1 rounded-full text-black" style={{ background: accent }} aria-hidden="true">LIVE</span>
        </div>
      </motion.div>
    </div>
  );
}

/* ─── 3D Visual: Dashboard ───────────────────────────────────── */
function ResultsVisual({ accent }: { accent: string }) {
  const bars = [22, 35, 48, 56, 70, 82, 95];
  return (
    <div className="flex justify-center" style={{ perspective: "900px" }}>
      <motion.div
        animate={{ rotateY: [4, -4, 4], rotateX: [2, -2, 2], y: [0, -10, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
        style={{ transformStyle: "preserve-3d" }}
        className="relative w-full max-w-[320px]"
      >
        <div aria-hidden="true" className="absolute inset-x-8 -bottom-6 h-10 blur-2xl rounded-full opacity-60" style={{ background: accent }} />
        <div className="relative rounded-2xl overflow-hidden p-5"
          style={{ background: "#0c0d13", border: "1px solid rgba(255,255,255,0.07)", boxShadow: "0 40px 100px rgba(0,0,0,0.9), 0 0 0 1px rgba(255,255,255,0.04), inset 0 1px 0 rgba(255,255,255,0.06)" }}
          aria-hidden="true">
          <div className="flex items-end justify-between mb-5">
            <div>
              <p className="text-white text-sm font-bold">Facturación</p>
              <p className="text-[10px] text-gray-500">90 días post-implementación</p>
            </div>
            <motion.span animate={{ scale: [1, 1.06, 1] }} transition={{ duration: 2.2, repeat: Infinity }}
              className="text-[11px] font-black px-2.5 py-1.5 rounded-full text-black" style={{ background: accent }}>
              +127% ↑
            </motion.span>
          </div>
          {/* Bar chart */}
          <div className="flex items-end gap-1.5 h-20 mb-3 px-0.5">
            {bars.map((h, i) => (
              <div key={i} className="flex-1 flex items-end h-full">
                <motion.div
                  className="w-full rounded-t-[3px]"
                  initial={{ scaleY: 0 }}
                  whileInView={{ scaleY: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.07, duration: 0.7, ease: "easeOut" as const }}
                  style={{
                    originY: "100%",
                    height: `${h}%`,
                    background: i === bars.length - 1 ? `linear-gradient(180deg, ${accent}, ${accent}70)` : `${accent}28`,
                    boxShadow: i === bars.length - 1 ? `0 0 16px ${accent}55` : undefined,
                  }}
                />
              </div>
            ))}
          </div>
          <div className="flex justify-between text-[8.5px] text-gray-600 mb-4 px-0.5">
            {["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Hoy"].map(m => <span key={m}>{m}</span>)}
          </div>
          <div className="grid grid-cols-3 gap-2 pt-3 border-t border-white/8">
            {[{ v: "10x", l: "ROI" }, { v: "80%", l: "Automatizado" }, { v: "24/7", l: "Activo" }].map(s => (
              <div key={s.l} className="text-center">
                <p className="text-[14px] font-black" style={{ color: accent }}>{s.v}</p>
                <p className="text-[8px] text-gray-500 leading-tight mt-0.5">{s.l}</p>
              </div>
            ))}
          </div>
          <span className="absolute top-3 right-3 text-[9px] font-black px-2 py-1 rounded-full text-white"
            style={{ background: `linear-gradient(135deg, ${accent}, #ec4899)` }}>LIVE</span>
        </div>
      </motion.div>
    </div>
  );
}

const VISUALS = [ChatVisual, WebVisual, ResultsVisual] as const;

/* ─── Main Section (vertical, no sticky) ────────────────────── */
export default function ScrollJourney() {
  return (
    <section id="solucion" aria-label="Nuestros servicios" className="w-full py-24 md:py-32 relative overflow-hidden">

      {/* Subtle grid background */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)
          `,
          backgroundSize: "52px 52px",
          maskImage: "radial-gradient(ellipse 90% 100% at 50% 50%, black 30%, transparent 100%)",
          WebkitMaskImage: "radial-gradient(ellipse 90% 100% at 50% 50%, black 30%, transparent 100%)",
        }}
      />

      <div className="max-w-7xl mx-auto px-5 md:px-10 relative z-10">

        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="text-center mb-20 md:mb-28"
        >
          <p className="text-[10px] font-black tracking-[0.4em] uppercase text-primary/60 mb-4">
            Lo que construimos para vos
          </p>
          <h2 className="text-4xl md:text-5xl xl:text-6xl font-black text-white tracking-tight">
            Servicios que{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-lime-300 to-emerald-400 italic font-medium">
              transforman.
            </span>
          </h2>
        </motion.div>

        {/* Stages — vertical stack */}
        <div className="flex flex-col gap-24 md:gap-32">
          {STAGES.map((stage, i) => {
            const Visual = VISUALS[i];
            const isEven = i % 2 === 0;

            return (
              <motion.div
                key={stage.step}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center"
              >
                {/* Text side */}
                <div className={`flex flex-col justify-center ${isEven ? "lg:order-1" : "lg:order-2"}`}>

                  {/* Step + subtitle row */}
                  <div className="flex items-center gap-3 mb-5">
                    <span
                      className="text-[56px] font-black leading-none select-none"
                      style={{ color: `${stage.accentA}15` }}
                      aria-hidden="true"
                    >
                      {stage.step}
                    </span>
                    <div className="h-px flex-1 max-w-[40px]" style={{ background: `${stage.accentA}40` }} aria-hidden="true" />
                    <p className="text-[10px] font-black tracking-[0.28em] uppercase" style={{ color: stage.accentA }}>
                      {stage.subtitle}
                    </p>
                  </div>

                  {/* Title */}
                  <h3 className="text-3xl md:text-4xl xl:text-5xl font-black text-white leading-[1.05] tracking-tight mb-5">
                    {stage.title}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-300 text-base leading-relaxed mb-8 max-w-[460px]">
                    {stage.desc}
                  </p>

                  {/* Feature list */}
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {stage.items.map((item, j) => (
                      <motion.li
                        key={item}
                        initial={{ opacity: 0, x: -12 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: j * 0.07 + 0.2, duration: 0.4 }}
                        className="flex items-center gap-3"
                      >
                        <div
                          className="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
                          style={{ background: `${stage.accentA}18`, border: `1px solid ${stage.accentA}35` }}
                          aria-hidden="true"
                        >
                          <CheckCircle2 size={11} style={{ color: stage.accentA }} aria-hidden="true" />
                        </div>
                        <span className="text-[13.5px] text-gray-300 leading-snug">{item}</span>
                      </motion.li>
                    ))}
                  </ul>

                  {/* Accent bar */}
                  <div className="mt-10 h-0.5 w-16 rounded-full" style={{ background: `linear-gradient(90deg, ${stage.accentA}, ${stage.accentB})` }} aria-hidden="true" />
                </div>

                {/* Visual side */}
                <div className={`${isEven ? "lg:order-2" : "lg:order-1"} relative`}>
                  {/* Ambient glow behind visual */}
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 blur-[80px] opacity-20 rounded-full pointer-events-none"
                    style={{ background: `radial-gradient(circle, ${stage.accentA}, transparent 70%)` }}
                  />
                  <motion.div
                    initial={{ opacity: 0, x: isEven ? 40 : -40, scale: 0.95 }}
                    whileInView={{ opacity: 1, x: 0, scale: 1 }}
                    viewport={{ once: true, margin: "-60px" }}
                    transition={{ duration: 0.65, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.15 }}
                  >
                    <Visual accent={stage.accentA} />
                  </motion.div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
