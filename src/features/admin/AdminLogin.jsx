import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, LogIn, Heart } from 'lucide-react';
import { adminLogin } from '../../services/api/admin.js';

export function AdminLogin({ onSuccess }) {
  const [form,    setForm]    = useState({ usernameOrEmail: '', password: '' });
  const [show,    setShow]    = useState(false);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await adminLogin(form);
      onSuccess(data);
    } catch (err) {
      // Always show generic message — never leak whether user exists
      setError('Invalid username/email or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center',
        justifyContent: 'center', padding: '24px',
        background: 'linear-gradient(135deg, #F5F0EC 0%, #EDE8E0 100%)',
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.6, ease: [0.2, 0.8, 0.2, 1] }}
        style={{
          width: '100%', maxWidth: 420,
          background: '#FFFFFF', borderRadius: 6,
          padding: '40px 36px',
          boxShadow: '0 4px 6px rgba(0,0,0,0.04), 0 20px 50px rgba(0,0,0,0.08)',
        }}
      >
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{
            width: 48, height: 48, borderRadius: '50%', margin: '0 auto 14px',
            background: 'linear-gradient(135deg, #E8D8E0, #C4A6B2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Heart size={20} fill="white" color="white" />
          </div>
          <h1 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 26, fontWeight: 600, color: '#1A1A1A', margin: 0 }}>
            Admin Panel
          </h1>
          <p style={{ fontSize: 12, color: '#9A9088', marginTop: 6 }}>
            Sign in to manage your wedding
          </p>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <label style={labelStyle}>
            Username or email
            <input
              type="text"
              autoComplete="username"
              value={form.usernameOrEmail}
              onChange={e => setForm(f => ({ ...f, usernameOrEmail: e.target.value }))}
              required
              style={inputStyle}
              placeholder="your@email.com"
              aria-required="true"
            />
          </label>

          <label style={{ ...labelStyle, marginTop: 16, position: 'relative' }}>
            Password
            <div style={{ position: 'relative' }}>
              <input
                type={show ? 'text' : 'password'}
                autoComplete="current-password"
                value={form.password}
                onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                required
                style={{ ...inputStyle, paddingRight: 44 }}
                placeholder="••••••••"
                aria-required="true"
              />
              <button type="button" onClick={() => setShow(v => !v)}
                aria-label={show ? 'Hide password' : 'Show password'}
                style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', cursor: 'pointer', color: '#9A9088', padding: 4 }}>
                {show ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </label>

          {error && (
            <p role="alert" style={{ fontSize: 12, color: '#C44040', marginTop: 10, marginBottom: 0 }}>
              {error}
            </p>
          )}

          <button type="submit" disabled={loading}
            style={{
              width: '100%', marginTop: 24, padding: '13px',
              background: loading ? '#C4A6B2' : '#8B6E7F',
              color: '#fff', border: 'none', borderRadius: 4,
              fontSize: 13, fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              transition: 'background 0.2s',
            }}>
            <LogIn size={16} aria-hidden="true" />
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        <p style={{ fontSize: 11, color: '#B0A898', textAlign: 'center', marginTop: 20 }}>
          Forgot your password? Contact your super user.
        </p>
      </motion.div>
    </motion.div>
  );
}

const labelStyle = {
  display: 'block', fontSize: 11, fontWeight: 600,
  color: '#4A4540', letterSpacing: '0.04em',
};
const inputStyle = {
  display: 'block', width: '100%', marginTop: 6,
  padding: '11px 13px', fontSize: 13,
  border: '1px solid #E0DAD4', borderRadius: 4,
  background: '#FAFAF8', color: '#1A1A1A',
  outline: 'none', boxSizing: 'border-box',
  fontFamily: "'Jost', sans-serif",
};
