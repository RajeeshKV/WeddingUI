/**
 * authStore.js
 *
 * In-memory token storage for Admin and Super User sessions.
 * Access tokens are NEVER written to localStorage.
 * Refresh tokens are stored in sessionStorage as the safest
 * browser-accessible option (cleared on tab close, not readable
 * by service workers or other origins).
 *
 * Two separate namespaces: "admin" and "su" — they never share tokens.
 */

const REFRESH_KEYS = {
  admin: 'wedding_admin_refresh',
  su:    'wedding_su_refresh',
};

// In-memory access tokens — wiped on page refresh (intentional).
const _access = { admin: null, su: null };

// ── Setters ───────────────────────────────────────────────────────

export function setTokens(role, { accessToken, refreshToken }) {
  _access[role] = accessToken;
  if (refreshToken) {
    try {
      sessionStorage.setItem(REFRESH_KEYS[role], refreshToken);
    } catch {
      // sessionStorage blocked (private mode edge cases) — fail silently
    }
  }
}

export function clearTokens(role) {
  _access[role] = null;
  try { sessionStorage.removeItem(REFRESH_KEYS[role]); } catch { /* */ }
}

export function clearAllTokens() {
  clearTokens('admin');
  clearTokens('su');
}

// ── Getters ───────────────────────────────────────────────────────

export function getAccessToken(role) {
  return _access[role];
}

export function getRefreshToken(role) {
  try { return sessionStorage.getItem(REFRESH_KEYS[role]); } catch { return null; }
}

export function isAuthenticated(role) {
  return Boolean(_access[role]);
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
