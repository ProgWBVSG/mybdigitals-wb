"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { 
  Building2, 
  Clock, 
  Target, 
  TrendingUp, 
  Search, 
  Crosshair, 
  PenTool, 
  Rocket, 
  Users, 
  HeartHandshake, 
  CheckCircle2, 
  MessageCircle,
  XCircle,
  ArrowRight
} from "lucide-react";

// Animations
const fadeIn = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
};

const slideInLeft = {
  hidden: { opacity: 0, x: -30 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

export default function Nosotros() {
  return (
    <main className="flex min-h-[100vh] flex-col overflow-hidden bg-background text-foreground bg-mesh">
      
      {/* ══════════════════════════════════════════════════════
          SECCIÓN 1 – HERO
      ══════════════════════════════════════════════════════ */}
      <section className="relative w-full min-h-[90vh] flex flex-col justify-center items-center overflow-hidden pt-32 pb-20 px-4 z-10">
        {/* Glows de ambiente */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/[0.05] blur-[140px] rounded-full pointer-events-none" />
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-cyan-500/[0.03] blur-[120px] rounded-full pointer-events-none" />

        <motion.div 
          initial="hidden" 
          animate="visible" 
          variants={staggerContainer} 
          className="relative z-10 w-full max-w-4xl mx-auto flex flex-col items-center text-center gap-6"
        >
          <motion.div variants={fadeIn} className="inline-flex items-center gap-2 mb-4 px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5 backdrop-blur-md">
             <Target className="w-4 h-4 text-primary" />
             <span className="text-xs font-bold text-primary tracking-widest uppercase">Nuestra Filosofía</span>
          </motion.div>

          <motion.h1 variants={fadeIn} className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tighter text-white leading-[1.1] mb-6">
            La tecnología es el medio.<br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-lime-300 to-emerald-400 italic">Tu crecimiento es el fin.</span>
          </motion.h1>

          <motion.p variants={fadeIn} className="text-lg md:text-2xl text-gray-300 max-w-3xl leading-relaxed font-light text-balance mb-8">
            En un mercado saturado de agencias que solo buscan implementar plantillas genéricas, nosotros decidimos ser el partner estratégico que a nosotros nos hubiera gustado tener.
          </motion.p>
        </motion.div>
      </section>

      {/* ══════════════════════════════════════════════════════
          SECCIÓN 2 – EL PROBLEMA Y LA REALIDAD
      ══════════════════════════════════════════════════════ */}
      <section className="relative w-full py-24 px-4 border-t border-white/5">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          
          <motion.div 
            initial="hidden" whileInView="visible" viewport={{once:true}} variants={staggerContainer}
            className="flex flex-col gap-6"
          >
            <motion.h2 variants={fadeIn} className="text-2xl md:text-3xl lg:text-4xl font-black text-white leading-[1.1] tracking-tight text-balance">
              Vemos negocios que gastaron <span className="text-red-400 whitespace-nowrap">+$3000 USD</span> en "automatización"
            </motion.h2>
            <motion.p variants={fadeIn} className="text-xl text-gray-300">
              ...y siguen perdiendo tiempo, dinero y clientes porque su operativo sigue siendo caótico.
            </motion.p>
            
            <motion.div variants={fadeIn} className="mt-6 flex flex-col gap-4">
               <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6 flex gap-4 items-start backdrop-blur-sm">
                  <XCircle className="w-8 h-8 text-red-400 shrink-0 mt-1" />
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">El problema no era tecnológico.</h3>
                    <p className="text-gray-300 leading-relaxed font-medium">
                      El error principal es creer que un chatbot que responde lento va a salvar ventas de poco valor. El problema raíz siempre es de diagnóstico.
                    </p>
                  </div>
               </div>
            </motion.div>
          </motion.div>

          <motion.div 
            initial="hidden" whileInView="visible" viewport={{once:true}} variants={fadeIn}
            className="relative rounded-[2.5rem] bg-white/[0.02] border border-white/[0.07] overflow-hidden p-8 md:p-12 shadow-[0_0_80px_rgba(195,216,9,0.03)]"
          >
             <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(195,216,9,0.08)_0%,transparent_70%)]" />
             <div className="relative z-10">
                <Target className="w-12 h-12 text-primary mb-6" />
                <h3 className="text-2xl md:text-4xl font-black text-white mb-4 leading-tight">
                  Somos <span className="text-primary italic">DOCTORES</span> de negocios. <br/> No vendedores de software.
                </h3>
                <p className="text-gray-300 text-lg leading-relaxed pt-4 border-t border-white/10 mt-6">
                  Entendemos que <strong className="text-white">la herramienta es el medio, tu crecimiento es el fin</strong>. Por eso, ayudamos a empresas y marcas a competir digitalmente creando ecosistemas que realmente retornan la inversión mediante sistemas hechos a la medida.
                </p>
             </div>
          </motion.div>

        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          SECCIÓN 3 – NUESTRO PROCESO (4 PASOS)
      ══════════════════════════════════════════════════════ */}
      <section className="relative w-full py-24 px-4 bg-primary/[0.02] border-y border-white/5">
        <div className="max-w-6xl mx-auto">
          <div className="mb-16 md:flex justify-between items-end gap-8">
            <div className="max-w-2xl">
              <h2 className="text-4xl md:text-5xl font-black text-white mb-6">Entender <span className="text-primary">PRIMERO</span>.<br/> Implementar DESPUÉS.</h2>
              <p className="text-gray-300 text-lg">Nuestro proceso científico en 4 pasos para no dejar nada a la intuición ni a la magia negra.</p>
            </div>
            <div className="hidden md:flex bg-white/5 backdrop-blur-md border border-white/10 px-6 py-4 rounded-full mt-6 md:mt-0 items-center justify-center shrink-0">
               <span className="font-bold text-white text-sm">Cero Humo. Solo Resultados.</span>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: <Search className="w-8 h-8"/>, step: "01",
                title: "Auditoría", phase: "Primero",
                desc: "Identificamos exactamente dónde estás perdiendo tiempo, dinero o clientes. Sin suposiciones."
              },
              {
                icon: <Crosshair className="w-8 h-8"/>, step: "02",
                title: "Diagnóstico", phase: "Primero",
                desc: "Encontramos la causa raíz del estancamiento u obstáculo. Cortamos de raíz el problema y no solo el síntoma."
              },
              {
                icon: <PenTool className="w-8 h-8"/>, step: "03",
                title: "Diseño", phase: "Después",
                desc: "Diseñamos la solución arquitectónica (IA + software + estrategia web) a medida de tu diagnóstico."
              },
              {
                icon: <Rocket className="w-8 h-8"/>, step: "04",
                title: "Implementación", phase: "Después",
                desc: "Lo hacemos funcionar en la vida real. Lo desplegamos y te acompañamos garantizando su iteración."
              }
            ].map((item, i) => (
              <motion.div 
                key={i} initial="hidden" whileInView="visible" viewport={{once:true}}
                variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { delay: i * 0.15, duration: 0.6 }}}}
                className="bg-black/40 border border-white/5 rounded-[2rem] p-8 flex flex-col relative group overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 group-hover:scale-125 transition-all text-7xl font-black text-white pointer-events-none">
                  {item.step}
                </div>
                <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-primary mb-6 transition-transform group-hover:scale-110">
                  {item.icon}
                </div>
                <div className="text-[10px] uppercase tracking-widest text-primary/60 font-bold mb-2">{item.phase}</div>
                <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed font-medium">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          SECCIÓN 4 – EL EQUIPO FUNDADOR
      ══════════════════════════════════════════════════════ */}
      <section className="relative w-full py-32 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            initial="hidden" whileInView="visible" viewport={{once:true}} variants={staggerContainer}
            className="text-center max-w-3xl mx-auto mb-20"
          >
            <Users className="w-12 h-12 text-primary mx-auto mb-6" />
            <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
              Somos <span className="text-primary italic">Benjamín, Matías y Álvaro.</span>
            </h2>
            <p className="text-xl text-gray-300 leading-relaxed text-balance">
              Vimos a demasiadas empresas gastar fortunas en soluciones que no servían para nada. Por eso creamos MYB Digitals: queríamos ser una agencia transparente, rápida y enfocada únicamente en hacer crecer tu negocio.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Bio Benjamín */}
            <motion.div 
              initial="hidden" whileInView="visible" viewport={{once:true}}
              variants={fadeIn}
              className="bg-white/[0.02] border border-white/5 rounded-3xl p-8 hover:bg-white/[0.04] transition-colors"
            >
               <div className="w-20 h-20 bg-gradient-to-br from-primary/20 to-transparent rounded-full mb-6 border border-primary/20 flex items-center justify-center text-2xl font-black text-primary">B</div>
               <h3 className="text-2xl font-bold text-white mb-1">Benjamín</h3>
               <p className="text-primary text-sm font-bold mb-4 tracking-wide uppercase">Estrategia & Consultoría</p>
               <p className="text-gray-400 text-sm leading-relaxed">
                 Apasionado por la optimización de procesos y el diagnóstico de negocios. Se asegura de que la solución técnica realmente resuelva el dolor financiero de la empresa antes de escribir una sola línea de código.
               </p>
            </motion.div>

            {/* Bio Matías */}
            <motion.div 
              initial="hidden" whileInView="visible" viewport={{once:true}}
              variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { delay: 0.15, duration: 0.6 }}}}
              className="bg-white/[0.02] border border-white/5 rounded-3xl p-8 hover:bg-white/[0.04] transition-colors"
            >
               <div className="w-20 h-20 bg-gradient-to-br from-cyan-500/20 to-transparent rounded-full mb-6 border border-cyan-500/20 flex items-center justify-center text-2xl font-black text-cyan-400">M</div>
               <h3 className="text-2xl font-bold text-white mb-1">Matías</h3>
               <p className="text-cyan-400 text-sm font-bold mb-4 tracking-wide uppercase">Ingeniería Web & IA</p>
               <p className="text-gray-400 text-sm leading-relaxed">
                 Diseñador de ecosistemas digitales y arquitecto de software. Su objetivo no es solo implementar tecnología, sino orquestar flujos de trabajo hiper-optimizados que operen como el motor silencioso de la marca.
               </p>
            </motion.div>

            {/* Bio Álvaro */}
            <motion.div 
              initial="hidden" whileInView="visible" viewport={{once:true}}
              variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { delay: 0.3, duration: 0.6 }}}}
              className="bg-white/[0.02] border border-white/5 rounded-3xl p-8 hover:bg-white/[0.04] transition-colors"
            >
               <div className="w-20 h-20 bg-gradient-to-br from-emerald-500/20 to-transparent rounded-full mb-6 border border-emerald-500/20 flex items-center justify-center text-2xl font-black text-emerald-400">A</div>
               <h3 className="text-2xl font-bold text-white mb-1">Álvaro</h3>
               <p className="text-emerald-400 text-sm font-bold mb-4 tracking-wide uppercase">Operaciones & Crecimiento</p>
               <p className="text-gray-400 text-sm leading-relaxed">
                 Garantiza la entrega impecable y el escalamiento del proyecto. Conecta los resultados comerciales con las integraciones técnicas, asegurando la adopción y el retorno de inversión del sistema desplegado.
               </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          SECCIÓN 5 – VALORES / DIFERENCIADORES
      ══════════════════════════════════════════════════════ */}
      <section className="relative w-full py-24 px-4 bg-primary text-black rounded-t-[3rem] md:rounded-t-[4rem]">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white opacity-20 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black mb-4">¿Por qué confiar en nosotros?</h2>
            <p className="text-black/80 text-lg font-medium">Bases sólidas. Sin jerga técnica injustificada.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: <Building2 className="w-6 h-6"/>, title: "Enfoque de Negocios",
                desc: "Hablamos de rentabilidad, procesos y cómo escalar tu facturación, no solo de piezas de código."
              },
              {
                icon: <MessageCircle className="w-6 h-6"/>, title: "Soporte Ágil",
                desc: "Tiempos de respuesta rápidos para evitar cuellos de botella diarios y trabas operativas."
              },
              {
                icon: <TrendingUp className="w-6 h-6"/>, title: "Resultados Reales",
                desc: "Casos de éxito verificables, con optimización guiada a números, no a estética puramente."
              },
              {
                icon: <HeartHandshake className="w-6 h-6"/>, title: "Acompañamiento",
                desc: "No vendemos enlatados. Te damos la mano en cada paso del proceso y después del lanzamiento."
              }
            ].map((diff, idx) => (
              <div key={idx} className="bg-black/10 backdrop-blur-sm border border-black/10 rounded-[2rem] p-8 flex flex-col gap-4">
                 <div className="w-12 h-12 bg-black rounded-full text-primary flex items-center justify-center shrink-0">
                    {diff.icon}
                 </div>
                 <h3 className="text-xl font-bold">{diff.title}</h3>
                 <p className="text-black/80 text-sm leading-relaxed font-medium">{diff.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-20 text-center flex flex-col items-center">
             <h2 className="text-3xl md:text-4xl font-black mb-8">Hagamos crecer tu empresa.</h2>
             <Link 
              href="https://wa.me/543515555123" 
              target="_blank" rel="noopener noreferrer"
              aria-label="Contactar por WhatsApp y empezar auditoría"
              className="inline-flex items-center gap-3 bg-black text-white px-10 py-5 rounded-full font-bold text-lg hover:scale-105 transition-transform shadow-[0_0_20px_rgba(0,0,0,0.2)]"
             >
               <MessageCircle className="w-5 h-5"/>
               Hablar con los Fundadores
             </Link>
          </div>
        </div>
      </section>

    </main>
  );
}
