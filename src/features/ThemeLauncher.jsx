import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { THEMES } from '../theme/registry.js';

/* ── Canvas particle ambient bg ──────────────────────────── */
function LauncherParticles() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let raf;
    let W = canvas.width  = window.innerWidth;
    let H = canvas.height = window.innerHeight;
    const particles = Array.from({ length: 70 }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      r: 1 + Math.random() * 2,
      vx: (Math.random() - 0.5) * 0.25,
      vy: -0.12 - Math.random() * 0.2,
      opacity: 0.15 + Math.random() * 0.4,
      hue: 270 + Math.random() * 80,
    }));
    const resize = () => { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; };
    window.addEventListener('resize', resize);
    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.y < -10) { p.y = H + 10; p.x = Math.random() * W; }
        if (p.x < -10) p.x = W + 10;
        if (p.x > W + 10) p.x = -10;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue},55%,75%,${p.opacity})`;
        ctx.fill();
      });
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); };
  }, []);
  return <canvas ref={canvasRef} aria-hidden="true" style={{ position:'fixed',inset:0,pointerEvents:'none',zIndex:0 }} />;
}

/* ── Palette swatch ───────────────────────────────────────── */
function PaletteStrip({ colors }) {
  return (
    <div style={{ display:'flex', height:3, borderRadius:2, overflow:'hidden', marginTop:10 }}>
      {colors.map((c, i) => <div key={i} style={{ flex:1, background:c }} />)}
    </div>
  );
}

/* ── Single theme card ────────────────────────────────────── */
function ThemeCard({ theme, index, onSelect }) {
  const [hovered, setHovered] = useState(false);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useTransform(mouseY, [-60, 60], [3, -3]);
  const rotateY = useTransform(mouseX, [-80, 80], [-4, 4]);

  const handleMouseMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - r.left - r.width / 2);
    mouseY.set(e.clientY - r.top - r.height / 2);
  };

  const handleMouseLeave = () => {
    setHovered(false);
    mouseX.set(0); mouseY.set(0);
  };

  const [c1, c2, c3] = theme.palette.preview;
  const cardBg = `linear-gradient(135deg, ${c1} 0%, ${c2} 55%, ${c3} 100%)`;
  const isDark = ['midnight-vows','celestial-promise'].includes(theme.id);
  const textColor = isDark ? 'rgba(255,255,255,0.88)' : 'rgba(255,255,255,0.92)';

  return (
    <motion.div
      initial={{ opacity:0, y:30 }}
      animate={{ opacity:1, y:0 }}
      transition={{ delay: index * 0.05, duration:0.55, ease:[0.2,0.8,0.2,1] }}
      style={{ perspective:900 }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={handleMouseLeave}
    >
      <motion.button
        onClick={() => onSelect(theme.id)}
        aria-label={`Open ${theme.name} theme`}
        style={{
          rotateX, rotateY,
          width:'100%', background:'none', border:'none',
          padding:0, cursor:'pointer',
          transformStyle:'preserve-3d', textAlign:'left',
        }}
        whileTap={{ scale:0.97 }}
      >
        <div style={{
          borderRadius:8, overflow:'hidden',
          boxShadow: hovered
            ? '0 24px 60px rgba(0,0,0,0.2),0 4px 14px rgba(0,0,0,0.1)'
            : '0 4px 18px rgba(0,0,0,0.09)',
          transition:'box-shadow 0.35s ease',
        }}>
          {/* Gradient preview */}
          <div style={{
            height:'clamp(120px,14vw,160px)',
            background: cardBg,
            position:'relative', display:'flex',
            alignItems:'center', justifyContent:'center', overflow:'hidden',
          }}>
            {/* Ambient orb */}
            <motion.div aria-hidden="true"
              animate={ hovered ? { scale:1.4, opacity:0.4 } : { scale:1, opacity:0.18 } }
              transition={{ duration:0.7, ease:'easeOut' }}
              style={{
                position:'absolute',
                width:100, height:100, borderRadius:'50%',
                background:`radial-gradient(circle, ${theme.palette.preview[3]} 0%, transparent 70%)`,
                filter:'blur(20px)',
              }} />

            {/* Spinning ring */}
            <motion.div aria-hidden="true"
              animate={{ rotate:360 }}
              transition={{ duration:20, repeat:Infinity, ease:'linear' }}
              style={{
                position:'absolute', width:90, height:90, borderRadius:'50%',
                border:`1px solid ${isDark ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.38)'}`,
              }} />

            {/* Theme label only — no couple names */}
            <div style={{ position:'relative', zIndex:1, textAlign:'center', padding:'0 12px' }}>
              <div style={{
                fontSize:9, fontWeight:600, letterSpacing:'0.2em',
                color: isDark ? 'rgba(255,255,255,0.55)' : 'rgba(255,255,255,0.65)',
                textTransform:'uppercase', marginBottom:6,
                fontFamily:"'Jost',sans-serif",
              }}>
                {theme.label.split('·')[0].trim()}
              </div>
              <div style={{
                fontFamily:"'Cormorant Garamond',Georgia,serif",
                fontSize:'clamp(15px,2.2vw,20px)', fontWeight:600,
                color: textColor, lineHeight:1.1,
                letterSpacing:'-0.01em',
              }}>
                {theme.name}
              </div>
            </div>

            {/* Hover CTA */}
            <AnimatePresence>
              {hovered && (
                <motion.div
                  initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
                  transition={{ duration:0.18 }}
                  style={{
                    position:'absolute', inset:0,
                    background:'rgba(0,0,0,0.1)',
                    display:'flex', alignItems:'center', justifyContent:'center',
                  }}>
                  <div style={{
                    background:'rgba(255,255,255,0.9)', borderRadius:999,
                    padding:'7px 16px',
                    display:'flex', alignItems:'center', gap:5,
                    fontFamily:"'Jost',sans-serif",
                    fontSize:11, fontWeight:600, color:'#1A1A1A', letterSpacing:'0.04em',
                  }}>
                    Select <ArrowUpRight size={12} />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Card footer */}
          <div style={{ padding:'12px 14px 14px', background:'#FFFFFF' }}>
            <div style={{
              fontFamily:"'Cormorant Garamond',Georgia,serif",
              fontSize:15, fontWeight:600, color:'#1A1A1A', lineHeight:1.25, marginBottom:3,
            }}>
              {theme.name}
            </div>
            <div style={{
              fontFamily:"'Jost',sans-serif",
              fontSize:10, color:'#888', letterSpacing:'0.03em', lineHeight:1.5,
            }}>
              {theme.note}
            </div>
            <PaletteStrip colors={theme.palette.preview} />
          </div>
        </div>
      </motion.button>
    </motion.div>
  );
}

