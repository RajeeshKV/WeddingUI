import React, { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, Heart } from 'lucide-react';
import { IntroShell } from './IntroShell.jsx';

const PETALS = [
  [4,18,-1],[13,66,1],[23,32,-1],[34,82,1],[44,12,1],[57,89,-1],
  [67,19,1],[76,72,-1],[86,34,1],[95,58,-1],[8,88,1],[90,12,-1],
];

function FloatingPetals({ reduced }) {
  if (reduced) return null;
  return <div className="eb-petal-field" aria-hidden="true">
    {PETALS.map(([left, top, direction], index) => (
      <motion.svg
        key={index}
        className="eb-petal"
        style={{ left: `${left}%`, top: `${top}%` }}
        viewBox="0 0 40 58"
        initial={reduced ? false : { opacity: 0, y: 16, x: 0, rotate: direction * 20, scale: 0.72 }}
        animate={reduced ? undefined : {
          opacity: [0, 0.82, 0.5, 0],
          y: [24, -34, 34, 92],
          x: [0, direction * 24, direction * -17, direction * 12],
          rotate: [direction * 25, direction * 105, direction * 190, direction * 270],
          scale: [0.74, 1.05, 0.9, 0.64],
        }}
        transition={{ delay: index * 0.42, duration: 10 + (index % 4) * 1.3, repeat: Infinity, ease: 'easeInOut' }}
      >
        <defs>
          <linearGradient id={`eb-petal-${index}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#fff4eb" />
            <stop offset=".48" stopColor={index % 3 === 0 ? '#eab3b3' : '#d9959e'} />
            <stop offset="1" stopColor="#b9697c" />
          </linearGradient>
        </defs>
        <path d="M20 3C35 14 39 31 20 55 1 31 5 14 20 3Z" fill={`url(#eb-petal-${index})`} />
        <path d="M20 9C21 23 21 36 20 49" fill="none" stroke="rgba(255,246,237,.58)" strokeWidth=".8" />
      </motion.svg>
    ))}
  </div>;
}

export function EternalBloomIntro({ onOpen }) {
  const reduceMotion = useReducedMotion();
  const [opening, setOpening] = useState(false);

  const handleOpen = () => {
    if (opening) return;
    setOpening(true);
    window.setTimeout(onOpen, reduceMotion ? 0 : 900);
  };
  const handleSkip = () => {
    if (!opening) onOpen();
  };

  return (
    <IntroShell
      onOpen={handleSkip}
      exitVariants={{
        initial: { opacity: 1, scale: 1, filter: 'blur(0px)' },
        exit: { opacity: 0, scale: 1.035, filter: 'blur(7px)', transition: { duration: reduceMotion ? 0 : 0.82, ease: [0.4, 0, 0.2, 1] } },
      }}
    >
      <div className="eternal-intro" data-opening={opening ? 'true' : 'false'}>
        <motion.div
          className="eternal-intro__backdrop"
          initial={reduceMotion ? false : { opacity: 0, scale: 1.055 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: reduceMotion ? 0 : 1.7, ease: [0.2, 0.7, 0.2, 1] }}
        />
        <div className="eternal-intro__veil" aria-hidden="true" />
        <FloatingPetals reduced={reduceMotion} />

        <div className="eternal-intro__stage">
          <motion.p
            className="eternal-intro__eyebrow"
            initial={reduceMotion ? false : { opacity: 0, y: 12, letterSpacing: '.55em' }}
            animate={{ opacity: 1, y: 0, letterSpacing: '.34em' }}
            transition={{ delay: reduceMotion ? 0 : .28, duration: reduceMotion ? 0 : .95 }}
          >YOU’RE INVITED</motion.p>

          <motion.div
            className="eternal-intro__ornament"
            aria-hidden="true"
            initial={reduceMotion ? false : { opacity: 0, scaleX: .2 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ delay: reduceMotion ? 0 : .48, duration: reduceMotion ? 0 : .8 }}
          >
            <span />
            <Heart size={20} strokeWidth={1.25} />
            <Heart className="eternal-intro__ornament-heart" size={16} strokeWidth={1.1} />
            <span />
          </motion.div>

          <motion.h1
            className="eternal-intro__names"
            initial={reduceMotion ? false : { opacity: 0, y: 30, filter: 'blur(8px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ delay: reduceMotion ? 0 : .56, duration: reduceMotion ? 0 : 1.05, ease: [0.2, 0.8, 0.2, 1] }}
          >
            <span>Aarav</span><em className="couple-ampersand">&amp;</em><span>Siya</span>
          </motion.h1>

          <motion.p
            className="eternal-intro__tagline"
            initial={reduceMotion ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: reduceMotion ? 0 : .82, duration: reduceMotion ? 0 : .8 }}
          >TWO HEARTS <i>·</i> ONE BEAUTIFUL JOURNEY</motion.p>

          <motion.div
            className={`eternal-envelope${opening ? ' is-opening' : ''}`}
            initial={reduceMotion ? false : { opacity: 0, y: 42, rotateX: 10, scale: .95 }}
            animate={{ opacity: 1, y: 0, rotateX: 0, scale: 1 }}
            transition={{ delay: reduceMotion ? 0 : 1.02, duration: reduceMotion ? 0 : 1.25, type: 'spring', stiffness: 58, damping: 17 }}
          >
            <div className="eternal-envelope__paper" />
            <svg className="eternal-envelope__folds" viewBox="0 0 560 300" preserveAspectRatio="none" aria-hidden="true">
              <defs><linearGradient id="eb-fold" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#bb8f72" stopOpacity=".12"/><stop offset=".5" stopColor="#aa775e" stopOpacity=".42"/><stop offset="1" stopColor="#fff9ef" stopOpacity=".34"/></linearGradient></defs>
              <path d="M1 2 280 174 559 2M1 298 280 174 559 298M1 2v296M559 2v296" fill="none" stroke="url(#eb-fold)" strokeWidth="2" />
              <path d="M1 4 280 176 559 4" fill="none" stroke="rgba(255,255,255,.72)" strokeWidth="3" />
            </svg>
            <motion.div
              className="eternal-envelope__flap"
              initial={false}
              animate={opening && !reduceMotion ? { rotateX: -172, opacity: .14 } : { rotateX: 0, opacity: 1 }}
              transition={{ duration: reduceMotion ? 0 : .72, ease: [0.45, 0, 0.2, 1] }}
            />
            <motion.div
              className="eternal-wax"
              initial={reduceMotion ? false : { opacity: 0, scale: .72, y: 9 }}
              animate={opening && !reduceMotion ? { opacity: 0, scale: 1.2, y: -24, rotate: -18 } : { opacity: 1, scale: 1, y: 0, rotate: 0 }}
              transition={{ delay: opening ? .1 : 1.4, duration: opening ? .46 : .65, type: 'spring', stiffness: 160, damping: 16 }}
              aria-hidden="true"
            >
              <img src="/assets/red-waxed-seal.svg" alt="" />
              <span>A<span className="couple-ampersand">&amp;</span>S</span>
            </motion.div>
          </motion.div>

          <motion.button
            className="eternal-intro__open"
            type="button"
            onClick={handleOpen}
            disabled={opening}
            initial={reduceMotion ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: reduceMotion ? 0 : 1.48, duration: reduceMotion ? 0 : .72 }}
            whileHover={reduceMotion ? undefined : { y: -3, scale: 1.015 }}
            whileTap={reduceMotion ? undefined : { scale: .985 }}
          >
            <span>OPEN INVITATION</span><ArrowRight size={18} strokeWidth={1.5} aria-hidden="true" />
          </motion.button>

          <motion.div
            className="eternal-intro__date"
            initial={reduceMotion ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: reduceMotion ? 0 : 1.68, duration: reduceMotion ? 0 : .7 }}
          >
            <span className="eternal-intro__date-rule" />
            <Heart size={15} fill="currentColor" strokeWidth={0} aria-hidden="true" />
            <span className="eternal-intro__date-rule" />
            <strong>17 · 02 · 2027</strong>
            <small>A LITTLE SOMETHING MADE WITH LOVE</small>
          </motion.div>
        </div>
      </div>
    </IntroShell>
  );
}

export default EternalBloomIntro;
