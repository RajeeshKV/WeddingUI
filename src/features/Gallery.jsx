import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, Images } from 'lucide-react';
import { AmbientCanvas } from '../components/background/AmbientCanvas.jsx';
import { GuestPhotoUpload } from './GuestPhotoUpload.jsx';

export function Gallery({ weddingConfig = null }) {
  return (
    <section
      className="gallery section-pad"
      id="gallery"
      aria-labelledby="gallery-heading"
      style={{ position: 'relative', overflow: 'hidden' }}
    >
      <AmbientCanvas mode="orbs" opacity={0.5} />

      <div className="section-heading" style={{ position: 'relative', zIndex: 1 }}>
        <motion.span
          className="eyebrow"
          initial={{ opacity: 0, letterSpacing: '0.5em' }}
          whileInView={{ opacity: 1, letterSpacing: '0.22em' }}
          viewport={{ once: true }}
          transition={{ duration: 0.9 }}
        >
          LITTLE PIECES OF FOREVER
        </motion.span>
        <motion.h2
          id="gallery-heading"
          initial={{ opacity: 0, y: 20, filter: 'blur(6px)' }}
          whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          viewport={{ once: true }}
          transition={{ delay: 0.15, duration: 0.85, ease: [0.2, 0.8, 0.2, 1] }}
        >
          Our <em>memories.</em>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          Were you there? Share your favourite moments with us.
        </motion.p>
      </div>

      <motion.div
        style={{ position: 'relative', zIndex: 1, maxWidth: 680, margin: '0 auto' }}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ delay: 0.2, duration: 0.75, ease: [0.2, 0.8, 0.2, 1] }}
      >
        {/* Gallery link */}
        <a
          href="/gallery"
          aria-label="Open the full photo gallery"
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '18px 24px', marginBottom: 16,
            background: 'var(--t-surface-hi)', border: '1px solid var(--t-border)',
            borderRadius: 6, textDecoration: 'none',
            transition: 'box-shadow 0.2s, transform 0.2s',
          }}
          onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 28px rgba(0,0,0,0.08)'; }}
          onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = ''; }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{
              width: 40, height: 40, borderRadius: '50%',
              background: 'var(--t-accent-soft)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
              <Images size={18} color="var(--t-rose)" aria-hidden="true" />
            </div>
            <div>
              <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--t-fg)', margin: 0, lineHeight: 1.3 }}>
                View the full gallery
              </p>
              <p style={{ fontSize: 11, color: 'var(--t-muted)', margin: '3px 0 0' }}>
                Browse all approved photos from the celebration
              </p>
            </div>
          </div>
          <ArrowUpRight size={16} color="var(--t-rose)" aria-hidden="true" style={{ flexShrink: 0 }} />
        </a>

        <GuestPhotoUpload weddingConfig={weddingConfig} />
      </motion.div>

      <style>{`
      `}</style>
    </section>
  );
}

export default Gallery;
