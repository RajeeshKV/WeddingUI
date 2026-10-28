import React from 'react';
import { motion } from 'framer-motion';
import { AmbientCanvas } from '../components/background/AmbientCanvas.jsx';

const storyPhoto  = 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=1100&q=85';
const STORY_MOSAIC_FALLBACKS = [
  { imageUrl: storyPhoto, alt: 'A couple sharing a quiet moment together' },
  { imageUrl: 'https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&w=1000&q=85', alt: 'A wedding day portrait by the sea' },
  { imageUrl: 'https://images.unsplash.com/photo-1519225421980-888cb7e6c7c2?auto=format&fit=crop&w=900&q=85', alt: 'A wedding celebration detail' },
  { imageUrl: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=900&q=85', alt: 'A joyful wedding moment' },
];

// Timeline dates and content are editorial copy — not derived from API
const TIMELINE = [
  { n: '01', date: 'THE BEGINNING',      title: 'The first hello',     body: 'A chance meeting, a long conversation, and a feeling we could not quite explain.' },
  { n: '02', date: 'OUR FIRST ADVENTURE',title: 'Something new',       body: 'New places, terrible directions, and memories we still talk about.' },
  { n: '03', date: 'A QUIET EVENING',    title: 'The big question',    body: 'One little question. One very happy yes.' },
  { n: '04', date: 'VERY SOON',          title: 'Our forever',         body: 'And now, the best part begins — with all of you.' },
];

export function Story({ photos = [] }) {
  const uploadedPhotos = photos.slice(0, 4).map((photo, index) => ({
        imageUrl: photo.thumbnailUrl || photo.imageUrl,
        alt: photo.caption || (photo.uploadedByName ? `A wedding memory shared by ${photo.uploadedByName}` : `Wedding memory ${index + 1}`),
      })).filter(photo => photo.imageUrl);
  const mosaicPhotos = [
    ...uploadedPhotos,
    ...STORY_MOSAIC_FALLBACKS.filter(fallback => !uploadedPhotos.some(photo => photo.imageUrl === fallback.imageUrl)),
  ].slice(0, 4);

  return (
    <section
      className="story section-pad"
      id="story"
      aria-labelledby="story-heading"
      style={{ position: 'relative', overflow: 'hidden' }}
    >
      <AmbientCanvas mode="petals" opacity={0.35} />

      <div className="section-heading" style={{ position: 'relative', zIndex: 1 }}>
        <motion.span
          className="eyebrow"
          initial={{ opacity: 0, letterSpacing: '0.5em' }}
          whileInView={{ opacity: 1, letterSpacing: '0.22em' }}
          viewport={{ once: true }}
          transition={{ duration: 0.9 }}
        >
          THE BEGINNING OF US
        </motion.span>
        <motion.h2
          id="story-heading"
          initial={{ opacity: 0, y: 22, filter: 'blur(6px)' }}
          whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          viewport={{ once: true }}
          transition={{ delay: 0.15, duration: 0.85, ease: [0.2, 0.8, 0.2, 1] }}
        >
          Every love story<br /><em>has its moments.</em>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.7 }}
        >
          Here are a few of ours.
        </motion.p>
      </div>

      <div className="story-grid" style={{ position: 'relative', zIndex: 1 }}>
        <motion.figure
          className="story-photo story-photo--large"
          initial={{ opacity: 0, x: -32, filter: 'blur(8px)' }}
          whileInView={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.95, ease: [0.2, 0.8, 0.2, 1] }}
        >
          <img src={storyPhoto} alt="The couple at the beginning of their journey" loading="lazy" />
          <figcaption>Somewhere, it all began.</figcaption>
        </motion.figure>

        <div className="timeline" role="list" aria-label="Love story timeline">
          {TIMELINE.map((item, i) => (
            <motion.div
              key={item.n}
              className="timeline-item"
              role="listitem"
              initial={{ opacity: 0, x: 28 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ delay: i * 0.12, duration: 0.6, type: 'spring', stiffness: 120, damping: 18 }}
            >
              <span className="timeline-num" aria-hidden="true">{item.n}</span>
              <div>
                <span className="eyebrow">{item.date}</span>
                <h3>{item.title}</h3>
                <p>{item.body}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.figure
          className="story-mosaic"
          initial={{ opacity: 0, y: 28, filter: 'blur(6px)' }}
          whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.85, ease: [0.2, 0.8, 0.2, 1] }}
        >
          {mosaicPhotos.map((photo, index) => (
            <div className={`story-mosaic__tile story-mosaic__tile--${index + 1}`} key={`${photo.imageUrl}-${index}`}>
              <img src={photo.imageUrl} alt={photo.alt} loading="lazy" />
            </div>
          ))}
        </motion.figure>
      </div>
    </section>
  );
}

export default Story;
