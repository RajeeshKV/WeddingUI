import React from 'react';
import { motion } from 'framer-motion';
import { AmbientCanvas } from '../components/background/AmbientCanvas.jsx';

function InlineSkel({ w = 100 }) {
  return (
    <span style={{
      display: 'inline-block', width: w, height: '0.9em',
      background: 'linear-gradient(90deg,#E8E0EC 25%,#D4C8DC 50%,#E8E0EC 75%)',
      backgroundSize: '200% 100%',
      animation: 'welcomeSkel 1.5s ease-in-out infinite',
      borderRadius: 4, verticalAlign: 'middle',
    }} aria-hidden="true" />
  );
}

export function Welcome({ weddingConfig = null, loading = false }) {
  // Parse names from config
  let names = null;
  let nameParts = null;
  if (!loading && weddingConfig?.name) {
    const m = weddingConfig.name.match(/^(.+?)\s*&\s*(.+?)(?:\s+Wedding)?$/i);
    nameParts = m ? [m[1].trim(), m[2].trim()] : [weddingConfig.name.replace(/\s*Wedding\s*$/i, '').trim()];
    names = nameParts.join(' & ');
  }

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
          aria-label={names ? `With love, ${names}` : undefined}
        >
          {loading
            ? <><span className="signature-lead">With love,</span><InlineSkel w={160} /></>
            : nameParts
              ? <>
                  <span className="signature-lead">With love,</span>
                  <span className="signature-couple">
                    {nameParts[0]}
                    {nameParts.length === 2 && <><span className="couple-ampersand">&amp;</span>{nameParts[1]}</>}
                  </span>
                </>
              : null
          }
        </motion.div>

        <motion.div
          className="flourish" aria-hidden="true"
          initial={{ opacity: 0, rotate: 0, scale: 0.6 }}
          whileInView={{ opacity: 1, rotate: 14, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, delay: 0.6, type: 'spring', stiffness: 80 }}
        >
          *
        </motion.div>
      </motion.div>

      <style>{`
        @keyframes welcomeSkel {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </section>
  );
}

export default Welcome;
