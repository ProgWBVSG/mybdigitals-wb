"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Globe, MonitorSmartphone, Search, TrendingUp, ArrowRight, Code } from "lucide-react";
import Link from "next/link";

const fadeIn = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
};

export default function PresenciaDigitalPage() {
  return (
    <main className="flex min-h-screen flex-col bg-background text-foreground bg-mesh pt-32 pb-20">
      <div className="max-w-6xl mx-auto px-4 md:px-10 w-full relative z-10">
        
        {/* Header Section */}
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="mb-20 text-center flex flex-col items-center"
        >
          <motion.div variants={fadeIn} className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-md">
            <Globe className="text-primary w-4 h-4" />
            <span className="text-xs font-semibold text-gray-300 tracking-wider">PRESENCIA DIGITAL</span>
          </motion.div>
          
          <motion.h1 variants={fadeIn} className="text-5xl md:text-7xl font-black tracking-tighter mb-6 text-balance text-white leading-tight">
            Sitios Web <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-emerald-400 italic">Corporativos</span>
          </motion.h1>
          
          <motion.p variants={fadeIn} className="text-lg md:text-xl text-gray-400 max-w-2xl text-center text-balance leading-relaxed">
            Tu negocio merece más que una plantilla. Desarrollamos identidades digitales a medida, de alto rendimiento y diseñadas para posicionar tu marca como líder en su industria.
          </motion.p>
        </motion.div>

        {/* Feature Grid */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-24"
        >
          {[
             { icon: <MonitorSmartphone />, title: "Diseño Responsive", desc: "Adaptabilidad perfecta en todos los dispositivos móviles y de escritorio." },
             { icon: <Search />, title: "SEO Optimizado", desc: "Estructura pensada para dominar los resultados de búsqueda en Google." },
             { icon: <Code />, title: "Tecnología Next.js", desc: "El estándar de la industria para webs ultra rápidas y seguras." }
          ].map((feature, i) => (
            <motion.div key={i} variants={fadeIn} className="bg-white/5 border border-white/10 p-8 rounded-[2rem] hover:bg-white/10 transition-colors group">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* What Includes Section */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="bg-white/5 border border-white/10 rounded-[3rem] p-8 md:p-16 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 blur-[120px] rounded-full pointer-events-none" />
          
          <div className="grid md:grid-cols-2 gap-12 items-center relative z-10">
            <motion.div variants={fadeIn}>
              <h2 className="text-3xl md:text-5xl font-black text-white mb-6 leading-tight">
                El ecosistema digital <br />
                <span className="text-primary italic">definitivo.</span>
              </h2>
              <p className="text-gray-400 text-lg mb-8">
                Nos encargamos del ciclo completo. Desde la conceptualización UI/UX hasta el despliegue en servidores globales.
              </p>
              <Link 
                href="https://wa.me/543515555123" 
                target="_blank"
                className="inline-flex items-center gap-2 bg-primary text-black px-8 py-4 rounded-full font-bold hover:bg-white transition-colors"
              >
                Solicitar Cotización <ArrowRight size={18} />
              </Link>
            </motion.div>

            <motion.div variants={fadeIn} className="space-y-4">
              {[
                "Diseño UX/UI personalizado y premium",
                "Desarrollo Full-Stack con React & Next.js",
                "Integración de CMS (Panel autogestionable)",
                "Optimizaciones Core Web Vitals",
                "Dominio y Hosting por el primer año",
                "Mantenimiento y soporte técnico"
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4 bg-black/20 p-4 rounded-2xl border border-white/5">
                  <CheckCircle2 className="text-primary shrink-0" />
                  <span className="text-gray-200 font-medium">{item}</span>
                </div>
              ))}
            </motion.div>
          </div>
        </motion.div>

      </div>
    </main>
  );
}
