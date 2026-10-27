import React, { useState, useEffect, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { isAuthenticated, subscribeAuth, getRefreshToken } from '../../stores/authStore.js';
import { suLogout } from '../../services/api/su.js';
import { SuLogin }     from './SuLogin.jsx';
import { SuDashboard } from './SuDashboard.jsx';

export function SuApp() {
  const [authed, setAuthed] = useState(() => isAuthenticated('su'));

  useEffect(() => subscribeAuth(() => setAuthed(isAuthenticated('su'))), []);

  const handleLogout = useCallback(async () => {
    await suLogout(getRefreshToken('su'));
  }, []);

  return (
    <div style={{ minHeight: '100vh', background: '#0F0D0C', fontFamily: "'Jost', sans-serif" }}>
      <AnimatePresence mode="wait">
        {!authed
          ? <SuLogin key="login" />
          : <SuDashboard key="dash" onLogout={handleLogout} />
        }
      </AnimatePresence>
    </div>
  );
}
