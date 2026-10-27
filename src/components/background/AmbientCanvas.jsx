import React, { useEffect, useRef } from 'react';

/**
 * AmbientCanvas — lightweight canvas-based ambient animation layer.
 * Runs behind every main-site section. Reads theme CSS variables to stay
 * color-coordinated. pointer-events:none, aria-hidden, respects reduced-motion.
 *
 * mode:
 *   'petals'       — gently drifting organic shapes (hero, welcome, story)
 *   'particles'    — slow rising dust motes (events, RSVP)
 *   'orbs'         — soft radial glow blobs that drift (gallery, travel)
 *   'sparkles'     — tiny twinkling star-points (footer)
 */
export function AmbientCanvas({ mode = 'petals', opacity = 1, className = '' }) {
  const canvasRef = useRef(null);
  const rafRef    = useRef(null);

  useEffect(() => {
    // Respect prefers-reduced-motion
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mq.matches) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let W = 0, H = 0;
    const resize = () => {
      W = canvas.width  = canvas.offsetWidth;
      H = canvas.height = canvas.offsetHeight;
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas.parentElement || canvas);

    // Read primary color from CSS var on root — fallback to rose
    const style    = getComputedStyle(document.documentElement);
    const primary  = style.getPropertyValue('--t-primary').trim()  || '#8B6E7F';
    const accent   = style.getPropertyValue('--t-accent').trim()   || '#C4A6B2';
    const surface  = style.getPropertyValue('--t-surface').trim()  || '#EEE4EE';

    // ── Petal shapes ──────────────────────────────────────────
    if (mode === 'petals') {
      const petals = Array.from({ length: 22 }, () => ({
        x:  Math.random() * 100,
        y:  -10 - Math.random() * 100,  // start above viewport
        vx: (Math.random() - 0.5) * 0.18,
        vy:  0.18 + Math.random() * 0.22,
        rot: Math.random() * Math.PI * 2,
        rotV: (Math.random() - 0.5) * 0.012,
        size: 5 + Math.random() * 9,
        opacity: 0.18 + Math.random() * 0.28,
        color: Math.random() > 0.5 ? primary : accent,
      }));

      const draw = () => {
        ctx.clearRect(0, 0, W, H);
        petals.forEach(p => {
          p.x += p.vx; p.y += p.vy; p.rot += p.rotV;
          if (p.y > H + 20) { p.y = -20; p.x = Math.random() * 100; }
          if (p.x < -5) p.x = 105;
          if (p.x > 105) p.x = -5;

          const px = (p.x / 100) * W;
          const py = p.y;

          ctx.save();
          ctx.translate(px, py);
          ctx.rotate(p.rot);
          ctx.globalAlpha = p.opacity;
          // Ellipse petal
          ctx.beginPath();
          ctx.ellipse(0, 0, p.size, p.size * 0.55, 0, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.fill();
          ctx.restore();
        });
        rafRef.current = requestAnimationFrame(draw);
      };
      draw();
    }

    // ── Rising dust particles ─────────────────────────────────
    if (mode === 'particles') {
      const dots = Array.from({ length: 36 }, () => ({
        x:  Math.random() * 100,
        y:  110 + Math.random() * 30,
        vx: (Math.random() - 0.5) * 0.15,
        vy: -(0.12 + Math.random() * 0.18),
        r:  0.8 + Math.random() * 2,
        opacity: 0.12 + Math.random() * 0.3,
        color: Math.random() > 0.6 ? primary : accent,
      }));

      const draw = () => {
        ctx.clearRect(0, 0, W, H);
        dots.forEach(p => {
          p.x += p.vx; p.y += p.vy;
          if (p.y < -10) { p.y = H + 10; p.x = Math.random() * 100; }
          ctx.beginPath();
          ctx.arc((p.x / 100) * W, p.y, p.r, 0, Math.PI * 2);
          ctx.globalAlpha = p.opacity;
          ctx.fillStyle   = p.color;
          ctx.fill();
        });
        rafRef.current = requestAnimationFrame(draw);
      };
      draw();
    }

    // ── Soft glowing orbs ─────────────────────────────────────
    if (mode === 'orbs') {
      const orbs = Array.from({ length: 6 }, (_, i) => ({
        x:  15 + i * 16 + (Math.random() - 0.5) * 10,
        y:  20 + Math.random() * 60,
        vx: (Math.random() - 0.5) * 0.06,
        vy: (Math.random() - 0.5) * 0.04,
        r:  60 + Math.random() * 80,
        opacity: 0.06 + Math.random() * 0.08,
        color: i % 2 === 0 ? primary : accent,
      }));

      const draw = () => {
        ctx.clearRect(0, 0, W, H);
        orbs.forEach(p => {
          p.x += p.vx; p.y += p.vy;
          if (p.x < -10 || p.x > 110) p.vx *= -1;
          if (p.y < -10 || p.y > 110) p.vy *= -1;

          const px = (p.x / 100) * W;
          const py = (p.y / 100) * H;
          const grad = ctx.createRadialGradient(px, py, 0, px, py, p.r);
          grad.addColorStop(0, p.color + '40');
          grad.addColorStop(1, p.color + '00');
          ctx.beginPath();
          ctx.arc(px, py, p.r, 0, Math.PI * 2);
          ctx.globalAlpha = p.opacity * 3;
          ctx.fillStyle   = grad;
          ctx.fill();
        });
        rafRef.current = requestAnimationFrame(draw);
      };
      draw();
    }

    // ── Twinkling sparkles ─────────────────────────────────────
    if (mode === 'sparkles') {
      const sparks = Array.from({ length: 50 }, () => ({
        x: Math.random() * 100,
        y: Math.random() * 100,
        r: 0.5 + Math.random() * 1.5,
        phase: Math.random() * Math.PI * 2,
        speed: 0.008 + Math.random() * 0.015,
        color: Math.random() > 0.5 ? primary : '#ffffff',
      }));

      const draw = () => {
        ctx.clearRect(0, 0, W, H);
        sparks.forEach(p => {
          p.phase += p.speed;
          const a = 0.1 + Math.abs(Math.sin(p.phase)) * 0.55;
          ctx.beginPath();
          ctx.arc((p.x / 100) * W, (p.y / 100) * H, p.r, 0, Math.PI * 2);
          ctx.globalAlpha = a;
          ctx.fillStyle   = p.color;
          ctx.fill();
        });
        rafRef.current = requestAnimationFrame(draw);
      };
      draw();
    }

    return () => {
      cancelAnimationFrame(rafRef.current);
      ro.disconnect();
    };
  }, [mode]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`ambient-canvas ${className}`}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 0,
        opacity,
      }}
    />
  );
}

export default AmbientCanvas;
