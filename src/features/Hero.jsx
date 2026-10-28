import React from 'react';
import { motion } from 'framer-motion';
import { Heart, ArrowDown } from 'lucide-react';
import { AmbientCanvas } from '../components/background/AmbientCanvas.jsx';

// Inline skeleton block — fits inline in text nodes
function Skel({ w = 120, h = '1em', style = {} }) {
  return (
    <span style={{
      display: 'inline-block',
      width: w, height: h,
      background: 'linear-gradient(90deg, rgba(255,255,255,0.12) 25%, rgba(255,255,255,0.22) 50%, rgba(255,255,255,0.12) 75%)',
      backgroundSize: '200% 100%',
      animation: 'heroSkelShimmer 1.5s ease-in-out infinite',
      borderRadius: 4,
      verticalAlign: 'middle',
      ...style,
    }} aria-hidden="true" />
  );
}

const HERO_PHOTOS = {
  'eternal-bloom': 'photo-1519741497674-611481863552',
  'midnight-vows': 'photo-1511285560929-80b456fea0bc',
  'marigold-mandap': 'photo-1606800052052-a08af7148866',
  'tuscan-romance': 'photo-1519225421980-888cb7e6c7c2',
  'pearl-atelier': 'photo-1519741497674-611481863552',
  'sakura-reverie': 'photo-1537633552985-df8429e8048b',
  'secret-garden': 'photo-1522673607200-164d1b6ce486',
  'ocean-serenade': 'photo-1519225421980-888cb7e6c7c2',
  'cinema-paradiso': 'photo-1511285560929-80b456fea0bc',
  'celestial-promise': 'photo-1519741497674-611481863552',
  'floral-romance': 'photo-1537633552985-df8429e8048b',
  'modern-luxury': 'photo-1519741497674-611481863552',
  'royal-heritage': 'photo-1606800052052-a08af7148866',
  'minimal-editorial': 'photo-1519225421980-888cb7e6c7c2',
  'celestial-romance': 'photo-1511285560929-80b456fea0bc',
};
const heroPhoto = (themeId) => `https://images.unsplash.com/${HERO_PHOTOS[themeId] || HERO_PHOTOS['eternal-bloom']}?auto=format&fit=crop&w=2200&q=90`;

export function Hero({ timeLeft, onScrollTo, weddingConfig = null, loading = false, themeId = 'eternal-bloom' }) {
  const hasConfig = !loading && weddingConfig;

  // Parse names only when config is ready
  let name1 = 'Aarav', name2 = 'Siya';
  if (hasConfig?.name) {
    const parts = hasConfig.name.trim().replace(/\s+wedding\s*$/i, '').split(/\s*&\s*|\s+and\s+/i);
    if (parts.length > 1 && parts[0].trim() && parts.slice(1).join(' & ').trim()) {
      name1 = parts[0].trim();
      name2 = parts.slice(1).join(' & ').trim();
    } else if (hasConfig.name.trim()) {
      name1 = hasConfig.name.trim();
      name2 = null;
    }
  }

  const eventDate = hasConfig?.eventDateUtc
    ? new Date(hasConfig.eventDateUtc).toLocaleDateString('en-IN', {
        day: 'numeric', month: 'long', year: 'numeric',
      }).toUpperCase()
    : null;

  const venueLine = hasConfig?.venue
    ? hasConfig.venue.split(',').pop()?.trim().toUpperCase()
    : null;

  return (
    <section className="hero" id="home" aria-label="Wedding hero">
      <div
        className="hero-bg" role="img" aria-label="Wedding couple"
        style={{ backgroundImage: `url(${heroPhoto(themeId)})` }}
      />
      <div className="hero-shade" aria-hidden="true" />
      <AmbientCanvas mode="petals" opacity={0.55} />

      <motion.div
        className="hero-content"
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.1, delay: 0.15, ease: [0.2, 0.8, 0.2, 1] }}
        style={{ position: 'relative', zIndex: 2 }}
      >
        <motion.span
          className="eyebrow eyebrow--light"
          initial={{ opacity: 0, letterSpacing: '0.5em' }}
          animate={{ opacity: 1, letterSpacing: '0.22em' }}
          transition={{ delay: 0.4, duration: 1.1 }}
        >
          WITH FULL HEARTS AND HAPPY TEARS
        </motion.span>

        <motion.h1
          className="hero-title"
          initial={{ opacity: 0, y: 24, filter: 'blur(8px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ delay: 0.55, duration: 1.0, ease: [0.2, 0.8, 0.2, 1] }}
        >
          {loading
            ? <Skel w="60%" h="1em" />
            : <>{name1}{name2 && <> <em className="couple-ampersand">&amp;</em> {name2}</>}</>
          }
        </motion.h1>

        <motion.div
          className="hero-rule" aria-hidden="true"
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ delay: 0.85, duration: 0.8 }}
        >
          <span /><Heart size={13} fill="currentColor" /><span />
        </motion.div>

        <motion.p
          className="hero-subtitle"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.95, duration: 0.7 }}
        >
          FOREVER BEGINS HERE
        </motion.p>

        <motion.div
          className="countdown" aria-label="Countdown to wedding"
          initial="hidden" animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.08, delayChildren: 1.05 } } }}
        >
          {Object.entries(timeLeft).map(([unit, val]) => (
            <motion.div
              className="countdown-item" key={unit}
              variants={{ hidden: { opacity: 0, y: 16, scale: 0.9 }, visible: { opacity: 1, y: 0, scale: 1 } }}
              transition={{ type: 'spring', stiffness: 220, damping: 22 }}
            >
              <strong>{String(val).padStart(2, '0')}</strong>
              <span>{unit}</span>
            </motion.div>
          ))}
        </motion.div>

        <motion.p
          className="hero-date"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.35, duration: 0.8 }}
        >
          {loading
            ? <Skel w={200} h="0.9em" />
            : eventDate
              ? <>{eventDate}<span aria-hidden="true"> · </span>{venueLine || ''}</>
              : null
          }
        </motion.p>
      </motion.div>

      <button
        className="scroll-cue" onClick={() => onScrollTo('story')}
        aria-label="Scroll to our story"
        style={{ position: 'relative', zIndex: 2 }}
      >
        <span>SCROLL TO EXPLORE</span>
        <ArrowDown size={15} aria-hidden="true" />
      </button>

      <span className="hero-side-label" aria-hidden="true">A NEW CHAPTER</span>

      <style>{`
        @keyframes heroSkelShimmer {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </section>
  );
}

export default Hero;
