"use client";

import { useEffect, useRef } from "react";

export default function DigitalSpores() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    let mouse = { x: -1000, y: -1000 };
    let isMouseIn = false;

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      isMouseIn = true;
    };

    const handleMouseLeave = () => {
      isMouseIn = false;
      mouse.x = -1000;
      mouse.y = -1000;
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);

    const sporeCount = 80; // Aumentado por pedido del usuario
    const spores: { x: number, y: number, vx: number, vy: number, baseSize: number, color: string }[] = [];

    for (let i = 0; i < sporeCount; i++) {
      spores.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4 - 0.2, // Ligera tendencia hacia arriba
        baseSize: Math.random() * 2 + 0.5, // Tamaño más pequeño
        color: `rgba(195, 216, 9, ${Math.random() * 0.15 + 0.05})` // Muy transparente
      });
    }

    let animationFrameId: number;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < sporeCount; i++) {
        const s = spores[i];

        // Movimiento base
        s.x += s.vx;
        s.y += s.vy;

        // Si salen de la pantalla, vuelven a aparecer por el otro lado
        if (s.y < -20) s.y = height + 20;
        if (s.y > height + 20) s.y = -20;
        if (s.x < -20) s.x = width + 20;
        if (s.x > width + 20) s.x = -20;

        // Dibujar espora
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.baseSize, 0, Math.PI * 2);
        ctx.fillStyle = s.color;
        ctx.shadowBlur = 8; // Glow más suave
        ctx.shadowColor = "rgba(195, 216, 9, 0.2)";
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[1]"
    />
  );
}
