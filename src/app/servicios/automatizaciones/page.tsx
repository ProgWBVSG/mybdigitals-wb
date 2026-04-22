"use client";

import { motion, useScroll, useTransform, AnimatePresence, useMotionValue, useSpring, useInView } from "framer-motion";
import {
  CheckCircle2, Bot, Network, Cpu, Clock, MessageSquareText, Layers,
  ArrowRight, Search, Code, Rocket, XCircle, TrendingDown, TrendingUp,
  Database, Zap, AlertTriangle, ShoppingCart, HeartPulse, Home, UtensilsCrossed,
  BriefcaseBusiness, Store, PhoneOff, Timer, Database as DBIcon, Users, CalendarX,
  BadgeDollarSign, BarChart3, Wifi
} from "lucide-react";
import Link from "next/link";
import { useRef, useState, useEffect } from "react";

const fadeIn = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" as const } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
};

// ─── CHAT COMPARISON SECTION ──────────────────────────────────────────────────

type ChatMessage = {
  from: "user" | "bot";
  text: string;
  delay: number;
  typing?: number;
};

const WITHOUT_MESSAGES: ChatMessage[] = [
  { from: "user", text: "Hola, quería saber el precio del plan PRO.", delay: 0, typing: 0 },
  { from: "bot",  text: "Hola! Un momento...", delay: 3200, typing: 2800 },
  { from: "bot",  text: "Estamos revisando. Te respondo a la brevedad 🙂", delay: 6500, typing: 1500 },
  { from: "user", text: "Ok, quedé esperando entonces?", delay: 9000, typing: 0 },
  { from: "bot",  text: "Disculpas, no tenemos ese dato ahora. Mandá mail a info@empresa.com", delay: 14500, typing: 3200 },
  { from: "user", text: "Ok gracias... (cierra el chat)", delay: 17000, typing: 0 },
];

const WITH_MESSAGES: ChatMessage[] = [
  { from: "user", text: "Hola, quería saber el precio del plan PRO.", delay: 0, typing: 0 },
  { from: "bot",  text: "¡Hola Martín! 👋 El Plan PRO tiene un valor de $49.900/mes e incluye onboarding, integración CRM y soporte 24/7. ¿Querés que te arme una propuesta personalizada?", delay: 1100, typing: 800 },
  { from: "user", text: "Sí, por favor.", delay: 3500, typing: 0 },
  { from: "bot",  text: "¡Perfecto! Ya generé tu propuesta y la guardé en tu perfil. También agendé un llamado con el equipo el Miércoles 23 a las 11 AM. ¿Confirmás esa hora? ✅", delay: 5200, typing: 1200 },
  { from: "user", text: "Confirmado, gracias!", delay: 7500, typing: 0 },
  { from: "bot",  text: "¡Listo, Martín! Todo quedó registrado. Recibirás un recordatorio. 🤖💡", delay: 8800, typing: 900 },
];

