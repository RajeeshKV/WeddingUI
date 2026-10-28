import React from 'react';
import { motion } from 'framer-motion';
import { FloatingPetals } from '../background/FloatingPetals.jsx';
import { FilmGrain } from '../background/FilmGrain.jsx';

const GOLD = '#ead39c';

function FallingPetals({ color, count = 10, className = '' }) {
  return <FloatingPetals count={count} color={color} className={className} />;
}

function BloomReveal({ tone = '#d78391' }) {
  return <div className="motion-bloom-cluster">
    {[0, 1, 2, 3, 4].map((flower) => <motion.span key={flower} className={`motion-bloom motion-bloom--${flower + 1}`}
      style={{ '--bloom-tone': tone }} initial={{ opacity: 0, scale: 0.2, rotate: -40 }}
      animate={{ opacity: [0, 0.64, 0.4], scale: [0.2, 1.05, 1], rotate: [-40, 8, 0] }}
      transition={{ delay: 0.45 + flower * 0.24, duration: 1.9, ease: [0.2, 0.75, 0.2, 1] }} />)}
  </div>;
}

function MarigoldCanopy() {
  return <div className="motion-marigold-canopy">
    {[0, 1, 2, 3, 4, 5, 6].map((strand) => <motion.div key={strand} className="motion-marigold-strand"
      style={{ '--strand': strand }} initial={{ scaleY: 0, opacity: 0 }}
      animate={{ scaleY: 1, opacity: 1 }} transition={{ delay: 0.18 + strand * 0.1, duration: 1.25, ease: [0.18, 0.72, 0.18, 1] }}>
      <span /><span /><span /><span /><span />
    </motion.div>)}
  </div>;
}

function SakuraBranch() {
  return <svg className="motion-sakura-branch" viewBox="0 0 520 420" aria-hidden="true">
    <motion.path d="M-24 400C118 322 170 260 272 204S416 96 545 18M172 272c-7-76-50-114-119-136m189 74c44-67 46-121 15-175m27 151c83 7 143-17 188-75m-262 144c-51 10-91 43-117 99"
      pathLength="1" initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 0.76 }} transition={{ duration: 2.6, ease: 'easeInOut' }} />
    {[[104, 124], [236, 156], [363, 113], [274, 205], [112, 339], [442, 74], [183, 246]].map(([cx, cy], i) =>
      <motion.g key={i} className="motion-sakura-blossom" transform={`translate(${cx} ${cy})`} initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 0.88 }} transition={{ delay: 1.1 + i * 0.16, duration: 0.8, type: 'spring', stiffness: 95, damping: 14 }}>
        {Array.from({ length: 5 }, (_, petal) => <ellipse key={petal} cx="0" cy="-8" rx="4.5" ry="9" transform={`rotate(${petal * 72})`} />)}<circle r="2.6" />
      </motion.g>)}
  </svg>;
}

function OliveLeaves() {
  return <motion.svg className="motion-olive-branch" viewBox="0 0 320 600" initial={{ opacity: 0, x: -18 }} animate={{ opacity: 1, x: 0, rotate: [-1.8, 1.8, -1.8] }} transition={{ opacity: { delay: 0.25, duration: 1.6 }, x: { delay: 0.25, duration: 1.6 }, rotate: { delay: 1.8, duration: 8, repeat: Infinity, ease: 'easeInOut' } }}>
    <path className="motion-olive-stem" d="M20 590C104 469 55 352 147 251S218 113 296 18" />
    {[...Array(9)].map((_, i) => <ellipse key={i} className="motion-olive-leaf" cx={74 + (i % 2) * 58} cy={455 - i * 47} rx="14" ry="38" transform={`rotate(${i % 2 ? 48 : -42} ${74 + (i % 2) * 58} ${455 - i * 47})`} />)}
  </motion.svg>;
}

