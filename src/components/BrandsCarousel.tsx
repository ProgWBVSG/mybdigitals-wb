"use client";

import React from "react";
import Image from "next/image";

// Brands config: logo path (null = text only)
const brands: { name: string; logo: string | null; height: number }[] = [
  { name: "Reinventadas 5.0",               logo: null,                      height: 0 },
  { name: "Elevare Consulting",              logo: "/logo_elevare.png",       height: 48 },
  { name: "Erika Rios",                      logo: null,                      height: 0 },
  { name: "eneascoaching",                   logo: "/logo_eneascoaching.png", height: 56 },
  { name: "Imperio de la moda",              logo: "/logo_imperio.png",       height: 64 },
  { name: "Fernando Berberian Producciones", logo: null,                      height: 0 },
];

function BrandItem({ brand }: { brand: typeof brands[number] }) {
  return (
    <div className="flex flex-col items-center justify-center opacity-40 hover:opacity-100 transition-all duration-500 hover:scale-105 cursor-pointer group shrink-0 px-6 md:px-10">
      {brand.logo ? (
        <div className="relative flex items-center justify-center h-16 md:h-20">
          <Image
            src={brand.logo}
            alt={brand.name}
            width={160}
            height={brand.height}
            className="object-contain max-h-14 md:max-h-20 w-auto brightness-0 invert opacity-80 group-hover:opacity-100 transition-all duration-500"
            style={{ filter: "brightness(0) invert(1)" }}
          />
        </div>
      ) : (
        <span className="text-xl sm:text-2xl md:text-3xl font-black tracking-tighter text-white whitespace-nowrap">
          {brand.name}
        </span>
      )}
      {/* Underline animado al hover */}
      <div className="w-0 h-[2px] bg-primary mt-3 group-hover:w-full transition-all duration-500 rounded-full" />
    </div>
  );
}

export default function BrandsCarousel() {
  // Duplicamos los items para el scroll infinito seamless
  const allBrands = [...brands, ...brands, ...brands, ...brands];

  return (
    <section
      id="marcas"
      aria-labelledby="brands-heading"
      className="w-full py-20 md:py-28 border-t border-white/5 bg-background overflow-hidden relative z-20"
    >
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-primary/5 blur-[150px] pointer-events-none rounded-full" />

      <div className="text-center mb-12 md:mb-20 relative z-10 px-4">
        <h3 className="text-sm md:text-base font-bold text-primary tracking-widest uppercase mb-3">
          Marcas de Élite
        </h3>
        <h2
          id="brands-heading"
          className="text-3xl md:text-5xl font-black text-white"
        >
          Confían en nuestra{" "}
          <span className="italic font-medium text-transparent bg-clip-text bg-gradient-to-r from-primary via-lime-300 to-emerald-400">
            tecnología
          </span>
        </h2>
      </div>

      {/* Marquee container */}
      <div className="relative w-full overflow-hidden flex items-center">
        {/* Fade edges */}
        <div className="absolute left-0 top-0 bottom-0 w-24 md:w-48 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 md:w-48 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

        <div className="flex w-max animate-brands-scroll hover:[animation-play-state:paused]">
          {allBrands.map((brand, i) => (
            <BrandItem key={`${brand.name}-${i}`} brand={brand} />
          ))}
        </div>
      </div>
    </section>
  );
}
