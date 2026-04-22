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
  ArrowDown,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
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

/* ── Phone Mini (Para la galería de catálogos) ────────────── */
function PhoneMini({ label, imgUrl, delay = 0, dateStr }: { label: string; imgUrl: string; delay?: number; dateStr: string }) {
  return (
    <motion.div 
       animate={{ y: [0, -8, 0] }}
       transition={{ duration: 4, repeat: Infinity, delay, ease: "easeInOut" }}
       className="w-24 sm:w-32 aspect-[9/19] rounded-[2rem] overflow-hidden border-[4px] border-black relative shrink-0 shadow-xl bg-black"
    >
        {/* Notch */}
        <div className="absolute top-0 inset-x-0 h-4 flex justify-center z-20">
           <div className="w-10 h-3 bg-black rounded-b-xl" />
        </div>
        <Image src={imgUrl} alt={label} fill className="object-cover opacity-90" sizes="150px" />
        
        {/* Card info overlap */}
        <div className="absolute bottom-4 inset-x-2 bg-white/90 backdrop-blur-md rounded-xl p-2 flex flex-col items-center shadow-lg">
           <p className="text-[8px] sm:text-[9px] font-black text-black uppercase text-center mb-1 leading-tight">{label}</p>
           <div className="w-full h-px bg-black/10 my-1"/>
           <p className="text-[6px] sm:text-[7px] text-gray-500 font-semibold tracking-wider">{dateStr}</p>
        </div>
    </motion.div>
  )
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
      q: "¿Cuáles son las formas de pago?",
      a: "El pago se realiza mediante transferencia bancaria o MercadoPago por un valor único de $68.999 ARS. El pago es único y completo. Actualmente ofrecemos un 50% de descuento sobre el precio regular, por tiempo limitado.",
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
    <main className="flex min-h-screen flex-col bg-background text-foreground bg-mesh pt-36 md:pt-40 pb-24">
      <div className="max-w-6xl mx-auto px-5 md:px-10 w-full relative z-10">

        {/* ── HERO ──────────────────────────────────────────── */}
        <section aria-labelledby="inv-hero-title" className="flex flex-col items-center text-center gap-10 mb-28 md:mb-32">
          
          <motion.div
            initial="hidden"
            animate="visible"
            variants={stagger}
            className="flex flex-col items-center w-full max-w-5xl text-center"
          >
            {/* Tag / Badge */}
            <motion.div variants={fadeUp} className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-md">
              <Ticket className="text-primary w-4 h-4" aria-hidden="true" />
              <span className="text-xs font-semibold text-gray-300 tracking-wider uppercase">Invitaciones web interactivas</span>
            </motion.div>

            {/* Title Centered */}
            <motion.h1
              id="inv-hero-title"
              variants={fadeUp}
              className="flex flex-col items-center justify-center font-black tracking-tight mb-6 text-white leading-[1.1] drop-shadow-md w-full"
            >
              <span className="text-[clamp(1.5rem,4.5vw,5.5rem)] whitespace-nowrap">
                La invitación que{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-lime-300 to-emerald-400 italic pr-2 pb-[0.1em]">
                  enamora
                </span>
              </span>
              <span className="text-[clamp(1.5rem,4.5vw,5.5rem)] whitespace-nowrap">
                antes del evento.
              </span>
            </motion.h1>

            {/* Subtext */}
            <motion.p variants={fadeUp} className="text-gray-300 text-lg md:text-xl font-light leading-relaxed mb-8 max-w-3xl text-balance">
              Diseños premium 100% personalizados para Bodas, 15 Años y Baby Showers. Tus invitados confirman su lugar, ubican el salón y abren la pista de baile desde su pantalla.
            </motion.p>

            {/* Trust badges */}
            <motion.div variants={fadeUp} className="flex flex-wrap justify-center gap-3 mb-16">
              {["🔒 Pago seguro", "📲 Envío por WhatsApp", "⚡ Entrega en 72 hs", "♾️ Sin límite de invitados"].map((badge) => (
                <span key={badge} className="text-xs font-medium text-gray-300 bg-white/5 border border-white/10 px-4 py-2 rounded-full">
                  {badge}
                </span>
              ))}
            </motion.div>

            {/* Bottom Content: Phone & Action Panel */}
            <motion.div variants={fadeUp} className="w-full flex flex-col md:flex-row items-center justify-center gap-12 lg:gap-24 relative">
               
               {/* Decorative background glow behind phone */}
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] bg-[radial-gradient(ellipse_at_center,rgba(195,216,9,0.06)_0%,transparent_60%)] -z-10 pointer-events-none" />

               {/* Left: Phone */}
               <div className="flex justify-center z-10 shrink-0">
                  <PhoneMockup />
               </div>

               {/* Right: Actions */}
               <div className="flex flex-col items-center md:items-start text-center md:text-left z-10">
                 {/* Price highlight */}
                 <div
                   className="rounded-[2rem] border p-6 sm:p-8 mb-6 relative overflow-hidden w-full max-w-sm text-center bg-black/60 backdrop-blur-xl shadow-2xl"
                   style={{ borderColor: "rgba(195,216,9,0.25)" }}
                 >
                   <div className="absolute top-0 inset-x-0 h-32 blur-[60px] opacity-20 pointer-events-none" style={{ background: "#C3D809" }} aria-hidden="true" />
                   <div className="flex justify-center items-end gap-2 mb-2 relative z-10 mt-2">
                     <span className="text-5xl lg:text-6xl font-black text-white">$68.999</span>
                   </div>
                   <p className="text-gray-400 text-sm mb-6 relative z-10 font-medium">Pago único y definitivo</p>
                   
                   <p className="text-gray-300 text-sm mb-6 relative z-10">
                     <strong className="text-primary font-bold">50% OFF por tiempo limitado</strong> — precio único de pago, sin costos ocultos ni cuotas.
                   </p>
                   <Link
                     href={WA_LINK}
                     target="_blank"
                     rel="noopener noreferrer"
                     aria-label="Reservar mi invitación por WhatsApp"
                     className="inline-flex items-center justify-center w-full gap-2 bg-primary text-black px-6 py-4 rounded-xl font-black text-[15px] hover:bg-white transition-all shadow-lg hover:scale-105"
                     style={{ boxShadow: "0 10px 30px rgba(195,216,9,0.25)" }}
                   >
                     <MessageCircle size={18} aria-hidden="true" />
                     Cotizar por WhatsApp
                   </Link>
                   <p className="text-[11px] text-gray-500 mt-4 relative z-10 uppercase tracking-widest font-bold">Sin extras sorpresas</p>
                 </div>

                 {/* Social proof & Anchors */}
                 <div className="flex flex-col items-center md:items-start w-full gap-6">
                    <a href="#galeria-modelos" className="inline-flex items-center justify-center gap-2 text-sm font-bold text-white border border-white/20 bg-white/5 w-full max-w-sm py-4 rounded-xl hover:bg-white/10 transition-colors">
                      Explorar catálogos <ArrowDown size={16} />
                    </a>
                    
                    <div className="flex items-center gap-3 w-full justify-center md:justify-start">
                      <div className="flex -space-x-3" aria-hidden="true">
                        {["💍", "🎉", "🥂"].map((emoji, i) => (
                          <div key={i} className="w-10 h-10 rounded-full bg-white/10 border-2 border-background flex items-center justify-center text-sm z-10 shadow-md backdrop-blur-md">
                            {emoji}
                          </div>
                        ))}
                      </div>
                      <p className="text-sm text-gray-400 text-left leading-tight">
                        <strong className="text-white">+200 eventos</strong> felices<br/>respaldan nuestro trabajo
                      </p>
                    </div>
                 </div>
               </div>
            </motion.div>
          </motion.div>
        </section>

        {/* ── GALERÍA DE MODELOS (NUEVO) ────────────────────── */}
        <motion.section
          id="galeria-modelos"
          aria-labelledby="inv-gallery-title"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={stagger}
          className="mb-28"
        >
           <motion.div variants={fadeUp} className="text-center mb-14">
            <p className="text-[10px] font-black tracking-[0.4em] uppercase text-primary/60 mb-3">Catálogo online</p>
            <h2 id="inv-gallery-title" className="text-3xl md:text-4xl font-black text-white">
              Elegí la temática, <span className="text-primary italic">nosotros la armamos</span>
            </h2>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-8">
             {/* BODAS */}
             <motion.div variants={fadeUp} className="bg-white/5 border border-white/10 rounded-[3rem] p-8 md:p-12 flex flex-col items-center relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-rose-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <h3 className="text-2xl font-black italic uppercase text-white mb-2 relative z-10">Bodas & Casamientos</h3>
                <p className="text-gray-400 text-sm mb-10 text-center relative z-10">Diseños elegantes, románticos y minimalistas.</p>
                
                <div className="flex justify-center items-center gap-4 w-full mb-12 relative z-10">
                   <PhoneMini label="Mica & Fede" imgUrl="https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80" dateStr="23 OCT 2025" delay={0} />
                   <PhoneMini label="Ana & Juan" imgUrl="https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=600&q=80" dateStr="12 DIC 2025" delay={1} />
                   <div className="hidden sm:block">
                     <PhoneMini label="Sofi & Mati" imgUrl="https://images.unsplash.com/photo-1532712938310-34cb3982ef74?auto=format&fit=crop&w=600&q=80" dateStr="15 NOV 2025" delay={2} />
                   </div>
                </div>

                <Link
                  href="/servicios/web/invitaciones/bodas"
                  className="w-full sm:w-auto relative z-10 inline-flex items-center justify-center gap-2 px-10 py-4 rounded-full font-black text-[14px] uppercase tracking-wider bg-white text-black hover:bg-gray-200 hover:scale-105 transition-all shadow-xl"
                >
                  Ver modelos de bodas <ArrowRight size={16} />
                </Link>
             </motion.div>

             {/* CUMPLES & 15S */}
             <motion.div variants={fadeUp} className="bg-white/5 border border-white/10 rounded-[3rem] p-8 md:p-12 flex flex-col items-center relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-bl from-violet-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <h3 className="text-2xl font-black italic uppercase text-white mb-2 relative z-10">Fiestas & 15 Años</h3>
                <p className="text-gray-400 text-sm mb-10 text-center relative z-10">Diseños neón, juveniles, dark y modernos.</p>
                
                <div className="flex justify-center items-center gap-4 w-full mb-12 relative z-10">
                   <PhoneMini label="Mis 15 Lola" imgUrl="https://images.unsplash.com/photo-1516054575922-f0b8eeadec1a?auto=format&fit=crop&w=600&q=80" dateStr="10 ENE 2026" delay={0.5} />
                   <PhoneMini label="Valen 15" imgUrl="https://images.unsplash.com/photo-1566737236500-c8ac43014a67?auto=format&fit=crop&w=600&q=80" dateStr="25 FEB 2026" delay={1.5} />
                   <div className="hidden sm:block">
                     <PhoneMini label="Martu Fest" imgUrl="https://images.unsplash.com/photo-1527529482837-4698179dc6ce?auto=format&fit=crop&w=600&q=80" dateStr="04 MAR 2026" delay={2.5} />
                   </div>
                </div>

                <Link
                  href="/servicios/web/invitaciones/cumples"
                  className="w-full sm:w-auto relative z-10 inline-flex items-center justify-center gap-2 px-10 py-4 rounded-full font-black text-[14px] uppercase tracking-wider bg-white text-black hover:bg-gray-200 hover:scale-105 transition-all shadow-xl"
                >
                  Ver modelos de 15s <ArrowRight size={16} />
                </Link>
             </motion.div>
          </div>
        </motion.section>

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
                Una sola inversión, <span className="text-primary italic">todo resuelto.</span>
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
                <p className="text-primary text-sm mt-1"><strong className="text-primary">50% OFF</strong> — precio especial por tiempo limitado</p>
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
              <div className="inline-flex flex-col sm:flex-row items-center gap-6 mb-10 px-8 py-5 rounded-2xl border border-primary/20 bg-white/5">
                <div className="text-left">
                  <p className="text-gray-400 text-xs line-through">Precio regular</p>
                  <p className="text-gray-500 text-3xl font-black line-through">$137.999</p>
                </div>
                <div className="text-left">
                  <p className="text-gray-400 text-xs">Precio con descuento</p>
                  <p className="text-primary text-3xl font-black">$68.999</p>
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
                  href="/servicios/web/invitaciones/bodas"
                  aria-label="Ver ejemplos de invitaciones"
                  className="inline-flex items-center justify-center gap-2 border border-white/20 text-white px-8 py-4 rounded-full font-bold hover:bg-white/10 transition-colors min-h-[52px] text-base"
                >
                  Ver ejemplos de Bodas
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