type ChatBubbleProps = { msg: ChatMessage; isWithout: boolean };
const ChatBubble = ({ msg, isWithout }: ChatBubbleProps) => {
  const isUser = msg.from === "user";
  return (
    <motion.div
      initial={{ opacity: 0, y: 12, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className={`flex ${isUser ? "justify-end" : "justify-start"} mb-4`}
    >
      {!isUser && (
        <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center shrink-0 mr-3 mt-0.5 border ${isWithout ? "bg-red-900/30 border-red-500/30" : "bg-emerald-900/30 border-emerald-500/30"}`}>
          <Bot size={16} className={isWithout ? "text-red-400" : "text-emerald-400"} />
        </div>
      )}
      <div className={`max-w-[85%] md:max-w-[78%] px-5 py-3 md:py-4 rounded-2xl text-[15px] md:text-[16px] leading-relaxed font-medium ${
        isUser
          ? "bg-white/10 text-gray-200 rounded-tr-sm border border-white/10"
          : isWithout
          ? "bg-red-900/20 text-red-100 rounded-tl-sm border border-red-500/20"
          : "bg-emerald-900/30 text-emerald-50 rounded-tl-sm border border-emerald-500/20"
      }`}>
        {msg.text}
      </div>
    </motion.div>
  );
};

const TypingBubble = ({ isWithout }: { isWithout: boolean }) => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex justify-start mb-4">
    <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center shrink-0 mr-3 border ${isWithout ? "bg-red-900/30 border-red-500/30" : "bg-emerald-900/30 border-emerald-500/30"}`}>
      <Bot size={16} className={isWithout ? "text-red-400" : "text-emerald-400"} />
    </div>
    <div className={`px-5 py-4 rounded-2xl rounded-tl-sm border ${isWithout ? "bg-red-900/20 border-red-500/20" : "bg-emerald-900/30 border-emerald-500/20"}`}>
      <div className="flex gap-1.5 items-center h-4">
        {[0, 1, 2].map(i => (
          <motion.span key={i} className={`w-2 h-2 rounded-full ${isWithout ? "bg-red-400" : "bg-emerald-400"}`}
            animate={{ y: [0, -5, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }} />
        ))}
      </div>
    </div>
  </motion.div>
);

type ChatWindowProps = {
  title: string; subtitle: string; messages: ChatMessage[];
  isWithout: boolean; isRunning: boolean; statusLabel: string;
  statusBadges: { label: string; ok: boolean }[];
  postChatNote: string;
};

const ChatWindow = ({ title, subtitle, messages, isWithout, isRunning, statusLabel, statusBadges, postChatNote }: ChatWindowProps) => {
  const [visibleMessages, setVisibleMessages] = useState<ChatMessage[]>([]);
  const [showTyping, setShowTyping] = useState(false);
  const [chatDone, setChatDone] = useState(false);

  useEffect(() => {
    if (!isRunning) { setVisibleMessages([]); setShowTyping(false); setChatDone(false); return; }
    const timers: ReturnType<typeof setTimeout>[] = [];
    messages.forEach((msg) => {
      if (msg.typing && msg.typing > 0 && msg.from === "bot") {
        timers.push(setTimeout(() => setShowTyping(true), msg.delay - msg.typing));
      }
      timers.push(setTimeout(() => { setShowTyping(false); setVisibleMessages(prev => [...prev, msg]); }, msg.delay + 300));
    });
    timers.push(setTimeout(() => setChatDone(true), messages[messages.length - 1].delay + 1200));
    return () => timers.forEach(t => clearTimeout(t));
  }, [isRunning, messages]);

  return (
    <div className={`flex flex-col rounded-3xl overflow-hidden border ${isWithout ? "border-red-500/25 bg-[#0d0507]" : "border-emerald-500/25 bg-[#030d08]"}`}>
      {/* Header */}
      <div className={`flex items-center gap-3 px-5 py-4 border-b ${isWithout ? "border-red-500/15 bg-red-950/20" : "border-emerald-500/15 bg-emerald-950/20"}`}>
        <div className={`w-10 h-10 rounded-full flex items-center justify-center border ${isWithout ? "bg-red-900/40 border-red-500/40 text-red-400" : "bg-emerald-900/40 border-emerald-500/40 text-emerald-400"}`}>
          <Bot size={18} />
        </div>
        <div>
          <p className="text-white font-bold text-base md:text-lg leading-none">{title}</p>
          <p className={`text-sm mt-1.5 font-medium ${isWithout ? "text-red-400" : "text-emerald-400"}`}>{subtitle}</p>
        </div>
        <div className="ml-auto flex items-center gap-1.5">
          <span className={`w-2 h-2 rounded-full ${isWithout ? "bg-red-500 animate-pulse" : "bg-emerald-400"}`} />
          <span className={`text-xs font-semibold ${isWithout ? "text-red-400" : "text-emerald-400"}`}>{statusLabel}</span>
        </div>
      </div>

      {/* Chat Messages — NO scrollbar, grows naturally */}
      <div className="px-4 py-5 min-h-[300px]">
        <AnimatePresence>
          {visibleMessages.map((msg, i) => <ChatBubble key={i} msg={msg} isWithout={isWithout} />)}
          {showTyping && <TypingBubble key="typing" isWithout={isWithout} />}
        </AnimatePresence>
      </div>

      {/* Status Badges */}
      <div className={`px-5 py-5 md:px-6 border-t flex flex-col gap-4 ${isWithout ? "border-red-500/15 bg-red-950/10" : "border-emerald-500/15 bg-emerald-950/10"}`}>
        <p className="text-gray-400 text-xs md:text-sm font-bold uppercase tracking-widest">Post Finalización del Chat</p>
        <div className="flex flex-col gap-2.5">
          {statusBadges.map((b, i) => (
            <div key={i} className="flex items-center gap-3">
              {b.ok ? <CheckCircle2 size={16} className="text-emerald-400 shrink-0" /> : <XCircle size={16} className="text-red-500 shrink-0" />}
              <span className={`text-sm md:text-base font-medium ${b.ok ? "text-gray-200" : "text-gray-500 line-through"}`}>{b.label}</span>
            </div>
          ))}
        </div>
        <div className={`mt-2 flex items-start gap-3 rounded-xl px-4 py-3.5 border text-sm md:text-[15px] ${isWithout ? "bg-red-950/30 border-red-500/20 text-red-300" : "bg-emerald-950/30 border-emerald-500/20 text-emerald-300"}`}>
          {isWithout ? <AlertTriangle size={18} className="shrink-0 mt-0.5" /> : <Database size={18} className="shrink-0 mt-0.5" />}
          <span className="leading-relaxed">{postChatNote}</span>
        </div>
      </div>
    </div>
  );
};

const ChatComparisonSection = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [key, setKey] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-150px" });

  useEffect(() => {
    if (isInView && !isRunning && key === 0) {
      setTimeout(() => setIsRunning(true), 400);
    }
  }, [isInView, isRunning, key]);

  const handleStart = () => {
    setKey(k => k + 1); setIsRunning(false);
    setTimeout(() => setIsRunning(true), 80);
  };
  return (
    <div ref={sectionRef} className="w-full max-w-6xl mx-auto py-24 mb-8">
      <div className="text-center mb-14">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-white font-bold text-[10px] tracking-widest uppercase mb-6 backdrop-blur-md">
          Comparativa Real
        </motion.div>
        <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
          className="text-3xl md:text-5xl font-black text-white mb-4">
          ¿Qué pasa cuando <span className="text-red-400 italic">no</span> automatizás{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-emerald-400">vs. cuando sí.</span>
        </motion.h2>
        <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}
          className="text-gray-400 md:text-lg max-w-2xl mx-auto">
          Dos conversaciones reales. Mismo cliente. Distinto sistema. Las consecuencias hablan solas.
        </motion.p>
      </div>
      <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 }}
        className="grid md:grid-cols-2 gap-6 lg:gap-10 mb-10" key={key}>
        <ChatWindow title="Soporte Manual" subtitle="Sin automatización implementada" messages={WITHOUT_MESSAGES}
          isWithout={true} isRunning={isRunning} statusLabel="Lento / Cortante"
          statusBadges={[
            { label: "Cliente sin respuesta en 10+ min", ok: false },
            { label: "Datos del cliente guardados en CRM", ok: false },
            { label: "Base de datos actualizada post-chat", ok: false },
            { label: "Seguimiento automático enviado", ok: false },
          ]}
          postChatNote="La conversación se pierde. Ningún dato queda guardado. El cliente tuvo que esperar y se fue frustrado." />
        <ChatWindow title="Agente IA MYB" subtitle="Con ecosistema automatizado" messages={WITH_MESSAGES}
          isWithout={false} isRunning={isRunning} statusLabel="Online · Instantáneo"
          statusBadges={[
            { label: "Respuesta en menos de 1 segundo", ok: true },
            { label: "CRM actualizado con perfil del lead", ok: true },
            { label: "Base de datos guardada post-chat", ok: true },
            { label: "Recordatorio automático agendado", ok: true },
          ]}
          postChatNote="Todo queda registrado: perfil, intención, reunión agendada. El agente sabe quién es Martín la próxima vez que escribe." />
      </motion.div>
      <div className="flex justify-center">
        <motion.button initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
          whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }} onClick={handleStart}
          className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-white/10 border border-white/20 text-white font-bold hover:bg-white/15 transition-all duration-300 backdrop-blur-md text-sm">
          <Zap size={16} className="text-primary" />
          {isRunning ? "Reiniciar Simulación" : "▶ Simular Conversación en Vivo"}
        </motion.button>
      </div>
    </div>
  );
};

