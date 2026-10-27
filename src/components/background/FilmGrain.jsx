import React from 'react';

/**
 * Subtle film grain overlay for Cinema Paradiso theme.
 * SVG feTurbulence — lightweight, no canvas.
 */
export function FilmGrain({ opacity = 0.18, animate = true }) {
  return (
    <div
      aria-hidden="true"
      style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 2, overflow: 'hidden' }}
    >
      <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity }}>
        <filter id="filmGrainFilter" x="0%" y="0%" width="100%" height="100%" colorInterpolationFilters="linearRGB">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.65"
            numOctaves="3"
            stitchTiles="stitch"
            result="noise"
          >
            {animate && (
              <animate attributeName="seed" from="0" to="100" dur="0.15s" repeatCount="indefinite" />
            )}
          </feTurbulence>
          <feColorMatrix type="saturate" values="0" in="noise" result="grayNoise" />
          <feBlend in="SourceGraphic" in2="grayNoise" mode="overlay" result="blended" />
          <feComponentTransfer in="blended">
            <feFuncA type="linear" slope="1" />
          </feComponentTransfer>
        </filter>
        <rect width="100%" height="100%" filter="url(#filmGrainFilter)" />
      </svg>
      <style>{`
        @media (prefers-reduced-motion: reduce) {
          [id="filmGrainFilter"] animate { display: none; }
        }
      `}</style>
    </div>
  );
}

export default FilmGrain;
