import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, Heart } from 'lucide-react';

/** The shared, theme-tinted envelope, seal, and invitation action. */
export function InvitationLetter({ opening, onOpen, monogram = 'A&S', entrance, entranceDelay = .82, entranceDuration = 1.12 }) {
  const reduceMotion = useReducedMotion();
  const [initialOne, initialTwo] = monogram.split('&');

  return (
    <>
      <motion.div
        className="invite-letter"
        initial={reduceMotion ? false : entrance || { opacity: 0, y: 38, rotateX: 9, scale: .96 }}
        animate={opening && !reduceMotion
          ? { opacity: .62, y: -18, rotateX: -5, rotateY: 0, rotateZ: 0, scale: 1.025, x: 0, filter:'blur(0px)' }
          : { opacity: 1, y: 0, x: 0, rotateX: 0, rotateY: 0, rotateZ: 0, scale: 1, filter:'blur(0px)' }}
        transition={opening
          ? { duration: reduceMotion ? 0 : .48, ease: [.2, .75, .2, 1] }
          : { delay: reduceMotion ? 0 : entranceDelay, duration: reduceMotion ? 0 : entranceDuration, type: 'spring', stiffness: 62, damping: 17 }}
        aria-hidden="true"
      >
        <img className="invite-letter-art" src="/assets/wedding-envelope-blank-seal.webp" alt="" />
        <span className="invite-seal-monogram" aria-label={`Wax seal for ${monogram}`}><span>{initialOne}<i className="couple-ampersand">&amp;</i>{initialTwo}</span></span>
      </motion.div>

      <motion.button
        className="invite-open"
        type="button"
        onClick={onOpen}
        disabled={opening}
        whileHover={reduceMotion ? undefined : { y: -3, scale: 1.015 }}
        whileTap={reduceMotion ? undefined : { scale: .985 }}
        initial={reduceMotion ? false : { opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: reduceMotion ? 0 : 1.3, duration: reduceMotion ? 0 : .72 }}
      >
        <span>OPEN INVITATION</span>
        <ArrowRight size={18} strokeWidth={1.5} aria-hidden="true" />
      </motion.button>

      <motion.div
        className="invite-date-note"
        initial={reduceMotion ? false : { opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: reduceMotion ? 0 : 1.52, duration: reduceMotion ? 0 : .72 }}
      >
        <span className="invite-date-rule" />
        <Heart size={16} fill="currentColor" strokeWidth={0} aria-hidden="true" />
        <span className="invite-date-rule" />
        <strong>17 · 02 · 2027</strong>
        <small>A LITTLE SOMETHING MADE WITH LOVE</small>
      </motion.div>
    </>
  );
}

export default InvitationLetter;
