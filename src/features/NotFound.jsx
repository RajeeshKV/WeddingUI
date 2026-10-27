import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, Home } from 'lucide-react';

export function NotFound() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '32px 24px',
      background: 'linear-gradient(160deg, #FDF8FF 0%, #F0E8F5 40%, #FFF5F8 100%)',
      textAlign: 'center',
      fontFamily: "'Jost', sans-serif",
    }}>
      {/* Animated number */}
      <motion.div
        initial={{ opacity: 0, scale: 0.7, filter: 'blur(12px)' }}
        animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
        transition={{ duration: 0.9, ease: [0.2, 0.8, 0.2, 1] }}
        style={{
          fontFamily: "'Cormorant Garamond', Georgia, serif",
          fontSize: 'clamp(100px, 22vw, 180px)',
          fontWeight: 600,
          color: '#C4A6B2',
          lineHeight: 1,
          letterSpacing: '-0.05em',
          marginBottom: 8,
          userSelect: 'none',
        }}
        aria-hidden="true"
      >
        404
      </motion.div>

      {/* Ornamental divider */}
      <motion.div
        initial={{ scaleX: 0, opacity: 0 }}
        animate={{ scaleX: 1, opacity: 1 }}
        transition={{ delay: 0.35, duration: 0.9, ease: [0.4, 0, 0.2, 1] }}
        style={{
          width: 'min(280px, 60vw)',
          height: 1,
          background: 'linear-gradient(to right, transparent, rgba(140,100,130,0.45), transparent)',
          margin: '0 auto 28px',
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45, duration: 0.75, ease: [0.2, 0.8, 0.2, 1] }}
      >
        <p style={{
          fontSize: 10,
          fontWeight: 600,
          letterSpacing: '0.28em',
          color: '#8B6E7F',
          textTransform: 'uppercase',
          marginBottom: 14,
        }}>
          Page not found
        </p>

        <h1 style={{
          fontFamily: "'Cormorant Garamond', Georgia, serif",
          fontSize: 'clamp(28px, 5vw, 42px)',
          fontWeight: 600,
          color: '#3A2535',
          letterSpacing: '-0.03em',
          margin: '0 0 12px',
          lineHeight: 1.2,
        }}>
          This page doesn't exist
        </h1>

        <p style={{
          fontSize: 14,
          color: '#7A6070',
          lineHeight: 1.8,
          maxWidth: 380,
          margin: '0 auto 32px',
        }}>
          The page you're looking for may have been moved, deleted, or never existed. Head back home to find what you need.
        </p>

        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <a
            href="/"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '12px 22px',
              borderRadius: 999,
              background: '#8B6E7F',
              color: '#FDF9FC',
              fontSize: 12,
              fontWeight: 600,
              textDecoration: 'none',
              letterSpacing: '0.02em',
              transition: 'transform 0.2s, box-shadow 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(139,110,127,0.3)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = ''; }}
          >
            <Home size={14} aria-hidden="true" />
            Back to home
          </a>
        </div>
      </motion.div>

      {/* Floating decorative petals */}
      {[
        { top: '12%', left: '8%',  size: 40, delay: 0.6, rotate: -25 },
        { top: '18%', right: '9%', size: 32, delay: 0.75, rotate: 40 },
        { bottom: '18%', left: '6%',  size: 36, delay: 0.9,  rotate: 120 },
        { bottom: '14%', right: '7%', size: 28, delay: 1.0,  rotate: 200 },
      ].map((pos, i) => (
        <motion.svg
          key={i}
          aria-hidden="true"
          viewBox="0 0 40 60"
          width={pos.size}
          height={pos.size * 1.5}
          style={{
            position: 'fixed',
            top: pos.top, bottom: pos.bottom,
            left: pos.left, right: pos.right,
            pointerEvents: 'none',
            opacity: 0,
          }}
          animate={{
            opacity: [0, 0.18, 0.18],
            y: [0, -8, 0],
          }}
          transition={{
            opacity: { delay: pos.delay, duration: 0.8 },
            y: { delay: pos.delay, duration: 5 + i * 0.6, repeat: Infinity, ease: 'easeInOut' },
          }}
        >
          <path
            d="M20,2 C20,2 36,18 36,34 C36,46 29,56 20,58 C11,56 4,46 4,34 C4,18 20,2 20,2 Z"
            fill="none"
            stroke="#8B6E7F"
            strokeWidth="1.5"
          />
          <line x1="20" y1="2" x2="20" y2="58" stroke="#8B6E7F" strokeWidth="0.7" />
        </motion.svg>
      ))}

      <style>{`
        @media (prefers-reduced-motion: reduce) {
          * { animation: none !important; transition: none !important; }
        }
      `}</style>
    </div>
  );
}

export default NotFound;
