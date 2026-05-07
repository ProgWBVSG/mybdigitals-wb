"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, CheckCircle2, ChevronLeft, Building2, User, Mail, Phone, Briefcase, Activity, Target, Zap, Rocket } from "lucide-react";
import Link from "next/link";

export default function DiagnosticoPage() {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    nombre_negocio: "",
    rubro: "",
    email: "",
    telefono: "",
    nombre_contacto: "",
    cantidad_empleados: "",
    facturacion_mensual: "",
    años_en_el_mercado: "",
    canales_venta_actuales: [] as string[],
    mayor_problema: [] as string[],
    horas_operativas_semana: "",
    usa_herramientas_digitales: [] as string[],
    objetivo_principal: "",
    urgencia: "",
    presupuesto_disponible: ""
  });

  const updateForm = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleArrayItem = (field: "canales_venta_actuales" | "usa_herramientas_digitales", value: string) => {
    setFormData(prev => {
      const array = prev[field];
      if (array.includes(value)) {
        return { ...prev, [field]: array.filter(item => item !== value) };
      } else {
        return { ...prev, [field]: [...array, value] };
      }
    });
  };

  const toggleProblem = (value: string) => {
    setFormData(prev => {
      const array = prev.mayor_problema;
      if (array.includes(value)) {
        return { ...prev, mayor_problema: array.filter(item => item !== value) };
      } else if (array.length < 3) {
        return { ...prev, mayor_problema: [...array, value] };
      }
      return prev;
    });
  };

  const handleNext = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setStep(prev => prev + 1);
  };
  const handlePrev = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setStep(prev => prev - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API Call for now. 
    // TODO: Connect to Make.com / n8n webhook
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 2000);
  };

  return (
    <main className="min-h-screen bg-[#030303] text-white flex flex-col items-center justify-center relative overflow-hidden font-sans selection:bg-primary/30 selection:text-white pb-20 pt-32 px-4">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none -z-10">
         <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-primary/5 blur-[120px] rounded-full mix-blend-screen" />
         <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-emerald-500/5 blur-[150px] rounded-full mix-blend-screen" />
         <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,#030303_100%)]" />
      </div>

      <div className="w-full max-w-3xl mx-auto z-10 relative">
        
        {/* Header */}
        {!isSuccess && (
          <div className="mb-8 text-center">
            <Link href="/" className="inline-block mb-6">
              <span className="font-black text-xl tracking-tight text-white">MYB <span className="text-primary">DIGITALS</span></span>
            </Link>
            <h1 className="text-3xl md:text-4xl font-black mb-4">Diagnóstico Rápido de Negocio</h1>
            <p className="text-gray-400">Descubrí tus cuellos de botella y cómo la IA puede escalar tu operación.</p>
            
            {/* Progress Bar */}
            <div className="w-full bg-white/10 h-1.5 rounded-full mt-8 overflow-hidden">
               <div 
                 className="h-full bg-primary transition-all duration-500 ease-out"
                 style={{ width: `${(step / 4) * 100}%` }}
               />
            </div>
            <div className="text-xs text-gray-500 mt-2 text-right">Paso {step} de 4</div>
          </div>
        )}

        {/* Form Container */}
        <div className="bg-[#0a0a0a] border border-white/10 rounded-[2rem] p-6 md:p-10 shadow-2xl relative overflow-hidden">
           
           {isSuccess ? (
             <motion.div 
               initial={{ opacity: 0, scale: 0.9 }}
               animate={{ opacity: 1, scale: 1 }}
               className="text-center py-10"
             >
               <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-emerald-500/20">
                 <CheckCircle2 className="w-10 h-10 text-emerald-500" />
               </div>
               <h2 className="text-3xl font-black mb-4">¡Diagnóstico Solicitado!</h2>
               <p className="text-gray-400 mb-8 max-w-md mx-auto">
                 Estamos procesando tus datos con nuestro sistema de Inteligencia Artificial. En breve vas a recibir un diagnóstico completo en tu email.
               </p>
               <Link href="/" className="inline-flex items-center justify-center bg-white text-black px-8 py-4 rounded-full font-bold hover:bg-primary transition-colors">
                 Volver al Inicio
               </Link>
             </motion.div>
           ) : (
             <form onSubmit={step === 4 ? handleSubmit : (e) => { e.preventDefault(); handleNext(); }}>
               <AnimatePresence mode="wait">
                 
                 {/* PASO 1: IDENTIFICACIÓN */}
                 {step === 1 && (
                   <motion.div 
                     key="step1"
                     initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                     className="flex flex-col gap-6"
                   >
                     <h3 className="text-2xl font-bold flex items-center gap-3 border-b border-white/10 pb-4">
                       <User className="text-primary" /> Tus Datos
                     </h3>

                     <div className="grid md:grid-cols-2 gap-6">
                       <div className="flex flex-col gap-2">
                         <label className="text-sm font-semibold text-gray-300">Nombre Comercial / Empresa</label>
                         <div className="relative">
                           <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                           <input required type="text" value={formData.nombre_negocio} onChange={e => updateForm("nombre_negocio", e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 pl-12 text-white outline-none focus:border-primary transition-colors" placeholder="Ej: Mi Empresa S.A." />
                         </div>
                       </div>
                       <div className="flex flex-col gap-2">
                         <label className="text-sm font-semibold text-gray-300">Rubro / Industria</label>
                         <div className="relative">
                           <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                           <input required type="text" value={formData.rubro} onChange={e => updateForm("rubro", e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 pl-12 text-white outline-none focus:border-primary transition-colors" placeholder="Ej: E-commerce, Salud, B2B..." />
                         </div>
                       </div>
                     </div>

                     <div className="flex flex-col gap-2">
                       <label className="text-sm font-semibold text-gray-300">Tu Nombre</label>
                       <div className="relative">
                         <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                         <input required type="text" value={formData.nombre_contacto} onChange={e => updateForm("nombre_contacto", e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 pl-12 text-white outline-none focus:border-primary transition-colors" placeholder="Ej: Juan Pérez" />
                       </div>
                     </div>

                     <div className="grid md:grid-cols-2 gap-6">
                       <div className="flex flex-col gap-2">
                         <label className="text-sm font-semibold text-gray-300">Email Profesional</label>
                         <div className="relative">
                           <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                           <input required type="email" value={formData.email} onChange={e => updateForm("email", e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 pl-12 text-white outline-none focus:border-primary transition-colors" placeholder="tu@email.com" />
                         </div>
                       </div>
                       <div className="flex flex-col gap-2">
                         <label className="text-sm font-semibold text-gray-300">Teléfono (WhatsApp)</label>
                         <div className="relative">
                           <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                           <input required type="tel" value={formData.telefono} onChange={e => updateForm("telefono", e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 pl-12 text-white outline-none focus:border-primary transition-colors" placeholder="+54 9 11..." />
                         </div>
                       </div>
                     </div>
                   </motion.div>
                 )}

                 {/* PASO 2: ESTADO ACTUAL */}
                 {step === 2 && (
                   <motion.div 
                     key="step2"
                     initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                     className="flex flex-col gap-8"
                   >
                     <h3 className="text-2xl font-bold flex items-center gap-3 border-b border-white/10 pb-4">
                       <Activity className="text-primary" /> Estado Actual
                     </h3>

                     <div className="flex flex-col gap-3">
                       <label className="text-sm font-semibold text-gray-300">¿Cuántas personas forman el equipo?</label>
                       <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                         {["Solo yo", "2-5", "6-20", "+20"].map(opt => (
                           <button type="button" key={opt} onClick={() => updateForm("cantidad_empleados", opt)}
                             className={`py-3 px-4 border rounded-xl text-sm font-medium transition-all ${formData.cantidad_empleados === opt ? 'bg-primary/10 border-primary text-primary' : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/30'}`}
                           >
                             {opt}
                           </button>
                         ))}
                       </div>
                     </div>

                     <div className="flex flex-col gap-3">
                       <label className="text-sm font-semibold text-gray-300">Facturación Mensual (USD Estimado)</label>
                       <div className="grid grid-cols-2 gap-3">
                         {["Menos de $1k", "$1k-$5k", "$5k-$20k", "+$20k"].map(opt => (
                           <button type="button" key={opt} onClick={() => updateForm("facturacion_mensual", opt)}
                             className={`py-3 px-4 border rounded-xl text-sm font-medium transition-all ${formData.facturacion_mensual === opt ? 'bg-primary/10 border-primary text-primary' : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/30'}`}
                           >
                             {opt}
                           </button>
                         ))}
                       </div>
                     </div>

                     <div className="flex flex-col gap-3">
                       <label className="text-sm font-semibold text-gray-300">Años en el mercado</label>
                       <div className="grid grid-cols-3 gap-3">
                         {["Menos de 1 año", "1-3 años", "+3 años"].map(opt => (
                           <button type="button" key={opt} onClick={() => updateForm("años_en_el_mercado", opt)}
                             className={`py-3 px-4 border rounded-xl text-sm font-medium transition-all ${formData.años_en_el_mercado === opt ? 'bg-primary/10 border-primary text-primary' : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/30'}`}
                           >
                             {opt}
                           </button>
                         ))}
                       </div>
                     </div>

                     <div className="flex flex-col gap-3">
                       <label className="text-sm font-semibold text-gray-300">Canales de venta actuales (Seleccioná varios)</label>
                       <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                         {["Instagram", "WhatsApp", "Web propia", "Marketplace", "Ventas directas", "Otro"].map(opt => {
                           const isSelected = formData.canales_venta_actuales.includes(opt);
                           return (
                             <button type="button" key={opt} onClick={() => toggleArrayItem("canales_venta_actuales", opt)}
                               className={`py-3 px-4 border rounded-xl text-sm font-medium transition-all flex items-center justify-between ${isSelected ? 'bg-primary/10 border-primary text-primary' : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/30'}`}
                             >
                               {opt}
                               {isSelected && <CheckCircle2 className="w-4 h-4" />}
                             </button>
                           );
                         })}
                       </div>
                     </div>
                   </motion.div>
                 )}

                 {/* PASO 3: DOLOR OPERATIVO */}
                 {step === 3 && (
                   <motion.div 
                     key="step3"
                     initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                     className="flex flex-col gap-8"
                   >
                     <h3 className="text-2xl font-bold flex items-center gap-3 border-b border-white/10 pb-4">
                       <Zap className="text-primary" /> Dolor Operativo
                     </h3>

                     <div className="flex flex-col gap-3">
                       <label className="text-sm font-semibold text-gray-300">¿Cuál es tu mayor problema hoy? (Seleccioná hasta 3)</label>
                       <div className="flex flex-col gap-2">
                         {[
                           "Pierdo mucho tiempo en tareas repetitivas",
                           "No tengo visibilidad de mis métricas y resultados",
                           "Me cuesta conseguir clientes nuevos",
                           "Tengo clientes pero no logro fidelizarlos",
                           "Mi equipo no trabaja de forma organizada",
                           "No sé por dónde empezar con la tecnología"
                         ].map(opt => {
                           const isSelected = formData.mayor_problema.includes(opt);
                           return (
                             <button type="button" key={opt} onClick={() => toggleProblem(opt)}
                               className={`py-3.5 px-5 border rounded-xl text-sm font-medium transition-all text-left flex items-center justify-between ${isSelected ? 'bg-primary/10 border-primary text-primary' : 'bg-white/5 border-white/10 text-gray-300 hover:border-white/30 hover:bg-white/10'}`}
                             >
                               {opt}
                               {isSelected && <CheckCircle2 className="w-4 h-4 shrink-0 ml-2" />}
                             </button>
                           );
                         })}
                       </div>
                     </div>

                     <div className="flex flex-col gap-3">
                       <label className="text-sm font-semibold text-gray-300">Horas dedicadas a tareas operativas / manuales por semana</label>
                       <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                         {["Menos de 20hs", "20-40hs", "40-60hs", "+60hs"].map(opt => (
                           <button type="button" key={opt} onClick={() => updateForm("horas_operativas_semana", opt)}
                             className={`py-3 px-4 border rounded-xl text-sm font-medium transition-all ${formData.horas_operativas_semana === opt ? 'bg-primary/10 border-primary text-primary' : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/30'}`}
                           >
                             {opt}
                           </button>
                         ))}
                       </div>
                     </div>

                     <div className="flex flex-col gap-3">
                       <label className="text-sm font-semibold text-gray-300">Herramientas que usás hoy (Seleccioná varias)</label>
                       <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                         {["CRM", "Email marketing", "Redes sociales", "Google Ads", "Meta Ads", "Ninguna", "Otro"].map(opt => {
                           const isSelected = formData.usa_herramientas_digitales.includes(opt);
                           return (
                             <button type="button" key={opt} onClick={() => toggleArrayItem("usa_herramientas_digitales", opt)}
                               className={`py-3 px-4 border rounded-xl text-sm font-medium transition-all flex items-center justify-between ${isSelected ? 'bg-primary/10 border-primary text-primary' : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/30'}`}
                             >
                               {opt}
                               {isSelected && <CheckCircle2 className="w-4 h-4" />}
                             </button>
                           );
                         })}
                       </div>
                     </div>
                   </motion.div>
                 )}

                 {/* PASO 4: OBJETIVOS */}
                 {step === 4 && (
                   <motion.div 
                     key="step4"
                     initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                     className="flex flex-col gap-8"
                   >
                     <h3 className="text-2xl font-bold flex items-center gap-3 border-b border-white/10 pb-4">
                       <Target className="text-primary" /> Objetivos & Proyección
                     </h3>

                     <div className="flex flex-col gap-3">
                       <label className="text-sm font-semibold text-gray-300">¿Cuál es tu objetivo principal a 6 meses?</label>
                       <div className="flex flex-col gap-2">
                         {[
                           "Automatizar procesos internos",
                           "Conseguir más clientes",
                           "Vender más a clientes actuales",
                           "Tener más control y visibilidad del negocio",
                           "Escalar sin contratar más personal"
                         ].map(opt => (
                           <button type="button" key={opt} onClick={() => updateForm("objetivo_principal", opt)}
                             className={`py-3.5 px-5 border rounded-xl text-sm font-medium transition-all text-left ${formData.objetivo_principal === opt ? 'bg-primary/10 border-primary text-primary' : 'bg-white/5 border-white/10 text-gray-300 hover:border-white/30 hover:bg-white/10'}`}
                           >
                             {opt}
                           </button>
                         ))}
                       </div>
                     </div>

                     <div className="flex flex-col gap-3">
                       <label className="text-sm font-semibold text-gray-300">Nivel de urgencia</label>
                       <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                         {["Quiero empezar ya", "Estoy evaluando opciones", "Solo curiosidad por ahora"].map(opt => (
                           <button type="button" key={opt} onClick={() => updateForm("urgencia", opt)}
                             className={`py-3 px-4 border rounded-xl text-sm font-medium transition-all ${formData.urgencia === opt ? 'bg-primary/10 border-primary text-primary' : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/30'}`}
                           >
                             {opt}
                           </button>
                         ))}
                       </div>
                     </div>

                     <div className="flex flex-col gap-3">
                       <label className="text-sm font-semibold text-gray-300">Presupuesto disponible para inversión</label>
                       <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                         {["No tengo presupuesto", "Menos de $300/mes", "$300-$1000/mes", "+$1000/mes"].map(opt => (
                           <button type="button" key={opt} onClick={() => updateForm("presupuesto_disponible", opt)}
                             className={`py-3 px-4 border rounded-xl text-sm font-medium transition-all ${formData.presupuesto_disponible === opt ? 'bg-primary/10 border-primary text-primary' : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/30'}`}
                           >
                             {opt}
                           </button>
                         ))}
                       </div>
                     </div>
                   </motion.div>
                 )}
               </AnimatePresence>

               {/* Navigation Buttons */}
               <div className="mt-10 pt-6 border-t border-white/10 flex justify-between items-center">
                 {step > 1 ? (
                   <button type="button" onClick={handlePrev} className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors font-medium">
                     <ChevronLeft className="w-5 h-5" /> Atrás
                   </button>
                 ) : <div></div>}

                 {step < 4 ? (
                   <button type="submit" className="flex items-center gap-2 bg-white text-black px-6 py-3 rounded-full font-bold hover:bg-primary transition-colors">
                     Siguiente <ArrowRight className="w-5 h-5" />
                   </button>
                 ) : (
                   <button 
                     type="submit" 
                     disabled={isSubmitting}
                     className="flex items-center gap-2 bg-primary text-black px-8 py-3.5 rounded-full font-bold text-lg hover:bg-white transition-colors disabled:opacity-70 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(195,216,9,0.3)]"
                   >
                     {isSubmitting ? (
                       <span className="flex items-center gap-2">Analizando Datos... <Rocket className="w-5 h-5 animate-pulse" /></span>
                     ) : (
                       <span className="flex items-center gap-2">Generar Diagnóstico <Zap className="w-5 h-5" /></span>
                     )}
                   </button>
                 )}
               </div>
             </form>
           )}
        </div>

      </div>
    </main>
  );
}
