"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

const niches = [
  { text: "CLÍNICO.", image: "/niche_clinico.png", color: "from-blue-400 to-cyan-300" },
  { text: "DE COACHING.", image: "/niche_coaching.png", color: "from-amber-400 to-orange-400" },
  { text: "GASTRONÓMICO.", image: "/niche_gastronomico.png", color: "from-red-400 to-orange-500" },
  { text: "VETERINARIO.", image: "/niche_veterinario.png", color: "from-emerald-400 to-teal-400" },
  { text: "E-COMMERCE.", image: "/niche_ecommerce.png", color: "from-purple-400 to-pink-400" },
  { text: "FINANCIERO.", image: "/niche_financiero.png", color: "from-indigo-400 to-purple-400" }
];

export default function NicheTypewriter() {
  const [displayedText, setDisplayedText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [loopNum, setLoopNum] = useState(0);

  const idx = loopNum % niches.length;

  useEffect(() => {
    let timer: NodeJS.Timeout;
    const currentNiche = niches[idx].text;
    
    if (isDeleting) {
      timer = setTimeout(() => {
        setDisplayedText(currentNiche.substring(0, displayedText.length - 1));
      }, 40); // fast delete
    } else {
      timer = setTimeout(() => {
        setDisplayedText(currentNiche.substring(0, displayedText.length + 1));
      }, 70); // normal type
    }
  
    if (!isDeleting && displayedText === currentNiche) {
      timer = setTimeout(() => setIsDeleting(true), 2500); // pause at end
    } else if (isDeleting && displayedText === "") {
      timer = setTimeout(() => {
        setIsDeleting(false);
        setLoopNum(loopNum + 1);
      }, 500);
    }
  
    return () => clearTimeout(timer);
  }, [displayedText, isDeleting, loopNum, idx]);

  return (
    <div className="relative w-full overflow-hidden bg-[#020202] py-24 md:py-40 min-h-[500px] border-y border-white/5 flex items-center justify-center isolate">
       {/* Background Images with mix-blend-screen allowing them to fade organically */}
       <AnimatePresence mode="wait">
         <motion.div
           key={idx}
           initial={{ opacity: 0, x: 30, filter: "blur(10px)" }}
           animate={{ opacity: 0.85, x: 0, filter: "blur(0px)" }}
           exit={{ opacity: 0, x: -30, filter: "blur(10px)" }}
           transition={{ duration: 1.2, ease: "easeInOut" }}
           className="absolute inset-0 z-0 flex items-center justify-end lg:pr-40 pointer-events-none mix-blend-screen"
         >
            <div className="relative w-[400px] h-[400px] md:w-[700px] md:h-[700px]">
                <Image 
                  src={niches[idx].image} 
                  alt={niches[idx].text}
                  fill
                  className="object-contain"
                />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_20%,#020202_70%)]" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#020202] via-transparent to-[#020202]" />
                <div className="absolute inset-0 bg-gradient-to-r from-[#020202] via-transparent to-[#020202]" />
            </div>
         </motion.div>
       </AnimatePresence>

       {/* Text Content overlay */}
       <div className="max-w-[1240px] w-full px-6 mx-auto relative z-10 grid lg:grid-cols-2">
          <div className="flex flex-col justify-center text-left">
             <span className="text-white/50 uppercase tracking-widest text-xs font-bold mb-6 flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                Arquitectura de Autoridad
             </span>
             <h2 className="text-5xl md:text-6xl lg:text-[4.5rem] font-black text-white leading-[1.05] tracking-tighter mb-4 h-[180px] md:h-[220px]">
               Adaptado a <br/> tu negocio <br/>
               <span className={`text-transparent bg-clip-text bg-gradient-to-r ${niches[idx].color}`}>
                  {displayedText}
               </span>
               <motion.span 
                 animate={{ opacity: [1, 0, 1] }} 
                 transition={{ repeat: Infinity, duration: 0.8 }}
                 className="inline-block w-[4px] h-[45px] md:h-[65px] bg-primary ml-2 align-middle -mt-3"
               />
             </h2>
             <p className="text-gray-400 max-w-md text-lg font-light leading-relaxed border-l-[3px] border-primary/30 pl-6 backdrop-blur-sm bg-black/20 py-2">
                No instalamos plantillas genéricas. Tu ecosistema se adapta al lenguaje estricto de tu nicho, garantizando autoridad visual y filtrando clientes premium en piloto automático.
             </p>
          </div>
       </div>
    </div>
  );
}
