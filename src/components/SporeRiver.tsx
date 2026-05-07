"use client";

import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  baseY: number;
  size: number;
  speed: number;
  opacity: number;
  waveAmp: number;
  waveFreq: number;
  phase: number;
}

export default function SporeRiver() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let particles: Particle[] = [];

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = canvas.offsetWidth * dpr;
      canvas.height = canvas.offsetHeight * dpr;
      ctx.scale(dpr, dpr);
    };

    const init = () => {
      resize();
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      const count = Math.min(Math.floor(w * 0.18), 140);

      particles = [];
      for (let i = 0; i < count; i++) {
        const baseY = h * 0.08 + Math.random() * h * 0.35; // river band at top behind title
        particles.push({
          x: Math.random() * w,
          y: baseY,
          baseY,
          size: 1 + Math.random() * 2.5,
          speed: 0.3 + Math.random() * 1.2,
          opacity: 0.08 + Math.random() * 0.25,
          waveAmp: 8 + Math.random() * 25,
          waveFreq: 0.002 + Math.random() * 0.004,
          phase: Math.random() * Math.PI * 2,
        });
      }
    };

    let time = 0;

    const draw = () => {
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      ctx.clearRect(0, 0, w, h);

      time += 0.016;

      // Particles only — no background rect
      for (const p of particles) {
        // Horizontal flow
        p.x += p.speed;
        if (p.x > w + 10) {
          p.x = -10;
          p.baseY = h * 0.08 + Math.random() * h * 0.35;
          p.opacity = 0.08 + Math.random() * 0.25;
        }

        // Vertical sine wave — river undulation
        p.y = p.baseY + Math.sin(p.x * p.waveFreq + p.phase + time * 0.5) * p.waveAmp;

        // Fade edges horizontally
        const edgeFade = Math.min(p.x / (w * 0.15), (w - p.x) / (w * 0.15), 1);
        const alpha = p.opacity * Math.max(edgeFade, 0);

        // Draw spore with glow
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(195, 216, 9, ${alpha})`;
        ctx.fill();

        // Subtle glow halo
        if (p.size > 1.8) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(195, 216, 9, ${alpha * 0.15})`;
          ctx.fill();
        }
      }

      // Draw faint connection lines between nearby particles (tech feel)
      ctx.strokeStyle = "rgba(195, 216, 9, 0.04)";
      ctx.lineWidth = 0.5;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = dx * dx + dy * dy;
          if (dist < 4000) {
            const lineAlpha = (1 - dist / 4000) * 0.06;
            ctx.strokeStyle = `rgba(195, 216, 9, ${lineAlpha})`;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      animId = requestAnimationFrame(draw);
    };

    init();
    animId = requestAnimationFrame(draw);

    window.addEventListener("resize", init);
    return () => {
      window.removeEventListener("resize", init);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-0"
      style={{ opacity: 0.9 }}
    />
  );
}
