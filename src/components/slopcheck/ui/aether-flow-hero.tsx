"use client";

import React from "react";
import { motion, useReducedMotion, type Variants } from "framer-motion";

interface Particle {
  x: number;
  y: number;
  dx: number;
  dy: number;
  size: number;
}

// La red se dibuja sobre el degradado claro, así que va en índigo y tinta.
const PARTICLE_COLOR = "rgba(67, 56, 202, 0.55)";
const LINE_NEAR_MOUSE = "rgba(20, 18, 31, ";
const LINE_DEFAULT = "rgba(99, 102, 241, ";

interface AetherFlowHeroProps {
  title: string;
  subtitle: string;
  /** Va donde el diseño original ponía el botón. */
  children: React.ReactNode;
}

/**
 * Hero de pantalla completa con una red de partículas dibujada en canvas.
 * El canvas reacciona al puntero: las partículas se apartan y las líneas
 * cercanas se aclaran. Es decorativo, así que se apaga entero con
 * prefers-reduced-motion y se pausa cuando la pestaña no está visible.
 */
export function AetherFlowHero({ title, subtitle, children }: AetherFlowHeroProps) {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const reduceMotion = useReducedMotion();

  React.useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    let frame = 0;
    let particles: Particle[] = [];
    let width = 0;
    let height = 0;
    const mouse: { x: number | null; y: number | null } = { x: null, y: null };
    const MOUSE_RADIUS = 200;
    // El puntero fino es el único que produce hover real; el táctil dispara falsos.
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

    const seed = () => {
      particles = [];
      const count = Math.min(160, Math.round((width * height) / 11000));
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          dx: Math.random() * 0.4 - 0.2,
          dy: Math.random() * 0.4 - 0.2,
          size: Math.random() * 2 + 1,
        });
      }
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed();
    };

    const connect = () => {
      const maxDistance = Math.min(width, height) / 5;
      const maxSquared = maxDistance * maxDistance;
      for (let a = 0; a < particles.length; a++) {
        for (let b = a + 1; b < particles.length; b++) {
          const dx = particles[a].x - particles[b].x;
          const dy = particles[a].y - particles[b].y;
          const squared = dx * dx + dy * dy;
          if (squared >= maxSquared) continue;

          const opacity = 1 - squared / maxSquared;
          let near = false;
          if (mouse.x !== null && mouse.y !== null) {
            const mx = particles[a].x - mouse.x;
            const my = particles[a].y - mouse.y;
            near = mx * mx + my * my < MOUSE_RADIUS * MOUSE_RADIUS;
          }
          const alpha = near ? opacity * 0.55 : opacity * 0.4;
          ctx.strokeStyle = `${near ? LINE_NEAR_MOUSE : LINE_DEFAULT}${alpha.toFixed(3)})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(particles[a].x, particles[a].y);
          ctx.lineTo(particles[b].x, particles[b].y);
          ctx.stroke();
        }
      }
    };

    const draw = (move: boolean) => {
      // Transparente: el degradado de la página tiene que verse a través.
      ctx.clearRect(0, 0, width, height);

      for (const p of particles) {
        if (move) {
          if (p.x > width || p.x < 0) p.dx = -p.dx;
          if (p.y > height || p.y < 0) p.dy = -p.dy;

          if (mouse.x !== null && mouse.y !== null) {
            const dx = mouse.x - p.x;
            const dy = mouse.y - p.y;
            const distance = Math.hypot(dx, dy);
            if (distance < MOUSE_RADIUS + p.size && distance > 0) {
              const force = (MOUSE_RADIUS - distance) / MOUSE_RADIUS;
              p.x -= (dx / distance) * force * 5;
              p.y -= (dy / distance) * force * 5;
            }
          }
          p.x += p.dx;
          p.y += p.dy;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = PARTICLE_COLOR;
        ctx.fill();
      }
      connect();
    };

    const loop = () => {
      frame = requestAnimationFrame(loop);
      draw(true);
    };

    const start = () => {
      cancelAnimationFrame(frame);
      if (reduceMotion) draw(false);
      else loop();
    };

    const onVisibility = () => {
      if (document.hidden) cancelAnimationFrame(frame);
      else start();
    };

    const onResize = () => {
      resize();
      if (reduceMotion) draw(false);
    };

    const onMouseMove = (event: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = event.clientX - rect.left;
      mouse.y = event.clientY - rect.top;
    };

    const onMouseOut = () => {
      mouse.x = null;
      mouse.y = null;
    };

    resize();
    start();

    window.addEventListener("resize", onResize);
    document.addEventListener("visibilitychange", onVisibility);
    if (finePointer) {
      window.addEventListener("mousemove", onMouseMove);
      window.addEventListener("mouseout", onMouseOut);
    }

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseout", onMouseOut);
    };
  }, [reduceMotion]);

  // Entrada escalonada: se ve una vez por visita, así que puede durar más que la UI.
  const fadeUp: Variants = {
    hidden: { opacity: 0, transform: "translateY(16px)" },
    visible: (i: number) => ({
      opacity: 1,
      transform: "translateY(0px)",
      transition: {
        delay: reduceMotion ? 0 : i * 0.07 + 0.15,
        duration: reduceMotion ? 0.2 : 0.6,
        ease: [0.23, 1, 0.32, 1],
      },
    }),
  };

  return (
    <div className="hero">
      <canvas ref={canvasRef} className="hero-canvas" aria-hidden="true" />

      <div className="hero-content">
        <motion.h1 custom={0} variants={fadeUp} initial="hidden" animate="visible" className="hero-title">
          {title}
        </motion.h1>

        <motion.p custom={1} variants={fadeUp} initial="hidden" animate="visible" className="hero-subtitle">
          {subtitle}
        </motion.p>

        <motion.div custom={2} variants={fadeUp} initial="hidden" animate="visible" className="hero-slot">
          {children}
        </motion.div>
      </div>
    </div>
  );
}

export default AetherFlowHero;
