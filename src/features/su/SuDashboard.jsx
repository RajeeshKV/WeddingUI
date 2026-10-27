import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Shield, LogOut, Plus, Trash2, ToggleLeft, ToggleRight,
  Copy, Check, ChevronDown, ChevronUp, Loader2, Users, Link,
} from 'lucide-react';
import {
  listAdmins, createAdmin, listFrontendUrls,
  addFrontendUrl, toggleFrontendUrl, deleteFrontendUrl,
} from '../../services/api/su.js';

// ── Shared primitives ─────────────────────────────────────────────
const Card = ({ children, style }) => (
  <div style={{ background: '#1C1814', border: '1px solid rgba(255,255,255,0.06)',
    borderRadius: 6, padding: 24, ...style }}>
    {children}
  </div>
);

const Spinner = () => (
  <div style={{ display: 'flex', justifyContent: 'center', padding: 40 }}>
    <Loader2 size={24} style={{ animation: 'spin 1s linear infinite', color: '#7A6A50' }} />
  </div>
);

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    });
  };
  return (
    <button onClick={copy} title="Copy to clipboard"
      style={{ background: 'none', border: 'none', cursor: 'pointer',
        color: copied ? '#C9A84C' : '#7A6A50', padding: '3px 6px', borderRadius: 3 }}>
      {copied ? <Check size={13} /> : <Copy size={13} />}
    </button>
  );
}

