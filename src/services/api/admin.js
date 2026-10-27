/**
 * Admin API service — routes strictly matching the OpenAPI spec.
 * All authenticated endpoints under /api/v1/admin/
 * Role: 'admin'
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
  return data;
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
// GET /api/v1/admin/weddings/{weddingId}/dashboard
export function getAdminDashboard(weddingId) {
  return api.get(base(`/weddings/${weddingId}/dashboard`), { role: ROLE });
}

// ── Wedding config ────────────────────────────────────────────────
// GET /api/v1/admin/weddings/{weddingId}/config
export function getAdminWeddingConfig(weddingId) {
  return api.get(base(`/weddings/${weddingId}/config`), { role: ROLE });
}

// PUT /api/v1/admin/weddings/{weddingId}/config
export function updateWeddingConfig(weddingId, config) {
  return api.put(base(`/weddings/${weddingId}/config`), config, { role: ROLE });
}

// ── Photos ────────────────────────────────────────────────────────
// GET /api/v1/admin/photos — all photos across admin's weddings
export function getAllAdminPhotos() {
  return api.get(base('/photos'), { role: ROLE });
}

// GET /api/v1/admin/photos/pending — pending only
export function getPendingPhotos() {
  return api.get(base('/photos/pending'), { role: ROLE });
}

// GET /api/v1/admin/weddings/{weddingId}/photos — all photos for one wedding
export function getWeddingPhotos(weddingId) {
  return api.get(base(`/weddings/${weddingId}/photos`), { role: ROLE });
}

// POST /api/v1/admin/photos/{photoId}/approve
export function approvePhoto(photoId) {
  return api.post(base(`/photos/${photoId}/approve`), null, { role: ROLE });
}

// POST /api/v1/admin/photos/{photoId}/reject
export function rejectPhoto(photoId) {
  return api.post(base(`/photos/${photoId}/reject`), null, { role: ROLE });
}

// DELETE /api/v1/admin/photos/{photoId}
export function deletePhoto(photoId) {
  return api.delete(base(`/photos/${photoId}`), { role: ROLE });
}

// POST /api/v1/admin/photos/bulk-approve  body: string[] (UUID array)
export function bulkApprovePhotos(photoIds) {
  return api.post(base('/photos/bulk-approve'), photoIds, { role: ROLE });
}

// POST /api/v1/admin/weddings/{weddingId}/photos/auto-approve
export function enableAutoApprove(weddingId) {
  return api.post(base(`/weddings/${weddingId}/photos/auto-approve`), null, { role: ROLE });
}
