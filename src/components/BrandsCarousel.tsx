"use client";

import React from "react";

const brands = [
  "Reinventadas 5.0",
  "Elevare Consulting",
  "Erika Rios",
  "eneascoaching",
  "Imperio de la moda",
  "Fernando Berberian Producciones."
];

export default function BrandsCarousel() {
  return (
    <section className="w-full py-20 md:py-32 border-t border-white/5 bg-background overflow-hidden relative z-20">
      {/* Background glow para darle el aspecto premium oscuro */}
      <div className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-primary/5 blur-[150px] pointer-events-none rounded-full" />
      
      <div className="text-center mb-12 md:mb-20 relative z-10 px-4">
        <h3 className="text-sm md:text-base font-bold text-primary tracking-widest uppercase mb-3">Marcas de Élite</h3>
        <h2 className="text-3xl md:text-5xl font-black text-white">Confían en nuestra <span className="italic">tecnología</span></h2>
      </div>

      {/* Contenedor del Carrusel Marquee */}
      <div className="relative w-full overflow-hidden flex items-center">
        {/* Gradients a los lados para difuminar la entrada/salida */}
        <div className="absolute left-0 top-0 bottom-0 w-32 md:w-64 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-32 md:w-64 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

        <div className="flex w-max animate-scroll hover:[animation-play-state:paused]">
          {/* Se renderizan 2 grupos idénticos para el infinite scroll seamless */}
          {[0, 1].map((groupIdx) => (
            <div key={groupIdx} className="flex items-center justify-around gap-16 md:gap-24 px-8 md:px-12">
              {/* Duplicamos el array interno para asegurarnos de que cubra pantallas ultra anchas */}
              {[...brands, ...brands].map((brand, i) => (
                <div 
                  key={`${groupIdx}-${i}`} 
                  className="flex flex-col items-center justify-center opacity-40 hover:opacity-100 transition-all duration-500 hover:scale-105 cursor-pointer group"
                >
                  <span className="text-2xl md:text-4xl font-black tracking-tighter text-white whitespace-nowrap group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-400">
                    {brand}
                  </span>
                  {/* Pequeño indicador debajo (opcional) */}
                  <div className="w-0 h-[2px] bg-primary mt-2 group-hover:w-full transition-all duration-500" />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
