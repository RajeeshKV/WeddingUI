/**
 * Admin API service
 * All authenticated endpoints under /api/v1/admin/
 * Role: 'admin'
 */

import api from './client.js';
import { setTokens, clearTokens, notifyAuthChange } from '../../stores/authStore.js';

const ROLE = 'admin';
const base = (path) => `/api/v1/admin${path}`;

// ── Auth ──────────────────────────────────────────────────────────

// Login — browser sends Origin header automatically (required by backend)
export async function adminLogin({ usernameOrEmail, password }) {
  const data = await api.post(base('/auth/login'), { usernameOrEmail, password });
  setTokens(ROLE, { accessToken: data.accessToken, refreshToken: data.refreshToken });
  notifyAuthChange();
  return data; // { accessToken, refreshToken, expiresIn, securityVersion }
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
// Returns: { totalRsvps, attendingCount, notAttendingCount, maybeCount,
//            totalPhotos, pendingPhotos, approvedPhotos }
export function getAdminDashboard(weddingId) {
  return api.get(base(`/weddings/${weddingId}/dashboard`), { role: ROLE });
}

// ── Wedding config ────────────────────────────────────────────────
// All fields optional — only send what changed
export function updateWeddingConfig(weddingId, config) {
  return api.put(base(`/weddings/${weddingId}/config`), config, { role: ROLE });
}

// ── Photo moderation ──────────────────────────────────────────────

// All pending photos across this admin's weddings
export function getPendingPhotos() {
  return api.get(base('/photos/pending'), { role: ROLE });
}

export function approvePhoto(photoId) {
  return api.post(base(`/photos/${photoId}/approve`), null, { role: ROLE });
}

export function rejectPhoto(photoId) {
  return api.post(base(`/photos/${photoId}/reject`), null, { role: ROLE });
}

// photoIds: string[]
export function bulkApprovePhotos(photoIds) {
  return api.post(base('/photos/bulk-approve'), photoIds, { role: ROLE });
}

// Enables auto-approve and approves ALL currently pending photos
export function enableAutoApprove(weddingId) {
  return api.post(base(`/weddings/${weddingId}/photos/auto-approve`), null, { role: ROLE });
}

// ── RSVPs ─────────────────────────────────────────────────────────
export function getAdminRsvps(weddingId) {
  return api.get(base(`/weddings/${weddingId}/rsvp`), { role: ROLE });
}