// ─── 3D NICHE BENEFITS SECTION ────────────────────────────────────────────────

const niches = [
  {
    icon: <ShoppingCart className="w-7 h-7" />,
    color: "#f97316",
    glow: "rgba(249,115,22,0.35)",
    border: "rgba(249,115,22,0.3)",
    label: "E-commerce & Tiendas",
    pain: "Clientes abandonan el carrito. Nadie responde a las 11 PM. Ventas perdidas.",
    benefits: [
      { icon: <ShoppingCart size={14} />, text: "Recuperación automática de carritos abandonados" },
      { icon: <Clock size={14} />, text: "Atención instantánea a cualquier hora del día" },
      { icon: <BarChart3 size={14} />, text: "Upsell y cross-sell inteligente según el historial" },
      { icon: <DBIcon size={14} />, text: "Fichas de cliente completas post cada interacción" },
    ],
    stat: "+73%",
    statLabel: "recuperación de carritos",
  },
  {
    icon: <HeartPulse className="w-7 h-7" />,
    color: "#ec4899",
    glow: "rgba(236,72,153,0.35)",
    border: "rgba(236,72,153,0.3)",
    label: "Clínicas & Salud",
    pain: "Turnos perdidos, llamadas sin respuesta, recordatorios manuales que nadie hace.",
    benefits: [
      { icon: <CalendarX size={14} />, text: "Agenda de turnos 24/7 sin asistente humano" },
      { icon: <Timer size={14} />, text: "Recordatorios automáticos 48hs antes del turno" },
      { icon: <Users size={14} />, text: "Historial clínico del paciente accesible en segundos" },
      { icon: <PhoneOff size={14} />, text: "Cero llamadas perdidas: el bot responde siempre" },
    ],
    stat: "-62%",
    statLabel: "ausentismo de turnos",
  },
  {
    icon: <Home className="w-7 h-7" />,
    color: "#8b5cf6",
    glow: "rgba(139,92,246,0.35)",
    border: "rgba(139,92,246,0.3)",
    label: "Inmobiliarias",
    pain: "Leads que se enfrían solos. Seguimiento manual. Propiedades que nadie recuerda mostrar.",
    benefits: [
      { icon: <Zap size={14} />, text: "Cualificación instantánea del lead por zona y presupuesto" },
      { icon: <Search size={14} />, text: "Búsqueda personalizada de propiedades automatizada" },
      { icon: <TrendingUp size={14} />, text: "Seguimiento activo hasta el cierre de la operación" },
      { icon: <DBIcon size={14} />, text: "CRM actualizado con cada consulta recibida" },
    ],
    stat: "3x",
    statLabel: "más cierres mensuales",
  },
  {
    icon: <UtensilsCrossed className="w-7 h-7" />,
    color: "#eab308",
    glow: "rgba(234,179,8,0.35)",
    border: "rgba(234,179,8,0.3)",
    label: "Restaurantes & Gastronomía",
    pain: "Reservas por teléfono, preguntas repetitivas de menú y pedidos que se pierden.",
    benefits: [
      { icon: <CalendarX size={14} />, text: "Reservas automáticas por WhatsApp o Instagram" },
      { icon: <MessageSquareText size={14} />, text: "Menú interactivo y consultas de ingredientes 24/7" },
      { icon: <Timer size={14} />, text: "Confirmación y recordatorio de reserva automatizado" },
      { icon: <BadgeDollarSign size={14} />, text: "Promociones del día enviadas al segmento correcto" },
    ],
    stat: "100%",
    statLabel: "reservas sin personal",
  },
  {
    icon: <BriefcaseBusiness className="w-7 h-7" />,
    color: "#06b6d4",
    glow: "rgba(6,182,212,0.35)",
    border: "rgba(6,182,212,0.3)",
    label: "Coaches & Consultores",
    pain: "Agenda caótica, leads que no se convierten, y cero seguimiento post sesión.",
    benefits: [
      { icon: <CalendarX size={14} />, text: "Agenda de sesiones y recordatorios automáticos" },
      { icon: <Users size={14} />, text: "Onboarding automático del nuevo cliente" },
      { icon: <DBIcon size={14} />, text: "Resumen de sesión guardado en CRM post llamada" },
      { icon: <TrendingUp size={14} />, text: "Seguimiento de avance por etapas del programa" },
    ],
    stat: "5hs",
    statLabel: "ahorradas por semana",
  },
  {
    icon: <Store className="w-7 h-7" />,
    color: "#C3D809",
    glow: "rgba(195,216,9,0.35)",
    border: "rgba(195,216,9,0.4)",
    label: "PYME & Comercios",
    pain: "Equipo saturado de consultas de stock, precios y envíos que se repiten todo el día.",
    benefits: [
      { icon: <Wifi size={14} />, text: "Respuesta omnicanal: WhatsApp, Instagram, Web" },
      { icon: <Search size={14} />, text: "Consultas de stock y precios respondidas al instante" },
      { icon: <TrendingDown size={14} />, text: "Reducción del 80% de consultas manuales al equipo" },
      { icon: <BadgeDollarSign size={14} />, text: "Escala sin contratar más personal" },
    ],
    stat: "-80%",
    statLabel: "carga operativa del equipo",
  },
];