/* ── Main launcher ────────────────────────────────────────── */
export function ThemeLauncher() {
  const handleSelect = (themeId) => {
    window.location.href = `/?theme=${themeId}`;
  };

  return (
    <div style={{
      minHeight:'100vh',
      background:'linear-gradient(160deg,#FDF8FF 0%,#F0E8F5 30%,#E8F0FF 70%,#FFF5F8 100%)',
      position:'relative', overflowX:'hidden',
    }}>
      <LauncherParticles />

      <div style={{ position:'relative', zIndex:1, padding:'0 0 72px' }}>

        {/* Minimal page heading — no couple name, no date */}
        <motion.div
          initial={{ opacity:0, y:-14 }}
          animate={{ opacity:1, y:0 }}
          transition={{ duration:0.75, ease:[0.2,0.8,0.2,1] }}
          style={{
            textAlign:'center',
            padding:'clamp(40px,7vh,72px) 24px clamp(24px,4vh,48px)',
          }}
        >
          <p style={{
            fontFamily:"'Jost',sans-serif",
            fontSize:10, fontWeight:600, letterSpacing:'0.28em',
            color:'#9A7AAA', textTransform:'uppercase', margin:'0 0 14px',
          }}>
            WEDDING INVITATION
          </p>
          <h1 style={{
            fontFamily:"'Cormorant Garamond',Georgia,serif",
            fontSize:'clamp(22px,3.5vw,36px)', fontWeight:500,
            color:'#3A2040', letterSpacing:'-0.01em',
            lineHeight:1.35, margin:'0 auto 10px', maxWidth:500,
            fontStyle:'italic',
          }}>
            Choose your wedding world
          </h1>
          <p style={{
            fontFamily:"'Jost',sans-serif",
            fontSize:12, color:'#8A7090', margin:'0 auto',
            maxWidth:380, lineHeight:1.8,
          }}>
            Ten distinct experiences. Select the one that feels like you.
          </p>

          <motion.div
            initial={{ scaleX:0, opacity:0 }}
            animate={{ scaleX:1, opacity:1 }}
            transition={{ delay:0.4, duration:0.9 }}
            style={{
              width:'min(280px,50vw)', height:1, margin:'24px auto 0',
              background:'linear-gradient(to right,transparent,rgba(140,100,130,0.4),transparent)',
            }} />
        </motion.div>

        {/* Theme grid — 2 cols mobile, auto-fill desktop */}
        <div style={{
          maxWidth:1280, margin:'0 auto',
          padding:'0 clamp(10px,2.5vw,40px)',
          display:'grid',
          gridTemplateColumns:'repeat(auto-fill, minmax(clamp(160px, 44vw, 220px), 1fr))',
          gap:'clamp(10px,1.5vw,20px)',
        }}>
          {THEMES.map((theme, i) => (
            <ThemeCard key={theme.id} theme={theme} index={i} onSelect={handleSelect} />
          ))}
        </div>

        {/* Footer note */}
        <motion.p
          initial={{ opacity:0 }}
          animate={{ opacity:1 }}
          transition={{ delay:1, duration:0.8 }}
          style={{
            textAlign:'center', marginTop:48,
            fontFamily:"'Jost',sans-serif",
            fontSize:10, fontWeight:500, letterSpacing:'0.2em',
            color:'#B0A0B8', textTransform:'uppercase',
          }}
        >
          Each theme has its own intro animation
        </motion.p>
      </div>

      <style>{`
        @media (min-width: 640px) {
          .launcher-grid { grid-template-columns: repeat(auto-fill, minmax(min(200px,100%),1fr)) !important; }
        }
      `}</style>
    </div>
  );
}

export default ThemeLauncher;
