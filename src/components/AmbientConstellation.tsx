import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  baseAlpha: number;
  pulseSpeed: number;
  pulsePhase: number;
  color: 'amber' | 'gold' | 'slate';
}

export function AmbientConstellation() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    // Respect user's motion preferences
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize, { passive: true });

    // Number of particles proportional to screen size, bounded for 60fps performance
    const count = Math.min(48, Math.floor((width * height) / 32000));
    const particles: Particle[] = [];

    const colors = [
      { type: 'amber', r: 245, g: 166, b: 35 },
      { type: 'gold', r: 255, g: 192, b: 77 },
      { type: 'slate', r: 161, g: 161, b: 170 },
    ] as const;

    for (let i = 0; i < count; i += 1) {
      const colorDef = colors[i % colors.length];
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        radius: Math.random() * 1.6 + 0.8,
        baseAlpha: Math.random() * 0.35 + 0.15,
        pulseSpeed: Math.random() * 0.02 + 0.01,
        pulsePhase: Math.random() * Math.PI * 2,
        color: colorDef.type,
      });
    }

    let mouseX = -1000;
    let mouseY = -1000;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    const handleMouseLeave = () => {
      mouseX = -1000;
      mouseY = -1000;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mouseleave', handleMouseLeave, { passive: true });

    let isDocumentVisible = !document.hidden;
    const handleVisibilityChange = () => {
      isDocumentVisible = !document.hidden;
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    const maxDistance = 140;
    const maxDistanceSq = maxDistance * maxDistance;

    const render = () => {
      if (isDocumentVisible) {
        ctx.clearRect(0, 0, width, height);

        // Update and draw particles
        for (let i = 0; i < particles.length; i += 1) {
          const p = particles[i];
          p.x += p.vx;
          p.y += p.vy;

          if (p.x < -20) p.x = width + 20;
          else if (p.x > width + 20) p.x = -20;
          if (p.y < -20) p.y = height + 20;
          else if (p.y > height + 20) p.y = -20;

          // Subtle mouse repel/attract
          if (mouseX > 0) {
            const dx = mouseX - p.x;
            const dy = mouseY - p.y;
            const distSq = dx * dx + dy * dy;
            if (distSq < 22500 && distSq > 100) {
              const force = (1 - distSq / 22500) * 0.2;
              p.x += dx * force * 0.03;
              p.y += dy * force * 0.03;
            }
          }

          p.pulsePhase += p.pulseSpeed;
          const currentAlpha =
            p.baseAlpha + Math.sin(p.pulsePhase) * (p.baseAlpha * 0.35);

          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          if (p.color === 'amber') {
            ctx.fillStyle = `rgba(245, 166, 35, ${currentAlpha})`;
          } else if (p.color === 'gold') {
            ctx.fillStyle = `rgba(255, 192, 77, ${currentAlpha})`;
          } else {
            ctx.fillStyle = `rgba(161, 161, 170, ${currentAlpha * 0.7})`;
          }
          ctx.fill();

          // Connect nearby particles with subtle neural filaments
          for (let j = i + 1; j < particles.length; j += 1) {
            const p2 = particles[j];
            const dx = p.x - p2.x;
            const dy = p.y - p2.y;
            const distSq = dx * dx + dy * dy;

            if (distSq < maxDistanceSq) {
              const alphaRatio = (1 - distSq / maxDistanceSq) * 0.16;
              ctx.beginPath();
              ctx.moveTo(p.x, p.y);
              ctx.lineTo(p2.x, p2.y);
              ctx.strokeStyle = `rgba(245, 166, 35, ${alphaRatio})`;
              ctx.lineWidth = 0.75;
              ctx.stroke();
            }
          }
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-0 opacity-70"
    />
  );
}
