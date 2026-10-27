import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Images, Settings, LogOut, Heart,
  Users, CheckCircle, XCircle, Clock, Check, X,
  Key, AlertTriangle, Loader2, UserCheck, UserX,
  RefreshCw, ToggleLeft, ToggleRight, Save,
} from 'lucide-react';
import {
  getAdminDashboard,
  getPendingPhotos, approvePhoto, rejectPhoto, bulkApprovePhotos,
  updateWeddingConfig, changePassword, enableAutoApprove,
} from '../../services/api/admin.js';
import { getWeddingConfig } from '../../services/api/public.js';
import { getWeddingIdFromToken } from '../../stores/authStore.js';

// ─────────────────────────────────────────────────────────────────
// Shared primitives
// ─────────────────────────────────────────────────────────────────

const Card = ({ children, style }) => (
  <div style={{
    background: '#fff', borderRadius: 8,
    boxShadow: '0 1px 3px rgba(0,0,0,0.05),0 4px 18px rgba(0,0,0,0.06)',
    ...style,
  }}>{children}</div>
);

const Spinner = ({ size = 26 }) => (
  <div style={{ display: 'flex', justifyContent: 'center', padding: '52px 0' }}>
    <Loader2 size={size} style={{ animation: 'spin 1s linear infinite', color: '#C4A6B2' }} aria-label="Loading" />
  </div>
);

const ErrBox = ({ msg }) => (
  <div style={{ background: '#FEF2F2', border: '1px solid #FCA5A5', borderRadius: 6, padding: '14px 18px',
    color: '#991B1B', fontSize: 13, display: 'flex', gap: 10, alignItems: 'flex-start' }}>
    <AlertTriangle size={16} style={{ flexShrink: 0, marginTop: 1 }} aria-hidden="true" />
    {msg}
  </div>
);

const Pill = ({ status }) => {
  const map = {
    Attending:     { bg: '#DCFCE7', fg: '#166534' },
    NotAttending:  { bg: '#FEE2E2', fg: '#991B1B' },
    Maybe:         { bg: '#FEF9C3', fg: '#854D0E' },
    Pending:       { bg: '#F3F4F6', fg: '#374151' },
    Approved:      { bg: '#DCFCE7', fg: '#166534' },
    Rejected:      { bg: '#FEE2E2', fg: '#991B1B' },
  };
  const s = map[status] || { bg: '#F3F4F6', fg: '#374151' };
  return (
    <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase',
      background: s.bg, color: s.fg, borderRadius: 99, padding: '3px 9px', whiteSpace: 'nowrap' }}>
      {status}
    </span>
  );
};

// ─────────────────────────────────────────────────────────────────
// Overview + RSVP summary
// ─────────────────────────────────────────────────────────────────

