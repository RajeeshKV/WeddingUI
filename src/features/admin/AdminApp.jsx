import React, { useState, useEffect, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { isAuthenticated, subscribeAuth, getRefreshToken } from '../../stores/authStore.js';
import { getAdminMe, adminLogout } from '../../services/api/admin.js';
import { AdminLogin }     from './AdminLogin.jsx';
import { AdminDashboard } from './AdminDashboard.jsx';

export function AdminApp() {
  const [authed,      setAuthed]      = useState(() => isAuthenticated('admin'));
  const [me,          setMe]          = useState(null);
  const [weddingId,   setWeddingId]   = useState(null);
  const [mustChange,  setMustChange]  = useState(false);
  const [page,        setPage]        = useState('dashboard'); // dashboard | photos | config | password

  // Keep authed state in sync with token store
  useEffect(() => subscribeAuth(() => setAuthed(isAuthenticated('admin'))), []);

  // Fetch /me after login
  useEffect(() => {
    if (!authed) { setMe(null); setWeddingId(null); return; }
    getAdminMe()
      .then(data => {
        setMe(data);
        setMustChange(data.mustChangePassword || false);
        // The admin owns exactly one wedding — we'll discover its ID from the dashboard call
      })
      .catch(() => { /* token may have expired — authStore will handle */ });
  }, [authed]);

  const handleLogout = useCallback(async () => {
    await adminLogout(getRefreshToken('admin'));
  }, []);

  const handleLoginSuccess = useCallback((data) => {
    setMustChange(data.mustChangePassword || false);
  }, []);

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
