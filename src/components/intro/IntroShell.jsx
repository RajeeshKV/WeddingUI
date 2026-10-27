import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Shared shell for all intro experiences.
 * Handles the exit animation, skip button, and backdrop.
 */
export function IntroShell({ onOpen, children, exitVariants }) {
  const defaultExit = {
    initial: { opacity: 1 },
    exit: { opacity: 0, scale: 1.02, transition: { duration: 0.85, ease: [0.4, 0, 0.2, 1] } },
  };
  const variants = exitVariants || defaultExit;

  return (
    <motion.div
      className="intro-shell"
      initial={variants.initial}
      exit={variants.exit}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}
    >
      {children}
      {/* Skip button — always accessible */}
      <button
        className="intro-skip-btn"
        onClick={onOpen}
        aria-label="Skip intro and open invitation"
      >
        Skip intro
      </button>
    </motion.div>
  );
}

export default IntroShell;
