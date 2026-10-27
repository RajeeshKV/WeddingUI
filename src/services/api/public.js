/**
 * Public API service
 * All endpoints under /api/v1/public/weddings/{slug}
 * No authentication required.
 */

import api from './client.js';

const SLUG = import.meta.env.VITE_WEDDING_SLUG || '';

function slugPath(path) {
  return `/api/v1/public/weddings/${SLUG}${path}`;
}

// ── Wedding config ────────────────────────────────────────────────
// Returns: { id, name, slug, eventDateUtc, venue, description,
//            heroImageUrl, rsvpEnabled, guestUploadsEnabled }
export function getWeddingConfig() {
  return api.get(slugPath('/config'));
}

// ── Events ────────────────────────────────────────────────────────
// Returns: [ { id, name, description, startTimeUtc, endTimeUtc,
//              venue, address, displayOrder } ]
export function getWeddingEvents() {
  return api.get(slugPath('/events'));
}

// ── Gallery ───────────────────────────────────────────────────────
// Returns only Approved photos.
// [ { id, imageUrl, thumbnailUrl, uploadedByName, caption, status, uploadedAtUtc } ]
export function getPublicGallery() {
  return api.get(slugPath('/gallery'));
}

// ── RSVP ──────────────────────────────────────────────────────────
// status: "Attending" | "NotAttending" | "Maybe" | "Pending"
export function submitRsvp({ guestName, email, phone, status, guestCount, message }) {
  return api.post(slugPath('/rsvp'), {
    guestName,
    email:      email  || undefined,
    phone:      phone  || undefined,
    status:     status || 'Attending',
    guestCount: guestCount ?? 1,
    message:    message || undefined,
  });
}

// ── Guest photo upload ────────────────────────────────────────────
// files: File[]
// uploadedByName: string (optional)
// Returns: [ { id, status } ]
export function uploadGuestPhotos(files, uploadedByName = '') {
  const formData = new FormData();
  files.forEach(file => formData.append('files', file));
  if (uploadedByName) formData.append('uploadedByName', uploadedByName);
  // Do NOT set Content-Type — browser sets multipart boundary automatically
  return api.post(slugPath('/photos/upload'), formData);
}
