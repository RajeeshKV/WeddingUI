/**
 * Centralized API client
 *
 * - Reads access token from localStorage via authStore (survives refresh)
 * - Proactively refreshes when stored token is expired before each request
 * - 401 response → silent refresh → one retry
 * - If refresh fails → clears tokens + notifies UI
 */

import {
  getAccessToken,
  getRefreshToken,
  setTokens,
  clearTokens,
  notifyAuthChange,
  isTokenExpired,
} from '../../stores/authStore.js';

const BASE = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '');

// ── Error class ───────────────────────────────────────────────────

export class ApiError extends Error {
  constructor(status, message, body) {
    super(message);
    this.name   = 'ApiError';
    this.status = status;
    this.body   = body;
  }
}

// ── Token refresh — deduplicates concurrent calls ─────────────────

const _refreshing = { admin: null, su: null };

export async function refreshAccessToken(role) {
  // Return existing in-flight promise to deduplicate
  if (_refreshing[role]) return _refreshing[role];

  _refreshing[role] = (async () => {
    const refreshToken = getRefreshToken(role);
    if (!refreshToken) throw new Error('No refresh token stored');

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
      refreshToken: data.refreshToken, // rotated token
    });
    notifyAuthChange();
    return data.accessToken;
  })().finally(() => { _refreshing[role] = null; });

  return _refreshing[role];
}

// ── Core request ──────────────────────────────────────────────────

export async function request(method, path, options = {}) {
  const {
    role = null,
    body,
    params,
    headers: extraHeaders = {},
    _isRetry = false,
  } = options;

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
  if (!isFormData) headers['Content-Type'] = 'application/json';
  // Browsers send Origin automatically — never set it manually

  if (role) {
    let token = getAccessToken(role);

    // Proactively refresh if token is expired before sending the request
    if (token && isTokenExpired(token) && !_isRetry) {
      try {
        token = await refreshAccessToken(role);
      } catch {
        clearTokens(role);
        notifyAuthChange();
        throw new ApiError(401, 'Session expired. Please log in again.', null);
      }
    }

    if (token) headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(url.toString(), {
    method,
    headers,
    body: body ? (isFormData ? body : JSON.stringify(body)) : undefined,
  });

  // 401 → try refresh once (handles cases where server rejects before our local check)
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

  // Parse response
  const ct = res.headers.get('content-type') || '';
  let responseBody = null;
  if (res.status !== 204) {
    responseBody = ct.includes('application/json')
      ? await res.json()
      : await res.text();
  }

  if (!res.ok) {
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
  get:    (path, opts)       => request('GET',    path, opts),
  post:   (path, body, opts) => request('POST',   path, { ...opts, body }),
  put:    (path, body, opts) => request('PUT',    path, { ...opts, body }),
  patch:  (path, body, opts) => request('PATCH',  path, { ...opts, body }),
  delete: (path, opts)       => request('DELETE', path, opts),
};

export default api;
