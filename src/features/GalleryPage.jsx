/**
 * GalleryPage — /gallery
 *
 * Dynamic masonry layout (Pinterest/Google Images style).
 * Photos sourced exclusively from the API public gallery endpoint.
 * No placeholder images. Shows loading skeleton, empty state, error state.
 */
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowUpRight, Loader2, ImageOff, RefreshCw } from 'lucide-react';
import { getPublicGallery, getWeddingConfig } from '../services/api/public.js';

const SLUG = import.meta.env.VITE_WEDDING_SLUG || '';

// Distributes photos into N columns using round-robin so they fill evenly.
// Images determine their own height via natural aspect ratio.
function buildColumns(photos, columnCount) {
  const cols = Array.from({ length: columnCount }, () => []);
  photos.forEach((photo, i) => {
    cols[i % columnCount].push(photo);
  });
  return cols;
}

function useColumnCount() {
  const [cols, setCols] = useState(() =>
    window.innerWidth < 640 ? 2 : window.innerWidth < 1024 ? 3 : 4
  );
  useEffect(() => {
    const update = () => {
      setCols(window.innerWidth < 640 ? 2 : window.innerWidth < 1024 ? 3 : 4);
    };
    window.addEventListener('resize', update, { passive: true });
    return () => window.removeEventListener('resize', update);
  }, []);
  return cols;
}

// ── Skeleton card ─────────────────────────────────────────────────
function SkeletonCard({ ratio = 0.75 }) {
  return (
    <div style={{
      width: '100%',
      paddingBottom: `${ratio * 100}%`,
      background: 'linear-gradient(90deg, #f0ece8 25%, #e4ddd8 50%, #f0ece8 75%)',
      backgroundSize: '200% 100%',
      borderRadius: 6,
      animation: 'shimmer 1.5s ease-in-out infinite',
    }} aria-hidden="true" />
  );
}

// ── Lightbox ──────────────────────────────────────────────────────
function Lightbox({ photo, onClose }) {
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label={photo.uploadedByName ? `Photo by ${photo.uploadedByName}` : 'Wedding photo'}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.22 }}
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 200,
        background: 'rgba(8,6,5,0.92)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '20px',
        backdropFilter: 'blur(6px)',
      }}
    >
      <button
        onClick={onClose}
        aria-label="Close"
        style={{
          position: 'fixed', top: 16, right: 16,
          width: 40, height: 40, borderRadius: '50%',
          background: 'rgba(255,255,255,0.1)',
          border: '1px solid rgba(255,255,255,0.2)',
          color: '#fff', cursor: 'pointer', zIndex: 201,
          display: 'grid', placeItems: 'center',
        }}
      >
        <X size={18} />
      </button>

      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3, ease: [0.2, 0.8, 0.2, 1] }}
        onClick={e => e.stopPropagation()}
        style={{ maxWidth: 'min(1000px,95vw)', textAlign: 'center' }}
      >
        <img
          src={photo.imageUrl}
          alt={photo.uploadedByName ? `Photo by ${photo.uploadedByName}` : 'Wedding photo'}
          style={{
            maxHeight: '85vh', maxWidth: '100%',
            objectFit: 'contain', borderRadius: 4,
            boxShadow: '0 24px 80px rgba(0,0,0,0.6)',
          }}
        />
        {(photo.uploadedByName || photo.caption) && (
          <p style={{
            color: 'rgba(255,255,255,0.6)', fontSize: 12,
            marginTop: 12, letterSpacing: '0.06em',
          }}>
            {photo.caption || `Shared by ${photo.uploadedByName}`}
          </p>
        )}
      </motion.div>
    </motion.div>
  );
}

