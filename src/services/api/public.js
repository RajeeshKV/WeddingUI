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
// Returns every event across all API pages as an array.
export function getWeddingEvents() {
  return getAllWeddingEvents();
}

// ── Gallery ───────────────────────────────────────────────────────
// Returns only Approved photos as a paged response.
export function getWeddingEventsPage({ page = 1, pageSize = 50 } = {}) {
  return api.get(slugPath('/events'), { params: { page, pageSize } });
}

export function getPublicGallery({ page = 1, pageSize = 20 } = {}) {
  return api.get(slugPath('/gallery'), { params: { page, pageSize } });
}

// The API returns { items, page, pageSize, totalCount, totalPages } for
// paged endpoints, but older deployments may still return a bare array.
export function normalizePage(response, requestedPage = 1, requestedPageSize = 20) {
  if (Array.isArray(response)) {
    return {
      items: response,
      page: requestedPage,
      pageSize: requestedPageSize,
      totalCount: response.length,
      totalPages: response.length ? 1 : 0,
    };
  }

  const items = Array.isArray(response?.items) ? response.items : [];
  const page = Number(response?.page) > 0 ? Number(response.page) : requestedPage;
  const pageSize = Number(response?.pageSize) > 0 ? Number(response.pageSize) : requestedPageSize;
  const totalCount = Number.isFinite(Number(response?.totalCount))
    ? Number(response.totalCount)
    : items.length;
  const totalPages = Number.isFinite(Number(response?.totalPages))
    ? Number(response.totalPages)
    : Math.ceil(totalCount / pageSize);

  return { items, page, pageSize, totalCount, totalPages };
}

export async function getAllWeddingEvents(pageSize = 50) {
  const collected = [];
  let page = 1;
  let totalPages = 1;

  do {
    const response = await getWeddingEventsPage({ page, pageSize });
    const result = normalizePage(response, page, pageSize);
    collected.push(...result.items);
    totalPages = Math.max(1, result.totalPages);
    page += 1;
  } while (page <= totalPages && page <= 100);

  return collected;
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