// ── Frontend URL manager ──────────────────────────────────────────
function FrontendUrls({ adminId }) {
  const [urls,    setUrls]    = useState([]);
  const [loading, setLoading] = useState(true);
  const [newUrl,  setNewUrl]  = useState('');
  const [busy,    setBusy]    = useState(false);
  const [msg,     setMsg]     = useState('');
  const [error,   setError]   = useState('');

  const load = () => {
    setLoading(true);
    listFrontendUrls(adminId)
      .then(setUrls)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(load, [adminId]);

  const add = async (e) => {
    e.preventDefault();
    if (!newUrl.trim()) return;
    setBusy(true); setMsg(''); setError('');
    try {
      await addFrontendUrl(adminId, newUrl.trim());
      setNewUrl('');
      setMsg('URL added.');
      load();
    } catch (err) { setError(err.message || 'Failed to add URL.'); }
    finally { setBusy(false); }
  };

  const toggle = async (urlId) => {
    setBusy(true);
    try { await toggleFrontendUrl(adminId, urlId); load(); }
    catch (err) { setError(err.message); }
    finally { setBusy(false); }
  };

  const remove = async (urlId) => {
    if (!window.confirm('Remove this URL from the allowlist?')) return;
    setBusy(true);
    try { await deleteFrontendUrl(adminId, urlId); load(); }
    catch (err) { setError(err.message); }
    finally { setBusy(false); }
  };

  if (loading) return <Spinner />;

  return (
    <div style={{ marginTop: 16 }}>
      <form onSubmit={add} style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
        <input type="url" value={newUrl} required placeholder="https://app.vercel.app"
          onChange={e => setNewUrl(e.target.value)}
          style={{ ...suInput, flex: 1 }}
          aria-label="New frontend URL" />
        <button type="submit" disabled={busy} style={suBtn('#C9A84C', '#0F0D0C')}>
          <Plus size={14} /> Add
        </button>
      </form>
      {msg   && <p style={{ fontSize: 11, color: '#C9A84C', marginBottom: 8 }} role="status">{msg}</p>}
      {error && <p style={{ fontSize: 11, color: '#C44040', marginBottom: 8 }} role="alert">{error}</p>}

      {urls.length === 0 ? (
        <p style={{ fontSize: 12, color: '#5A4A38' }}>No URLs whitelisted yet.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {urls.map(u => (
            <div key={u.id} style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '9px 12px', borderRadius: 4,
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.06)',
              opacity: u.isEnabled === false ? 0.5 : 1,
            }}>
              <span style={{ flex: 1, fontSize: 12, color: '#D4B88A', wordBreak: 'break-all' }}>
                {u.url}
              </span>
              <CopyButton text={u.url} />
              <button onClick={() => toggle(u.id)} disabled={busy} title={u.isEnabled ? 'Disable' : 'Enable'}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#7A6A50', padding: 4 }}>
                {u.isEnabled !== false ? <ToggleRight size={18} color="#C9A84C" /> : <ToggleLeft size={18} />}
              </button>
              <button onClick={() => remove(u.id)} disabled={busy} title="Remove URL"
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#7A6A50', padding: 4 }}
                aria-label="Remove URL">
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Admin row ─────────────────────────────────────────────────────
function AdminRow({ admin }) {
  const [open, setOpen] = useState(false);
  const [slugCopied, setSlugCopied] = useState(false);

  const copySlug = () => {
    navigator.clipboard.writeText(admin.defaultWeddingSlug).then(() => {
      setSlugCopied(true);
      setTimeout(() => setSlugCopied(false), 1800);
    });
  };

  return (
    <Card style={{ marginBottom: 12, padding: 0 }}>
      <button
        onClick={() => setOpen(v => !v)}
        style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 14,
          padding: '16px 20px', background: 'none', border: 'none', cursor: 'pointer',
          textAlign: 'left' }}
        aria-expanded={open}
      >
        <div style={{ width: 36, height: 36, borderRadius: '50%',
          background: 'linear-gradient(135deg, #3A2A18, #5A3A1A)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0, fontSize: 14, fontWeight: 700,
          color: '#C9A84C', fontFamily: "'Cormorant Garamond',Georgia,serif" }}>
          {(admin.fullName || admin.username).charAt(0).toUpperCase()}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontSize: 14, fontWeight: 600, color: '#F5E8D0', margin: 0 }}>
            {admin.fullName}
          </p>
          <p style={{ fontSize: 11, color: '#7A6A50', margin: '2px 0 0' }}>
            @{admin.username} · {admin.email}
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.06em',
            background: admin.isActive ? 'rgba(16,185,129,0.15)' : 'rgba(220,38,38,0.15)',
            color: admin.isActive ? '#6EE7B7' : '#FCA5A5',
            borderRadius: 99, padding: '3px 9px' }}>
            {admin.isActive ? 'Active' : 'Inactive'}
          </span>
          {open ? <ChevronUp size={16} color="#7A6A50" /> : <ChevronDown size={16} color="#7A6A50" />}
        </div>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }}
            style={{ overflow: 'hidden' }}>
            <div style={{ padding: '0 20px 20px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>

              {/* Slug row */}
              <div style={{ marginTop: 14, padding: '10px 14px',
                background: 'rgba(201,168,76,0.07)', borderRadius: 4,
                border: '1px solid rgba(201,168,76,0.2)' }}>
                <p style={{ fontSize: 10, fontWeight: 600, color: '#9A8A6A', margin: '0 0 4px', letterSpacing: '0.08em' }}>
                  VITE_WEDDING_SLUG
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <code style={{ flex: 1, fontSize: 12, color: '#C9A84C', wordBreak: 'break-all' }}>
                    {admin.defaultWeddingSlug}
                  </code>
                  <button onClick={copySlug}
                    style={{ background: 'none', border: 'none', cursor: 'pointer',
                      color: slugCopied ? '#C9A84C' : '#7A6A50', padding: '3px 6px' }}>
                    {slugCopied ? <Check size={14} /> : <Copy size={14} />}
                  </button>
                </div>
                <p style={{ fontSize: 10, color: '#5A4A38', margin: '6px 0 0' }}>
                  Copy this to the couple's public frontend .env
                </p>
              </div>

              {/* Frontend URLs */}
              <div style={{ marginTop: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <Link size={14} color="#7A6A50" aria-hidden="true" />
                  <p style={{ fontSize: 12, fontWeight: 600, color: '#9A8A6A', margin: 0 }}>
                    Whitelisted Frontend Origins
                  </p>
                </div>
                <p style={{ fontSize: 11, color: '#5A4A38', margin: '0 0 8px' }}>
                  Add every domain this admin's panel will be deployed on (prod + preview + custom).
                </p>
                <FrontendUrls adminId={admin.id} />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}

// ── Create Admin form ─────────────────────────────────────────────
function CreateAdminForm({ onCreated }) {
  const [form,    setForm]    = useState({ fullName: '', username: '', email: '' });
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      const admin = await createAdmin(form);
      setForm({ fullName: '', username: '', email: '' });
      onCreated(admin);
    } catch (err) {
      setError(err.message || 'Failed to create admin.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card style={{ marginBottom: 28 }}>
      <h3 style={{ fontFamily: "'Cormorant Garamond',Georgia,serif", fontSize: 20,
        fontWeight: 600, color: '#F5E8D0', margin: '0 0 20px' }}>
        Create Admin (Tenant)
      </h3>
      <form onSubmit={handleSubmit}
        style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 14 }}>
        {[
          { key: 'fullName', label: 'Full name',    placeholder: 'Rahul & Priya',    type: 'text'  },
          { key: 'username', label: 'Username',     placeholder: 'rahulpriya',       type: 'text'  },
          { key: 'email',    label: 'Email',        placeholder: 'rahul@example.com',type: 'email' },
        ].map(({ key, label, placeholder, type }) => (
          <label key={key} style={suLabel}>
            {label}
            <input type={type} required value={form[key]} placeholder={placeholder}
              onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
              style={suInput} aria-required="true" />
          </label>
        ))}
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 10 }}>
          {error && <p style={{ fontSize: 11, color: '#C44040', flex: 1 }} role="alert">{error}</p>}
          <button type="submit" disabled={loading} style={suBtn('#C9A84C', '#0F0D0C')}>
            {loading ? <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> : <Plus size={14} />}
            {loading ? 'Creating…' : 'Create admin'}
          </button>
        </div>
      </form>
      <p style={{ fontSize: 11, color: '#5A4A38', marginTop: 12 }}>
        A temporary password will be emailed to the admin. Copy their wedding slug after creation.
      </p>
    </Card>
  );
}

