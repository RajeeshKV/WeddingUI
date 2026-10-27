import React from 'react';

/**
 * Thin concentric orbital rings for The Eternal Bloom theme intro.
 * Pure SVG + CSS animation. No DOM mutation.
 */
export function OrbitalRings({ rings = 3, color = 'rgba(180,140,165,0.35)', dotColor = '#C4A6B2' }) {
  const sizes = [85, 65, 48]; // % of container
  const speeds = [32, 20, 14]; // seconds
  const dots = [[0, 15], [60, 40], [180, 25]]; // [angle, offsetPercent] per ring

  return (
    <div
      aria-hidden="true"
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        pointerEvents: 'none',
        zIndex: 0,
        overflow: 'hidden',
      }}
    >
      {sizes.slice(0, rings).map((size, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            width: `min(${size}vw, ${size}vh)`,
            height: `min(${size}vw, ${size}vh)`,
            borderRadius: '50%',
            border: `1px solid ${color}`,
            animation: `orbitSpin ${speeds[i]}s linear infinite${i % 2 === 1 ? ' reverse' : ''}`,
            willChange: 'transform',
          }}
        >
          {/* Small dot orbiting each ring */}
          <span
            style={{
              position: 'absolute',
              top: '0%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              background: dotColor,
              opacity: 0.7,
              boxShadow: `0 0 6px ${dotColor}`,
            }}
          />
        </div>
      ))}
      <style>{`
        @keyframes orbitSpin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @media (prefers-reduced-motion: reduce) {
          [style*="orbitSpin"] { animation: none !important; }
        }
      `}</style>
    </div>
  );
}

export default OrbitalRings;
