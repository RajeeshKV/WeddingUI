import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { ArrowUpRight, Sparkles, Heart } from 'lucide-react';
import { THEMES } from '../theme/registry.js';

/* ── Tiny floating particle canvas (ambient bg) ───────────── */
function LauncherParticles() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let raf;
    let W = canvas.width  = window.innerWidth;
    let H = canvas.height = window.innerHeight;

    const particles = Array.from({ length: 80 }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      r: 1 + Math.random() * 2.5,
      vx: (Math.random() - 0.5) * 0.3,
      vy: -0.15 - Math.random() * 0.25,
      opacity: 0.2 + Math.random() * 0.5,
      hue: 270 + Math.random() * 80, // lavender → rose
    }));

    const resize = () => {
      W = canvas.width  = window.innerWidth;
      H = canvas.height = window.innerHeight;
    };
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
        ctx.fillStyle = `hsla(${p.hue}, 55%, 75%, ${p.opacity})`;
        ctx.fill();
      });
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0 }}
    />
  );
}

/* ── Palette swatch strip ─────────────────────────────────── */
function PaletteStrip({ colors }) {
  return (
    <div style={{ display: 'flex', height: 4, borderRadius: 2, overflow: 'hidden', marginTop: 8 }}>
      {colors.map((c, i) => (
        <div key={i} style={{ flex: 1, background: c }} />
      ))}
    </div>
  );
}

