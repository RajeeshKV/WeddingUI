/**
 * authStore.js
 *
 * Token storage for Admin and SU sessions.
 *
 * Storage strategy (per your instruction):
 *   accessToken  → localStorage  (survives page refresh)
 *   refreshToken → localStorage  (survives page refresh, used for silent re-auth)
 *
 * On every page load, initFromStorage(role) restores the saved tokens and
 * kicks off a silent refresh so a fresh access token is ready immediately.
 *
 * Two namespaces: "admin" and "su" — they never share storage keys.
 */

const KEYS = {
  admin: { access: 'w_admin_at', refresh: 'w_admin_rt' },
  su:    { access: 'w_su_at',    refresh: 'w_su_rt'    },
};

// In-memory copy of the current access token for fast synchronous reads
const _mem = { admin: null, su: null };

// ── JWT helpers ───────────────────────────────────────────────────

/**
 * Decode a JWT payload without verifying the signature.
 * Only used to read non-sensitive claims (tenantId, exp, etc.).
 */
export function decodeJwt(token) {
  try {
    const payload = token.split('.')[1];
    const json = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(json);
  } catch {
    return null;
  }
}

/** Return true if token is expired or expires within the next 30 seconds */
export function isTokenExpired(token) {
  const claims = decodeJwt(token);
  if (!claims?.exp) return true;
  return Date.now() / 1000 > claims.exp - 30;
}

/** Extract the weddingId (tenantId claim) from the stored admin access token */
export function getWeddingIdFromToken() {
  const token = _mem.admin || ls('get', KEYS.admin.access);
  if (!token) return null;
  const claims = decodeJwt(token);
  // Backend may use "tenantId", "weddingId", or "sub" depending on implementation
  return claims?.tenantId ?? claims?.weddingId ?? claims?.defaultWeddingId ?? null;
}

// ── localStorage helpers ──────────────────────────────────────────

function ls(op, key, value) {
  try {
    if (op === 'get')    return localStorage.getItem(key);
    if (op === 'set')    localStorage.setItem(key, value);
    if (op === 'remove') localStorage.removeItem(key);
  } catch { /* storage blocked in some privacy modes */ }
  return null;
}

// ── Setters ───────────────────────────────────────────────────────

export function setTokens(role, { accessToken, refreshToken }) {
  if (accessToken) {
    _mem[role] = accessToken;
    ls('set', KEYS[role].access, accessToken);
  }
  if (refreshToken) {
    ls('set', KEYS[role].refresh, refreshToken);
  }
}

export function clearTokens(role) {
  _mem[role] = null;
  ls('remove', KEYS[role].access);
  ls('remove', KEYS[role].refresh);
}

export function clearAllTokens() {
  clearTokens('admin');
  clearTokens('su');
}

// ── Getters ───────────────────────────────────────────────────────

export function getAccessToken(role) {
  // Prefer in-memory, fall back to localStorage
  return _mem[role] || ls('get', KEYS[role].access) || null;
}

export function getRefreshToken(role) {
  return ls('get', KEYS[role].refresh) || null;
}

export function isAuthenticated(role) {
  const token = getAccessToken(role);
  return Boolean(token && !isTokenExpired(token));
}

/**
 * Restore tokens from localStorage into memory on page load.
 * Returns true if a (possibly expired) access token was found,
 * so the caller knows to attempt a silent refresh.
 */
export function initFromStorage(role) {
  const at = ls('get', KEYS[role].access);
  if (at) { _mem[role] = at; return true; }
  return false;
}

// ── Listeners — notify UI when auth state changes ─────────────────

const listeners = new Set();

export function subscribeAuth(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export function notifyAuthChange() {
  listeners.forEach(fn => fn());
}