// ── Main SU Dashboard ─────────────────────────────────────────────
export function SuDashboard({ onLogout }) {
  const [admins,  setAdmins]  = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState('');

  const load = () => {
    setLoading(true);
    listAdmins()
      .then(setAdmins)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleCreated = (admin) => {
    setAdmins(prev => [admin, ...prev]);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      {/* Top bar */}
      <header style={{
        position: 'sticky', top: 0, zIndex: 30,
        background: 'rgba(15,13,12,0.95)', backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 clamp(16px,4vw,40px)', height: 64,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Shield size={18} color="#C9A84C" aria-hidden="true" />
          <span style={{ fontFamily: "'Cormorant Garamond',Georgia,serif",
            fontSize: 20, fontWeight: 600, color: '#F5E8D0' }}>
            Super User Panel
          </span>
        </div>
        <button onClick={onLogout}
          style={{ display: 'flex', alignItems: 'center', gap: 6,
            background: 'none', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 4,
            color: '#9A8A6A', fontSize: 12, padding: '7px 12px', cursor: 'pointer' }}>
          <LogOut size={14} /> Sign out
        </button>
      </header>

      {/* Content */}
      <main style={{ maxWidth: 900, margin: '0 auto', padding: '32px clamp(16px,4vw,40px) 80px' }}>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 28 }}>
          <Users size={20} color="#C9A84C" aria-hidden="true" />
          <h1 style={{ fontFamily: "'Cormorant Garamond',Georgia,serif",
            fontSize: 28, fontWeight: 600, color: '#F5E8D0', margin: 0 }}>
            Admins
          </h1>
          <span style={{ fontSize: 12, color: '#5A4A38', marginLeft: 4 }}>
            {!loading && `(${admins.length})`}
          </span>
        </div>

        <CreateAdminForm onCreated={handleCreated} />

        {loading && <Spinner />}
        {error   && <p style={{ color: '#C44040', fontSize: 13 }} role="alert">{error}</p>}

        {!loading && !error && admins.length === 0 && (
          <p style={{ color: '#5A4A38', fontSize: 13 }}>No admins yet. Create one above.</p>
        )}

        {admins.map(admin => (
          <AdminRow key={admin.id} admin={admin} />
        ))}
      </main>

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </motion.div>
  );
}

// ── Shared styles ─────────────────────────────────────────────────
const suLabel = { display: 'block', fontSize: 11, fontWeight: 600, color: '#9A8A6A', letterSpacing: '0.06em' };
const suInput = {
  display: 'block', width: '100%', marginTop: 6,
  padding: '10px 12px', fontSize: 12,
  border: '1px solid rgba(255,255,255,0.08)', borderRadius: 4,
  background: '#13100D', color: '#F5E8D0',
  outline: 'none', boxSizing: 'border-box',
  fontFamily: "'Jost', sans-serif",
};
const suBtn = (bg, color = '#fff') => ({
  display: 'inline-flex', alignItems: 'center', gap: 7,
  padding: '10px 16px', border: 'none', borderRadius: 4,
  background: bg, color, fontSize: 12, fontWeight: 700,
  cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0,
});
