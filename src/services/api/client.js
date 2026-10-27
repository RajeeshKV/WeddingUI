/**
 * Centralized API client
 *
 * Features:
 *  - Single base URL from VITE_API_BASE_URL
 *  - Automatic Authorization header injection
 *  - 401 → silent token refresh → one retry
 *  - If refresh fails → clears tokens + fires auth-change event
 *  - Normalised error objects (never leaks stack traces)
 *  - Handles JSON and FormData bodies
 */

import {
  getAccessToken,
  getRefreshToken,
  setTokens,
  clearTokens,
  notifyAuthChange,
} from '../../stores/authStore.js';

const BASE = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '');

// ── Error class ───────────────────────────────────────────────────

export class ApiError extends Error {
  constructor(status, message, body) {
    super(message);
    this.name    = 'ApiError';
    this.status  = status;
    this.body    = body;
  }
}

// ── Token refresh ─────────────────────────────────────────────────

let _refreshPromise = null; // deduplicate concurrent refresh calls

async function refreshAccessToken(role) {
  if (_refreshPromise) return _refreshPromise;

  _refreshPromise = (async () => {
    const refreshToken = getRefreshToken(role);
    if (!refreshToken) throw new Error('No refresh token');

    const endpoint = role === 'su'
      ? '/api/v1/su/auth/refresh'
      : '/api/v1/admin/auth/refresh';

    const res = await fetch(`${BASE}${endpoint}`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ refreshToken }),
    });

    if (!res.ok) throw new Error('Refresh failed');

    const data = await res.json();
    setTokens(role, {
      accessToken:  data.accessToken,
      refreshToken: data.refreshToken,
    });
    return data.accessToken;
  })()
    .finally(() => { _refreshPromise = null; });

  return _refreshPromise;
}

// ── Core request ──────────────────────────────────────────────────

/**
 * request(method, path, options)
 *
 * options:
 *   role        — 'admin' | 'su' | null (public)
 *   body        — object (JSON) or FormData
 *   params      — query string object
 *   headers     — extra headers
 *   _isRetry    — internal flag to prevent infinite refresh loops
 */
export async function request(method, path, options = {}) {
  const { role = null, body, params, headers: extraHeaders = {}, _isRetry = false } = options;

  // Build URL
  const url = new URL(`${BASE}${path}`);
  if (params) {
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null) url.searchParams.set(k, v);
    });
  }

  // Build headers
  const headers = { ...extraHeaders };
  const isFormData = body instanceof FormData;

  if (!isFormData) {
    headers['Content-Type'] = 'application/json';
  }
  // Note: browsers send Origin automatically — do NOT set it manually

  if (role) {
    const token = getAccessToken(role);
    if (token) headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(url.toString(), {
    method,
    headers,
    body: body
      ? isFormData ? body : JSON.stringify(body)
      : undefined,
  });

  // ── 401 → try refresh once ──────────────────────────────────────
  if (res.status === 401 && role && !_isRetry) {
    try {
      await refreshAccessToken(role);
      return request(method, path, { ...options, _isRetry: true });
    } catch {
      clearTokens(role);
      notifyAuthChange();
      throw new ApiError(401, 'Session expired. Please log in again.', null);
    }
  }

  // ── Parse response ──────────────────────────────────────────────
  const contentType = res.headers.get('content-type') || '';
  let responseBody = null;

  if (res.status !== 204) {
    if (contentType.includes('application/json')) {
      responseBody = await res.json();
    } else {
      responseBody = await res.text();
    }
  }

  if (!res.ok) {
    // Extract a human-readable message without exposing stack traces
    const message =
      (typeof responseBody === 'object' && responseBody?.message) ||
      (typeof responseBody === 'string' && responseBody) ||
      `Request failed (${res.status})`;
    throw new ApiError(res.status, message, responseBody);
  }

  return responseBody;
}

// ── Convenience wrappers ──────────────────────────────────────────

export const api = {
  get:    (path, opts)        => request('GET',    path, opts),
  post:   (path, body, opts)  => request('POST',   path, { ...opts, body }),
  put:    (path, body, opts)  => request('PUT',    path, { ...opts, body }),
  patch:  (path, body, opts)  => request('PATCH',  path, { ...opts, body }),
  delete: (path, opts)        => request('DELETE', path, opts),
};

export default api;
