/**
 * Super User API service
 * All authenticated endpoints under /api/v1/su/
 * Role: 'su'
 */

import api from './client.js';
import { setTokens, clearTokens, notifyAuthChange } from '../../stores/authStore.js';

const ROLE = 'su';
const base = (path) => `/api/v1/su${path}`;

// ── Bootstrap (one-time only) ─────────────────────────────────────
export function bootstrapSu({ username, email, password }) {
  return api.post(base('/bootstrap/create-su'), { username, email, password });
}

// ── Auth ──────────────────────────────────────────────────────────

export async function suLogin({ usernameOrEmail, password }) {
  const data = await api.post(base('/auth/login'), { usernameOrEmail, password });
  setTokens(ROLE, { accessToken: data.accessToken, refreshToken: data.refreshToken });
  notifyAuthChange();
  return data;
}

export async function suLogout(refreshToken) {
  try {
    await api.post(base('/auth/logout'), { refreshToken }, { role: ROLE });
  } finally {
    clearTokens(ROLE);
    notifyAuthChange();
  }
}

export async function suLogoutAll() {
  try {
    await api.post(base('/auth/logout-all'), null, { role: ROLE });
  } finally {
    clearTokens(ROLE);
    notifyAuthChange();
  }
}

// ── Admins (tenants) ──────────────────────────────────────────────

// Returns: [ { id, fullName, username, email, isActive,
//              mustChangePassword, defaultWeddingSlug } ]
export function listAdmins() {
  return api.get(base('/admins'), { role: ROLE });
}

// Returns the created admin object including defaultWeddingSlug
export function createAdmin({ fullName, username, email }) {
  return api.post(base('/admins'), { fullName, username, email }, { role: ROLE });
}

// ── Frontend URL allowlist ────────────────────────────────────────

export function listFrontendUrls(adminId) {
  return api.get(base(`/admins/${adminId}/frontend-urls`), { role: ROLE });
}

export function addFrontendUrl(adminId, url) {
  return api.post(base(`/admins/${adminId}/frontend-urls`), { url }, { role: ROLE });
}

export function toggleFrontendUrl(adminId, urlId) {
  return api.put(base(`/admins/${adminId}/frontend-urls/${urlId}/toggle`), null, { role: ROLE });
}

export function deleteFrontendUrl(adminId, urlId) {
  return api.delete(base(`/admins/${adminId}/frontend-urls/${urlId}`), { role: ROLE });
}
