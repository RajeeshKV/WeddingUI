import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Images, Settings, LogOut, Heart,
  Users, CheckCircle, XCircle, Clock, Check, X, ChevronDown,
  Key, AlertTriangle, Loader2,
} from 'lucide-react';
import {
  getAdminDashboard, getPendingPhotos, approvePhoto, rejectPhoto,
  bulkApprovePhotos, enableAutoApprove, updateWeddingConfig, changePassword,
  getAdminRsvps,
} from '../../services/api/admin.js';

// ── Shared primitives ─────────────────────────────────────────────

const Card = ({ children, style }) => (
  <div style={{
    background: '#FFFFFF', borderRadius: 6, padding: '24px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.06)',
    ...style,
  }}>{children}</div>
);

const StatCard = ({ label, value, icon: Icon, color = '#8B6E7F' }) => (
  <Card>
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <div>
        <p style={{ fontSize: 11, color: '#9A9088', fontWeight: 500, letterSpacing: '0.06em', margin: '0 0 6px', textTransform: 'uppercase' }}>{label}</p>
        <p style={{ fontSize: 32, fontWeight: 700, color: '#1A1A1A', margin: 0, fontFamily: "'Cormorant Garamond', Georgia, serif" }}>{value ?? '—'}</p>
      </div>
      <div style={{ width: 44, height: 44, borderRadius: '50%', background: `${color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Icon size={20} color={color} aria-hidden="true" />
      </div>
    </div>
  </Card>
);

const Spinner = () => (
  <div style={{ display: 'flex', justifyContent: 'center', padding: '48px 0' }}>
    <Loader2 size={28} style={{ animation: 'spin 1s linear infinite', color: '#9A9088' }} aria-label="Loading" />
  </div>
);

const Badge = ({ status }) => {
  const map = {
    Pending:    { bg: '#FEF3C7', color: '#92400E' },
    Approved:   { bg: '#D1FAE5', color: '#065F46' },
    Rejected:   { bg: '#FEE2E2', color: '#991B1B' },
    Attending:  { bg: '#D1FAE5', color: '#065F46' },
    NotAttending:{ bg: '#FEE2E2', color: '#991B1B' },
    Maybe:      { bg: '#FEF3C7', color: '#92400E' },
  };
  const s = map[status] || { bg: '#F3F4F6', color: '#374151' };
  return (
    <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.06em',
      background: s.bg, color: s.color, borderRadius: 99,
      padding: '3px 9px', whiteSpace: 'nowrap' }}>
      {status}
    </span>
  );
};

// ── Overview ──────────────────────────────────────────────────────
function Overview({ weddingId }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!weddingId) return;
    setLoading(true);
    getAdminDashboard(weddingId)
      .then(setStats)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, [weddingId]);

  if (loading) return <Spinner />;
  if (error)   return <p style={{ color: '#C44040', padding: 24 }}>{error}</p>;
  if (!stats)  return null;

  return (
    <div>
      <h2 style={headingStyle}>Overview</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 16, marginBottom: 28 }}>
        <StatCard label="Total RSVPs"     value={stats.totalRsvps}       icon={Users}       color="#8B6E7F" />
        <StatCard label="Attending"       value={stats.attendingCount}   icon={CheckCircle} color="#059669" />
        <StatCard label="Not Attending"   value={stats.notAttendingCount}icon={XCircle}     color="#DC2626" />
        <StatCard label="Maybe"           value={stats.maybeCount}       icon={Clock}       color="#D97706" />
        <StatCard label="Total Photos"    value={stats.totalPhotos}      icon={Images}      color="#2A7A8C" />
        <StatCard label="Pending Approval"value={stats.pendingPhotos}    icon={Clock}       color="#D97706" />
        <StatCard label="Approved Photos" value={stats.approvedPhotos}   icon={CheckCircle} color="#059669" />
      </div>
    </div>
  );
}

// ── Photo Moderation ──────────────────────────────────────────────
function PhotoModeration() {
  const [photos,   setPhotos]   = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState('');
  const [selected, setSelected] = useState(new Set());
  const [busy,     setBusy]     = useState(false);
  const [msg,      setMsg]      = useState('');

  const load = () => {
    setLoading(true); setMsg('');
    getPendingPhotos()
      .then(data => { setPhotos(data); setSelected(new Set()); })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const toggle = (id) => setSelected(prev => {
    const next = new Set(prev);
    next.has(id) ? next.delete(id) : next.add(id);
    return next;
  });

  const act = async (fn, successMsg) => {
    setBusy(true); setMsg('');
    try { await fn(); setMsg(successMsg); load(); }
    catch (e) { setMsg(e.message || 'Action failed.'); }
    finally { setBusy(false); }
  };

  const approveSingle  = (id) => act(() => approvePhoto(id), 'Photo approved.');
  const rejectSingle   = (id) => act(() => rejectPhoto(id), 'Photo rejected.');
  const approveSelected = () => act(() => bulkApprovePhotos([...selected]), `${selected.size} photo(s) approved.`);

  if (loading) return <Spinner />;
  if (error)   return <p style={{ color: '#C44040', padding: 24 }}>{error}</p>;

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, marginBottom: 20 }}>
        <h2 style={headingStyle}>Photo Moderation</h2>
        <div style={{ display: 'flex', gap: 8 }}>
          {selected.size > 0 && (
            <button onClick={approveSelected} disabled={busy} style={btnStyle('#059669')}>
              <Check size={14} /> Approve {selected.size} selected
            </button>
          )}
        </div>
      </div>

      {msg && <p style={{ fontSize: 12, color: '#059669', marginBottom: 12 }} role="status">{msg}</p>}

      {photos.length === 0 ? (
        <Card>
          <p style={{ textAlign: 'center', color: '#9A9088', padding: '32px 0' }}>
            No pending photos — you're all caught up! 🎉
          </p>
        </Card>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 16 }}>
          {photos.map(photo => (
            <Card key={photo.id} style={{ padding: 0, overflow: 'hidden' }}>
              <div style={{ position: 'relative' }}>
                <img src={photo.thumbnailUrl || photo.imageUrl} alt={`Photo by ${photo.uploadedByName || 'guest'}`}
                  style={{ width: '100%', aspectRatio: '4/3', objectFit: 'cover', display: 'block' }} loading="lazy" />
                <input type="checkbox" checked={selected.has(photo.id)}
                  onChange={() => toggle(photo.id)}
                  aria-label={`Select photo by ${photo.uploadedByName || 'guest'}`}
                  style={{ position: 'absolute', top: 10, left: 10, width: 18, height: 18, cursor: 'pointer', accentColor: '#8B6E7F' }} />
                <Badge status={photo.status} />
              </div>
              <div style={{ padding: '12px 14px' }}>
                <p style={{ fontSize: 11, color: '#6A6258', margin: '0 0 4px' }}>
                  By: <strong>{photo.uploadedByName || 'Anonymous'}</strong>
                </p>
                <p style={{ fontSize: 10, color: '#9A9088', margin: '0 0 12px' }}>
                  {new Date(photo.uploadedAtUtc).toLocaleString('en-IN', { dateStyle: 'short', timeStyle: 'short' })}
                </p>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button onClick={() => approveSingle(photo.id)} disabled={busy}
                    style={{ ...btnStyle('#059669'), flex: 1, padding: '7px 0' }}>
                    <Check size={13} /> Approve
                  </button>
                  <button onClick={() => rejectSingle(photo.id)} disabled={busy}
                    style={{ ...btnStyle('#DC2626'), flex: 1, padding: '7px 0' }}>
                    <X size={13} /> Reject
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Wedding Config Editor ─────────────────────────────────────────
function WeddingConfig({ weddingId }) {
  const [form, setForm] = useState({
    name: '', description: '', venue: '', eventDateUtc: '',
    heroImageUrl: '', rsvpEnabled: true, guestUploadsEnabled: true, autoApprovePhotos: false,
  });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');

  const save = async (e) => {
    e.preventDefault();
    setLoading(true); setMsg(''); setError('');
    try {
      const payload = {};
      Object.entries(form).forEach(([k, v]) => { if (v !== '') payload[k] = v; });
      await updateWeddingConfig(weddingId, payload);
      setMsg('Wedding details updated successfully.');
    } catch (err) {
      setError(err.message || 'Update failed.');
    } finally {
      setLoading(false);
    }
  };

  if (!weddingId) return <p style={{ padding: 24, color: '#9A9088' }}>Wedding ID not loaded yet.</p>;

  return (
    <div>
      <h2 style={headingStyle}>Wedding Settings</h2>
      <Card>
        <form onSubmit={save} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
          {[
            { key: 'name',         label: 'Wedding name',    type: 'text',     placeholder: 'Rahul & Priya Wedding' },
            { key: 'venue',        label: 'Venue',           type: 'text',     placeholder: 'Grand Hall, City' },
            { key: 'eventDateUtc', label: 'Event date (UTC)',type: 'datetime-local' },
            { key: 'heroImageUrl', label: 'Hero image URL',  type: 'url',      placeholder: 'https://...' },
          ].map(({ key, label, type, placeholder }) => (
            <label key={key} style={{ ...labelStyle, gridColumn: key === 'heroImageUrl' ? '1 / -1' : undefined }}>
              {label}
              <input type={type} value={form[key]}
                onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                placeholder={placeholder} style={inputStyle} />
            </label>
          ))}

          <label style={labelStyle}>
            Description
            <textarea rows={3} value={form.description}
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              style={{ ...inputStyle, resize: 'vertical' }}
              placeholder="A short description shown on the public site" />
          </label>

          {/* Toggles */}
          <div style={{ gridColumn: '1 / -1', display: 'flex', flexWrap: 'wrap', gap: 24 }}>
            {[
              { key: 'rsvpEnabled',          label: 'RSVPs open' },
              { key: 'guestUploadsEnabled',   label: 'Guest uploads open' },
              { key: 'autoApprovePhotos',     label: 'Auto-approve photos' },
            ].map(({ key, label }) => (
              <label key={key} style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', fontSize: 13, color: '#3A3530' }}>
                <input type="checkbox" checked={form[key]}
                  onChange={e => setForm(f => ({ ...f, [key]: e.target.checked }))}
                  style={{ width: 16, height: 16, accentColor: '#8B6E7F', cursor: 'pointer' }} />
                {label}
              </label>
            ))}
          </div>

          <div style={{ gridColumn: '1 / -1' }}>
            {msg   && <p style={{ fontSize: 12, color: '#059669', marginBottom: 8 }} role="status">{msg}</p>}
            {error && <p style={{ fontSize: 12, color: '#DC2626', marginBottom: 8 }} role="alert">{error}</p>}
            <button type="submit" disabled={loading} style={btnStyle('#8B6E7F')}>
              {loading ? <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> : <Check size={14} />}
              {loading ? 'Saving…' : 'Save changes'}
            </button>
          </div>
        </form>
      </Card>
    </div>
  );
}

// ── Change Password ───────────────────────────────────────────────
function ChangePassword({ onSuccess }) {
  const [form,    setForm]    = useState({ currentPassword: '', newPassword: '', confirm: '' });
  const [show,    setShow]    = useState(false);
  const [loading, setLoading] = useState(false);
  const [msg,     setMsg]     = useState('');
  const [error,   setError]   = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.newPassword !== form.confirm) { setError('Passwords do not match.'); return; }
    if (form.newPassword.length < 8)       { setError('Password must be at least 8 characters.'); return; }
    setLoading(true); setMsg(''); setError('');
    try {
      await changePassword({ currentPassword: form.currentPassword, newPassword: form.newPassword });
      setMsg('Password changed successfully!');
      setForm({ currentPassword: '', newPassword: '', confirm: '' });
      onSuccess?.();
    } catch (err) {
      setError(err.message || 'Password change failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 style={headingStyle}>Change Password</h2>
      <Card style={{ maxWidth: 440 }}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {[
            { key: 'currentPassword', label: 'Current password', auto: 'current-password' },
            { key: 'newPassword',     label: 'New password',     auto: 'new-password' },
            { key: 'confirm',         label: 'Confirm new password', auto: 'new-password' },
          ].map(({ key, label, auto }) => (
            <label key={key} style={labelStyle}>
              {label}
              <input type={show ? 'text' : 'password'} autoComplete={auto}
                value={form[key]} required
                onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                style={inputStyle} />
            </label>
          ))}
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: '#6A6258', cursor: 'pointer' }}>
            <input type="checkbox" checked={show} onChange={e => setShow(e.target.checked)} style={{ width: 14, height: 14 }} />
            Show passwords
          </label>
          {msg   && <p style={{ fontSize: 12, color: '#059669' }} role="status">{msg}</p>}
          {error && <p style={{ fontSize: 12, color: '#DC2626' }} role="alert">{error}</p>}
          <button type="submit" disabled={loading} style={btnStyle('#8B6E7F')}>
            {loading ? 'Saving…' : 'Update password'}
          </button>
        </form>
      </Card>
    </div>
  );
}

// ── Main Dashboard shell ──────────────────────────────────────────
const NAV_ITEMS = [
  { id: 'dashboard', label: 'Overview',   Icon: LayoutDashboard },
  { id: 'photos',    label: 'Photos',     Icon: Images           },
  { id: 'config',    label: 'Settings',   Icon: Settings         },
  { id: 'password',  label: 'Password',   Icon: Key              },
];

export function AdminDashboard({ me, mustChange, onMustChangeResolved, onLogout, page, setPage }) {
  // Discover weddingId from first dashboard call
  const [weddingId, setWeddingId] = useState(null);

  useEffect(() => {
    if (!weddingId) {
      // Ask for it — we call dashboard on /admin/weddings/:id — but we don't know the ID yet.
      // The backend returns a wedding list. If not, we guess from /me or just try 'default'.
      // Realistically the admin only has one wedding so we call a lightweight endpoint.
      // We lazily discover it when Overview tries getAdminDashboard and fails, then
      // fallback: ask for wedding list if that endpoint exists. For now surface it from
      // the RSVPs or photos endpoints which don't need a weddingId.
      // Simple: call getPendingPhotos which returns weddingId in each photo.
      getPendingPhotos()
        .then(photos => {
          if (photos.length > 0) setWeddingId(photos[0].weddingId);
        })
        .catch(() => {});
    }
  }, [weddingId]);

  // Force password change screen
  if (mustChange) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, background: '#F8F7F5' }}>
        <div style={{ maxWidth: 500, width: '100%' }}>
          <div style={{ background: '#FEF3C7', border: '1px solid #F59E0B', borderRadius: 6, padding: '14px 18px', marginBottom: 24, display: 'flex', gap: 10, alignItems: 'center' }}>
            <AlertTriangle size={18} color="#D97706" aria-hidden="true" />
            <p style={{ fontSize: 13, color: '#92400E', margin: 0 }}>
              Please change your temporary password before continuing.
            </p>
          </div>
          <ChangePassword onSuccess={onMustChangeResolved} />
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      <aside style={{
        width: 220, flexShrink: 0,
        background: '#1A1714', color: '#F5F0EC',
        display: 'flex', flexDirection: 'column',
        position: 'sticky', top: 0, height: '100vh',
      }}>
        <div style={{ padding: '24px 20px 18px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Heart size={18} fill="#C4A6B2" color="#C4A6B2" aria-hidden="true" />
            <span style={{ fontFamily: "'Cormorant Garamond',Georgia,serif", fontSize: 17, fontWeight: 600 }}>
              Admin Panel
            </span>
          </div>
          {me && (
            <p style={{ fontSize: 11, color: '#9A9088', marginTop: 8, margin: '8px 0 0' }}>
              {me.fullName || me.username}
            </p>
          )}
        </div>

        <nav style={{ flex: 1, padding: '12px 10px' }} aria-label="Admin navigation">
          {NAV_ITEMS.map(({ id, label, Icon }) => (
            <button key={id} onClick={() => setPage(id)}
              aria-current={page === id ? 'page' : undefined}
              style={{
                width: '100%', display: 'flex', alignItems: 'center', gap: 10,
                padding: '10px 12px', border: 'none', borderRadius: 5, cursor: 'pointer',
                background: page === id ? 'rgba(196,166,178,0.18)' : 'transparent',
                color: page === id ? '#E8D4DC' : '#9A9088',
                fontSize: 13, fontWeight: page === id ? 600 : 400,
                marginBottom: 2, textAlign: 'left',
                transition: 'background 0.15s, color 0.15s',
              }}>
              <Icon size={16} aria-hidden="true" />
              {label}
            </button>
          ))}
        </nav>

        <div style={{ padding: '12px 10px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <button onClick={onLogout}
            style={{
              width: '100%', display: 'flex', alignItems: 'center', gap: 10,
              padding: '10px 12px', border: 'none', borderRadius: 5, cursor: 'pointer',
              background: 'transparent', color: '#9A9088', fontSize: 13,
            }}>
            <LogOut size={16} aria-hidden="true" /> Sign out
          </button>
        </div>
      </aside>

      {/* Main */}
      <main style={{ flex: 1, padding: '32px clamp(16px,3vw,40px)', overflowY: 'auto', background: '#F8F7F5' }}>
        <AnimatePresence mode="wait">
          <motion.div key={page}
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.25 }}>
            {page === 'dashboard' && <Overview weddingId={weddingId} />}
            {page === 'photos'    && <PhotoModeration />}
            {page === 'config'    && <WeddingConfig weddingId={weddingId} />}
            {page === 'password'  && <ChangePassword />}
          </motion.div>
        </AnimatePresence>
      </main>

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

// ── Shared styles ─────────────────────────────────────────────────
const headingStyle = {
  fontFamily: "'Cormorant Garamond', Georgia, serif",
  fontSize: 26, fontWeight: 600, color: '#1A1714',
  margin: '0 0 20px',
};
const labelStyle = {
  display: 'block', fontSize: 11, fontWeight: 600,
  color: '#4A4540', letterSpacing: '0.04em',
};
const inputStyle = {
  display: 'block', width: '100%', marginTop: 6,
  padding: '10px 12px', fontSize: 12,
  border: '1px solid #E0DAD4', borderRadius: 4,
  background: '#FAFAF8', color: '#1A1A1A',
  outline: 'none', boxSizing: 'border-box',
  fontFamily: "'Jost', sans-serif",
};
const btnStyle = (bg) => ({
  display: 'inline-flex', alignItems: 'center', gap: 7,
  padding: '10px 18px', border: 'none', borderRadius: 4,
  background: bg, color: '#fff', fontSize: 12, fontWeight: 600,
  cursor: 'pointer', transition: 'opacity 0.2s',
});
