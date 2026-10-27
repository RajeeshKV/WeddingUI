import React from 'react';

/**
 * Layered SVG wave background for Ocean Serenade theme.
 * Three wave layers at different speeds and opacities.
 */
export function WaveBackground({ colorA = '#2A7A8C', colorB = '#7ABCB8', colorC = '#EFF7F7' }) {
  return (
    <div
      aria-hidden="true"
      style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
        zIndex: 0,
      }}
    >
      {/* Background fill */}
      <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(180deg, #0D3040 0%, #1A5060 40%, ${colorA} 80%, ${colorB} 100%)` }} />

      {/* Wave layer 1 — deepest */}
      <svg
        style={{ position: 'absolute', bottom: '0', width: '200%', height: '35%', animation: 'waveSlide1 18s linear infinite', willChange: 'transform' }}
        viewBox="0 0 1440 200" preserveAspectRatio="none"
      >
        <path d="M0,80 C240,20 480,160 720,80 C960,20 1200,160 1440,80 L1440,200 L0,200 Z" fill={colorA} fillOpacity="0.6" />
      </svg>

      {/* Wave layer 2 — mid */}
      <svg
        style={{ position: 'absolute', bottom: '0', width: '200%', height: '25%', animation: 'waveSlide2 12s linear infinite', willChange: 'transform' }}
        viewBox="0 0 1440 160" preserveAspectRatio="none"
      >
        <path d="M0,60 C360,10 720,130 1080,60 C1260,25 1350,100 1440,60 L1440,160 L0,160 Z" fill={colorB} fillOpacity="0.7" />
      </svg>

      {/* Wave layer 3 — surface */}
      <svg
        style={{ position: 'absolute', bottom: '0', width: '200%', height: '15%', animation: 'waveSlide3 8s linear infinite reverse', willChange: 'transform' }}
        viewBox="0 0 1440 100" preserveAspectRatio="none"
      >
        <path d="M0,40 C180,15 360,65 540,40 C720,15 900,65 1080,40 C1260,15 1350,55 1440,40 L1440,100 L0,100 Z" fill={colorC} fillOpacity="0.5" />
      </svg>

      {/* Floating light particles on water */}
      {Array.from({ length: 8 }).map((_, i) => (
        <span
          key={i}
          style={{
            position: 'absolute',
            bottom: `${10 + i * 5}%`,
            left: `${10 + i * 11}%`,
            width: `${4 + i % 3 * 2}px`,
            height: `${4 + i % 3 * 2}px`,
            borderRadius: '50%',
            background: '#E0F4F8',
            opacity: 0,
            animation: `waterLight ${3 + i * 0.5}s ${i * 0.4}s ease-in-out infinite`,
          }}
        />
      ))}

      <style>{`
        @keyframes waveSlide1 {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes waveSlide2 {
          0%   { transform: translateX(-10%); }
          100% { transform: translateX(-60%); }
        }
        @keyframes waveSlide3 {
          0%   { transform: translateX(-5%); }
          100% { transform: translateX(-55%); }
        }
        @keyframes waterLight {
          0%, 100% { opacity: 0; transform: translateY(0) scale(0.8); }
          50%       { opacity: 0.6; transform: translateY(-8px) scale(1.2); }
        }
        @media (prefers-reduced-motion: reduce) {
          [style*="waveSlide"], [style*="waterLight"] { animation: none !important; }
        }
      `}</style>
    </div>
  );
}

export default WaveBackground;
