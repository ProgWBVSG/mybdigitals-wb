"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ChevronDown } from "lucide-react";

export default function Navbar() {
  return (
    <motion.header 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="fixed top-0 w-full flex justify-between items-center px-4 md:px-10 py-5 z-50 bg-background/40 backdrop-blur-xl border-b border-white/5"
    >
      <Link href="/" className="text-xl md:text-2xl font-black tracking-tighter flex items-center gap-2">
        <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-primary/20 flex items-center justify-center border border-primary/30 overflow-hidden relative">
          <Image 
            src="/myb-robot.png" 
            alt="MYB Bot" 
            fill
            className="object-contain p-1"
          />
        </div>
        <span className="text-white">MYB</span> <span className="text-primary/80 font-medium">DIGITALS</span>
      </Link>
      
      <nav className="hidden md:flex gap-8 items-center font-medium bg-white/5 px-8 py-3 rounded-full border border-white/10">
        <Link href="/" className="text-xs tracking-widest uppercase text-gray-400 hover:text-white transition-colors">
          Inicio
        </Link>
        <div className="relative group p-2 -m-2">
          <span className="text-xs tracking-widest uppercase text-gray-400 hover:text-white transition-colors cursor-pointer flex items-center gap-1">
            Web <ChevronDown size={12}/>
          </span>
          <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 w-52 bg-background/95 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all flex flex-col shadow-2xl">
            <Link href="/servicios/web/presencia-digital" className="text-xs tracking-wide text-gray-400 hover:text-white hover:bg-white/5 p-3 px-4 transition-colors border-b border-white/5">
              Presencia Digital
            </Link>
            <Link href="/servicios/web/landing-page" className="text-xs tracking-wide text-gray-400 hover:text-white hover:bg-white/5 p-3 px-4 transition-colors border-b border-white/5">
              Landing Page
            </Link>
            <Link href="/servicios/web/invitaciones" className="text-xs tracking-wide text-gray-400 hover:text-white hover:bg-white/5 p-3 px-4 transition-colors">
              Web Invitations
            </Link>
          </div>
        </div>
        <Link href="/servicios/automatizaciones" className="text-xs tracking-widest uppercase text-gray-400 hover:text-white transition-colors">
          Automatizaciones IA
        </Link>
      </nav>

      <Link 
        href="https://wa.me/543515555123" 
        target="_blank"
        className="bg-white text-black px-6 py-3 rounded-full font-bold text-sm hover:scale-105 hover:bg-primary transition-all flex gap-2 items-center shadow-lg"
      >
        Agendar Sesión <ArrowRight size={16} />
      </Link>
    </motion.header>
  );
}
