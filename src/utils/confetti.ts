/**
 * Lightweight, zero-dependency canvas confetti burst tailored for Synora 2K26.
 * Bursts luxury gold, amber, obsidian, and champagne particles.
 */
export function triggerCelebrationConfetti(): void {
  if (typeof window === 'undefined') return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const canvas = document.createElement('canvas');
  canvas.style.position = 'fixed';
  canvas.style.inset = '0';
  canvas.style.width = '100vw';
  canvas.style.height = '100vh';
  canvas.style.pointerEvents = 'none';
  canvas.style.zIndex = '9999';
  document.body.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    document.body.removeChild(canvas);
    return;
  }

  const width = (canvas.width = window.innerWidth);
  const height = (canvas.height = window.innerHeight);

  const colors = [
    '#F5A623', // Amber accent
    '#FFC04D', // Gold
    '#FFE4A0', // Champagne
    '#FFFFFF', // White highlight
    '#A1A1AA', // Slate
  ];

  interface ConfettiPiece {
    x: number;
    y: number;
    w: number;
    h: number;
    vx: number;
    vy: number;
    rot: number;
    vRot: number;
    color: string;
    opacity: number;
  }

  const particles: ConfettiPiece[] = [];
  const count = 75;
  const startX = width > 768 ? width * 0.65 : width * 0.5;
  const startY = height * 0.45;

  for (let i = 0; i < count; i += 1) {
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 12 + 6;
    particles.push({
      x: startX,
      y: startY,
      w: Math.random() * 8 + 4,
      h: Math.random() * 5 + 3,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 4, // slight upward bias
      rot: Math.random() * 360,
      vRot: (Math.random() - 0.5) * 12,
      color: colors[Math.floor(Math.random() * colors.length)],
      opacity: 1,
    });
  }

  let startTime = performance.now();
  let animId: number;

  const step = (time: number) => {
    const elapsed = time - startTime;
    ctx.clearRect(0, 0, width, height);

    let aliveCount = 0;
    const gravity = 0.28;
    const drag = 0.985;

    for (let i = 0; i < particles.length; i += 1) {
      const p = particles[i];
      p.vx *= drag;
      p.vy = p.vy * drag + gravity;
      p.x += p.vx;
      p.y += p.vy;
      p.rot += p.vRot;

      if (elapsed > 1200) {
        p.opacity = Math.max(0, 1 - (elapsed - 1200) / 1200);
      }

      if (p.opacity > 0.01 && p.y < height + 40) {
        aliveCount += 1;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rot * Math.PI) / 180);
        ctx.globalAlpha = p.opacity;
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        ctx.restore();
      }
    }

    if (aliveCount > 0 && elapsed < 2600) {
      animId = requestAnimationFrame(step);
    } else {
      cancelAnimationFrame(animId);
      if (canvas.parentNode) {
        canvas.parentNode.removeChild(canvas);
      }
    }
  };

  animId = requestAnimationFrame(step);
}
