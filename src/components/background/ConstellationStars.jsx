import React, { useMemo } from 'react';

function rand(min, max) { return min + Math.random() * (max - min); }

/**
 * Constellation star field for the Celestial Promise theme.
 * SVG-based, CSS animated, no canvas.
 */
export function ConstellationStars({ width = 800, height = 600, starCount = 120, lineCount = 18 }) {
  const { stars, lines } = useMemo(() => {
    const stars = Array.from({ length: starCount }, (_, i) => ({
      id: i,
      cx: rand(2, 98),
      cy: rand(2, 98),
      r: rand(0.4, 2.2),
      delay: rand(0, 5),
      dur: rand(2, 5),
      bright: Math.random() > 0.7,
    }));

    // Connect nearby stars
    const lines = [];
    for (let i = 0; i < stars.length && lines.length < lineCount; i++) {
      for (let j = i + 1; j < stars.length && lines.length < lineCount; j++) {
        const dx = stars[i].cx - stars[j].cx;
        const dy = stars[i].cy - stars[j].cy;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist > 4 && dist < 16) {
          lines.push({ id: `${i}-${j}`, x1: stars[i].cx, y1: stars[i].cy, x2: stars[j].cx, y2: stars[j].cy, delay: rand(0, 3) });
        }
      }
    }
    return { stars, lines };
  }, [starCount, lineCount]);

  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 100 100"
      preserveAspectRatio="xMidYMid slice"
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 0 }}
    >
      <defs>
        <radialGradient id="starGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fff" stopOpacity="1" />
          <stop offset="100%" stopColor="#9BA4E0" stopOpacity="0" />
        </radialGradient>
      </defs>
      {/* Constellation lines */}
      {lines.map(l => (
        <line
          key={l.id}
          x1={`${l.x1}%`} y1={`${l.y1}%`}
          x2={`${l.x2}%`} y2={`${l.y2}%`}
          stroke="#7B7EC8"
          strokeWidth="0.08"
          strokeOpacity="0"
          style={{ animation: `lineAppear 3s ${l.delay}s ease-out forwards` }}
        />
      ))}
      {/* Stars */}
      {stars.map(s => (
        <circle
          key={s.id}
          cx={`${s.cx}%`} cy={`${s.cy}%`}
          r={s.r * 0.4}
          fill={s.bright ? 'url(#starGlow)' : '#C8C0E8'}
          opacity="0"
          style={{
            animation: `starAppear ${s.dur}s ${s.delay}s ease-in-out infinite alternate`,
          }}
        />
      ))}
      <style>{`
        @keyframes starAppear {
          0%   { opacity: 0; }
          40%  { opacity: 0.9; }
          100% { opacity: 0.3; }
        }
        @keyframes lineAppear {
          0%   { stroke-opacity: 0; stroke-dashoffset: 100; stroke-dasharray: 100; }
          100% { stroke-opacity: 0.35; stroke-dashoffset: 0; stroke-dasharray: 100; }
        }
        @media (prefers-reduced-motion: reduce) {
          circle, line { animation: none !important; opacity: 0.5; }
        }
      `}</style>
    </svg>
  );
}

export default ConstellationStars;
