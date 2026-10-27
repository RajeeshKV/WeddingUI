import React from 'react';
import { motion } from 'framer-motion';
import { AmbientCanvas } from '../components/background/AmbientCanvas.jsx';

export function SiteFooter() {
  return (
    <footer
      className="site-footer"
      role="contentinfo"
      style={{ position: 'relative', overflow: 'hidden' }}
    >
      <AmbientCanvas mode="sparkles" opacity={0.6} />

      <div style={{ position: 'relative', zIndex: 1 }}>
        <motion.div
          className="footer-flower"
          aria-hidden="true"
          initial={{ opacity: 0, scale: 0.6, rotate: -30 }}
          whileInView={{ opacity: 0.7, scale: 1, rotate: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, type: 'spring', stiffness: 80 }}
        >
          ✳
        </motion.div>

        <motion.span
          className="eyebrow"
          initial={{ opacity: 0, letterSpacing: '0.5em' }}
          whileInView={{ opacity: 1, letterSpacing: '0.22em' }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, delay: 0.1 }}
        >
          WITH LOVE, ALWAYS
        </motion.span>

        <motion.h2
          initial={{ opacity: 0, y: 20, filter: 'blur(8px)' }}
          whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.9, ease: [0.2, 0.8, 0.2, 1] }}
        >
          Aarav <em>&amp;</em> Siya
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.35, duration: 0.7 }}
        >
          17 · 02 · 2027 &nbsp;·&nbsp; Bangalore, India
        </motion.p>

        <div className="footer-rule" aria-hidden="true" />

        <motion.span
          className="footer-small"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.7 }}
        >
          MADE WITH LOVE, FOR OUR FAVOURITE PEOPLE
        </motion.span>
      </div>
    </footer>
  );
}

export default SiteFooter;