const Tilt3DCard = ({ niche, index }: { niche: typeof niches[0]; index: number }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [12, -12]), { stiffness: 300, damping: 30 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-12, 12]), { stiffness: 300, damping: 30 });
  const glareX = useTransform(x, [-0.5, 0.5], ["-30%", "130%"]);
  const glareY = useTransform(y, [-0.5, 0.5], ["-30%", "130%"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  };
  const handleMouseLeave = () => { x.set(0); y.set(0); };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ delay: index * 0.08, duration: 0.6, ease: "easeOut" }}
      style={{ perspective: 1000 }}
    >
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="relative rounded-3xl p-px cursor-default group h-full"
        whileHover={{ scale: 1.02, z: 30 }}
        transition={{ duration: 0.2 }}
      >
        {/* Animated border glow */}
        <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{ background: `radial-gradient(circle at 50% 0%, ${niche.glow}, transparent 70%)`, filter: "blur(1px)" }} />
        <div className="absolute inset-0 rounded-3xl border transition-colors duration-300"
          style={{ borderColor: niche.border }} />

        {/* Card Body */}
        <div className="relative bg-[#080808] rounded-3xl p-7 h-full overflow-hidden"
          style={{ transform: "translateZ(0)" }}>
          
          {/* Glare Effect */}
          <motion.div className="absolute w-40 h-40 rounded-full pointer-events-none opacity-0 group-hover:opacity-100 blur-[40px] transition-opacity duration-300 -z-0"
            style={{ left: glareX, top: glareY, background: `radial-gradient(circle, ${niche.glow}, transparent)` }} />

          {/* Floating stat badge */}
          <div className="absolute top-5 right-5 flex flex-col items-end">
            <span className="text-2xl font-black leading-none" style={{ color: niche.color }}>{niche.stat}</span>
            <span className="text-[10px] text-gray-500 font-medium text-right leading-tight max-w-[80px]">{niche.statLabel}</span>
          </div>

          {/* Icon */}
          <motion.div
            className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5 relative z-10 border"
            style={{
              backgroundColor: `${niche.color}18`,
              borderColor: `${niche.color}40`,
              color: niche.color,
              boxShadow: `0 0 20px ${niche.glow}`,
              transform: "translateZ(40px)",
            }}
          >
            {niche.icon}
          </motion.div>

          {/* Label */}
          <p className="text-xs font-bold uppercase tracking-widest mb-1.5 relative z-10" style={{ color: niche.color }}>{niche.label}</p>

          {/* Pain point */}
          <p className="text-gray-400 text-[15px] leading-relaxed mb-6 relative z-10 italic">
            &ldquo;{niche.pain}&rdquo;
          </p>

          {/* Divider */}
          <div className="w-full h-px mb-6 relative z-10" style={{ background: `linear-gradient(to right, ${niche.color}40, transparent)` }} />

          {/* Benefits list */}
          <ul className="space-y-3.5 relative z-10">
            {niche.benefits.map((b, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="mt-1 shrink-0" style={{ color: niche.color }}>{b.icon}</span>
                <span className="text-gray-300 text-sm leading-snug md:text-[15px]">{b.text}</span>
              </li>
            ))}
          </ul>
        </div>
      </motion.div>
    </motion.div>
  );
};

