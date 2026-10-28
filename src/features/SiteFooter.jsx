import React from 'react';
import { motion } from 'framer-motion';
import { AmbientCanvas } from '../components/background/AmbientCanvas.jsx';

function FooterSkel({ w = 160, style = {} }) {
  return (
    <span style={{
      display: 'inline-block', width: w, height: '1em',
      background: 'linear-gradient(90deg,rgba(255,255,255,0.08) 25%,rgba(255,255,255,0.18) 50%,rgba(255,255,255,0.08) 75%)',
      backgroundSize: '200% 100%',
      animation: 'footerSkel 1.5s ease-in-out infinite',
      borderRadius: 4, verticalAlign: 'middle', ...style,
    }} aria-hidden="true" />
  );
}

export function SiteFooter({ weddingConfig = null, loading = false }) {
  const hasConfig = !loading && weddingConfig;

  let nameParts = null;
  if (hasConfig?.name) {
    const m = hasConfig.name.match(/^(.+?)\s*&\s*(.+?)(?:\s+Wedding)?$/i);
    nameParts = m ? [m[1].trim(), m[2].trim()] : [hasConfig.name];
  }

  const dateStr = hasConfig?.eventDateUtc
    ? new Date(hasConfig.eventDateUtc).toLocaleDateString('en-IN', {
        day: 'numeric', month: '2-digit', year: 'numeric',
      }).replace(/\//g, ' · ')
    : null;

  const location = hasConfig?.venue?.split(',')[0] || null;

  return (
    <footer className="site-footer" role="contentinfo" style={{ position: 'relative', overflow: 'hidden' }}>
      <AmbientCanvas mode="sparkles" opacity={0.6} />

      <div style={{ position: 'relative', zIndex: 1 }}>
        <motion.div className="footer-flower" aria-hidden="true"
          initial={{ opacity: 0, scale: 0.6, rotate: -30 }}
          whileInView={{ opacity: 0.7, scale: 1, rotate: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, type: 'spring', stiffness: 80 }}>
          *
        </motion.div>

        <motion.span className="eyebrow"
          initial={{ opacity: 0, letterSpacing: '0.5em' }}
          whileInView={{ opacity: 1, letterSpacing: '0.22em' }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, delay: 0.1 }}>
          WITH LOVE, ALWAYS
        </motion.span>

        <motion.h2
          initial={{ opacity: 0, y: 20, filter: 'blur(8px)' }}
          whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.9, ease: [0.2, 0.8, 0.2, 1] }}>
          {loading
            ? <FooterSkel w={200} />
            : nameParts
              ? nameParts.length === 2
                ? <>{nameParts[0]} <em>&amp;</em> {nameParts[1]}</>
                : nameParts[0]
              : null
          }
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.35, duration: 0.7 }}>
          {loading
            ? <FooterSkel w={160} />
            : dateStr && location
              ? <>{dateStr} &nbsp;·&nbsp; {location}</>
              : dateStr || location || null
          }
        </motion.p>

        <div className="footer-rule" aria-hidden="true" />

        <motion.span className="footer-small"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.7 }}>
          MADE WITH LOVE, FOR OUR FAVOURITE PEOPLE
        </motion.span>
      </div>

      <style>{`
        @keyframes footerSkel {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </footer>
  );
}

export default SiteFooter;
