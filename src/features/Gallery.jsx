import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, X, Camera, Upload, Loader2 } from 'lucide-react';
import { AmbientCanvas } from '../components/background/AmbientCanvas.jsx';
import { uploadGuestPhotos } from '../services/api/public.js';

// Static fallback images for demo/no-slug mode
const FALLBACK_IMGS = [
  { id: '1', imageUrl: 'https://images.unsplash.com/photo-1532712938310-34cb3982ef74?auto=format&fit=crop&w=900&q=85', alt: 'Wedding memory 1' },
  { id: '2', imageUrl: 'https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&w=900&q=85',  alt: 'Couple portrait' },
  { id: '3', imageUrl: 'https://images.unsplash.com/photo-1523438885200-e635ba2c371e?auto=format&fit=crop&w=900&q=85',  alt: 'Wedding detail' },
  { id: '4', imageUrl: 'https://images.unsplash.com/photo-1529636798458-92182e662485?auto=format&fit=crop&w=900&q=85',  alt: 'Wedding ceremony' },
  { id: '5', imageUrl: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=900&q=85',  alt: 'Romantic moment' },
  { id: '6', imageUrl: 'https://images.unsplash.com/photo-1465495976277-4387d4b0e4a6?auto=format&fit=crop&w=900&q=85',  alt: 'Wedding celebration' },
];

const SLUG    = import.meta.env.VITE_WEDDING_SLUG || '';
const HAS_API = Boolean(SLUG);

export function Gallery({ apiPhotos = null, weddingConfig = null }) {
  const [lightbox,      setLightbox]      = useState(null);
  const [uploading,     setUploading]     = useState(false);
  const [uploadName,    setUploadName]    = useState('');
  const [uploadedLocal, setUploadedLocal] = useState([]); // preview before API approval
  const [uploadMsg,     setUploadMsg]     = useState('');
  const [uploadErr,     setUploadErr]     = useState('');

  const guestUploadsEnabled = weddingConfig ? weddingConfig.guestUploadsEnabled : true;

  // Use API photos when available, otherwise fallback
  const displayPhotos = apiPhotos && apiPhotos.length > 0
    ? apiPhotos
    : FALLBACK_IMGS;

  const handleUpload = async (e) => {
    const files = [...e.target.files].filter(f => f.type.startsWith('image/')).slice(0, 8);
    if (!files.length) return;
    setUploadErr('');
    setUploadMsg('');

    if (!HAS_API) {
      // Demo: local preview only
      setUploadedLocal(prev => [
        ...prev,
        ...files.map(f => ({ id: URL.createObjectURL(f), imageUrl: URL.createObjectURL(f), alt: f.name }))
      ].slice(0, 12));
      return;
    }

    setUploading(true);
    try {
      const results = await uploadGuestPhotos(files, uploadName);
      const pendingCount  = results.filter(r => r.status === 'Pending').length;
      const approvedCount = results.filter(r => r.status === 'Approved').length;
      if (pendingCount > 0) {
        setUploadMsg(`${results.length} photo${results.length > 1 ? 's' : ''} uploaded! ${pendingCount} awaiting approval.`);
      } else {
        setUploadMsg(`${approvedCount} photo${approvedCount > 1 ? 's' : ''} added to the gallery!`);
      }
    } catch (err) {
      setUploadErr(err.message || 'Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
    e.target.value = '';
  };

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
          viewport={{ once: true }} transition={{ duration: 0.9 }}
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
        <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.3 }}>
          A few favourite frames from our story.
        </motion.p>
      </div>

      {/* Grid */}
      <motion.div
        className="gallery-grid" role="list"
        style={{ position: 'relative', zIndex: 1 }}
        initial="hidden" whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        variants={{ visible: { transition: { staggerChildren: 0.07 } } }}
      >
        {displayPhotos.slice(0, 6).map((photo, i) => (
          <motion.button
            key={photo.id || i}
            className={`gallery-item gi-${i + 1}`}
            role="listitem"
            onClick={() => setLightbox(photo)}
            variants={{ hidden: { opacity: 0, scale: 0.93, y: 16 }, visible: { opacity: 1, scale: 1, y: 0 } }}
            transition={{ duration: 0.55, ease: [0.2, 0.8, 0.2, 1] }}
            whileHover={{ scale: 1.02 }}
            aria-label={`View ${photo.alt || photo.uploadedByName || 'photo'}`}
          >
            <img src={photo.thumbnailUrl || photo.imageUrl} alt={photo.alt || photo.uploadedByName || `Wedding memory ${i + 1}`} loading="lazy" />
            <span aria-hidden="true"><ArrowUpRight size={17} /></span>
          </motion.button>
        ))}
      </motion.div>

      <div className="gallery-page-link" style={{ position: 'relative', zIndex: 1 }}>
        <a className="text-link" href="/gallery" aria-label="Explore the full photo gallery">
          Explore the full gallery <ArrowUpRight size={14} aria-hidden="true" />
        </a>
      </div>

      {/* Upload — only shown if guestUploadsEnabled */}
      {guestUploadsEnabled && (
        <div className="upload-box" style={{ position: 'relative', zIndex: 1 }}>
          <div className="upload-icon" aria-hidden="true"><Camera size={20} /></div>
          <div>
            <h3>Were you there?</h3>
            <p>Add your favourite photos to this little collection.</p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignSelf: 'center' }}>
            {HAS_API && (
              <input
                type="text"
                placeholder="Your name (optional)"
                value={uploadName}
                onChange={e => setUploadName(e.target.value)}
                style={{ border: '1px solid var(--t-border)', borderRadius: 3, padding: '7px 10px',
                  fontSize: 11, background: 'var(--t-bg)', color: 'var(--t-fg)', minWidth: 160 }}
                aria-label="Your name for the photo upload"
              />
            )}
            <label className="btn btn-outline upload-btn">
              {uploading
                ? <><Loader2 size={15} style={{ animation: 'spin 1s linear infinite' }} aria-hidden="true" /> Uploading…</>
                : <><Upload size={15} aria-hidden="true" /> Add photos</>
              }
              <input type="file" accept="image/*" multiple onChange={handleUpload} hidden
                disabled={uploading} aria-label="Upload your wedding photos" />
            </label>
          </div>
        </div>
      )}

      {uploadMsg && (
        <p style={{ textAlign: 'center', marginTop: 12, fontSize: 12, color: 'var(--t-rose)', position: 'relative', zIndex: 1 }}
          role="status" aria-live="polite">
          {uploadMsg}
        </p>
      )}
      {uploadErr && (
        <p style={{ textAlign: 'center', marginTop: 12, fontSize: 12, color: 'var(--t-danger)', position: 'relative', zIndex: 1 }}
          role="alert">
          {uploadErr}
        </p>
      )}

      {/* Local previews (demo only) */}
      {uploadedLocal.length > 0 && (
        <div className="upload-preview" role="region" aria-label="Your uploaded photos" style={{ position: 'relative', zIndex: 1 }}>
          <p>Preview only — photos pending approval.</p>
          {uploadedLocal.map((u, i) => (
            <img key={i} src={u.imageUrl} alt={`Uploaded photo ${i + 1}`} />
          ))}
        </div>
      )}

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <motion.div className="lightbox" role="dialog" aria-modal="true"
            aria-label={lightbox.alt || lightbox.uploadedByName || 'Photo'}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setLightbox(null)}
          >
            <button className="lightbox-close" onClick={() => setLightbox(null)} aria-label="Close photo">
              <X size={22} />
            </button>
            <motion.img
              src={lightbox.imageUrl}
              alt={lightbox.alt || lightbox.uploadedByName || 'Wedding photo'}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 22 }}
              onClick={e => e.stopPropagation()}
            />
            {lightbox.uploadedByName && (
              <p style={{ position: 'absolute', bottom: 24, left: 0, right: 0, textAlign: 'center',
                color: 'rgba(255,255,255,0.65)', fontSize: 12 }}>
                Shared by {lightbox.uploadedByName}
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </section>
  );
}

export default Gallery;
