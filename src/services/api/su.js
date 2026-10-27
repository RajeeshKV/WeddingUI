/**
 * Super User API service
 * Endpoints under /api/v1/su/
 * Role: 'su'
 *
 * Key fixes vs previous version:
 *  - toggle is POST not PUT (per spec)
 *  - admin response field is "slug" not "defaultWeddingSlug"
 *  - logout returns 204 (was 200)
 */

import api from './client.js';
import { setTokens, clearTokens, notifyAuthChange } from '../../stores/authStore.js';

const ROLE = 'su';
const base = (path) => `/api/v1/su${path}`;

// ── Bootstrap (one-time) ──────────────────────────────────────────
// POST /api/v1/su/bootstrap/create-su  → 204
export function bootstrapSu({ username, email, password }) {
  return api.post(base('/bootstrap/create-su'), { username, email, password });
}

// ── Auth ──────────────────────────────────────────────────────────

// POST /api/v1/su/auth/login
// Requires Origin/Referer header matching allowed origins (browser sends automatically)
// Returns: { accessToken, refreshToken, expiresIn }
export async function suLogin({ usernameOrEmail, password }) {
  const data = await api.post(base('/auth/login'), { usernameOrEmail, password });
  setTokens(ROLE, { accessToken: data.accessToken, refreshToken: data.refreshToken });
  notifyAuthChange();
  return data;
}

// POST /api/v1/su/auth/logout  → 204
export async function suLogout(refreshToken) {
  try {
    await api.post(base('/auth/logout'), { refreshToken }, { role: ROLE });
  } finally {
    clearTokens(ROLE);
    notifyAuthChange();
  }
}

// ── Admin management ──────────────────────────────────────────────

// GET /api/v1/su/admins
// Returns: [{ id, fullName, username, email, isActive, mustChangePassword, slug }]
// NOTE: field is "slug" (not "defaultWeddingSlug")
export function listAdmins() {
  return api.get(base('/admins'), { role: ROLE });
}

// POST /api/v1/su/admins
// Body: { fullName, username, email }
// Returns: TenantAdminResponse (same shape as above, including slug)
export function createAdmin({ fullName, username, email }) {
  return api.post(base('/admins'), { fullName, username, email }, { role: ROLE });
}

// ── Frontend URL allowlist ────────────────────────────────────────

// GET /api/v1/su/admins/{adminId}/frontend-urls
// Returns: [{ id, url, isActive, createdAtUtc }]
export function listFrontendUrls(adminId) {
  return api.get(base(`/admins/${adminId}/frontend-urls`), { role: ROLE });
}

// POST /api/v1/su/admins/{adminId}/frontend-urls  → 204
export function addFrontendUrl(adminId, url) {
  return api.post(base(`/admins/${adminId}/frontend-urls`), { url }, { role: ROLE });
}

// POST /api/v1/su/admins/{adminId}/frontend-urls/{urlId}/toggle  → 204
// NOTE: POST not PUT (per spec)
export function toggleFrontendUrl(adminId, urlId) {
  return api.post(base(`/admins/${adminId}/frontend-urls/${urlId}/toggle`), null, { role: ROLE });
}

// DELETE /api/v1/su/admins/{adminId}/frontend-urls/{urlId}  → 204
export function deleteFrontendUrl(adminId, urlId) {
  return api.delete(base(`/admins/${adminId}/frontend-urls/${urlId}`), { role: ROLE });
}
