"use client";

import { useEffect, useRef } from "react";

interface Particle {
  x: number; y: number; z: number;
  vx: number; vy: number; vz: number;
  r: number;
}

const NUM_PARTICLES = 120;
const CONNECTION_DIST = 160;
const FOV = 500;
const DEPTH = 600;

function project(x: number, y: number, z: number, w: number, h: number) {
  const scale = FOV / (FOV + z + DEPTH / 2);
  return {
    sx: x * scale + w / 2,
    sy: y * scale + h / 2,
    scale,
  };
}

export default function OrbitScene() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouse = useRef({ x: 0, y: 0 });
  const rotY = useRef(0);
  const rotX = useRef(0);
  const particles = useRef<Particle[]>([]);
  const raf = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    let W = 0, H = 0;

    // Inicializar partículas
    particles.current = Array.from({ length: NUM_PARTICLES }, () => ({
      x: (Math.random() - 0.5) * 800,
      y: (Math.random() - 0.5) * 800,
      z: (Math.random() - 0.5) * DEPTH,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      vz: (Math.random() - 0.5) * 0.3,
      r: 1.5 + Math.random() * 2,
    }));

    const resize = () => {
      W = canvas.width = canvas.offsetWidth;
      H = canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const onMouse = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.current.x = ((e.clientX - rect.left) / W - 0.5) * 2;
      mouse.current.y = ((e.clientY - rect.top) / H - 0.5) * 2;
    };
    window.addEventListener("mousemove", onMouse);

    // Colores de marca
    const PRIMARY = "195,216,9";
    const CYAN = "0,200,255";

    function draw() {
      ctx.clearRect(0, 0, W, H);

      // Rotación automática + mouse
      rotY.current += 0.003 + mouse.current.x * 0.008;
      rotX.current += 0.001 + mouse.current.y * 0.004;

      const cosY = Math.cos(rotY.current), sinY = Math.sin(rotY.current);
      const cosX = Math.cos(rotX.current), sinX = Math.sin(rotX.current);

      // Mover + rotar partículas
      const projected = particles.current.map((p) => {
        p.x += p.vx; p.y += p.vy; p.z += p.vz;
        // Rebote en caja
        if (Math.abs(p.x) > 420) p.vx *= -1;
        if (Math.abs(p.y) > 420) p.vy *= -1;
        if (Math.abs(p.z) > DEPTH / 2) p.vz *= -1;

        // Rotar Y
        const rx = p.x * cosY - p.z * sinY;
        const rz = p.x * sinY + p.z * cosY;
        // Rotar X
        const ry = p.y * cosX - rz * sinX;
        const rz2 = p.y * sinX + rz * cosX;

        const { sx, sy, scale } = project(rx, ry, rz2, W, H);
        return { sx, sy, scale, rz2, p };
      });

      // Ordenar por Z (pintor – lo más alejado primero)
      projected.sort((a, b) => a.rz2 - b.rz2);

      // Dibujar conexiones
      for (let i = 0; i < projected.length; i++) {
        const a = projected[i];
        for (let j = i + 1; j < projected.length; j++) {
          const b = projected[j];
          const dx = a.sx - b.sx, dy = a.sy - b.sy;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < CONNECTION_DIST) {
            const alpha = (1 - dist / CONNECTION_DIST) * 0.45;
            // Gradiente verde → cian según profundidad
            const depth = (a.rz2 + b.rz2) / 2;
            const t = Math.max(0, Math.min(1, (depth + DEPTH / 2) / DEPTH));
            const color = t > 0.5 ? PRIMARY : CYAN;
            ctx.beginPath();
            ctx.strokeStyle = `rgba(${color},${alpha})`;
            ctx.lineWidth = 0.6 * ((a.scale + b.scale) / 2);
            ctx.moveTo(a.sx, a.sy);
            ctx.lineTo(b.sx, b.sy);
            ctx.stroke();
          }
        }
      }

      // Dibujar nodos
      projected.forEach(({ sx, sy, scale, rz2, p }) => {
        const depth = (rz2 + DEPTH / 2) / DEPTH; // 0..1
        const alpha = 0.4 + depth * 0.6;
        const color = depth > 0.5 ? PRIMARY : CYAN;
        const radius = p.r * scale * 1.8;

        // Glow
        const grd = ctx.createRadialGradient(sx, sy, 0, sx, sy, radius * 3);
        grd.addColorStop(0, `rgba(${color},${alpha * 0.6})`);
        grd.addColorStop(1, `rgba(${color},0)`);
        ctx.beginPath();
        ctx.arc(sx, sy, radius * 3, 0, Math.PI * 2);
        ctx.fillStyle = grd;
        ctx.fill();

        // Núcleo
        ctx.beginPath();
        ctx.arc(sx, sy, radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${color},${alpha})`;
        ctx.fill();
      });

      // Nodo central fijo (el núcleo MYB)
      const { sx: cx, sy: cy } = project(0, 0, 0, W, H);
      const pulseR = 18 + Math.sin(Date.now() * 0.002) * 4;
      // Outer glow
      const cg = ctx.createRadialGradient(cx, cy, 0, cx, cy, pulseR * 4);
      cg.addColorStop(0, `rgba(${PRIMARY},0.5)`);
      cg.addColorStop(1, `rgba(${PRIMARY},0)`);
      ctx.beginPath(); ctx.arc(cx, cy, pulseR * 4, 0, Math.PI * 2);
      ctx.fillStyle = cg; ctx.fill();
      // Ring
      ctx.beginPath(); ctx.arc(cx, cy, pulseR + 8, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(${PRIMARY},0.3)`; ctx.lineWidth = 1; ctx.stroke();
      // Core
      ctx.beginPath(); ctx.arc(cx, cy, pulseR, 0, Math.PI * 2);
      const coreGrd = ctx.createRadialGradient(cx - 4, cy - 4, 2, cx, cy, pulseR);
      coreGrd.addColorStop(0, "#e8f56a");
      coreGrd.addColorStop(1, "#7da000");
      ctx.fillStyle = coreGrd; ctx.fill();
      // Label
      ctx.font = "bold 9px sans-serif";
      ctx.fillStyle = "#000";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("MYB", cx, cy);

      raf.current = requestAnimationFrame(draw);
    }

    draw();

    return () => {
      cancelAnimationFrame(raf.current);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouse);
    };
  }, []);

  return (
    <div className="relative w-full h-full">
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{ display: "block" }}
      />
      {/* Indicador de estado */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-2 pointer-events-none">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
        </span>
        <span className="text-[10px] font-bold text-primary/70 tracking-[0.2em] uppercase">Neural network activo</span>
      </div>
    </div>
  );
}