function Fireflies() {
  return <div className="motion-fireflies">{Array.from({ length: 7 }, (_, i) => <motion.i key={i}
    style={{ '--fly-x': `${9 + ((i * 19) % 81)}%`, '--fly-y': `${16 + ((i * 27) % 68)}%` }}
    animate={{ opacity: [0, 0.82, 0.18, 0.72, 0], scale: [0.5, 1.2, 0.8, 1, 0.5], x: [0, 10, -8, 4, 0], y: [0, -9, 6, -4, 0] }}
    transition={{ delay: 0.4 + i * 0.57, duration: 5.5 + (i % 3), repeat: Infinity, ease: 'easeInOut' }} />)}</div>;
}

function OceanTides() {
  return <div className="motion-ocean-tides">
    {[0, 1, 2].map((layer) => <motion.svg key={layer} viewBox="0 0 1440 260" preserveAspectRatio="none" style={{ '--tide': layer }}
      animate={{ x: layer % 2 ? ['-3%', '0%', '-3%'] : ['0%', '-3%', '0%'], y: [0, layer % 2 ? -8 : 7, 0] }} transition={{ duration: 8 + layer * 2, repeat: Infinity, ease: 'easeInOut' }}>
      <path d={`M0 ${96 + layer * 28} C180 ${30 + layer * 20} 330 ${175 + layer * 10} 520 ${95 + layer * 18} S860 ${35 + layer * 28} 1050 ${110 + layer * 18} S1280 ${155 - layer * 16} 1440 ${76 + layer * 18} V260 H0Z`} />
    </motion.svg>)}
    <motion.div className="motion-ocean-glint" animate={{ opacity: [0.08, 0.42, 0.12], scaleX: [0.8, 1.12, 0.8] }} transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }} />
  </div>;
}

function StarMap({ romantic = false }) {
  const stars = romantic
    ? [[12, 22], [25, 14], [39, 29], [54, 17], [70, 25], [84, 14], [91, 39], [75, 52], [57, 48], [39, 61], [20, 53]]
    : [[8, 18], [18, 31], [29, 15], [43, 23], [58, 13], [72, 27], [89, 17], [81, 46], [64, 42], [48, 55], [30, 48], [14, 68]];
  return <svg className={`motion-star-map${romantic ? ' motion-star-map--romantic' : ''}`} viewBox="0 0 100 100" preserveAspectRatio="none">
    <motion.path className="motion-star-route" d={romantic ? 'M12 22L25 14L39 29L54 17L70 25L84 14M70 25L75 52L57 48L39 61L20 53' : 'M8 18L18 31L29 15L43 23L58 13L72 27L89 17M72 27L81 46L64 42L48 55L30 48L14 68'} pathLength="1" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.45, duration: 2.6, ease: 'easeInOut' }} />
    {stars.map(([cx, cy], i) => <motion.circle key={i} cx={cx} cy={cy} r={i % 4 === 0 ? 0.35 : 0.22} initial={{ opacity: 0 }} animate={{ opacity: [0.12, 0.82, 0.26] }} transition={{ delay: 0.4 + i * 0.12, duration: 3.4 + (i % 3), repeat: Infinity, ease: 'easeInOut' }} />)}
    {!romantic && <motion.path className="motion-shooting-star" d="M0 0L-38 12" initial={{ opacity: 0, x: 0, y: 0 }} animate={{ opacity: [0, 1, 0], x: [0, -56, -82], y: [0, 18, 27] }} transition={{ delay: 3.6, duration: 1.2, repeat: Infinity, repeatDelay: 10, ease: 'easeOut' }} />}
    {romantic && <motion.circle className="motion-moonrise" cx="80" cy="77" r="8" initial={{ opacity: 0, y: 13 }} animate={{ opacity: [0, 0.65, 0.5], y: [13, -2, -5] }} transition={{ delay: 0.6, duration: 2.2, ease: 'easeOut' }} />}
  </svg>;
}

