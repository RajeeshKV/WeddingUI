import React, { useState, useEffect, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import {
  isAuthenticated,
  subscribeAuth,
  getRefreshToken,
  initFromStorage,
  notifyAuthChange,
} from '../../stores/authStore.js';
import { refreshAccessToken } from '../../services/api/client.js';
import { suLogout } from '../../services/api/su.js';
import { SuLogin }     from './SuLogin.jsx';
import { SuDashboard } from './SuDashboard.jsx';

export function SuApp() {
  const [status, setStatus] = useState('loading');
  const [authed, setAuthed] = useState(false);

  useEffect(() => subscribeAuth(() => setAuthed(isAuthenticated('su'))), []);

  useEffect(() => {
    const restore = async () => {
      const hadToken = initFromStorage('su');

      if (!hadToken) { setStatus('ready'); return; }

      if (isAuthenticated('su')) {
        setAuthed(true);
        setStatus('ready');
        return;
      }

      const rt = getRefreshToken('su');
      if (rt) {
        try {
          await refreshAccessToken('su');
          setAuthed(true);
          notifyAuthChange();
        } catch { /* must log in again */ }
      }
      setStatus('ready');
    };

    restore();
  }, []); // eslint-disable-line

  const handleLogout = useCallback(async () => {
    await suLogout(getRefreshToken('su'));
    setAuthed(false);
  }, []);

  if (status === 'loading') {
    return (
      <div style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center',
        justifyContent: 'center', background: '#0F0D0C',
        fontFamily: "'Jost', sans-serif", color: '#7A6A50', fontSize: 13,
      }}>
        Restoring session…
      </div>
    );
  }

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
