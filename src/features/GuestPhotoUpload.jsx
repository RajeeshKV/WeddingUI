import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Camera, Loader2, Upload } from 'lucide-react';
import { uploadGuestPhotos } from '../services/api/public.js';

const HAS_API = Boolean(import.meta.env.VITE_WEDDING_SLUG || '');

export function GuestPhotoUpload({ weddingConfig = null, onUploaded }) {
  const [uploading, setUploading] = useState(false);
  const [uploadName, setUploadName] = useState('');
  const [uploadMsg, setUploadMsg] = useState('');
  const [uploadErr, setUploadErr] = useState('');
  const enabled = weddingConfig ? weddingConfig.guestUploadsEnabled !== false : true;

  const handleUpload = async (event) => {
    const input = event.currentTarget;
    const files = [...(input.files || [])].filter(file => file.type.startsWith('image/')).slice(0, 8);
    if (!files.length) return;
    setUploadErr('');
    setUploadMsg('');
    if (!HAS_API) {
      setUploadMsg('Demo mode — set VITE_WEDDING_SLUG to upload for real.');
      input.value = '';
      return;
    }

    setUploading(true);
    try {
      const response = await uploadGuestPhotos(files, uploadName);
      const uploaded = Array.isArray(response) ? response
        : Array.isArray(response?.items) ? response.items
          : Array.isArray(response?.photos) ? response.photos : [];
      const pending = uploaded.filter(photo => String(photo.status || '').toLowerCase() === 'pending').length;
      const approved = uploaded.filter(photo => String(photo.status || '').toLowerCase() === 'approved').length;
      const total = uploaded.length || files.length;
      setUploadMsg(pending
        ? `${total} photo${total === 1 ? '' : 's'} uploaded. ${pending} awaiting approval.`
        : `${approved || total} photo${(approved || total) === 1 ? '' : 's'} uploaded.`);
      onUploaded?.(uploaded);
    } catch (error) {
      setUploadErr(error.message || 'Upload failed. Please try again.');
    } finally {
      setUploading(false);
      input.value = '';
    }
  };

  if (!enabled) return (
    <div style={{ padding: '18px 24px', borderRadius: 6, background: 'var(--t-accent-soft)',
      border: '1px solid var(--t-border)', fontSize: 12, color: 'var(--t-muted)', textAlign: 'center' }}>
      Guest photo uploads are currently closed.
    </div>
  );

  return (
    <div style={{ position: 'relative', padding: '22px 24px', background: 'var(--t-surface-hi)',
      border: '1px dashed var(--t-border)', borderRadius: 6 }}>
      <AnimatePresence>
        {uploading && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          style={{ position: 'absolute', inset: 0, borderRadius: 6, zIndex: 10,
            background: 'rgba(var(--t-surface-hi-rgb, 251,246,249), 0.88)', backdropFilter: 'blur(4px)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10 }}
          aria-live="polite" aria-label="Uploading photos">
          <Loader2 size={28} color="var(--t-rose)" aria-hidden="true" style={{ animation: 'galleryUploadSpin 0.9s linear infinite' }} />
          <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--t-fg)', margin: 0 }}>Uploading...</p>
        </motion.div>}
      </AnimatePresence>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
        <div style={{ width: 40, height: 40, borderRadius: '50%', flexShrink: 0,
          background: 'var(--t-accent-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Camera size={18} color="var(--t-rose)" aria-hidden="true" />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: 20, fontWeight: 600,
            color: 'var(--t-fg)', margin: '0 0 4px', lineHeight: 1.2 }}>Add your photos</h3>
          <p style={{ fontSize: 12, color: 'var(--t-muted)', margin: '0 0 16px', lineHeight: 1.6 }}>
            Share your favourite moments from the celebration. Photos may be reviewed before appearing in the gallery.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}>
            {HAS_API && <input type="text" placeholder="Your name (optional)" value={uploadName}
              onChange={event => setUploadName(event.target.value)} disabled={uploading}
              aria-label="Your name for the photo upload"
              style={{ border: '1px solid var(--t-border)', borderRadius: 4, padding: '8px 12px',
                fontSize: 12, background: 'var(--t-bg)', color: 'var(--t-fg)', minWidth: 160 }} />}
            <label className="btn btn-outline" style={{ cursor: uploading ? 'not-allowed' : 'pointer', opacity: uploading ? 0.6 : 1 }}>
              <Upload size={14} aria-hidden="true" /> Add photos
              <input type="file" accept="image/*" multiple onChange={handleUpload} hidden disabled={uploading}
                aria-label="Upload your wedding photos" />
            </label>
          </div>
          {uploadMsg && <p style={{ fontSize: 12, color: 'var(--t-rose)', marginTop: 10, lineHeight: 1.5 }} role="status" aria-live="polite">{uploadMsg}</p>}
          {uploadErr && <p style={{ fontSize: 12, color: 'var(--t-danger,#C4606E)', marginTop: 10 }} role="alert">{uploadErr}</p>}
        </div>
      </div>
      <style>{`@keyframes galleryUploadSpin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

export default GuestPhotoUpload;