function Overview({ weddingId }) {
  const [stats,   setStats]   = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState('');

  const load = useCallback(() => {
    if (!weddingId) {
      setLoading(false);
      setError('Wedding ID not found in session token. Please sign out and back in.');
      return;
    }
    setLoading(true); setError('');
    getAdminDashboard(weddingId)
      .then(setStats)
      .catch(e => setError(e.message || 'Failed to load dashboard.'))
      .finally(() => setLoading(false));
  }, [weddingId]);

  useEffect(() => { load(); }, [load]);

  if (loading) return <Spinner />;
  if (error)   return <ErrBox msg={error} />;
  if (!stats)  return null;

  const totalGuests = (stats.attendingCount ?? 0) + (stats.maybeCount ?? 0);

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <h2 style={H2}>Overview</h2>
        <button onClick={load} style={{ ...ghostBtn, display: 'flex', alignItems: 'center', gap: 6 }}>
          <RefreshCw size={13} /> Refresh
        </button>
      </div>

      {/* Photo stats */}
      <p style={sectionLabel}>PHOTOS</p>
      <div style={gridAuto(160)}>
        {[
          { label: 'Total',    value: stats.totalPhotos,    color: '#7C3AED', Icon: Images        },
          { label: 'Pending',  value: stats.pendingPhotos,  color: '#D97706', Icon: Clock         },
          { label: 'Approved', value: stats.approvedPhotos, color: '#059669', Icon: CheckCircle   },
        ].map(({ label, value, color, Icon }) => (
          <Card key={label} style={{ padding: '20px 22px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <p style={{ fontSize: 11, color: '#9A9088', fontWeight: 600, letterSpacing: '0.08em',
                  textTransform: 'uppercase', margin: '0 0 8px' }}>{label}</p>
                <p style={{ fontSize: 34, fontWeight: 700, color: '#111',
                  margin: 0, fontFamily: "'Cormorant Garamond',Georgia,serif" }}>{value ?? '—'}</p>
              </div>
              <div style={{ width: 40, height: 40, borderRadius: '50%',
                background: `${color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon size={18} color={color} aria-hidden="true" />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* RSVP stats */}
      <p style={{ ...sectionLabel, marginTop: 28 }}>RSVP SUMMARY</p>

      {/* Total guests banner */}
      <Card style={{ padding: '22px 28px', marginBottom: 16,
        background: 'linear-gradient(135deg, #1A1714 0%, #2E2721 100%)', color: '#F5F0EC' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <p style={{ fontSize: 11, letterSpacing: '0.1em', color: '#C4A6B2',
              fontWeight: 600, margin: '0 0 6px', textTransform: 'uppercase' }}>
              Total Expected Guests
            </p>
            <p style={{ fontSize: 44, fontWeight: 700, margin: 0,
              fontFamily: "'Cormorant Garamond',Georgia,serif", lineHeight: 1 }}>
              {totalGuests}
            </p>
            <p style={{ fontSize: 11, color: '#9A9088', margin: '6px 0 0' }}>
              Attending + Maybe
            </p>
          </div>
          <div style={{ display: 'flex', gap: 24 }}>
            {[
              { label: 'Attending',    value: stats.attendingCount,    color: '#6EE7B7' },
              { label: 'Maybe',        value: stats.maybeCount,        color: '#FCD34D' },
              { label: 'Not Attending',value: stats.notAttendingCount, color: '#FCA5A5' },
              { label: 'Total RSVPs',  value: stats.totalRsvps,        color: '#C4B5FD' },
            ].map(({ label, value, color }) => (
              <div key={label} style={{ textAlign: 'center' }}>
                <p style={{ fontSize: 26, fontWeight: 700, color,
                  fontFamily: "'Cormorant Garamond',Georgia,serif", margin: 0, lineHeight: 1 }}>
                  {value ?? 0}
                </p>
                <p style={{ fontSize: 10, color: '#9A9088', margin: '4px 0 0', letterSpacing: '0.06em' }}>
                  {label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* RSVP breakdown visual bars */}
      <Card style={{ padding: '22px 24px' }}>
        <p style={{ fontSize: 12, color: '#6A6258', margin: '0 0 16px' }}>
          Response breakdown
        </p>
        {[
          { label: 'Attending',     value: stats.attendingCount,    total: stats.totalRsvps, color: '#059669', Icon: UserCheck },
          { label: 'Not Attending', value: stats.notAttendingCount, total: stats.totalRsvps, color: '#DC2626', Icon: UserX    },
          { label: 'Maybe',         value: stats.maybeCount,        total: stats.totalRsvps, color: '#D97706', Icon: Clock    },
        ].map(({ label, value, total, color, Icon }) => {
          const pct = total > 0 ? Math.round((value / total) * 100) : 0;
          return (
            <div key={label} style={{ marginBottom: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Icon size={14} color={color} aria-hidden="true" />
                  <span style={{ fontSize: 12, fontWeight: 600, color: '#3A3530' }}>{label}</span>
                </div>
                <span style={{ fontSize: 12, fontWeight: 700, color }}>
                  {value ?? 0} <span style={{ fontWeight: 400, color: '#9A9088' }}>({pct}%)</span>
                </span>
              </div>
              <div style={{ height: 6, background: '#F3F0EC', borderRadius: 99, overflow: 'hidden' }}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: 0.8, ease: [0.2, 0.8, 0.2, 1] }}
                  style={{ height: '100%', background: color, borderRadius: 99 }}
                />
              </div>
            </div>
          );
        })}
        <p style={{ fontSize: 11, color: '#C4A6B2', margin: '16px 0 0', borderTop: '1px solid #F0ECE8', paddingTop: 12 }}>
          Individual RSVP records are not exposed by the API. Only aggregate counts are available.
        </p>
      </Card>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// Photo Moderation
// ─────────────────────────────────────────────────────────────────

function PhotoModeration() {
  const [photos,   setPhotos]   = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState('');
  const [selected, setSelected] = useState(new Set());
  const [busy,     setBusy]     = useState(false);
  const [msg,      setMsg]      = useState('');
  const [msgType,  setMsgType]  = useState('ok');

  const load = useCallback(() => {
    setLoading(true); setMsg('');
    getPendingPhotos()
      .then(data => { setPhotos(Array.isArray(data) ? data : []); setSelected(new Set()); })
      .catch(e => setError(e.message || 'Failed to load pending photos.'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  const toggle = (id) => setSelected(prev => {
    const next = new Set(prev);
    next.has(id) ? next.delete(id) : next.add(id);
    return next;
  });

  const act = async (fn, successMsg) => {
    setBusy(true); setMsg('');
    try {
      await fn();
      setMsg(successMsg); setMsgType('ok');
      load();
    } catch (e) {
      setMsg(e.message || 'Action failed.'); setMsgType('err');
    } finally { setBusy(false); }
  };

  const toggleAll = () => {
    setSelected(prev => prev.size === photos.length
      ? new Set()
      : new Set(photos.map(p => p.id)));
  };

  if (loading) return <Spinner />;
  if (error)   return <ErrBox msg={error} />;

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexWrap: 'wrap', gap: 12, marginBottom: 20 }}>
        <h2 style={H2}>Photo Moderation</h2>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          {photos.length > 0 && (
            <button onClick={toggleAll} style={ghostBtn}>
              {selected.size === photos.length ? 'Deselect all' : 'Select all'}
            </button>
          )}
          {selected.size > 0 && (
            <button onClick={() => act(() => bulkApprovePhotos([...selected]),
              `${selected.size} photo(s) approved.`)} disabled={busy}
              style={solidBtn('#059669')}>
              <Check size={13} aria-hidden="true" /> Approve {selected.size}
            </button>
          )}
          <button onClick={load} disabled={busy} style={ghostBtn}>
            <RefreshCw size={13} /> Refresh
          </button>
        </div>
      </div>

      {msg && (
        <div style={{ marginBottom: 14, padding: '10px 14px', borderRadius: 5, fontSize: 12,
          background: msgType === 'ok' ? '#DCFCE7' : '#FEE2E2',
          color: msgType === 'ok' ? '#166534' : '#991B1B' }}
          role="status" aria-live="polite">
          {msg}
        </div>
      )}

      {photos.length === 0 ? (
        <Card style={{ padding: '48px 24px', textAlign: 'center' }}>
          <CheckCircle size={32} color="#C4A6B2" style={{ margin: '0 auto 12px' }} aria-hidden="true" />
          <p style={{ color: '#9A9088', fontSize: 13, margin: 0 }}>
            No pending photos — you're all caught up!
          </p>
        </Card>
      ) : (
        <div style={gridAuto(220)}>
          {photos.map(photo => (
            <Card key={photo.id} style={{ padding: 0, overflow: 'hidden' }}>
              <div style={{ position: 'relative' }}>
                <img
                  src={photo.thumbnailUrl || photo.imageUrl}
                  alt={`Photo by ${photo.uploadedByName || 'guest'}`}
                  style={{ width: '100%', aspectRatio: '4/3', objectFit: 'cover', display: 'block' }}
                  loading="lazy"
                />
                <label style={{ position: 'absolute', top: 8, left: 8,
                  width: 20, height: 20, cursor: 'pointer', display: 'block' }}>
                  <input type="checkbox" checked={selected.has(photo.id)}
                    onChange={() => toggle(photo.id)}
                    aria-label={`Select photo by ${photo.uploadedByName || 'guest'}`}
                    style={{ width: 18, height: 18, accentColor: '#8B6E7F', cursor: 'pointer' }} />
                </label>
                <div style={{ position: 'absolute', top: 8, right: 8 }}>
                  <Pill status={photo.status} />
                </div>
              </div>
              <div style={{ padding: '12px 14px' }}>
                <p style={{ fontSize: 11, color: '#6A6258', margin: '0 0 3px' }}>
                  By <strong>{photo.uploadedByName || 'Anonymous'}</strong>
                </p>
                <p style={{ fontSize: 10, color: '#B0A898', margin: '0 0 12px' }}>
                  {new Date(photo.uploadedAtUtc).toLocaleString('en-IN', {
                    dateStyle: 'short', timeStyle: 'short',
                  })}
                </p>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button onClick={() => act(() => approvePhoto(photo.id), 'Approved.')}
                    disabled={busy}
                    style={{ ...solidBtn('#059669'), flex: 1, padding: '7px 0', justifyContent: 'center' }}>
                    <Check size={13} aria-hidden="true" /> Approve
                  </button>
                  <button onClick={() => act(() => rejectPhoto(photo.id), 'Rejected.')}
                    disabled={busy}
                    style={{ ...solidBtn('#DC2626'), flex: 1, padding: '7px 0', justifyContent: 'center' }}>
                    <X size={13} aria-hidden="true" /> Reject
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

// ─────────────────────────────────────────────────────────────────
// Wedding Settings — loads current config from API first
// ─────────────────────────────────────────────────────────────────

const SLUG = import.meta.env.VITE_WEDDING_SLUG || '';

function WeddingSettings({ weddingId }) {
  const [form, setForm] = useState({
    name: '', description: '', venue: '', eventDateUtc: '',
    heroImageUrl: '', rsvpEnabled: true, guestUploadsEnabled: true, autoApprovePhotos: false,
  });
  const [loadingConfig, setLoadingConfig] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg,    setMsg]    = useState('');
  const [error,  setError]  = useState('');

  // Load current config on mount if slug is available
  useEffect(() => {
    if (!SLUG) { setLoadingConfig(false); return; }
    getWeddingConfig()
      .then(cfg => {
        setForm({
          name:                cfg.name               ?? '',
          description:         cfg.description        ?? '',
          venue:               cfg.venue              ?? '',
          eventDateUtc:        cfg.eventDateUtc
            ? cfg.eventDateUtc.replace('Z', '').substring(0, 16)  // format for datetime-local input
            : '',
          heroImageUrl:        cfg.heroImageUrl        ?? '',
          rsvpEnabled:         cfg.rsvpEnabled         ?? true,
          guestUploadsEnabled: cfg.guestUploadsEnabled ?? true,
          autoApprovePhotos:   cfg.autoApprovePhotos   ?? false,
        });
      })
      .catch(() => { /* couldn't load — form starts blank */ })
      .finally(() => setLoadingConfig(false));
  }, []);

  const save = async (e) => {
    e.preventDefault();
    if (!weddingId) { setError('Wedding ID not available.'); return; }
    setSaving(true); setMsg(''); setError('');
    try {
      // Only include fields that have values (nullable fields in spec)
      const payload = {};
      if (form.name)         payload.name         = form.name;
      if (form.description)  payload.description  = form.description;
      if (form.venue)        payload.venue        = form.venue;
      if (form.eventDateUtc) payload.eventDateUtc = new Date(form.eventDateUtc).toISOString();
      if (form.heroImageUrl) payload.heroImageUrl = form.heroImageUrl;
      payload.rsvpEnabled         = form.rsvpEnabled;
      payload.guestUploadsEnabled = form.guestUploadsEnabled;
      payload.autoApprovePhotos   = form.autoApprovePhotos;

      await updateWeddingConfig(weddingId, payload);
      setMsg('Settings saved successfully.');
    } catch (err) {
      setError(err.message || 'Update failed.');
    } finally {
      setSaving(false);
    }
  };

  if (!weddingId) return (
    <div>
      <h2 style={H2}>Wedding Settings</h2>
      <ErrBox msg="Wedding ID not found in session token. Please sign out and back in." />
    </div>
  );

  if (loadingConfig) return (
    <div>
      <h2 style={H2}>Wedding Settings</h2>
      <Spinner />
    </div>
  );

  return (
    <div>
      <h2 style={H2}>Wedding Settings</h2>

      <form onSubmit={save}>
        {/* ── Basic details ── */}
        <Card style={{ padding: '24px 28px', marginBottom: 20 }}>
          <p style={sectionLabel}>BASIC DETAILS</p>
          <div style={gridAuto(280)}>
            <label style={LBL}>
              Wedding name
              <input type="text" value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                placeholder="Rahul &amp; Priya Wedding"
                style={INP} />
            </label>
            <label style={LBL}>
              Venue
              <input type="text" value={form.venue}
                onChange={e => setForm(f => ({ ...f, venue: e.target.value }))}
                placeholder="Grand Hall, Bangalore"
                style={INP} />
            </label>
            <label style={LBL}>
              Event date &amp; time (UTC)
              <input type="datetime-local" value={form.eventDateUtc}
                onChange={e => setForm(f => ({ ...f, eventDateUtc: e.target.value }))}
                style={INP} />
            </label>
            <label style={{ ...LBL, gridColumn: '1 / -1' }}>
              Hero image URL
              <input type="url" value={form.heroImageUrl}
                onChange={e => setForm(f => ({ ...f, heroImageUrl: e.target.value }))}
                placeholder="https://res.cloudinary.com/..."
                style={INP} />
            </label>
            <label style={{ ...LBL, gridColumn: '1 / -1' }}>
              Description
              <textarea rows={3} value={form.description}
                onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                placeholder="A short message shown on the public site"
                style={{ ...INP, resize: 'vertical' }} />
            </label>
          </div>
        </Card>

        {/* ── Toggles ── */}
        <Card style={{ padding: '24px 28px', marginBottom: 24 }}>
          <p style={sectionLabel}>FEATURE FLAGS</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {[
              { key: 'rsvpEnabled',         label: 'RSVPs open',          desc: 'Allow guests to submit RSVPs' },
              { key: 'guestUploadsEnabled',  label: 'Guest uploads open',  desc: 'Allow guests to upload photos' },
              { key: 'autoApprovePhotos',    label: 'Auto-approve photos', desc: 'Automatically approve all uploaded photos' },
            ].map(({ key, label, desc }) => (
              <label key={key}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  cursor: 'pointer', padding: '12px 16px', borderRadius: 6,
                  background: form[key] ? '#F0FDF4' : '#FAFAF8',
                  border: `1px solid ${form[key] ? '#86EFAC' : '#E8E4DF'}`,
                  transition: 'all 0.2s' }}>
                <div>
                  <p style={{ fontSize: 13, fontWeight: 600, color: '#1A1714', margin: 0 }}>{label}</p>
                  <p style={{ fontSize: 11, color: '#9A9088', margin: '2px 0 0' }}>{desc}</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <input type="checkbox" checked={form[key]}
                    onChange={e => setForm(f => ({ ...f, [key]: e.target.checked }))}
                    style={{ display: 'none' }}
                    aria-label={label} />
                  {form[key]
                    ? <ToggleRight size={28} color="#059669" aria-hidden="true" />
                    : <ToggleLeft  size={28} color="#C4B8B0" aria-hidden="true" />
                  }
                </div>
              </label>
            ))}
          </div>
        </Card>

        {/* ── Footer ── */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
          <button type="submit" disabled={saving} style={solidBtn('#8B6E7F')}>
            {saving
              ? <><Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> Saving…</>
              : <><Save size={14} aria-hidden="true" /> Save changes</>
            }
          </button>
          {msg   && <span style={{ fontSize: 12, color: '#059669' }} role="status">{msg}</span>}
          {error && <span style={{ fontSize: 12, color: '#DC2626' }} role="alert">{error}</span>}
        </div>
      </form>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// Change Password
// ─────────────────────────────────────────────────────────────────

function ChangePassword({ onSuccess }) {
  const [form, setForm] = useState({ currentPassword: '', newPassword: '', confirm: '' });
  const [show, setShow] = useState(false);
  const [saving, setSaving] = useState(false);
  const [msg,   setMsg]   = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.newPassword !== form.confirm) { setError('Passwords do not match.'); return; }
    if (form.newPassword.length < 8)       { setError('Password must be at least 8 characters.'); return; }
    setSaving(true); setMsg(''); setError('');
    try {
      await changePassword({ currentPassword: form.currentPassword, newPassword: form.newPassword });
      setMsg('Password changed successfully!');
      setForm({ currentPassword: '', newPassword: '', confirm: '' });
      onSuccess?.();
    } catch (err) {
      setError(err.message || 'Password change failed.');
    } finally { setSaving(false); }
  };

  return (
    <div>
      <h2 style={H2}>Change Password</h2>
      <Card style={{ padding: '28px', maxWidth: 440 }}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {[
            { key: 'currentPassword', label: 'Current password', auto: 'current-password' },
            { key: 'newPassword',     label: 'New password',     auto: 'new-password'     },
            { key: 'confirm',         label: 'Confirm new password', auto: 'new-password' },
          ].map(({ key, label, auto }) => (
            <label key={key} style={LBL}>
              {label}
              <input type={show ? 'text' : 'password'} autoComplete={auto}
                value={form[key]} required
                onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                style={INP} />
            </label>
          ))}

          <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12,
            color: '#6A6258', cursor: 'pointer', userSelect: 'none' }}>
            <input type="checkbox" checked={show} onChange={e => setShow(e.target.checked)}
              style={{ width: 14, height: 14 }} />
            Show passwords
          </label>

          {msg   && <p style={{ fontSize: 12, color: '#059669', margin: 0 }} role="status">{msg}</p>}
          {error && <p style={{ fontSize: 12, color: '#DC2626', margin: 0 }} role="alert">{error}</p>}

          <button type="submit" disabled={saving} style={solidBtn('#8B6E7F')}>
            {saving ? 'Saving…' : 'Update password'}
          </button>
        </form>
      </Card>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// Shell
// ─────────────────────────────────────────────────────────────────

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Overview',  Icon: LayoutDashboard },
  { id: 'photos',    label: 'Photos',    Icon: Images           },
  { id: 'settings',  label: 'Settings',  Icon: Settings         },
  { id: 'password',  label: 'Password',  Icon: Key              },
];

export function AdminDashboard({ me, mustChange, onMustChangeResolved, onLogout, page, setPage }) {
  const [weddingId] = useState(() => getWeddingIdFromToken());

  if (mustChange) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center',
        justifyContent: 'center', padding: 24, background: '#F8F7F5' }}>
        <div style={{ maxWidth: 480, width: '100%' }}>
          <div style={{ background: '#FEF9C3', border: '1px solid #FDE047', borderRadius: 6,
            padding: '14px 18px', marginBottom: 24, display: 'flex', gap: 10, alignItems: 'center' }}>
            <AlertTriangle size={16} color="#CA8A04" aria-hidden="true" />
            <p style={{ fontSize: 13, color: '#713F12', margin: 0 }}>
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
      <aside style={{ width: 220, flexShrink: 0, background: '#1A1714', color: '#F5F0EC',
        display: 'flex', flexDirection: 'column',
        position: 'sticky', top: 0, height: '100vh', overflowY: 'auto' }}>

        <div style={{ padding: '22px 20px 16px', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
            <Heart size={16} fill="#C4A6B2" color="#C4A6B2" aria-hidden="true" />
            <span style={{ fontFamily: "'Cormorant Garamond',Georgia,serif", fontSize: 16, fontWeight: 600 }}>
              Admin Panel
            </span>
          </div>
          {me && (
            <p style={{ fontSize: 11, color: '#9A9088', margin: '8px 0 0',
              whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {me.fullName || me.username}
            </p>
          )}
        </div>

        <nav style={{ flex: 1, padding: '10px 10px' }} aria-label="Admin navigation">
          {NAV_ITEMS.map(({ id, label, Icon }) => (
            <button key={id} onClick={() => setPage(id)}
              aria-current={page === id ? 'page' : undefined}
              style={{
                width: '100%', display: 'flex', alignItems: 'center', gap: 10,
                padding: '10px 12px', border: 'none', borderRadius: 5, cursor: 'pointer',
                background: page === id ? 'rgba(196,166,178,0.15)' : 'transparent',
                color: page === id ? '#F0E0E8' : '#9A9088',
                fontSize: 13, fontWeight: page === id ? 600 : 400,
                marginBottom: 2, textAlign: 'left',
                transition: 'background 0.15s, color 0.15s',
              }}>
              <Icon size={15} aria-hidden="true" />
              {label}
            </button>
          ))}
        </nav>

        <div style={{ padding: '10px', borderTop: '1px solid rgba(255,255,255,0.07)' }}>
          <button onClick={onLogout}
            style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10,
              padding: '10px 12px', border: 'none', borderRadius: 5, cursor: 'pointer',
              background: 'transparent', color: '#9A9088', fontSize: 13 }}>
            <LogOut size={15} aria-hidden="true" /> Sign out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main style={{ flex: 1, padding: '32px clamp(16px,3vw,44px)',
        overflowY: 'auto', background: '#F8F7F5', minHeight: '100vh' }}>
        <AnimatePresence mode="wait">
          <motion.div key={page}
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }} transition={{ duration: 0.22 }}>
            {page === 'dashboard' && <Overview   weddingId={weddingId} />}
            {page === 'photos'    && <PhotoModeration />}
            {page === 'settings'  && <WeddingSettings weddingId={weddingId} />}
            {page === 'password'  && <ChangePassword />}
          </motion.div>
        </AnimatePresence>
      </main>

      <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// Shared micro-styles
// ─────────────────────────────────────────────────────────────────

const H2 = {
  fontFamily: "'Cormorant Garamond',Georgia,serif",
  fontSize: 26, fontWeight: 600, color: '#1A1714', margin: '0 0 20px',
};

const sectionLabel = {
  fontSize: 10, fontWeight: 700, letterSpacing: '0.1em',
  color: '#C4B8B0', textTransform: 'uppercase', margin: '0 0 12px',
};

const LBL = { display: 'block', fontSize: 11, fontWeight: 600, color: '#4A4540', letterSpacing: '0.04em' };

const INP = {
  display: 'block', width: '100%', marginTop: 6,
  padding: '10px 12px', fontSize: 12, fontFamily: "'Jost',sans-serif",
  border: '1px solid #E0DAD4', borderRadius: 5,
  background: '#FDFCFA', color: '#1A1A1A',
  outline: 'none', boxSizing: 'border-box',
  transition: 'border-color 0.2s',
};

const gridAuto = (min) => ({
  display: 'grid',
  gridTemplateColumns: `repeat(auto-fill,minmax(${min}px,1fr))`,
  gap: 16,
  marginBottom: 16,
});

const ghostBtn = {
  display: 'inline-flex', alignItems: 'center', gap: 6,
  padding: '7px 12px', borderRadius: 5, cursor: 'pointer',
  background: 'none', border: '1px solid #E0DAD4',
  color: '#6A6258', fontSize: 11, fontWeight: 500,
  fontFamily: "'Jost',sans-serif",
};

const solidBtn = (bg) => ({
  display: 'inline-flex', alignItems: 'center', gap: 7,
  padding: '10px 18px', border: 'none', borderRadius: 5,
  background: bg, color: '#fff', fontSize: 12, fontWeight: 600,
  cursor: 'pointer', fontFamily: "'Jost',sans-serif",
  transition: 'opacity 0.2s',
});
