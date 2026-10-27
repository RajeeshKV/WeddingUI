import React from 'react';

/**
 * SVG botanical frame with self-drawing vines and leaves.
 * Used by Secret Garden and Sakura Reverie themes.
 */
export function BotanicalFrame({ variant = 'garden', color = '#5C7A5C', accentColor = '#C4A85A' }) {
  const isSakura = variant === 'sakura';
  const strokeColor = isSakura ? '#D4889A' : color;
  const leafColor = isSakura ? '#F0C0CC' : color;

  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 800 600"
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 1,
        overflow: 'visible',
      }}
    >
      <defs>
        <style>{`
          .branch-draw {
            stroke-dasharray: 600;
            stroke-dashoffset: 600;
            animation: drawBranch 2.5s 0.3s ease-out forwards;
          }
          .leaf-appear { opacity: 0; animation: leafFade 0.8s ease-out forwards; }
          .leaf-sway   { animation: leafSway 4s ease-in-out infinite; transform-origin: center; }
          @keyframes drawBranch {
            to { stroke-dashoffset: 0; }
          }
          @keyframes leafFade {
            to { opacity: 1; }
          }
          @keyframes leafSway {
            0%, 100% { transform: rotate(-3deg) scale(1); }
            50%       { transform: rotate(3deg) scale(1.02); }
          }
          @media (prefers-reduced-motion: reduce) {
            .branch-draw  { animation: none; stroke-dashoffset: 0; }
            .leaf-appear  { animation: none; opacity: 1; }
            .leaf-sway    { animation: none; }
          }
        `}</style>
      </defs>

      {/* Top-left corner branch */}
      <g>
        <path
          className="branch-draw"
          d={isSakura
            ? "M -20,0 C 40,30 60,80 100,120 C 130,150 160,140 180,160 C 200,180 190,220 200,250"
            : "M -20,-20 C 40,40 80,100 120,130 C 150,155 160,190 150,230 C 140,260 110,280 100,310"
          }
          stroke={strokeColor}
          strokeWidth={isSakura ? "2.5" : "2"}
          fill="none"
          opacity="0.7"
        />
        {/* Leaves on top-left branch */}
        {(isSakura ? [
          { x: 85, y: 100, r: 8, delay: '0.8s', rot: -30 },
          { x: 110, y: 130, r: 10, delay: '1.1s', rot: 20 },
          { x: 150, y: 155, r: 9, delay: '1.4s', rot: -15 },
          { x: 175, y: 175, r: 7, delay: '1.6s', rot: 35 },
        ] : [
          { x: 95, y: 115, r: 14, delay: '0.8s', rot: -30 },
          { x: 130, y: 148, r: 12, delay: '1.0s', rot: 20 },
          { x: 148, y: 195, r: 16, delay: '1.3s', rot: -15 },
          { x: 98, y: 295, r: 13, delay: '1.6s', rot: 40 },
        ]).map((l, i) => (
          <ellipse
            key={i}
            className="leaf-appear leaf-sway"
            cx={l.x} cy={l.y}
            rx={l.r} ry={l.r * 0.6}
            fill={leafColor}
            opacity="0.65"
            transform={`rotate(${l.rot}, ${l.x}, ${l.y})`}
            style={{ animationDelay: l.delay, animationDuration: `${4 + i * 0.5}s` }}
          />
        ))}
      </g>

      {/* Top-right corner branch */}
      <g transform="scale(-1,1) translate(-800,0)">
        <path
          className="branch-draw"
          d={isSakura
            ? "M -20,0 C 40,30 60,80 100,120 C 130,150 160,140 180,160 C 200,180 190,220 200,250"
            : "M -20,-20 C 40,40 80,100 120,130 C 150,155 160,190 150,230 C 140,260 110,280 100,310"
          }
          stroke={strokeColor}
          strokeWidth={isSakura ? "2.5" : "2"}
          fill="none"
          opacity="0.7"
          style={{ animationDelay: '0.4s' }}
        />
        {(isSakura ? [
          { x: 85, y: 100, r: 8, delay: '1.2s', rot: 30 },
          { x: 110, y: 130, r: 10, delay: '1.5s', rot: -20 },
          { x: 155, y: 158, r: 9, delay: '1.7s', rot: 15 },
        ] : [
          { x: 95, y: 115, r: 14, delay: '1.0s', rot: 30 },
          { x: 132, y: 148, r: 12, delay: '1.2s', rot: -20 },
          { x: 150, y: 195, r: 16, delay: '1.5s', rot: 15 },
        ]).map((l, i) => (
          <ellipse
            key={i}
            className="leaf-appear leaf-sway"
            cx={l.x} cy={l.y}
            rx={l.r} ry={l.r * 0.6}
            fill={leafColor}
            opacity="0.65"
            transform={`rotate(${l.rot}, ${l.x}, ${l.y})`}
            style={{ animationDelay: l.delay, animationDuration: `${4.5 + i * 0.4}s` }}
          />
        ))}
      </g>

      {/* Bottom accent — small scattered leaves */}
      {!isSakura && [
        { x: 60, y: 580, r: 12, rot: -60 },
        { x: 120, y: 590, r: 9, rot: -30 },
        { x: 680, y: 585, r: 11, rot: 45 },
        { x: 740, y: 578, r: 8, rot: 70 },
      ].map((l, i) => (
        <ellipse
          key={`bot-${i}`}
          className="leaf-appear"
          cx={l.x} cy={l.y}
          rx={l.r} ry={l.r * 0.55}
          fill={accentColor}
          opacity="0.45"
          transform={`rotate(${l.rot}, ${l.x}, ${l.y})`}
          style={{ animationDelay: `${1.8 + i * 0.2}s` }}
        />
      ))}
    </svg>
  );
}

export default BotanicalFrame;
