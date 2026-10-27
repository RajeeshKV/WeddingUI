/**
 * Admin API service
 * Updated to match backend spec — all tenant-scoped from JWT, no weddingId in URLs.
 * New canonical endpoints: /api/v1/admin/wedding/*
 * Legacy /api/v1/admin/weddings/{id}/* still work but are not used here.
 */

import api from './client.js';
import { setTokens, clearTokens, notifyAuthChange } from '../../stores/authStore.js';

const ROLE = 'admin';
const base = (path) => `/api/v1/admin${path}`;

// ── Auth ──────────────────────────────────────────────────────────

export async function adminLogin({ usernameOrEmail, password }) {
  const data = await api.post(base('/auth/login'), { usernameOrEmail, password });
  setTokens(ROLE, { accessToken: data.accessToken, refreshToken: data.refreshToken });
  notifyAuthChange();
  return data; // { accessToken, refreshToken, expiresIn }
  // JWT contains: role, tenantId (= AdminUser.Id), email, name, security_version
}

export async function adminLogout(refreshToken) {
  try {
    await api.post(base('/auth/logout'), { refreshToken }, { role: ROLE });
  } finally {
    clearTokens(ROLE);
    notifyAuthChange();
  }
}

export async function adminLogoutAll() {
  try {
    await api.post(base('/auth/logout-all'), null, { role: ROLE });
  } finally {
    clearTokens(ROLE);
    notifyAuthChange();
  }
}

// GET /api/v1/admin/auth/me
// Returns: { id, fullName, username, email, mustChangePassword, isActive }
export function getAdminMe() {
  return api.get(base('/auth/me'), { role: ROLE });
}

export function changePassword({ currentPassword, newPassword }) {
  return api.post(base('/auth/change-password'), { currentPassword, newPassword }, { role: ROLE });
}

export function forgotPassword(email) {
  return api.post(base('/auth/forgot-password'), { email });
}

export function verifyResetOtp({ email, otp }) {
  return api.post(base('/auth/verify-reset-otp'), { email, otp });
}

export function resetPassword({ email, otp, newPassword }) {
  return api.post(base('/auth/reset-password'), { email, otp, newPassword });
}

// ── Dashboard ─────────────────────────────────────────────────────
// GET /api/v1/admin/wedding/dashboard  (tenant resolved from JWT)
// Returns: { totalRsvps, attending, notAttending, maybe,
//            totalPhotos, pendingPhotos, approvedPhotos }
export function getAdminDashboard() {
  return api.get(base('/wedding/dashboard'), { role: ROLE });
}

// ── Wedding config ────────────────────────────────────────────────
// GET /api/v1/admin/wedding/config
// Returns: { weddingId, name, slug, eventDateUtc, venue, description,
//            heroImageUrl, rsvpEnabled, guestUploadsEnabled }
export function getAdminWeddingConfig() {
  return api.get(base('/wedding/config'), { role: ROLE });
}

// PUT /api/v1/admin/wedding/config
// Body: { name?, description?, venue?, eventDateUtc?, heroImageUrl?,
//         rsvpEnabled?, guestUploadsEnabled?, autoApprovePhotos? }
export function updateWeddingConfig(config) {
  return api.put(base('/wedding/config'), config, { role: ROLE });
}

// POST /api/v1/admin/wedding/photos/auto-approve
export function enableAutoApprove() {
  return api.post(base('/wedding/photos/auto-approve'), null, { role: ROLE });
}

// ── Photos ────────────────────────────────────────────────────────
// GET /api/v1/admin/wedding/photos — all photos for tenant's wedding
// Returns: [{ id, imageUrl, thumbnailUrl, uploadedByName, caption,
//             status: "Pending|Approved|Rejected", uploadedAtUtc, weddingId }]
export function getWeddingPhotos() {
  return api.get(base('/wedding/photos'), { role: ROLE });
}

// GET /api/v1/admin/photos — all photos across tenant's weddings
export function getAllAdminPhotos() {
  return api.get(base('/photos'), { role: ROLE });
}

// GET /api/v1/admin/photos/pending
export function getPendingPhotos() {
  return api.get(base('/photos/pending'), { role: ROLE });
}

// POST /api/v1/admin/photos/{photoId}/approve  → 204
export function approvePhoto(photoId) {
  return api.post(base(`/photos/${photoId}/approve`), null, { role: ROLE });
}

// POST /api/v1/admin/photos/{photoId}/reject  → 204
export function rejectPhoto(photoId) {
  return api.post(base(`/photos/${photoId}/reject`), null, { role: ROLE });
}

// DELETE /api/v1/admin/photos/{photoId}  → 204
export function deletePhoto(photoId) {
  return api.delete(base(`/photos/${photoId}`), { role: ROLE });
}

// POST /api/v1/admin/photos/bulk-approve  body: string[] (UUID[])  → 204
export function bulkApprovePhotos(photoIds) {
  return api.post(base('/photos/bulk-approve'), photoIds, { role: ROLE });
}
