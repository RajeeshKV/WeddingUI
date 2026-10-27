import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, X, Camera, Upload } from 'lucide-react';
import { AmbientCanvas } from '../components/background/AmbientCanvas.jsx';

const GALLERY_IMGS = [
  { src: 'https://images.unsplash.com/photo-1532712938310-34cb3982ef74?auto=format&fit=crop&w=900&q=85', alt: 'Wedding memory 1' },
  { src: 'https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&w=900&q=85',  alt: 'Couple portrait' },
  { src: 'https://images.unsplash.com/photo-1523438885200-e635ba2c371e?auto=format&fit=crop&w=900&q=85',  alt: 'Wedding detail' },
  { src: 'https://images.unsplash.com/photo-1529636798458-92182e662485?auto=format&fit=crop&w=900&q=85',  alt: 'Wedding ceremony' },
  { src: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=900&q=85',  alt: 'Romantic moment' },
  { src: 'https://images.unsplash.com/photo-1465495976277-4387d4b0e4a6?auto=format&fit=crop&w=900&q=85',  alt: 'Wedding celebration' },
];

export function Gallery({ uploads = [], onUpload }) {
  const [lightbox, setLightbox] = useState(null);

  const mergedImgs = GALLERY_IMGS.map((img, i) =>
    uploads[i] ? { src: uploads[i].url, alt: `Your photo ${i + 1}` } : img
  );

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
          A few favourite frames from our story.
        </motion.p>
      </div>

      <motion.div
        className="gallery-grid"
        role="list"
        style={{ position: 'relative', zIndex: 1 }}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        variants={{ visible: { transition: { staggerChildren: 0.07 } } }}
      >
        {mergedImgs.map((img, i) => (
          <motion.button
            key={img.src + i}
            className={`gallery-item gi-${i + 1}`}
            role="listitem"
            onClick={() => setLightbox(img)}
            variants={{
              hidden:  { opacity: 0, scale: 0.93, y: 16 },
              visible: { opacity: 1, scale: 1,    y: 0  },
            }}
            transition={{ duration: 0.55, ease: [0.2, 0.8, 0.2, 1] }}
            whileHover={{ scale: 1.02 }}
            aria-label={`View ${img.alt}`}
          >
            <img src={img.src} alt={img.alt} loading="lazy" />
            <span aria-hidden="true"><ArrowUpRight size={17} /></span>
          </motion.button>
        ))}
      </motion.div>

      <div className="gallery-page-link" style={{ position: 'relative', zIndex: 1 }}>
        <a className="text-link" href="/gallery" aria-label="Explore the full photo gallery">
          Explore the full gallery <ArrowUpRight size={14} aria-hidden="true" />
        </a>
      </div>

      <div className="upload-box" style={{ position: 'relative', zIndex: 1 }}>
        <div className="upload-icon" aria-hidden="true"><Camera size={20} /></div>
        <div>
          <h3>Were you there?</h3>
          <p>Add your favourite photos to this little collection.</p>
        </div>
        <label className="btn btn-outline upload-btn">
          <Upload size={15} aria-hidden="true" /> Add photos
          <input type="file" accept="image/*" multiple onChange={onUpload} hidden aria-label="Upload your wedding photos" />
        </label>
      </div>

      {uploads.length > 0 && (
        <div className="upload-preview" role="region" aria-label="Your uploaded photos" style={{ position: 'relative', zIndex: 1 }}>
          <p>{uploads.length} photo{uploads.length === 1 ? '' : 's'} selected for preview.</p>
          {uploads.map((u, i) => (
            <img key={i} src={u.url} alt={`Your uploaded photo ${i + 1}`} />
          ))}
        </div>
      )}

      <AnimatePresence>
        {lightbox && (
          <motion.div
            className="lightbox"
            role="dialog"
            aria-modal="true"
            aria-label={lightbox.alt}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightbox(null)}
          >
            <button className="lightbox-close" onClick={() => setLightbox(null)} aria-label="Close photo">
              <X size={22} />
            </button>
            <motion.img
              src={lightbox.src}
              alt={lightbox.alt}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 22 }}
              onClick={e => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

export default Gallery;
