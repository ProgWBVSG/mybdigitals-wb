"use client";

import { motion } from "framer-motion";
import {
  CheckCircle2,
  Ticket,
  MapPin,
  CalendarDays,
  Music,
  Camera,
  Users,
  Heart,
  Gift,
  MessageCircle,
  ArrowRight,
  QrCode,
  Star,
  Shield,
  Zap,
  ChevronDown,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const WA_LINK =
  "https://wa.me/543515555123?text=Hola!%20quiero%20info%20sobre%20la%20invitaci%C3%B3n%20web";

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.25, 0.46, 0.45, 0.94] as const } },
};

const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

/* ── Phone Mockup ─────────────────────────────────────────── */
function PhoneMockup() {
  return (
    <div className="flex justify-center" style={{ perspective: "900px" }}>
      <motion.div
        animate={{ rotateY: [4, -4, 4], rotateX: [3, -3, 3], y: [0, -14, 0] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
        style={{ transformStyle: "preserve-3d" }}
        className="relative"
      >
        {/* Glow floor */}
        <div
          aria-hidden="true"
          className="absolute inset-x-8 -bottom-8 h-14 blur-3xl rounded-full opacity-50"
          style={{ background: "#C3D809" }}
        />
        {/* Phone frame */}
        <div
          className="relative w-[240px] sm:w-[260px] rounded-[2.4rem] overflow-hidden"
          style={{
            background: "#0c0d13",
            border: "2px solid rgba(255,255,255,0.10)",
            boxShadow:
              "0 50px 120px rgba(0,0,0,0.9), 0 0 0 1px rgba(255,255,255,0.04), inset 0 1px 0 rgba(255,255,255,0.08)",
          }}
        >
          {/* Notch */}
          <div className="flex justify-center pt-3 pb-1">
            <div className="w-20 h-5 rounded-full bg-black" aria-hidden="true" />
          </div>

          {/* Screen content */}
          <div className="px-4 pb-6 flex flex-col gap-3">
            {/* Hero image placeholder */}
            <div
              className="w-full h-32 rounded-2xl flex items-center justify-center relative overflow-hidden"
              style={{ background: "linear-gradient(135deg, #C3D80920, #00d08420)" }}
            >
              <div className="absolute inset-0 opacity-30" style={{
                backgroundImage: "radial-gradient(circle at 30% 30%, #C3D809, transparent 60%)",
              }} aria-hidden="true" />
              <div className="text-center z-10">
                <p className="text-xs text-white/50 uppercase tracking-widest">Sofia &amp; Matías</p>
                <p className="text-lg font-black text-white">Casamiento</p>
                <p className="text-[10px] text-primary">15 · Nov · 2025</p>
              </div>
              {/* Floating hearts */}
              {[{ top: "10%", left: "8%" }, { top: "60%", right: "10%" }].map((pos, i) => (
                <motion.div
                  key={i}
                  animate={{ y: [0, -6, 0], opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2.5, repeat: Infinity, delay: i * 1.2 }}
                  className="absolute text-primary text-sm"
                  style={pos}
                  aria-hidden="true"
                >
                  ♥
                </motion.div>
              ))}
            </div>

            {/* Countdown */}
            <div className="grid grid-cols-4 gap-1.5">
              {[
                { val: "47", label: "días" },
                { val: "12", label: "horas" },
                { val: "34", label: "min" },
                { val: "08", label: "seg" },
              ].map((c) => (
                <div
                  key={c.label}
                  className="rounded-xl py-2 text-center"
                  style={{ background: "rgba(195,216,9,0.1)", border: "1px solid rgba(195,216,9,0.2)" }}
                >
                  <p className="text-sm font-black text-primary">{c.val}</p>
                  <p className="text-[8px] text-gray-500">{c.label}</p>
                </div>
              ))}
            </div>

            {/* Features micro-list */}
            {["📍 Salón La Perla · GPS", "🎵 Bienvenidos a este amor", "👗 Dress code: Formal"].map((item) => (
              <div
                key={item}
                className="text-[10px] text-gray-300 bg-white/5 border border-white/8 rounded-xl px-3 py-2"
              >
                {item}
              </div>
            ))}

            {/* CTA button */}
            <div
              className="w-full py-2.5 rounded-2xl text-center text-[11px] font-black text-black"
              style={{ background: "#C3D809" }}
            >
              ✅ Confirmar Asistencia
            </div>
          </div>
        </div>

        {/* WhatsApp bubble */}
        <motion.div
          animate={{ scale: [1, 1.05, 1], y: [0, -4, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -right-12 top-12 bg-[#25D366] rounded-2xl rounded-tr-none px-3 py-2 shadow-xl shadow-green-500/30"
          aria-hidden="true"
        >
          <p className="text-[10px] text-white font-bold whitespace-nowrap">Llegó tu invitación! 🎉</p>
        </motion.div>
      </motion.div>
    </div>
  );
}

/* ── FAQ Item ─────────────────────────────────────────────── */
function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-white/8 rounded-2xl overflow-hidden">
      <button
        onClick={() => setOpen((p) => !p)}
        className="w-full flex items-center justify-between px-6 py-5 text-left hover:bg-white/5 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        aria-expanded={open}
      >
        <span className="font-semibold text-white text-sm md:text-base pr-4">{q}</span>
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.25 }}>
          <ChevronDown size={18} className="text-gray-400 shrink-0" aria-hidden="true" />
        </motion.div>
      </button>
      <motion.div
        initial={false}
        animate={{ height: open ? "auto" : 0 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="overflow-hidden"
      >
        <p className="px-6 pb-5 text-gray-300 text-sm leading-relaxed">{a}</p>
      </motion.div>
    </div>
  );
}

/* ── Main Page ────────────────────────────────────────────── */
export default function InvitationsPage() {
  const features = [
    { icon: <Users size={22} />, title: "RSVP Propio", desc: "Tus invitados confirman asistencia dentro de la invitación sin salir de la experiencia ni usar Google Forms." },
    { icon: <MapPin size={22} />, title: "GPS Integrado", desc: "Mapas precisos hacia cada ubicación del evento. Tus invitados llegan sin complicaciones." },
    { icon: <CalendarDays size={22} />, title: "Cuenta Regresiva", desc: "Cronómetro en tiempo real que genera expectativa desde que reciben la invitación." },
    { icon: <Music size={22} />, title: "Música de Fondo", desc: "El tema que elijas suena de fondo. La experiencia completa desde el primer clic." },
    { icon: <Camera size={22} />, title: "Álbum QR de Fotos", desc: "Un código QR para que tus invitados suban fotos durante la fiesta. Sin apps ni registros." },
    { icon: <Heart size={22} />, title: "Personalizada por Invitado", desc: "Cada persona recibe su invitación con su nombre y lugares asignados, lista para enviar por WhatsApp." },
    { icon: <Gift size={22} />, title: "Lista de Regalos", desc: "CVU/Alias o links de tiendas para que tus invitados puedan hacerte llegar su regalo con facilidad." },
    { icon: <MessageCircle size={22} />, title: "Dress Code", desc: "Informá a tus invitados el código de vestimenta con estilo, dentro de la misma invitación." },
    { icon: <QrCode size={22} />, title: "Trivia Interactiva", desc: "Tus invitados juegan respondiendo preguntas personalizadas. Una experiencia única que los enamora." },
    { icon: <Star size={22} />, title: "Padrinos & Historia", desc: "Destacá a las personas claves y contá la historia que une a los festejados, con tu toque personal." },
    { icon: <Zap size={22} />, title: "Entrega en 72 hs", desc: "Tu invitación estará lista en 3 días hábiles desde que nos mandás la información." },
    { icon: <Shield size={22} />, title: "Cambios Posteriores", desc: "¿Cambió el horario o el salón? Todo se actualiza en segundos y todos verán la versión más reciente." },
  ];

  const allIncludes = [
    "Invitación web 100% personalizada",
    "Confirmación de asistencia integrada",
    "Cuenta regresiva en tiempo real",
    "GPS con mapas a cada ubicación",
    "Música de fondo a elección",
    "Galería de fotos del evento",
    "Lista de regalos (CBU/Alias)",
    "Dress code con diseño",
    "Trivia interactiva para invitados",
    "Álbum QR compartido ilimitado",
    "Padrinos y sección historia",
    "Personalizacion por invitado (con nombre)",
    "Save The Date animado",
    "Hospedajes y traslados",
    "Soporte técnico durante el evento",
    "Actualizaciones ilimitadas post-entrega",
  ];

  const faqs = [
    {
      q: "¿Cuánto tiempo antes debo pedirla?",
      a: "Lo ideal es pedirla 2 o 3 meses antes del evento para que tus invitados la reciban con tiempo. Si necesitás urgente, tenemos entrega en 24 hs con un costo adicional.",
    },
    {
      q: "¿Puedo hacer cambios después de que esté publicada?",
      a: "Sí, siempre. ¿Cambió el salón, el horario o el alias de regalo? Lo actualizamos y todos los invitados ven la versión más reciente automáticamente.",
    },
    {
      q: "¿Cuántos invitados puedo agregar?",
      a: "Podés enviarla a todos los que quieras, sin costo extra por invitado. Envíos ilimitados por WhatsApp.",
    },
    {
      q: "¿Cómo funciona el sistema de confirmación?",
      a: "Tus invitados completan un formulario dentro de la invitación (ni Google Forms ni redirecciones). Vos recibís un listado en tiempo real con nombre, acompañantes y restricciones alimentarias. Podés exportarlo a Excel cuando quieras.",
    },
    {
      q: "¿Puedo pagar en cuotas?",
      a: "Sí. Podés abonar en hasta 3 cuotas sin interés con tarjeta de débito o crédito. El precio en cuotas es de $23.666 x 3. También podés pagar en un solo pago de $68.999.",
    },
    {
      q: "¿Cómo es el proceso para crearla?",
      a: "Nos contactás por WhatsApp, te enviamos un formulario simple para cargar todos los datos (nombres, fotos, fecha, ubicación, música, etc.) y en 3 días hábiles te entregamos la invitación lista para compartir.",
    },
    {
      q: "¿Qué es el álbum QR de fotos?",
      a: "Es un código QR que imprimís y colocás en el evento. Tus invitados lo escanean y suben sus fotos en tiempo real a un álbum compartido, sin necesidad de descargar apps ni crear cuentas.",
    },
  ];

  const installs = [
    { step: "01", title: "Nos contactás por WhatsApp", desc: "Te enviamos el formulario para completar datos, fotos, música y preferencias del evento." },
    { step: "02", title: "Diseñamos tu invitación", desc: "Personalizamos cada detalle según el estilo y temática de tu celebración." },
    { step: "03", title: "Aprobás y la compartís", desc: "La recibís en 72 hs. Compartís por WhatsApp a todos tus invitados. Sin límite de envíos." },
  ];

  return (
    <main className="flex min-h-screen flex-col bg-background text-foreground bg-mesh pt-28 pb-24">
      <div className="max-w-6xl mx-auto px-5 md:px-10 w-full relative z-10">

        {/* ── HERO ──────────────────────────────────────────── */}
        <section aria-labelledby="inv-hero-title" className="grid lg:grid-cols-2 gap-12 items-center mb-28 md:mb-36">
          {/* Left text */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={stagger}
            className="flex flex-col"
          >
            <motion.div variants={fadeUp} className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-md w-fit">
              <Ticket className="text-primary w-4 h-4" aria-hidden="true" />
              <span className="text-xs font-semibold text-gray-300 tracking-wider uppercase">Invitaciones web interactivas</span>
            </motion.div>

            <motion.h1
              id="inv-hero-title"
              variants={fadeUp}
              className="text-5xl md:text-6xl xl:text-7xl font-black tracking-tight mb-6 text-white leading-[1.02]"
            >
              La invitación que{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-lime-300 to-emerald-400 italic">
                enamora
              </span>{" "}
              antes de llegar al evento.
            </motion.h1>

            <motion.p variants={fadeUp} className="text-gray-300 text-lg leading-relaxed mb-8 max-w-lg">
              Invitaciones web 100% personalizadas para Bodas, 15 Años, Baby Shower y más. Tus invitados confirman, ubican el salón, escuchan tu música y viven la experiencia desde el primer clic.
            </motion.p>

            {/* Trust badges */}
            <motion.div variants={fadeUp} className="flex flex-wrap gap-4 mb-8">
              {["🔒 Pago seguro", "📲 Envío por WhatsApp", "⚡ Entrega en 72 hs", "♾️ Sin límite de invitados"].map((badge) => (
                <span key={badge} className="text-xs font-semibold text-gray-300 bg-white/5 border border-white/10 px-3 py-1.5 rounded-full">
                  {badge}
                </span>
              ))}
            </motion.div>

            {/* Price highlight */}
            <motion.div
              variants={fadeUp}
              className="rounded-2xl border p-6 mb-6 relative overflow-hidden"
              style={{ background: "rgba(195,216,9,0.06)", borderColor: "rgba(195,216,9,0.25)" }}
            >
              <div className="absolute top-0 right-0 w-32 h-32 blur-3xl opacity-20 rounded-full pointer-events-none" style={{ background: "#C3D809" }} aria-hidden="true" />
              <div className="flex flex-wrap items-end gap-3 mb-2">
                <span className="text-4xl md:text-5xl font-black text-white">$68.999</span>
                <span className="text-gray-400 text-sm pb-1">pago único</span>
              </div>
              <p className="text-gray-300 text-sm mb-4">
                o en <strong className="text-primary">3 cuotas de $23.666</strong> sin interés con tarjeta
              </p>
              <Link
                href={WA_LINK}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Reservar mi invitación por WhatsApp"
                className="inline-flex items-center gap-2 bg-primary text-black px-7 py-3.5 rounded-full font-black text-sm hover:bg-white transition-colors hover:scale-105 shadow-lg min-h-[52px]"
                style={{ boxShadow: "0 12px 32px rgba(195,216,9,0.30)" }}
              >
                <MessageCircle size={18} aria-hidden="true" />
                Reservar mi invitación por WhatsApp
              </Link>
              <p className="text-[11px] text-gray-500 mt-2">Sin costo oculto · Precio sin interés con tarjeta</p>
            </motion.div>

            {/* Gallery Buttons */}
            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-3 mb-8">
              <Link
                href="/servicios/web/invitaciones/bodas"
                className="flex-1 inline-flex items-center justify-center gap-2 border border-rose-500/30 bg-rose-500/10 text-rose-200 px-6 py-3.5 rounded-2xl font-semibold text-sm hover:bg-rose-500/20 transition-colors"
              >
                💍 Ver diseños de Bodas
              </Link>
              <Link
                href="/servicios/web/invitaciones/cumples"
                className="flex-1 inline-flex items-center justify-center gap-2 border border-violet-500/30 bg-violet-500/10 text-violet-200 px-6 py-3.5 rounded-2xl font-semibold text-sm hover:bg-violet-500/20 transition-colors"
              >
                🎉 Ver de Cumples & 15s
              </Link>
            </motion.div>

            {/* Social proof */}
            <motion.div variants={fadeUp} className="flex items-center gap-3">
              <div className="flex -space-x-2" aria-hidden="true">
                {["💍", "🎉", "👶", "🥂"].map((emoji, i) => (
                  <div key={i} className="w-8 h-8 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-sm">
                    {emoji}
                  </div>
                ))}
              </div>
              <p className="text-sm text-gray-400">
                <strong className="text-white">+200 eventos</strong> celebrados con MYB
              </p>
            </motion.div>
          </motion.div>

          {/* Right: Phone mockup */}
          <motion.div
            initial={{ opacity: 0, x: 40, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="hidden lg:flex justify-center items-center relative"
          >
            <PhoneMockup />
          </motion.div>
        </section>

        {/* ── HOW IT WORKS ──────────────────────────────────── */}
        <motion.section
          aria-labelledby="inv-process-title"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={stagger}
          className="mb-28"
        >
          <motion.div variants={fadeUp} className="text-center mb-14">
            <p className="text-[10px] font-black tracking-[0.4em] uppercase text-primary/60 mb-3">El proceso</p>
            <h2 id="inv-process-title" className="text-3xl md:text-4xl font-black text-white">
              De la charla a la invitación en <span className="text-primary italic">72 horas</span>
            </h2>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-6 relative">
            {/* connecting line */}
            <div className="hidden md:block absolute top-10 left-1/6 right-1/6 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" aria-hidden="true" />
            {installs.map((s, i) => (
              <motion.div
                key={s.step}
                variants={fadeUp}
                className="relative flex flex-col items-center text-center p-7 rounded-3xl border border-white/8"
                style={{ background: "rgba(255,255,255,0.03)" }}
              >
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5 font-black text-lg text-black"
                  style={{ background: "#C3D809" }}
                  aria-hidden="true"
                >
                  {s.step}
                </div>
                <h3 className="text-white font-bold text-base mb-2">{s.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* ── FEATURES GRID ─────────────────────────────────── */}
        <motion.section
          aria-labelledby="inv-features-title"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={stagger}
          className="mb-28"
        >
          <motion.div variants={fadeUp} className="text-center mb-14">
            <p className="text-[10px] font-black tracking-[0.4em] uppercase text-primary/60 mb-3">Funcionalidades</p>
            <h2 id="inv-features-title" className="text-3xl md:text-4xl font-black text-white">
              Todo lo que incluye <span className="text-primary italic">tu invitación</span>
            </h2>
            <p className="text-gray-400 mt-3 max-w-xl mx-auto">
              Más que una invitación — una experiencia web completa para tu evento.
            </p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="group flex gap-4 p-5 rounded-2xl border border-white/8 transition-colors hover:border-primary/30"
                style={{ background: "rgba(255,255,255,0.03)" }}
              >
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 text-primary group-hover:scale-110 transition-transform"
                  style={{ background: "rgba(195,216,9,0.12)", border: "1px solid rgba(195,216,9,0.2)" }}
                  aria-hidden="true"
                >
                  {f.icon}
                </div>
                <div>
                  <h3 className="text-white font-bold text-sm mb-1">{f.title}</h3>
                  <p className="text-gray-400 text-xs leading-relaxed">{f.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* ── INCLUDES ──────────────────────────────────────── */}
        <motion.section
          aria-labelledby="inv-includes-title"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={stagger}
          className="mb-28"
        >
          <div className="rounded-3xl border p-8 md:p-14 relative overflow-hidden" style={{ background: "rgba(195,216,9,0.04)", borderColor: "rgba(195,216,9,0.18)" }}>
            {/* glow */}
            <div className="absolute top-0 right-0 w-64 h-64 blur-[100px] opacity-15 rounded-full pointer-events-none" style={{ background: "#C3D809" }} aria-hidden="true" />

            <motion.div variants={fadeUp} className="mb-10">
              <p className="text-[10px] font-black tracking-[0.4em] uppercase text-primary/60 mb-3">Todo incluido</p>
              <h2 id="inv-includes-title" className="text-3xl md:text-4xl font-black text-white">
                Una sola inversión, <span className="text-primary italic">todo adentro.</span>
              </h2>
              <p className="text-gray-400 mt-2 max-w-xl">Sin costos extra por invitado, sin cargos ocultos. Precio fijo, alcance ilimitado.</p>
            </motion.div>

            <motion.div variants={stagger} className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-10">
              {allIncludes.map((item, i) => (
                <motion.div key={i} variants={fadeUp} className="flex items-center gap-3">
                  <div
                    className="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
                    style={{ background: "rgba(195,216,9,0.15)", border: "1px solid rgba(195,216,9,0.3)" }}
                    aria-hidden="true"
                  >
                    <CheckCircle2 size={11} className="text-primary" aria-hidden="true" />
                  </div>
                  <span className="text-gray-200 text-sm">{item}</span>
                </motion.div>
              ))}
            </motion.div>

            {/* Pricing summary */}
            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-6 items-start sm:items-center justify-between pt-8 border-t border-white/8">
              <div>
                <p className="text-gray-400 text-sm mb-1">Precio único</p>
                <div className="flex items-end gap-3">
                  <span className="text-5xl font-black text-white">$68.999</span>
                  <span className="text-gray-500 text-sm pb-1">ARS</span>
                </div>
                <p className="text-primary text-sm mt-1">ó 3 cuotas de <strong>$23.666</strong> con tarjeta</p>
              </div>
              <Link
                href={WA_LINK}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Quiero mi invitación ahora"
                className="inline-flex items-center gap-2 bg-primary text-black px-8 py-4 rounded-full font-black hover:bg-white transition-all hover:scale-105 min-h-[52px] shrink-0"
                style={{ boxShadow: "0 12px 32px rgba(195,216,9,0.30)" }}
              >
                <Sparkles size={18} aria-hidden="true" />
                Quiero mi invitación ahora
                <ArrowRight size={16} aria-hidden="true" />
              </Link>
            </motion.div>
          </div>
        </motion.section>

        {/* ── SOCIAL PROOF ──────────────────────────────────── */}
        <motion.section
          aria-labelledby="inv-reviews-title"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={stagger}
          className="mb-28"
        >
          <motion.div variants={fadeUp} className="text-center mb-12">
            <p className="text-[10px] font-black tracking-[0.4em] uppercase text-primary/60 mb-3">Lo que dicen</p>
            <h2 id="inv-reviews-title" className="text-3xl md:text-4xl font-black text-white">
              Más de <span className="text-primary">200 eventos</span> felices
            </h2>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-5">
            {[
              { name: "Valentina M.", event: "Casamiento", quote: "Mis invitados no podían creer lo linda que era la invitación. Todos me preguntaron qué aplicación era. ¡La recomiendo a ciegas!" },
              { name: "Carla F.", event: "15 Años de Lucía", quote: "El proceso fue facilísimo. En 2 días teníamos todo listo. Lo que más nos encantó fue el album QR de fotos en la fiesta." },
              { name: "Rodrigo & Sofía", event: "Casamiento Civil", quote: "Los confirmados se gestionaron solos. Sin papeles, sin llamadas. Todos confirmaron por la invitación y recibimos el Excel al instante." },
            ].map((r, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                className="p-6 rounded-3xl border border-white/8 flex flex-col gap-4"
                style={{ background: "rgba(255,255,255,0.03)" }}
              >
                <div className="flex gap-1">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <Star key={j} size={14} className="text-primary fill-primary" aria-hidden="true" />
                  ))}
                </div>
                <p className="text-gray-300 text-sm leading-relaxed flex-1">&ldquo;{r.quote}&rdquo;</p>
                <div>
                  <p className="text-white font-bold text-sm">{r.name}</p>
                  <p className="text-gray-500 text-xs">{r.event}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* ── FAQ ───────────────────────────────────────────── */}
        <motion.section
          aria-labelledby="inv-faq-title"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={stagger}
          className="mb-28"
        >
          <motion.div variants={fadeUp} className="text-center mb-12">
            <p className="text-[10px] font-black tracking-[0.4em] uppercase text-primary/60 mb-3">Preguntas frecuentes</p>
            <h2 id="inv-faq-title" className="text-3xl md:text-4xl font-black text-white">
              Todo lo que querés <span className="text-primary italic">saber</span>
            </h2>
          </motion.div>
          <motion.div variants={stagger} className="flex flex-col gap-3 max-w-3xl mx-auto">
            {faqs.map((faq, i) => (
              <motion.div key={i} variants={fadeUp}>
                <FaqItem q={faq.q} a={faq.a} />
              </motion.div>
            ))}
          </motion.div>
        </motion.section>

        {/* ── FINAL CTA ─────────────────────────────────────── */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          aria-labelledby="inv-cta-title"
        >
          <div className="relative rounded-3xl overflow-hidden text-center px-8 py-16 md:py-20 border border-primary/20">
            {/* Glow bg */}
            <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 70% 70% at 50% 50%, rgba(195,216,9,0.10) 0%, transparent 70%)" }} aria-hidden="true" />
            <div className="absolute inset-0" style={{ backgroundImage: "linear-gradient(rgba(195,216,9,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(195,216,9,0.03) 1px, transparent 1px)", backgroundSize: "44px 44px" }} aria-hidden="true" />

            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/10 mb-6">
                <Sparkles size={14} className="text-primary" aria-hidden="true" />
                <span className="text-xs font-bold text-primary tracking-wider uppercase">Hasta que te queden sin fecha</span>
              </div>
              <h2 id="inv-cta-title" className="text-4xl md:text-5xl font-black text-white mb-4 max-w-2xl mx-auto">
                Tu evento empieza con una <span className="text-primary italic">invitación increíble.</span>
              </h2>
              <p className="text-gray-400 max-w-lg mx-auto mb-10">
                Reservá hoy, bloqueá el precio y empezamos cuando vos quieras. Sin fecha límite de inicio.
              </p>

              {/* Pricing recap */}
              <div className="inline-flex flex-col sm:flex-row items-center gap-6 mb-10 px-8 py-5 rounded-2xl border border-white/10 bg-white/5">
                <div className="text-left">
                  <p className="text-gray-400 text-xs">Valor total</p>
                  <p className="text-white text-3xl font-black">$68.999</p>
                </div>
                <div className="hidden sm:block h-12 w-px bg-white/10" aria-hidden="true" />
                <div className="text-left">
                  <p className="text-gray-400 text-xs">En cuotas</p>
                  <p className="text-primary text-3xl font-black">3 x $23.666</p>
                </div>
                <div className="hidden sm:block h-12 w-px bg-white/10" aria-hidden="true" />
                <div className="text-left">
                  <p className="text-gray-400 text-xs">Entrega</p>
                  <p className="text-white text-3xl font-black">72 hs</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href={WA_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Quiero reservar mi invitación por WhatsApp"
                  className="inline-flex items-center justify-center gap-2 bg-primary text-black px-8 py-4 rounded-full font-black hover:bg-white transition-all hover:scale-105 min-h-[52px] text-base"
                  style={{ boxShadow: "0 16px 40px rgba(195,216,9,0.35)" }}
                >
                  <MessageCircle size={20} aria-hidden="true" />
                  Reservar por WhatsApp
                </Link>
                <Link
                  href={WA_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Ver ejemplos de invitaciones"
                  className="inline-flex items-center justify-center gap-2 border border-white/20 text-white px-8 py-4 rounded-full font-bold hover:bg-white/10 transition-colors min-h-[52px] text-base"
                >
                  Ver ejemplos
                  <ArrowRight size={16} aria-hidden="true" />
                </Link>
              </div>

              <p className="text-gray-600 text-xs mt-6">🔒 Compra segura · 💯 Satisfacción garantizada · 👩‍💻 Atención humana</p>
            </div>
          </div>
        </motion.section>
      </div>
    </main>
  );
}