/* ── Single theme card ────────────────────────────────────── */
function ThemeCard({ theme, index, onSelect }) {
  const [hovered, setHovered] = useState(false);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useTransform(mouseY, [-60, 60], [4, -4]);
  const rotateY = useTransform(mouseX, [-80, 80], [-5, 5]);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left - rect.width / 2);
    mouseY.set(e.clientY - rect.top - rect.height / 2);
  };

  const handleMouseLeave = () => {
    setHovered(false);
    mouseX.set(0);
    mouseY.set(0);
  };

  // Background gradient from palette
  const [c1, c2, c3] = theme.palette.preview;
  const cardBg = `linear-gradient(135deg, ${c1} 0%, ${c2} 55%, ${c3} 100%)`;

  // Determine if dark theme for text color
  const isDark = ['midnight-vows', 'celestial-promise'].includes(theme.id);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.65, ease: [0.2, 0.8, 0.2, 1] }}
      style={{ perspective: 900 }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={handleMouseLeave}
    >
      <motion.button
        onClick={() => onSelect(theme.id)}
        aria-label={`Open ${theme.name} theme`}
        style={{
          rotateX, rotateY,
          width: '100%',
          background: 'none',
          border: 'none',
          padding: 0,
          cursor: 'pointer',
          transformStyle: 'preserve-3d',
          textAlign: 'left',
        }}
        whileTap={{ scale: 0.96 }}
      >
        {/* Card face */}
        <div style={{
          position: 'relative',
          borderRadius: 6,
          overflow: 'hidden',
          boxShadow: hovered
            ? '0 28px 70px rgba(0,0,0,0.22), 0 4px 16px rgba(0,0,0,0.12)'
            : '0 6px 24px rgba(0,0,0,0.1)',
          transition: 'box-shadow 0.4s ease',
        }}>
          {/* Gradient preview area */}
          <div style={{
            height: 160,
            background: cardBg,
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
          }}>
            {/* Animated orb / ambient inside card */}
            <motion.div
              aria-hidden="true"
              animate={hovered
                ? { scale: 1.3, opacity: 0.35 }
                : { scale: 1, opacity: 0.18 }
              }
              transition={{ duration: 0.8, ease: 'easeOut' }}
              style={{
                position: 'absolute',
                width: 120, height: 120,
                borderRadius: '50%',
                background: `radial-gradient(circle, ${theme.palette.preview[3]} 0%, transparent 70%)`,
                filter: 'blur(24px)',
              }}
            />

            {/* Orbital ring */}
            <motion.div
              aria-hidden="true"
              animate={{ rotate: 360 }}
              transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
              style={{
                position: 'absolute',
                width: 100, height: 100,
                borderRadius: '50%',
                border: `1px solid ${isDark ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.45)'}`,
              }}
            />
            <motion.div
              aria-hidden="true"
              animate={{ rotate: -360 }}
              transition={{ duration: 28, repeat: Infinity, ease: 'linear' }}
              style={{
                position: 'absolute',
                width: 140, height: 140,
                borderRadius: '50%',
                border: `1px solid ${isDark ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.25)'}`,
                borderStyle: 'dashed',
              }}
            />

            {/* Theme number + monogram */}
            <div style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
              <div style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontSize: 32,
                fontWeight: 600,
                color: isDark ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.95)',
                lineHeight: 1,
                textShadow: '0 2px 12px rgba(0,0,0,0.2)',
                letterSpacing: '-0.02em',
              }}>
                A&amp;S
              </div>
              <div style={{
                fontFamily: "'Jost', sans-serif",
                fontSize: 9,
                fontWeight: 500,
                letterSpacing: '0.22em',
                color: isDark ? 'rgba(255,255,255,0.6)' : 'rgba(255,255,255,0.75)',
                marginTop: 6,
                textTransform: 'uppercase',
              }}>
                {theme.note.split(',')[0]}
              </div>
            </div>

            {/* Hover overlay */}
            <AnimatePresence>
              {hovered && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  style={{
                    position: 'absolute', inset: 0,
                    background: 'rgba(0,0,0,0.12)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}
                >
                  <div style={{
                    background: 'rgba(255,255,255,0.92)',
                    borderRadius: 999,
                    padding: '8px 18px',
                    display: 'flex', alignItems: 'center', gap: 6,
                    fontFamily: "'Jost', sans-serif",
                    fontSize: 11, fontWeight: 600,
                    color: '#1A1A1A',
                    letterSpacing: '0.05em',
                  }}>
                    Open theme <ArrowUpRight size={13} />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Card info */}
          <div style={{
            padding: '14px 16px 16px',
            background: '#FFFFFF',
          }}>
            <div style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontSize: 17,
              fontWeight: 600,
              color: '#1A1A1A',
              lineHeight: 1.2,
              marginBottom: 4,
            }}>
              {theme.name}
            </div>
            <div style={{
              fontFamily: "'Jost', sans-serif",
              fontSize: 10,
              fontWeight: 400,
              color: '#707070',
              letterSpacing: '0.04em',
              lineHeight: 1.5,
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

/* ── Main launcher page ───────────────────────────────────── */
export function ThemeLauncher({ onSelectTheme }) {
  const [entered, setEntered] = useState(false);

  // Entrance animation sequence
  useEffect(() => {
    const t = setTimeout(() => setEntered(true), 100);
    return () => clearTimeout(t);
  }, []);

  const handleSelect = (themeId) => {
    // Navigate to the main site with the chosen theme
    window.location.href = `/?theme=${themeId}`;
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(160deg, #FDF8FF 0%, #F0E8F5 30%, #E8F0FF 70%, #FFF5F8 100%)',
      position: 'relative',
      overflowX: 'hidden',
    }}>
      <LauncherParticles />

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 1, padding: '0 0 80px' }}>
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.2, 0.8, 0.2, 1] }}
          style={{
            textAlign: 'center',
            padding: 'clamp(48px, 8vh, 96px) 24px clamp(32px, 5vh, 60px)',
          }}
        >
          {/* Animated logo */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.15, duration: 0.9, type: 'spring', stiffness: 80 }}
            style={{ marginBottom: 24 }}
          >
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 72,
              height: 72,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #EDD5E5, #C4A6B2)',
              boxShadow: '0 8px 32px rgba(140,100,130,0.25)',
              marginBottom: 16,
            }}>
              <Heart size={28} fill="rgba(255,255,255,0.9)" color="rgba(255,255,255,0.9)" />
            </div>
            <div style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontSize: 'clamp(48px, 7vw, 80px)',
              fontWeight: 600,
              letterSpacing: '-0.04em',
              color: '#2A1A2E',
              lineHeight: 1,
            }}>
              Aarav <em style={{ fontStyle: 'italic', color: '#8B6E7F' }}>&amp;</em> Siya
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.7 }}
          >
            <div style={{
              fontFamily: "'Jost', sans-serif",
              fontSize: 11,
              fontWeight: 500,
              letterSpacing: '0.28em',
              color: '#8B6E7F',
              textTransform: 'uppercase',
              marginBottom: 14,
            }}>
              17 · February · 2027 · Bangalore
            </div>
            <h1 style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontSize: 'clamp(22px, 3.5vw, 34px)',
              fontWeight: 500,
              color: '#4A2D3E',
              letterSpacing: '-0.01em',
              lineHeight: 1.4,
              maxWidth: 560,
              margin: '0 auto',
              fontStyle: 'italic',
            }}>
              Choose your wedding world
            </h1>
            <p style={{
              fontFamily: "'Jost', sans-serif",
              fontSize: 13,
              fontWeight: 400,
              color: '#7A6070',
              marginTop: 10,
              maxWidth: 440,
              margin: '10px auto 0',
              lineHeight: 1.8,
            }}>
              Ten distinct experiences. Select the one that feels like you.
            </p>
          </motion.div>

          {/* Animated divider */}
          <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.9, ease: [0.4, 0, 0.2, 1] }}
            style={{
              width: 'min(340px, 60vw)',
              height: 1,
              background: 'linear-gradient(to right, transparent, rgba(140,100,130,0.4), transparent)',
              margin: '28px auto 0',
            }}
          />
        </motion.header>

        {/* Theme grid */}
        <div style={{
          maxWidth: 1280,
          margin: '0 auto',
          padding: '0 clamp(12px, 3vw, 48px)',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(min(200px, 100%), 1fr))',
          gap: 'clamp(12px, 2vw, 24px)',
        }}>
          {THEMES.map((theme, i) => (
            <ThemeCard
              key={theme.id}
              theme={theme}
              index={i}
              onSelect={handleSelect}
            />
          ))}
        </div>

        {/* Footer note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          style={{
            textAlign: 'center',
            marginTop: 56,
            fontFamily: "'Jost', sans-serif",
            fontSize: 10,
            fontWeight: 500,
            letterSpacing: '0.22em',
            color: '#B0A0B8',
            textTransform: 'uppercase',
          }}
        >
          <Sparkles size={12} style={{ display: 'inline', marginRight: 6, verticalAlign: 'middle' }} />
          Each theme includes its own intro animation · Tap any card to experience it
        </motion.div>
      </div>
    </div>
  );
}

export default ThemeLauncher;
