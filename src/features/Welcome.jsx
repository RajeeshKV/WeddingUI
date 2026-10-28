import React from 'react';
import { motion } from 'framer-motion';
import { AmbientCanvas } from '../components/background/AmbientCanvas.jsx';

export function Welcome() {
  return (
    <section
      className="welcome section-pad"
      aria-labelledby="welcome-heading"
      style={{ position: 'relative', overflow: 'hidden' }}
    >
      <AmbientCanvas mode="orbs" opacity={0.7} />

      <motion.div
        className="welcome-inner"
        style={{ position: 'relative', zIndex: 1 }}
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.9, ease: [0.2, 0.8, 0.2, 1] }}
      >
        <motion.span
          className="eyebrow"
          initial={{ opacity: 0, letterSpacing: '0.5em' }}
          whileInView={{ opacity: 1, letterSpacing: '0.22em' }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, delay: 0.1 }}
        >
          TO OUR FAVOURITE PEOPLE
        </motion.span>

        <motion.h2
          id="welcome-heading"
          initial={{ opacity: 0, y: 20, filter: 'blur(6px)' }}
          whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          viewport={{ once: true }}
          transition={{ duration: 0.85, delay: 0.2, ease: [0.2, 0.8, 0.2, 1] }}
        >
          Our favourite day<br />is better <em>with you.</em>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.35 }}
        >
          Two families, two stories, and one little forever. We would be
          honoured to have you with us as we begin this next chapter together.
        </motion.p>

        <motion.div
          className="signature"
          initial={{ opacity: 0, x: -16 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.5, type: 'spring', stiffness: 100 }}
          aria-label="Signed: With love, Aarav and Siya"
        >
          With love, Aarav <span className="couple-ampersand">&amp;</span> Siya
        </motion.div>

        <motion.div
          className="flourish"
          aria-hidden="true"
          initial={{ opacity: 0, rotate: 0, scale: 0.6 }}
          whileInView={{ opacity: 1, rotate: 14, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, delay: 0.6, type: 'spring', stiffness: 80 }}
        >
          ❧
        </motion.div>
      </motion.div>
    </section>
  );
}

export default Welcome;
