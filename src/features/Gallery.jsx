/**
 * Gallery section — main wedding page (home)
 *
 * Shows ONLY the photo upload widget and a link to /gallery.
 * The grid of photos lives exclusively at /gallery (GalleryPage.jsx).
 */
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Camera, Upload, Loader2, ArrowUpRight, Images } from 'lucide-react';
import { AmbientCanvas } from '../components/background/AmbientCanvas.jsx';
import { uploadGuestPhotos } from '../services/api/public.js';

const SLUG    = import.meta.env.VITE_WEDDING_SLUG || '';
const HAS_API = Boolean(SLUG);

export function Gallery({ weddingConfig = null }) {
  const [uploading,  setUploading]  = useState(false);
  const [uploadName, setUploadName] = useState('');
  const [uploadMsg,  setUploadMsg]  = useState('');
  const [uploadErr,  setUploadErr]  = useState('');

  const guestUploadsEnabled = weddingConfig ? weddingConfig.guestUploadsEnabled : true;

  const handleUpload = async (e) => {
    const files = [...e.target.files].filter(f => f.type.startsWith('image/')).slice(0, 8);
    if (!files.length) return;
    setUploadErr('');
    setUploadMsg('');

    if (!HAS_API) {
      setUploadMsg('Demo mode — set VITE_WEDDING_SLUG to upload for real.');
      e.target.value = '';
      return;
    }

    setUploading(true);
    try {
      const results = await uploadGuestPhotos(files, uploadName);
      const pending  = results.filter(r => r.status === 'Pending').length;
      const approved = results.filter(r => r.status === 'Approved').length;
      setUploadMsg(
        pending > 0
          ? `${results.length} photo${results.length > 1 ? 's' : ''} uploaded — ${pending} awaiting admin approval.`
          : `${approved} photo${approved > 1 ? 's' : ''} added to the gallery!`
      );
    } catch (err) {
      setUploadErr(err.message || 'Upload failed. Please try again.');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  return (
    <section
      className="gallery section-pad"
      id="gallery"
      aria-labelledby="gallery-heading"
      style={{ position: 'relative', overflow: 'hidden' }}
    >
      <AmbientCanvas mode="orbs" opacity={0.5} />

      {/* Section heading */}
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

      {/* Content area */}
      <motion.div
        style={{ position: 'relative', zIndex: 1, maxWidth: 680, margin: '0 auto' }}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ delay: 0.2, duration: 0.75, ease: [0.2, 0.8, 0.2, 1] }}
      >
        {/* Gallery link — above upload */}
        <a
          href="/gallery"
          aria-label="Open the full photo gallery"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '18px 24px',
            marginBottom: 16,
            background: 'var(--t-surface-hi)',
            border: '1px solid var(--t-border)',
            borderRadius: 6,
            textDecoration: 'none',
            transition: 'box-shadow 0.2s, transform 0.2s',
          }}
          onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 28px rgba(0,0,0,0.08)'; }}
          onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = ''; }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{
              width: 40, height: 40, borderRadius: '50%',
              background: 'var(--t-accent-soft)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
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

        {/* Upload widget — only if enabled */}
        {guestUploadsEnabled ? (
          <div style={{
            padding: '22px 24px',
            background: 'var(--t-surface-hi)',
            border: '1px dashed var(--t-border)',
            borderRadius: 6,
          }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
              {/* Icon */}
              <div style={{
                width: 40, height: 40, borderRadius: '50%', flexShrink: 0,
                background: 'var(--t-accent-soft)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Camera size={18} color="var(--t-rose)" aria-hidden="true" />
              </div>

              {/* Text + controls */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <h3 style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: 20, fontWeight: 600,
                  color: 'var(--t-fg)',
                  margin: '0 0 4px',
                  lineHeight: 1.2,
                }}>
                  Add your photos
                </h3>
                <p style={{ fontSize: 12, color: 'var(--t-muted)', margin: '0 0 16px', lineHeight: 1.6 }}>
                  Share your favourite moments from the celebration. Photos may be reviewed before appearing in the gallery.
                </p>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}>
                  {HAS_API && (
                    <input
                      type="text"
                      placeholder="Your name (optional)"
                      value={uploadName}
                      onChange={e => setUploadName(e.target.value)}
                      style={{
                        border: '1px solid var(--t-border)',
                        borderRadius: 4, padding: '8px 12px',
                        fontSize: 12, background: 'var(--t-bg)',
                        color: 'var(--t-fg)', minWidth: 160,
                        fontFamily: "'Jost', sans-serif",
                      }}
                      aria-label="Your name for the photo upload"
                    />
                  )}

                  <label className="btn btn-outline" style={{ cursor: 'pointer' }}>
                    {uploading
                      ? <><Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} aria-hidden="true" /> Uploading…</>
                      : <><Upload size={14} aria-hidden="true" /> Add photos</>
                    }
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleUpload}
                      hidden
                      disabled={uploading}
                      aria-label="Upload your wedding photos"
                    />
                  </label>
                </div>

                {/* Feedback */}
                {uploadMsg && (
                  <p style={{ fontSize: 12, color: 'var(--t-rose)', marginTop: 10, lineHeight: 1.5 }}
                    role="status" aria-live="polite">
                    ✓ {uploadMsg}
                  </p>
                )}
                {uploadErr && (
                  <p style={{ fontSize: 12, color: 'var(--t-danger,#C4606E)', marginTop: 10 }}
                    role="alert">
                    {uploadErr}
                  </p>
                )}
              </div>
            </div>
          </div>
        ) : (
          /* Uploads disabled — just show the gallery link prominently */
          <div style={{
            padding: '18px 24px', borderRadius: 6,
            background: 'var(--t-accent-soft)',
            border: '1px solid var(--t-border)',
            fontSize: 12, color: 'var(--t-muted)', textAlign: 'center',
          }}>
            Guest photo uploads are currently closed.
          </div>
        )}
      </motion.div>

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </section>
  );
}

export default Gallery;