function CinemaBeam() {
  return <>
    <FilmGrain opacity={0.035} animate={false} />
    <motion.div className="motion-cinema-beam" initial={{ opacity: 0, scaleX: 0.78 }} animate={{ opacity: [0, 0.27, 0.16], scaleX: [0.78, 1, 1.04] }} transition={{ delay: 0.35, duration: 2.4, ease: 'easeOut' }} />
    <motion.div className="motion-cinema-flicker" animate={{ opacity: [0.05, 0.12, 0.04, 0.09, 0.05] }} transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }} />
    <div className="motion-film-gate"><span /><span /><span /><span /><span /><span /><span /><span /></div>
  </>;
}

function WindowLight() {
  return <>
    <motion.div className="motion-window-shadow" initial={{ opacity: 0, x: '-30%' }} animate={{ opacity: [0, 0.78, 0.58], x: ['-30%', '0%', '8%'] }} transition={{ delay: 0.3, duration: 3, ease: [0.18, 0.72, 0.2, 1] }} />
    <motion.div className="motion-brass-line" initial={{ scaleX: 0, opacity: 0 }} animate={{ scaleX: 1, opacity: [0, 0.74, 0.3] }} transition={{ delay: 1.25, duration: 1.7, ease: 'easeOut' }} />
  </>;
}

function RoyalCurtain() {
  return <>
    <motion.div className="motion-royal-curtain motion-royal-curtain--left" initial={{ scaleX: 1 }} animate={{ scaleX: 0 }} transition={{ delay: 0.22, duration: 2, ease: [0.76, 0, 0.24, 1] }} />
    <motion.div className="motion-royal-curtain motion-royal-curtain--right" initial={{ scaleX: 1 }} animate={{ scaleX: 0 }} transition={{ delay: 0.22, duration: 2, ease: [0.76, 0, 0.24, 1] }} />
    <svg className="motion-royal-arch" viewBox="0 0 600 800"><motion.path d="M55 760V310C55 151 163 44 300 44s245 107 245 266v450M82 760V312c0-141 89-240 218-240s218 99 218 240v448" pathLength="1" initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 0.72 }} transition={{ delay: 1.25, duration: 2.4, ease: 'easeInOut' }} /></svg>
  </>;
}

function EditorialFrame() {
  return <>
    <motion.div className="motion-editorial-rule motion-editorial-rule--top" initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 0.35, duration: 1.6, ease: 'easeInOut' }} />
    <motion.div className="motion-editorial-rule motion-editorial-rule--bottom" initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 0.72, duration: 1.6, ease: 'easeInOut' }} />
    <motion.div className="motion-editorial-corner motion-editorial-corner--left" initial={{ clipPath: 'inset(0 100% 100% 0)' }} animate={{ clipPath: 'inset(0 0 0 0)' }} transition={{ delay: 0.55, duration: 1.25 }} />
    <motion.div className="motion-editorial-corner motion-editorial-corner--right" initial={{ clipPath: 'inset(100% 0 0 100%)' }} animate={{ clipPath: 'inset(0 0 0 0)' }} transition={{ delay: 0.78, duration: 1.25 }} />
  </>;
}

function TuscanSunset() {
  return <>
    <motion.div className="motion-sunset-halo" initial={{ opacity: 0, scale: 0.72 }} animate={{ opacity: [0, 0.62, 0.36], scale: [0.72, 1.1, 1.2] }} transition={{ delay: 0.28, duration: 2.6, ease: 'easeOut' }} />
    <motion.div className="motion-sunset-disc" initial={{ y: '-3vh', opacity: 0 }} animate={{ y: ['-3vh', '7vh'], opacity: [0, 0.8, 0.56] }} transition={{ delay: 0.42, duration: 8, ease: 'easeInOut' }} />
    <motion.div className="motion-sunset-ray" initial={{ opacity: 0, rotate: -8 }} animate={{ opacity: [0, 0.22, 0.12], rotate: 0 }} transition={{ delay: 0.7, duration: 2.8 }} />
  </>;
}

