import React, { useEffect, useRef, useMemo } from 'react';

function createParticle(i, count, color) {
  return {
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: 1.5 + Math.random() * 3,
    duration: 3 + Math.random() * 5,
    delay: Math.random() * 4,
    driftX: (Math.random() - 0.5) * 30,
    driftY: -(10 + Math.random() * 30),
    opacity: 0.3 + Math.random() * 0.5,
  };
}

/**
 * Lightweight particle / dust field. Used by Midnight Vows (gold dust) and
 * Celestial Promise (star shimmer). CSS animation only — no canvas, no RAF loop.
 */
export function ParticleField({ count = 40, color = '#C9A84C', mode = 'float', className = '' }) {
  const particles = useMemo(() => Array.from({ length: count }, (_, i) => createParticle(i, count, color)), [count]);
  const isGold = mode === 'gold-converge';
  const isStar = mode === 'star-shimmer';

  return (
    <div
      aria-hidden="true"
      className={`particle-field ${className}`}
      style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}
    >
      {particles.map((p, i) => (
        <span
          key={i}
          style={{
            position: 'absolute',
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: isStar ? `${p.size * 0.7}px` : `${p.size}px`,
            height: isStar ? `${p.size * 0.7}px` : `${p.size}px`,
            borderRadius: '50%',
            background: color,
            opacity: 0,
            animation: `${isGold ? 'goldDrift' : isStar ? 'starPulse' : 'dustFloat'} ${p.duration}s ${p.delay}s ease-in-out infinite`,
            '--dx': `${p.driftX}px`,
            '--dy': `${p.driftY}px`,
            willChange: 'transform, opacity',
          }}
        />
      ))}
      <style>{`
        @keyframes dustFloat {
          0%   { opacity: 0; transform: translate(0, 0) scale(0.8); }
          20%  { opacity: var(--particle-opacity, 0.6); }
          80%  { opacity: var(--particle-opacity, 0.4); }
          100% { opacity: 0; transform: translate(var(--dx, 0), var(--dy, -20px)) scale(1.2); }
        }
        @keyframes goldDrift {
          0%   { opacity: 0; transform: translate(0, 30px) scale(0.5); }
          30%  { opacity: 0.7; }
          70%  { opacity: 0.5; }
          100% { opacity: 0; transform: translate(var(--dx, 0), var(--dy, -30px)) scale(1.4); }
        }
        @keyframes starPulse {
          0%, 100% { opacity: 0; transform: scale(0.6); }
          40%, 60% { opacity: 1; transform: scale(1.1); }
        }
        @media (prefers-reduced-motion: reduce) {
          .particle-field { display: none; }
        }
      `}</style>
    </div>
  );
}

export default ParticleField;