const NicheBenefitsSection = () => {
  return (
    <div className="w-full max-w-6xl mx-auto py-24 mb-10">
      {/* Section Header */}
      <div className="text-center mb-16">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-white font-bold text-[10px] tracking-widest uppercase mb-6 backdrop-blur-md">
          Beneficios por Industria
        </motion.div>
        <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
          className="text-3xl md:text-5xl font-black text-white mb-4 leading-tight">
          Tu negocio tiene un{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-orange-400 to-primary italic pr-2">dolor específico.</span>
          <br />
          Tenemos la solución exacta.
        </motion.h2>
        <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}
          className="text-gray-400 md:text-lg max-w-2xl mx-auto">
          No vendemos tecnología genérica. Diseñamos ecosistemas de IA adaptados al problema puntual de tu industria.
        </motion.p>
      </div>

      {/* 3D Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {niches.map((niche, i) => (
          <Tilt3DCard key={i} niche={niche} index={i} />
        ))}
      </div>

      {/* Bottom CTA strip */}
      <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 }}
        className="mt-14 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-md p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <p className="text-white font-black text-xl md:text-2xl mb-2">¿No ves tu industria?</p>
          <p className="text-gray-400 text-sm max-w-md">Trabajamos con cualquier sector. Si tu negocio tiene procesos repetitivos, lo automatizamos.</p>
        </div>
        <Link href="https://wa.me/543515555123?text=Hola,%20quiero%20ver%20si%20mi%20negocio%20puede%20automatizarse." target="_blank" rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-primary text-black px-7 py-4 rounded-full font-black hover:bg-white transition-all duration-300 hover:scale-105 shrink-0 text-sm">
          Hablemos de mi negocio <ArrowRight size={16} />
        </Link>
      </motion.div>
    </div>
  );
};

// ─── ROADMAP SECTION ───────────────────────────────────────────────────────────

const RoadmapSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start 60%", "end 80%"] });
  const scaleY = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  const steps = [
    { title: "Auditoría & Descubrimiento", desc: "Mapeamos tus procesos operativos manuales actuales y detectamos cuellos de botella para diseñar el alcance exacto de la Inteligencia Artificial.", icon: <Search className="w-5 h-5" />, color: "text-blue-400", glow: "shadow-[0_0_20px_rgba(96,165,250,0.4)]", gradient: "from-blue-400/20" },
    { title: "Arquitectura Lógica", desc: "Diseñamos los diagramas de flujo y planificamos las integraciones clave (CRM, bases de datos) estableciendo tu Sistema Base.", icon: <Layers className="w-5 h-5" />, color: "text-purple-400", glow: "shadow-[0_0_20px_rgba(192,132,252,0.4)]", gradient: "from-purple-400/20" },
    { title: "Desarrollo & Entrenamiento", desc: "Codificamos y entrenamos los modelos con el conocimiento de tu empresa. Ajustamos la personalidad, el tono y los prompts maestros.", icon: <Code className="w-5 h-5" />, color: "text-emerald-400", glow: "shadow-[0_0_20px_rgba(52,211,153,0.4)]", gradient: "from-emerald-400/20" },
    { title: "Despliegue & Monitoreo", desc: "Puesta en producción del Agente. Activamos el dashboard de métricas en tiempo real y ajustamos continuamente en base a sus iteraciones.", icon: <Rocket className="w-5 h-5" />, color: "text-primary", glow: "shadow-[0_0_20px_rgba(195,216,9,0.4)]", gradient: "from-primary/20" }
  ];
  return (
    <div className="w-full max-w-4xl mx-auto py-24 mb-16 relative" ref={containerRef}>
      <div className="text-center mb-24">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-white font-bold text-[10px] md:text-xs tracking-widest uppercase mb-6 backdrop-blur-md">
          Roadmap Técnico
        </motion.div>
        <h2 className="text-3xl md:text-5xl font-black text-white mb-4">Fases del <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-emerald-400 italic pr-2">Proyecto.</span></h2>
        <p className="text-gray-400 md:text-lg">Un proceso de ingeniería metódico, predecible y orientado a resultados.</p>
      </div>
      <div className="relative pl-6 md:pl-0">
        <div className="absolute left-[26px] md:left-1/2 top-0 bottom-0 w-1.5 md:-ml-[3px] bg-[#111] rounded-full overflow-hidden shadow-[inset_0_0_10px_rgba(0,0,0,1)]">
          <motion.div className="w-full bg-gradient-to-b from-primary via-emerald-400 to-blue-500 origin-top relative" style={{ height: scaleY }}>
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-4 bg-white rounded-full shadow-[0_0_15px_#C3D809,0_0_30px_#C3D809] blur-[2px] z-30 translate-y-1/2" />
          </motion.div>
        </div>
        <div className="flex flex-col gap-12 md:gap-24 relative z-10 pb-16">
          {steps.map((step, index) => {
            const isEven = index % 2 === 0;
            return (
              <div key={index} className="flex flex-col md:flex-row items-start md:items-center w-full group relative">
                <div className={`hidden md:flex w-1/2 justify-end pr-16 ${isEven ? 'opacity-100' : 'opacity-0'} relative`}>
                  {isEven && (
                    <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}
                      className="bg-gradient-to-br from-[#0c0c0c] to-[#050505] border border-white/10 p-8 rounded-3xl group-hover:border-white/30 transition-all duration-300 shadow-2xl w-full text-right relative overflow-hidden">
                      <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl ${step.gradient} to-transparent blur-[40px] opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                      <h3 className="text-2xl font-bold text-white mb-3 relative z-10">{step.title}</h3>
                      <p className="text-gray-400 text-sm leading-relaxed relative z-10 font-medium">{step.desc}</p>
                    </motion.div>
                  )}
                </div>
                <div className="absolute left-[13px] md:static md:w-16 flex justify-center shrink-0 -ml-[6px] md:-ml-0">
                  <motion.div initial={{ scale: 0 }} whileInView={{ scale: 1 }} transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
                    className={`w-14 h-14 rounded-full border border-white/20 bg-[#0c0c0c] flex items-center justify-center relative z-20 transition-all duration-500 shadow-[inset_0_4px_10px_rgba(255,255,255,0.1),0_10px_20px_rgba(0,0,0,0.8)] ring-4 ring-black group-hover:${step.glow}`}>
                    <div className={`absolute inset-0 bg-gradient-to-tr ${step.gradient} to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity blur-[2px]`} />
                    <div className="absolute inset-1 rounded-full bg-gradient-to-b from-white/10 to-transparent border border-white/5 opacity-50" />
                    <div className={`${step.color} relative z-10 drop-shadow-[0_0_8px_currentColor]`}>{step.icon}</div>
                  </motion.div>
                </div>
                <div className={`w-full md:w-1/2 pl-16 md:pl-16 flex ${isEven ? 'md:hidden' : 'opacity-100'} relative`}>
                  <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}
                    className="bg-gradient-to-tl from-[#0c0c0c] to-[#050505] border border-white/10 p-8 rounded-3xl group-hover:border-white/30 transition-all duration-300 shadow-2xl w-full text-left relative overflow-hidden">
                    <div className={`absolute top-0 left-0 w-32 h-32 bg-gradient-to-br ${step.gradient} to-transparent blur-[40px] opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                    <div className={`md:hidden text-[10px] ${step.color} font-bold uppercase tracking-widest mb-3`}>Fase 0{index + 1}</div>
                    <h3 className="text-2xl font-bold text-white mb-3 relative z-10">{step.title}</h3>
                    <p className="text-gray-400 text-sm leading-relaxed relative z-10 font-medium">{step.desc}</p>
                  </motion.div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// ─── MAIN PAGE ─────────────────────────────────────────────────────────────────

export default function AutomationsPage() {
  return (
    <main className="flex min-h-screen flex-col bg-background text-foreground bg-mesh pt-32 pb-20 relative">
      <div className="max-w-6xl mx-auto px-4 md:px-10 w-full relative z-10">

        {/* Header */}
        <motion.div initial="hidden" animate="visible" variants={staggerContainer}
          className="mb-20 text-center flex flex-col items-center">
          <motion.div variants={fadeIn} className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-md">
            <Cpu className="text-primary w-4 h-4" />
            <span className="text-xs font-semibold text-gray-300 tracking-wider">INTELIGENCIA ARTIFICIAL APLICADA</span>
          </motion.div>
          <motion.h1 variants={fadeIn} className="text-5xl md:text-7xl font-black tracking-tighter mb-6 text-white leading-[1.05]">
            Mientras dormís,<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-lime-300 to-emerald-400 italic pr-2">tu IA ya cerró la venta.</span>
          </motion.h1>
          <motion.p variants={fadeIn} className="text-lg md:text-xl text-gray-300 max-w-2xl text-center text-balance leading-relaxed">
            Sistemas inteligentes que clonan tu conocimiento, atienden a tus clientes 24/7 y cualifican leads sin intervención humana. Multiplica el rendimiento de tu equipo por cien.
          </motion.p>
        </motion.div>

        {/* Feature Grid */}
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-24">
          {[
            { icon: <MessageSquareText />, title: "Bots de WhatsApp", desc: "Asistentes de IA que leen, razonan y responden mensajes de WhatsApp en tiempo real." },
            { icon: <Clock />, title: "Disponibilidad 24/7", desc: "No pierdas ventas de madrugada. Tu IA atiende simultáneamente a miles de personas sin descansar." },
            { icon: <Network />, title: "Conexión Omnicanal", desc: "Integración completa con CRMs (HubSpot, Salesforce), Google Sheets, Calendly y más." }
          ].map((feature, i) => (
            <motion.div key={i} variants={fadeIn} className="bg-white/5 border border-white/10 p-8 rounded-[2rem] hover:bg-white/10 transition-colors group">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">{feature.icon}</div>
              <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
              <p className="text-gray-300 text-sm leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Deep Dive */}
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}
          className="bg-black/60 border border-white/10 rounded-[3rem] p-8 md:p-16 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 blur-[130px] rounded-full pointer-events-none" />
          <div className="grid md:grid-cols-2 gap-12 items-center relative z-10">
            <motion.div variants={fadeIn} className="order-2 md:order-1 relative">
              <div className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col gap-4 backdrop-blur-md relative z-10 scale-[0.98] rotate-2">
                <div className="flex justify-between items-center border-b border-white/10 pb-4 mb-2">
                  <div className="flex gap-3 items-center">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center shrink-0 border border-primary/30"><Bot size={20} className="text-primary" /></div>
                    <div><h4 className="text-white font-bold text-sm">Operador IA de Ventas</h4><span className="text-[10px] text-green-400 flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-400" />Online</span></div>
                  </div>
                </div>
                <div className="flex gap-3 items-end opacity-90"><div className="bg-white/10 rounded-xl rounded-bl-sm p-4 text-sm text-gray-300 w-fit max-w-[85%] border border-white/5">Hola, analicé tus gastos del mes. ¿Quieres que agende una reunión técnica con el equipo o te envío el reporte en PDF?</div></div>
                <div className="flex justify-end opacity-90"><div className="bg-primary text-black font-medium rounded-xl rounded-br-sm p-4 text-sm w-fit max-w-[85%]">Enviámelo en PDF y pasame también opciones de Lunes a Jueves.</div></div>
                <div className="flex gap-3 items-end opacity-90"><div className="bg-white/10 rounded-xl rounded-bl-sm p-4 text-sm text-gray-300 w-fit max-w-[85%] border border-white/5">¡Enviado! 📄 Y aquí tienes el enlace para agendar con prioridad técnica la próxima semana: [Link]</div></div>
              </div>
              <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-gradient-to-br from-primary to-emerald-400 blur-[80px] z-0 opacity-40" />
            </motion.div>
            <motion.div variants={fadeIn} className="order-1 md:order-2 space-y-6 md:pl-10">
              <h2 className="text-3xl md:text-5xl font-black text-white mb-2 leading-tight">El fin de lo <br /><span className="text-primary italic">manual.</span></h2>
              <p className="text-gray-300 text-lg mb-8">Desarrollamos redes neuronales acopladas al flujo de tu negocio. Si una tarea es repetitiva, predecible y se basa en datos, un Agente de IA entrenado a medida puede hacerla mejor, más rápido y sin margen de error.</p>
              <ul className="space-y-4 mb-8">
                {["Extracción e interpretación de bases de datos","Atención al cliente Human-like (voces y texto natural)","Procesamiento autónomo de carritos abandonados","Auditorías automáticas sobre datos internos"].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-gray-300"><Bot className="text-primary w-5 h-5 shrink-0" /><span>{item}</span></li>
                ))}
              </ul>
              <Link href="https://wa.me/543515555123" target="_blank" rel="noopener noreferrer" aria-label="Agendar auditoría IA gratuita por WhatsApp"
                className="inline-flex items-center gap-2 bg-primary text-black px-8 py-4 rounded-full font-bold hover:bg-white transition-colors min-h-[52px]">
                Auditoría IA Gratuita <ArrowRight size={18} aria-hidden="true" />
              </Link>
            </motion.div>
          </div>
        </motion.div>

        {/* CHAT COMPARISON */}
        <ChatComparisonSection />

        {/* 3D NICHE BENEFITS */}
        <NicheBenefitsSection />

        {/* ROADMAP */}
        <RoadmapSection />
      </div>

      {/* FOOTER CTA */}
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={staggerContainer}
        className="w-full mt-10 md:mt-20 rounded-t-[3rem] md:rounded-t-[5rem] overflow-hidden relative isolate px-4 py-20 bg-[#030303] border-t border-white/5 shadow-[0_-50px_100px_rgba(0,0,0,0.8)]">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-primary/20 blur-[150px] rounded-[100%] pointer-events-none -z-10 animate-pulse" />
        <div className="max-w-[1000px] mx-auto text-center flex flex-col items-center relative z-10">
          <motion.div variants={{hidden:{opacity:0,y:20},visible:{opacity:1,y:0,transition:{duration:0.8}}}} className="mb-6 flex justify-center space-x-2">
            <span className="px-5 py-2 rounded-full bg-white/10 text-white font-bold text-xs md:text-sm border border-white/20 backdrop-blur-md">Tu Nuevo Empleado del Mes</span>
          </motion.div>
          <motion.h2 variants={{hidden:{opacity:0,y:20},visible:{opacity:1,y:0,transition:{duration:0.8}}}}
            className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.1] mb-6 drop-shadow-2xl">
            Reemplaza el <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-emerald-500 block italic pr-2">TRABAJO MANUAL</span>
          </motion.h2>
          <motion.p variants={{hidden:{opacity:0,y:20},visible:{opacity:1,y:0,transition:{duration:0.8}}}}
            className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto font-medium leading-relaxed mb-12 text-balance">
            Automatiza tareas repetitivas y deja que un asistente incansable se encargue de <strong className="text-white">gestionar el 100% de tus ventas</strong> los 365 días del año.
          </motion.p>
          <motion.div variants={{hidden:{opacity:0,y:20},visible:{opacity:1,y:0,transition:{duration:0.8}}}}>
            <Link href="https://wa.me/543515555123?text=Hola,%20quiero%20conocer%20c%C3%B3mo%20un%20agente%20de%20IA%20puede%20automatizar%20mis%20ventas." target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-3 bg-white text-black px-8 py-5 md:px-10 md:py-6 rounded-full font-black text-lg md:text-2xl hover:bg-primary transition-all duration-300 hover:scale-[1.05] shadow-[0_0_50px_rgba(255,255,255,0.2)] hover:shadow-[0_0_60px_rgba(195,216,9,0.5)] group">
              Cotizar mi Agente IA <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </motion.div>
    </main>
  );
}
