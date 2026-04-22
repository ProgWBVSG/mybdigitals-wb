"use client";

import { motion, useMotionValue, useSpring, useTransform, useScroll } from "framer-motion";
import { useEffect, useState } from "react";

export const FloatingBot = () => {
  // Track mouse position
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Parallax Scrolling effect so it moves as you travel the page
  const { scrollYProgress } = useScroll();
  const parallaxY = useTransform(scrollYProgress, [0, 1], [0, 600]);
  const parallaxRotate = useTransform(scrollYProgress, [0, 1], [-5, 15]);

  // Smooth out the mouse movement for the eyes
  const springConfig = { damping: 25, stiffness: 200 };
  const smoothMouseX = useSpring(mouseX, springConfig);
  const smoothMouseY = useSpring(mouseY, springConfig);

  const eyeX = useTransform(smoothMouseX, [-0.5, 0.5], [-12, 12]);
  const eyeY = useTransform(smoothMouseY, [-0.5, 0.5], [-6, 6]);
  const headRotate = useTransform(smoothMouseX, [-0.5, 0.5], [-8, 8]);
  
  // Blink animation state (just changing height scale of eyes)
  const [blink, setBlink] = useState(1);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Normalize between -0.5 and 0.5
      mouseX.set(e.clientX / window.innerWidth - 0.5);
      mouseY.set(e.clientY / window.innerHeight - 0.5);
    };
    
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  useEffect(() => {
    // Random blinking logic
    const blinkInterval = setInterval(() => {
        setBlink(0.1); // Close eyes
        setTimeout(() => setBlink(1), 150); // Open eyes fast
    }, Math.random() * 4000 + 2000); // Blink every 2-6 seconds
    
    return () => clearInterval(blinkInterval);
  }, []);

  return (
    <motion.div 
       initial={{ opacity: 0 }}
       animate={{ opacity: 0.25 }}
       transition={{ duration: 2 }}
       style={{ y: parallaxY }}
       className="absolute top-[200px] right-4 md:right-[15%] w-64 h-64 md:w-96 md:h-96 pointer-events-none -z-10 drop-shadow-[0_20px_30px_rgba(0,0,0,0.6)] flex items-center justify-center cursor-none mix-blend-screen overflow-hidden"
    >
        <motion.div
           animate={{ y: [0, -30, 0] }}
           transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
           className="w-full h-full relative"
        >
            {/* The SVG Robot */}
            <motion.svg 
               viewBox="0 0 200 200" 
               fill="none" 
               xmlns="http://www.w3.org/2000/svg"
               style={{ rotateZ: parallaxRotate }}
               className="w-full h-full drop-shadow-[0_0_25px_rgba(195,216,9,0.2)]"
            >
                <defs>
                    <linearGradient id="bodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#2A2A2A" />
                        <stop offset="50%" stopColor="#151515" />
                        <stop offset="100%" stopColor="#080808" />
                    </linearGradient>
                    <linearGradient id="auricularGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#444" />
                        <stop offset="100%" stopColor="#111" />
                    </linearGradient>
                    <linearGradient id="visorGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#0a0a0a" />
                        <stop offset="100%" stopColor="#020202" />
                    </linearGradient>
                    <radialGradient id="eyeGlow" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor="#C3D809" stopOpacity="1" />
                        <stop offset="100%" stopColor="#C3D809" stopOpacity="0" />
                    </radialGradient>
                    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                        <feGaussianBlur stdDeviation="4" result="blur" />
                        <feMerge>
                            <feMergeNode in="blur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                    {/* Shadow for visor inset */}
                    <filter id="insetShadow">
                        <feOffset dx="0" dy="4"/>
                        <feGaussianBlur stdDeviation="3" result="offset-blur"/>
                        <feComposite operator="out" in="SourceGraphic" in2="offset-blur" result="inverse"/>
                        <feFlood floodColor="black" floodOpacity="0.8" result="color"/>
                        <feComposite operator="in" in="color" in2="inverse" result="shadow"/>
                        <feComposite operator="over" in="shadow" in2="SourceGraphic"/>
                    </filter>
                </defs>

                {/* Floating thrust / shadow underneath */}
                <ellipse cx="100" cy="170" rx="35" ry="10" fill="url(#eyeGlow)" opacity="0.3" filter="url(#glow)"/>
                
                {/* Auriculars (Ears) */}
                <rect x="15" y="80" width="20" height="40" rx="10" fill="url(#auricularGrad)" stroke="#333" strokeWidth="2" />
                <rect x="165" y="80" width="20" height="40" rx="10" fill="url(#auricularGrad)" stroke="#333" strokeWidth="2" />

                {/* Main Body (Curved Rectangle / Squircle) */}
                <rect x="25" y="40" width="150" height="120" rx="60" fill="url(#bodyGrad)" stroke="#333" strokeWidth="2" />
                
                {/* Top Antenna */}
                <path d="M100 40 L100 20" stroke="#888" strokeWidth="4" strokeLinecap="round" />
                <circle cx="100" cy="15" r="8" fill="#C3D809" filter="url(#glow)"/>

                {/* Visor Area (Glass) */}
                <rect x="40" y="65" width="120" height="60" rx="30" fill="url(#visorGrad)" stroke="#222" strokeWidth="2" filter="url(#insetShadow)"/>
                
                {/* Moving Eyes container */}
                <motion.g style={{ x: eyeX, y: eyeY }}>
                    <motion.g animate={{ scaleY: blink }} transition={{ duration: 0 }} style={{ transformOrigin: "center 95px" }}>
                        {/* Left Eye */}
                        <rect x="65" y="82" width="24" height="18" rx="8" fill="#C3D809" filter="url(#glow)" />
                        {/* Right Eye */}
                        <rect x="111" y="82" width="24" height="18" rx="8" fill="#C3D809" filter="url(#glow)" />
                    </motion.g>
                    
                    {/* Cute glowing cheeks */}
                    <ellipse cx="50" cy="110" rx="10" ry="5" fill="#C3D809" opacity="0.15" filter="blur(3px)"/>
                    <ellipse cx="150" cy="110" rx="10" ry="5" fill="#C3D809" opacity="0.15" filter="blur(3px)"/>
                </motion.g>

                {/* Metallic Highlight Top */}
                <path d="M45 55 Q100 35 155 55 Q100 45 45 55" fill="white" opacity="0.1" />
            </motion.svg>
        </motion.div>
    </motion.div>
  );
};
