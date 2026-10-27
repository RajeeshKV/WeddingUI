import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowUpRight } from 'lucide-react';

const ALL_PHOTOS = [
  { src: 'https://images.unsplash.com/photo-1532712938310-34cb3982ef74?auto=format&fit=crop&w=900&q=85', alt: 'Wedding memory 1',   cat: 'All' },
  { src: 'https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&w=900&q=85', alt: 'Pre-wedding shoot',   cat: 'Pre-Wedding' },
  { src: 'https://images.unsplash.com/photo-1523438885200-e635ba2c371e?auto=format&fit=crop&w=900&q=85', alt: 'Wedding detail',       cat: 'Candid' },
  { src: 'https://images.unsplash.com/photo-1529636798458-92182e662485?auto=format&fit=crop&w=900&q=85', alt: 'Wedding ceremony',     cat: 'All' },
  { src: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=900&q=85', alt: 'Romantic portrait',    cat: 'Pre-Wedding' },
  { src: 'https://images.unsplash.com/photo-1465495976277-4387d4b0e4a6?auto=format&fit=crop&w=900&q=85', alt: 'Celebration moment',   cat: 'Candid' },
  { src: 'https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&w=900&q=85', alt: 'Haldi ceremony',       cat: 'All' },
  { src: 'https://images.unsplash.com/photo-1519225421980-888cb7e6c7c2?auto=format&fit=crop&w=900&q=85', alt: 'Sangeet celebration',  cat: 'Friends & Family' },
  { src: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=900&q=85', alt: 'Wedding venue',        cat: 'Travel' },
];

const TABS = ['All', 'Pre-Wedding', 'Travel', 'Candid', 'Friends & Family'];

export function GalleryPage() {
  const [activeTab, setActiveTab] = useState('All');
  const [lightbox, setLightbox] = useState(null);

  const filtered = activeTab === 'All'
    ? ALL_PHOTOS
    : ALL_PHOTOS.filter(p => p.cat === activeTab || p.cat === 'All');

  return (
    <div className="gallery-page theme-eternal-bloom">
      {/* Nav */}
      <header className="site-nav gallery-page-nav" role="banner">
        <a className="nav-monogram" href="/" aria-label="Return home">
          A<span>&amp;</span>S
        </a>
        <nav className="nav-links gallery-nav-links" aria-label="Site navigation">
          <a href="/">Home</a>
          <a href="/#story">Our Story</a>
          <a href="/#events">Events</a>
          <a href="/gallery" aria-current="page">Gallery</a>
          <a href="/#rsvp">RSVP</a>
        </nav>
        <a className="btn btn-primary nav-rsvp-btn" href="/#rsvp">
          RSVP Now <ArrowUpRight size={14} aria-hidden="true" />
        </a>
      </header>

      <main className="gallery-page-main">
        <span className="eyebrow">OUR MEMORIES</span>
        <h1>Photo <em>Gallery</em></h1>
        <p>A collection of our favourite moments.</p>

        {/* Category tabs */}
        <div className="gallery-tabs" role="tablist" aria-label="Filter gallery by category">
          {TABS.map(tab => (
            <button
              key={tab}
              role="tab"
              aria-selected={activeTab === tab}
              className={`gallery-tab${activeTab === tab ? ' gallery-tab--active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="gallery-page-grid" role="list">
          <AnimatePresence>
            {filtered.map((photo, i) => (
              <motion.button
                key={photo.src}
                className={`gallery-page-item gpi-${(i % 4) + 1}`}
                role="listitem"
                onClick={() => setLightbox(photo)}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ delay: i * 0.04, duration: 0.4 }}
                aria-label={`View ${photo.alt}`}
              >
                <img src={photo.src} alt={photo.alt} loading="lazy" />
                <span aria-hidden="true">
                  Memory {String(i + 1).padStart(2, '0')} <ArrowUpRight size={13} />
                </span>
              </motion.button>
            ))}
          </AnimatePresence>
        </div>

        <a className="btn btn-primary gallery-back-btn" href="/">
          Return to invitation <ArrowUpRight size={14} aria-hidden="true" />
        </a>
      </main>

      {/* Footer */}
      <footer className="site-footer gallery-page-footer" role="contentinfo">
        <span className="eyebrow">WITH LOVE, ALWAYS</span>
        <h2>Aarav <em>&amp;</em> Siya</h2>
        <p>17 · 02 · 2027 · Bangalore, India</p>
      </footer>

      {/* Lightbox */}
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
            <button
              className="lightbox-close"
              onClick={() => setLightbox(null)}
              aria-label="Close photo"
            >
              <X size={22} />
            </button>
            <motion.img
              src={lightbox.src}
              alt={lightbox.alt}
              initial={{ scale: 0.93 }}
              animate={{ scale: 1 }}
              onClick={e => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default GalleryPage;