function PearlSheen() {
  return <motion.div className="motion-pearl-sheen" initial={{ x: '-120%', opacity: 0 }} animate={{ x: ['-120%', '120%'], opacity: [0, 0.6, 0] }} transition={{ delay: 0.35, duration: 2.8, ease: 'easeInOut' }} />;
}

function PearlGlints() {
  return <div className="motion-pearl-glints">{[[42, 52], [48, 61], [54, 63], [60, 55], [66, 46]].map(([x, y], i) =>
    <motion.i key={i} style={{ left: `${x}%`, top: `${y}%` }} animate={{ opacity: [0, 0.8, 0.08], scale: [0.5, 1.35, 0.6] }} transition={{ delay: 0.9 + i * 0.26, duration: 2.2, repeat: Infinity, repeatDelay: 5 + i * 0.4, ease: 'easeInOut' }} />
  )}</div>;
}

function EternalVine() {
  return <svg className="motion-eternal-vine" viewBox="0 0 1440 900" preserveAspectRatio="none">
    <motion.path d="M-20 730C170 700 210 560 310 480S455 420 522 330M1460 250C1300 260 1285 405 1160 455S1040 550 950 660" pathLength="1" initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 0.7 }} transition={{ delay: 0.18, duration: 3.2, ease: 'easeInOut' }} />
    <motion.path d="M520 332c-72 4-102-34-106-82 60-4 98 26 106 82Zm-124 85c-56-26-66-69-47-111 55 19 73 56 47 111Zm764 40c66-1 98 33 103 80-60 8-98-20-103-80Zm-106 118c54 20 70 60 55 104-57-14-78-49-55-104Z" pathLength="1" initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 0.46 }} transition={{ delay: 1.3, duration: 2.1, ease: 'easeOut' }} />
  </svg>;
}

function MotionForTheme({ themeId }) {
  switch (themeId) {
    case 'eternal-bloom': return <><FallingPetals color="#e9a6b4" count={11} /><FallingPetals color="#fff0e7" count={6} className="invite-petals-back" /><EternalVine /></>;
    case 'midnight-vows': return <><motion.div className="motion-candle-glow" animate={{ opacity: [0.12, 0.5, 0.23, 0.42], scale: [0.96, 1.04, 1, 1.03] }} transition={{ duration: 4.8, repeat: Infinity, ease: 'easeInOut' }} /><motion.div className="motion-gold-glint" initial={{ opacity: 0, x: '-30%' }} animate={{ opacity: [0, 0.64, 0], x: ['-30%', '0%', '26%'] }} transition={{ delay: 1, duration: 4.2, repeat: Infinity, repeatDelay: 5, ease: 'easeInOut' }} /></>;
    case 'marigold-mandap': return <><MarigoldCanopy /><FallingPetals color="#e6a12d" count={8} /></>;
    case 'tuscan-romance': return <TuscanSunset />;
    case 'pearl-atelier': return <><PearlSheen /><PearlGlints /></>;
    case 'sakura-reverie': return <><SakuraBranch /><FallingPetals color="#f7dfe2" count={7} /></>;
    case 'secret-garden': return <><OliveLeaves /><Fireflies /><motion.div className="motion-garden-mist" animate={{ opacity: [0.04, 0.2, 0.08], x: ['-6%', '4%', '-6%'] }} transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }} /></>;
    case 'ocean-serenade': return <OceanTides />;
    case 'cinema-paradiso': return <CinemaBeam />;
    case 'celestial-promise': return <StarMap />;
    case 'floral-romance': return <BloomReveal tone="#db8c82" />;
    case 'modern-luxury': return <WindowLight />;
    case 'royal-heritage': return <RoyalCurtain />;
    case 'minimal-editorial': return <EditorialFrame />;
    case 'celestial-romance': return <StarMap romantic />;
    default: return <BloomReveal />;
  }
}

export function ThemeMotion({ themeId, reduced }) {
  if (reduced) return null;
  return <div className={`invite-theme-motion invite-theme-motion--${themeId}`} aria-hidden="true">
    <MotionForTheme themeId={themeId} />
  </div>;
}

export default ThemeMotion;