// ── Photo card ────────────────────────────────────────────────────
function PhotoCard({ photo, onOpen, index }) {
  const [loaded, setLoaded] = useState(false);
  const imgRef = useRef(null);

  // If image is already cached, onLoad won't fire — check immediately
  useEffect(() => {
    if (imgRef.current?.complete) setLoaded(true);
  }, []);

  return (
    <motion.button
      onClick={() => onOpen(photo)}
      aria-label={photo.uploadedByName ? `View photo by ${photo.uploadedByName}` : `View photo ${index + 1}`}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.04, 0.4), duration: 0.45 }}
      whileHover={{ scale: 1.015 }}
      style={{
        position: 'relative', width: '100%',
        display: 'block', background: 'none', border: 'none',
        padding: 0, cursor: 'pointer', borderRadius: 6, overflow: 'hidden',
      }}
    >
      {/* Skeleton — shown until image loads, sits behind the image */}
      <div style={{
        position: loaded ? 'absolute' : 'relative',
        inset: loaded ? 0 : undefined,
        width: '100%',
        paddingBottom: loaded ? undefined : `${(photo._ratio || 0.75) * 100}%`,
        background: 'linear-gradient(135deg, #EDE8E2 0%, #E4DDD8 50%, #EDE8E2 100%)',
        backgroundSize: '200% 100%',
        animation: loaded ? 'none' : 'shimmer 1.4s ease-in-out infinite',
        borderRadius: 6,
        transition: 'opacity 0.3s',
        opacity: loaded ? 0 : 1,
        pointerEvents: 'none',
      }} aria-hidden="true" />

      {/* Always render img — opacity transition instead of display:none */}
      <img
        ref={imgRef}
        src={photo.thumbnailUrl || photo.imageUrl}
        alt={photo.uploadedByName ? `Photo by ${photo.uploadedByName}` : `Wedding photo ${index + 1}`}
        loading="lazy"
        onLoad={() => setLoaded(true)}
        style={{
          width: '100%',
          display: 'block',
          borderRadius: 6,
          verticalAlign: 'bottom',
          opacity: loaded ? 1 : 0,
          transition: 'opacity 0.4s ease',
        }}
      />

      {/* Hover overlay */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 55%)',
        borderRadius: 6,
        opacity: 0,
        transition: 'opacity 0.25s',
        pointerEvents: 'none',
      }} className="photo-overlay" />
      {photo.uploadedByName && (
        <div style={{
          position: 'absolute', bottom: 8, left: 10, right: 10,
          color: 'rgba(255,255,255,0.9)', fontSize: 10,
          letterSpacing: '0.06em', textAlign: 'left',
          pointerEvents: 'none',
          opacity: 0, transition: 'opacity 0.25s',
        }} className="photo-caption">
          {photo.uploadedByName}
        </div>
      )}
      <style>{`
        button:hover .photo-overlay { opacity: 1 !important; }
        button:hover .photo-caption { opacity: 1 !important; }
        @keyframes shimmer {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </motion.button>
  );
}

// ── Main page ─────────────────────────────────────────────────────
export function GalleryPage() {
  const [photos,   setPhotos]  = useState([]);
  const [config,   setConfig]  = useState(null);
  const [loading,  setLoading] = useState(true);
  const [error,    setError]   = useState('');
  const [lightbox, setLightbox] = useState(null);
  const columnCount = useColumnCount();

  const load = useCallback(async () => {
    if (!SLUG) {
      setLoading(false);
      setError('No wedding slug configured (VITE_WEDDING_SLUG). Gallery is not available.');
      return;
    }
    setLoading(true); setError('');
    try {
      const [gallery, cfg] = await Promise.allSettled([
        getPublicGallery(),
        getWeddingConfig(),
      ]);

      const raw = gallery.status === 'fulfilled' ? gallery.value : [];
      // Guard: API may return null or non-array on error
      const photos = Array.isArray(raw) ? raw : [];
      if (cfg.status === 'fulfilled') setConfig(cfg.value);
      setPhotos(photos);
    } catch (e) {
      setError(e.message || 'Failed to load gallery.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const columns = buildColumns(photos, columnCount);
  // Names and date — only render when config is loaded (no fallback placeholder)
  const nameParts = (() => {
    if (!config?.name) return null;
    const m = config.name.match(/^(.+?)\s*&\s*(.+?)(?:\s+Wedding)?$/i);
    return m ? [m[1].trim(), m[2].trim()] : [config.name.replace(/\s*Wedding\s*$/i, '').trim()];
  })();

  const footerDate = config?.eventDateUtc
    ? new Date(config.eventDateUtc).toLocaleDateString('en-IN', {
        day: 'numeric', month: 'long', year: 'numeric',
      }).toUpperCase()
    : null;

  const footerVenue = config?.venue?.split(',')[0] || null;

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--t-bg, #F7F3ED)',
      fontFamily: "'Jost', sans-serif",
    }}>
      {/* Minimal nav */}
      <header style={{
        position: 'sticky', top: 0, zIndex: 40,
        height: 64,
        padding: '0 clamp(16px, 4vw, 56px)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: 'rgba(247,243,237,0.94)',
        borderBottom: '1px solid rgba(0,0,0,0.07)',
        backdropFilter: 'blur(16px)',
      }} role="banner">
        <a href="/"
          style={{
            fontFamily: "'Cormorant Garamond',Georgia,serif",
            fontSize: 26, fontWeight: 600, letterSpacing: '-0.06em',
            color: 'var(--t-fg,#26372C)', textDecoration: 'none', lineHeight: 1,
          }}
          aria-label="Return home">
          A<span className="couple-ampersand" style={{ color: '#8B6E7F', margin: '0 1px' }}>&amp;</span>S
        </a>

        <nav aria-label="Gallery navigation"
          style={{ display: 'flex', alignItems: 'center', gap: 'clamp(12px,2vw,28px)' }}>
          {[['Home','/'],['Events','/#events'],['RSVP','/#rsvp']].map(([label, href]) => (
            <a key={href} href={href}
              style={{ fontSize: 12, fontWeight: 500, color: '#4A4A40',
                textDecoration: 'none', letterSpacing: '0.02em' }}>
              {label}
            </a>
          ))}
          <a href="/gallery" aria-current="page"
            style={{ fontSize: 12, fontWeight: 600, color: '#8B6E7F',
              textDecoration: 'none', letterSpacing: '0.02em' }}>
            Gallery
          </a>
        </nav>
      </header>

      {/* Content */}
      <main style={{ maxWidth: 1400, margin: '0 auto', padding: 'clamp(24px,4vw,48px) clamp(12px,3vw,32px) 80px' }}>

        {/* Loading state */}
        {loading && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'center', padding: '80px 0' }}>
              <Loader2 size={32} style={{ animation: 'spin 1s linear infinite', color: '#C4A6B2' }} aria-label="Loading gallery" />
            </div>
          </div>
        )}

        {/* Error state */}
        {!loading && error && (
          <div style={{ textAlign: 'center', padding: '80px 24px' }}>
            <ImageOff size={40} color="#C4B8B0" style={{ margin: '0 auto 16px' }} aria-hidden="true" />
            <p style={{ fontSize: 14, color: '#7A6A60', marginBottom: 20 }}>{error}</p>
            <button onClick={load}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '10px 20px', borderRadius: 999,
                background: '#8B6E7F', color: '#fff', border: 'none',
                fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
              <RefreshCw size={13} /> Try again
            </button>
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && photos.length === 0 && (
          <div style={{ textAlign: 'center', padding: '80px 24px' }}>
            <ImageOff size={40} color="#C4B8B0" style={{ margin: '0 auto 16px' }} aria-hidden="true" />
            <p style={{ fontSize: 15, color: '#7A6A60', marginBottom: 8 }}>No photos yet</p>
            <p style={{ fontSize: 13, color: '#B0A898' }}>
              Approved guest photos will appear here.
            </p>
          </div>
        )}

        {/* Masonry grid */}
        {!loading && photos.length > 0 && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${columnCount}, 1fr)`,
            gap: 'clamp(8px,1.2vw,14px)',
            alignItems: 'start',
          }} role="list" aria-label="Wedding gallery">
            {columns.map((col, ci) => (
              <div key={ci} style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(8px,1.2vw,14px)' }}>
                {col.map((photo, pi) => {
                  const globalIndex = photos.findIndex(p => p.id === photo.id);
                  return (
                    <div key={photo.id} role="listitem">
                      <PhotoCard
                        photo={photo}
                        index={globalIndex}
                        onOpen={setLightbox}
                      />
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        )}

        {/* Back link */}
        {!loading && (
          <div style={{ textAlign: 'center', marginTop: 56 }}>
            <a href="/"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 8,
                fontSize: 12, fontWeight: 600, color: '#8B6E7F',
                textDecoration: 'none', letterSpacing: '0.04em',
                borderBottom: '1px solid currentColor', paddingBottom: 2 }}>
              Return to invitation <ArrowUpRight size={13} aria-hidden="true" />
            </a>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer style={{ textAlign: 'center', padding: '40px 20px 48px',
        background: 'var(--t-footer-bg,#26372C)', color: 'var(--t-footer-fg,#F8F0F4)' }}
        role="contentinfo">
        {nameParts ? (
          <p style={{ fontFamily: "'Cormorant Garamond',Georgia,serif",
            fontSize: 'clamp(28px,5vw,40px)', fontWeight: 600, margin: '0 0 8px', letterSpacing: '-0.03em' }}>
            {nameParts.length === 2
              ? <>{nameParts[0]} <em style={{ opacity: 0.75 }}>&amp;</em> {nameParts[1]}</>
              : nameParts[0]
            }
          </p>
        ) : null}
        {(footerDate || footerVenue) && (
          <p style={{ fontSize: 11, letterSpacing: '0.18em', opacity: 0.55 }}>
            {[footerDate, footerVenue].filter(Boolean).join(' · ')}
          </p>
        )}
      </footer>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <Lightbox key="lb" photo={lightbox} onClose={() => setLightbox(null)} />
        )}
      </AnimatePresence>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes shimmer {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        @media (prefers-reduced-motion: reduce) {
          * { animation: none !important; transition: none !important; }
        }
      `}</style>
    </div>
  );
}

export default GalleryPage;
