import React, { useEffect, useRef } from 'react';

const PETAL_SHAPES = [
  // Cherry blossom / round petal
  'M 0,-10 C 6,-10 10,-6 10,0 C 10,6 6,10 0,10 C -6,10 -10,6 -10,0 C -10,-6 -6,-10 0,-10 Z',
  // Elongated petal
  'M 0,-12 C 5,-8 7,0 5,10 C 3,14 -3,14 -5,10 C -7,0 -5,-8 0,-12 Z',
  // Marigold petal
  'M 0,-14 C 4,-10 6,-4 4,6 C 2,10 -2,10 -4,6 C -6,-4 -4,-10 0,-14 Z',
  // Wide petal
  'M 0,-8 C 8,-6 12,2 8,10 C 4,14 -4,14 -8,10 C -12,2 -8,-6 0,-8 Z',
];

function createPetal(index, color, count) {
  const shape = PETAL_SHAPES[index % PETAL_SHAPES.length];
  const x = 5 + (index / count) * 90 + (Math.random() - 0.5) * 12;
  const duration = 6 + Math.random() * 8;
  const delay = (index / count) * duration * 0.7;
  const size = 8 + Math.random() * 14;
  const rotate = Math.random() * 360;
  const sway = 30 + Math.random() * 50;
  const opacity = 0.4 + Math.random() * 0.45;

  return { shape, x, duration, delay, size, rotate, sway, opacity };
}

export function FloatingPetals({ count = 18, color = '#D4889A', className = '' }) {
  const petals = Array.from({ length: count }, (_, i) => createPetal(i, color, count));

  return (
    <div
      aria-hidden="true"
      className={`floating-petals-container ${className}`}
      style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
        zIndex: 0,
      }}
    >
      {petals.map((p, i) => (
        <svg
          key={i}
          width={p.size * 2}
          height={p.size * 2}
          viewBox="-15 -15 30 30"
          style={{
            position: 'absolute',
            top: '-5%',
            left: `${p.x}%`,
            opacity: p.opacity,
            animation: `petalFall${i % 4} ${p.duration}s ${p.delay}s linear infinite`,
            '--sway': `${p.sway}px`,
            willChange: 'transform',
          }}
        >
          <path d={p.shape} fill={color} transform={`rotate(${p.rotate})`} />
        </svg>
      ))}
      <style>{`
        @keyframes petalFall0 {
          0%   { transform: translateY(-20px) translateX(0) rotate(0deg); opacity: 0; }
          5%   { opacity: 1; }
          90%  { opacity: 0.6; }
          100% { transform: translateY(110vh) translateX(var(--sway, 40px)) rotate(720deg); opacity: 0; }
        }
        @keyframes petalFall1 {
          0%   { transform: translateY(-20px) translateX(0) rotate(0deg); opacity: 0; }
          5%   { opacity: 1; }
          90%  { opacity: 0.5; }
          100% { transform: translateY(110vh) translateX(calc(var(--sway, 40px) * -1)) rotate(-540deg); opacity: 0; }
        }
        @keyframes petalFall2 {
          0%   { transform: translateY(-20px) translateX(0) rotate(45deg); opacity: 0; }
          8%   { opacity: 1; }
          90%  { opacity: 0.4; }
          100% { transform: translateY(110vh) translateX(calc(var(--sway, 40px) * 0.6)) rotate(480deg); opacity: 0; }
        }
        @keyframes petalFall3 {
          0%   { transform: translateY(-20px) translateX(0) rotate(-20deg); opacity: 0; }
          6%   { opacity: 1; }
          88%  { opacity: 0.5; }
          100% { transform: translateY(110vh) translateX(calc(var(--sway, 40px) * -0.8)) rotate(-600deg); opacity: 0; }
        }
        @media (prefers-reduced-motion: reduce) {
          .floating-petals-container { display: none; }
        }
      `}</style>
    </div>
  );
}

export default FloatingPetals;
