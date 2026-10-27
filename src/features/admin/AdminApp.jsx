import React, { useState, useEffect, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import {
  isAuthenticated,
  subscribeAuth,
  getRefreshToken,
  initFromStorage,
  notifyAuthChange,
  getWeddingIdFromToken,
} from '../../stores/authStore.js';
import { refreshAccessToken } from '../../services/api/client.js';
import { adminLogout, getAdminMe } from '../../services/api/admin.js';
import { AdminLogin }     from './AdminLogin.jsx';
import { AdminDashboard } from './AdminDashboard.jsx';

export function AdminApp() {
  // 'loading' while we attempt silent restore, then 'ready'
  const [status,  setStatus]  = useState('loading');
  const [authed,  setAuthed]  = useState(false);
  const [me,      setMe]      = useState(null);
  const [mustChange, setMustChange] = useState(false);
  const [page,    setPage]    = useState('dashboard');

  // Subscribe to auth-change events (e.g. 401 from API client)
  useEffect(() => subscribeAuth(() => {
    const ok = isAuthenticated('admin');
    setAuthed(ok);
    if (!ok) { setMe(null); setMustChange(false); }
  }), []);

  // On mount — restore from localStorage and silently refresh if needed
  useEffect(() => {
    const restore = async () => {
      const hadToken = initFromStorage('admin'); // loads saved tokens into memory

      if (!hadToken) {
        setStatus('ready');
        return;
      }

      if (isAuthenticated('admin')) {
        // Token is still valid
        setAuthed(true);
        setStatus('ready');
        fetchMe();
        return;
      }

      // Token expired — try silent refresh
      const rt = getRefreshToken('admin');
      if (rt) {
        try {
          await refreshAccessToken('admin');
          setAuthed(true);
          notifyAuthChange();
          fetchMe();
        } catch {
          // Refresh failed — must log in again
        }
      }
      setStatus('ready');
    };

    restore();
  }, []); // eslint-disable-line

  const fetchMe = async () => {
    try {
      const data = await getAdminMe();
      setMe(data);
      setMustChange(data.mustChangePassword || false);
    } catch { /* handled by 401 interceptor */ }
  };

  const handleLoginSuccess = useCallback((data) => {
    setAuthed(true);
    setMustChange(data.mustChangePassword || false);
    fetchMe();
  }, []);

  const handleLogout = useCallback(async () => {
    const rt = getRefreshToken('admin');
    await adminLogout(rt);
    setAuthed(false);
    setMe(null);
    setMustChange(false);
    setPage('dashboard');
  }, []);

  // Full-page spinner while restoring session
  if (status === 'loading') {
    return (
      <div style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center',
        justifyContent: 'center', background: '#F8F7F5',
        fontFamily: "'Jost', sans-serif", color: '#9A9088', fontSize: 13,
      }}>
        Restoring session…
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#F8F7F5', fontFamily: "'Jost', sans-serif" }}>
      <AnimatePresence mode="wait">
        {!authed ? (
          <AdminLogin key="login" onSuccess={handleLoginSuccess} />
        ) : (
          <AdminDashboard
            key="dash"
            me={me}
            mustChange={mustChange}
            onMustChangeResolved={() => setMustChange(false)}
            onLogout={handleLogout}
            page={page}
            setPage={setPage}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
