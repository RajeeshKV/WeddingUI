import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, LogIn, Shield } from 'lucide-react';
import { suLogin } from '../../services/api/su.js';

export function SuLogin() {
  const [form,    setForm]    = useState({ usernameOrEmail: '', password: '' });
  const [show,    setShow]    = useState(false);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await suLogin(form);
    } catch {
      setError('Invalid credentials or this origin is not whitelisted.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 24, background: 'linear-gradient(135deg, #0F0D0C 0%, #1A1410 100%)' }}
    >
      <motion.div
        initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.6 }}
        style={{ width: '100%', maxWidth: 400, background: '#1C1814', borderRadius: 6,
          padding: '40px 36px', border: '1px solid rgba(255,255,255,0.07)' }}
      >
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ width: 48, height: 48, borderRadius: '50%', margin: '0 auto 14px',
            background: 'linear-gradient(135deg, #3A2A18, #5A3A1A)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: '1px solid rgba(201,168,76,0.3)' }}>
            <Shield size={20} color="#C9A84C" />
          </div>
          <h1 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 26,
            fontWeight: 600, color: '#F5E8D0', margin: 0 }}>
            Super User
          </h1>
          <p style={{ fontSize: 12, color: '#7A6A50', marginTop: 6 }}>
            Platform administration
          </p>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <label style={labelSu}>
            Username or email
            <input type="text" autoComplete="username" required
              value={form.usernameOrEmail}
              onChange={e => setForm(f => ({ ...f, usernameOrEmail: e.target.value }))}
              style={inputSu} placeholder="superuser" aria-required="true" />
          </label>

          <label style={{ ...labelSu, marginTop: 16 }}>
            Password
            <div style={{ position: 'relative' }}>
              <input type={show ? 'text' : 'password'} autoComplete="current-password" required
                value={form.password}
                onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                style={{ ...inputSu, paddingRight: 44 }} placeholder="••••••••" aria-required="true" />
              <button type="button" onClick={() => setShow(v => !v)}
                aria-label={show ? 'Hide password' : 'Show password'}
                style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', cursor: 'pointer', color: '#7A6A50', padding: 4 }}>
                {show ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </label>

          {error && (
            <p role="alert" style={{ fontSize: 12, color: '#C44040', marginTop: 10 }}>{error}</p>
          )}

          <button type="submit" disabled={loading}
            style={{ width: '100%', marginTop: 24, padding: 13,
              background: loading ? '#3A2A18' : 'linear-gradient(135deg, #8B6A1E, #C9A84C)',
              color: '#0F0D0C', border: 'none', borderRadius: 4, fontSize: 13, fontWeight: 700,
              cursor: loading ? 'not-allowed' : 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
            <LogIn size={16} aria-hidden="true" />
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
      </motion.div>
    </motion.div>
  );
}

const labelSu = { display: 'block', fontSize: 11, fontWeight: 600, color: '#9A8A6A', letterSpacing: '0.06em' };
const inputSu  = {
  display: 'block', width: '100%', marginTop: 6,
  padding: '11px 13px', fontSize: 13,
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: 4, background: '#13100D', color: '#F5E8D0',
  outline: 'none', boxSizing: 'border-box',
  fontFamily: "'Jost', sans-serif",
};
