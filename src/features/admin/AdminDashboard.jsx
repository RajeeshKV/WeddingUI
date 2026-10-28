/**
 * AdminDashboard — mobile-first, modern SaaS design
 *
 * Layout:
 *   Mobile  (≤768px) : sticky top header + bottom tab bar
 *   Desktop (>768px) : collapsible sidebar (icon-only → full on hover/pin)
 *
 * Responsive strategy: CSS classes in admin-ui.css + inline only for dynamic values
 */

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Images, Settings, LogOut, Heart,
  Users, CheckCircle, Clock, Check, X, Trash2,
  Key, AlertTriangle, Loader2, UserCheck, UserX,
  RefreshCw, ToggleLeft, ToggleRight, Save, ChevronRight,
  Menu, PinIcon,
} from 'lucide-react';
import {
  getAdminDashboard,
  getPendingPhotos, getAllAdminPhotos,
  approvePhoto, rejectPhoto, deletePhoto, bulkApprovePhotos,
  updateWeddingConfig, changePassword, getAdminWeddingConfig,
} from '../../services/api/admin.js';
import { normalizePage } from '../../services/api/public.js';

// ─────────────────────────────────────────────────────────────────
// Design tokens (all CSS vars — overridable)
// ─────────────────────────────────────────────────────────────────
const T = {
  bg:        '#F8F7F6',
  surface:   '#FFFFFF',
  border:    '#EEEBE7',
  fg:        '#1A1714',
  muted:     '#6B6560',
  faint:     '#9A9088',
  primary:   '#8B6E7F',
  primaryFg: '#FFFFFF',
  sidebar:   '#1A1714',
  sidebarFg: '#F5F0EC',
  sidebarMuted: '#7A7068',
  success:   '#059669',
  warning:   '#D97706',
  danger:    '#DC2626',
  amber:     '#F59E0B',
  violet:    '#7C3AED',
  teal:      '#0891B2',
  radius:    8,
  transition: '0.2s ease',
};

// ─────────────────────────────────────────────────────────────────
// Shared primitives
// ─────────────────────────────────────────────────────────────────

const Card = ({ children, style, p = 20 }) => (
  <div style={{
    background: T.surface,
    borderRadius: T.radius,
    border: `1px solid ${T.border}`,
    padding: p,
    ...style,
  }}>
    {children}
  </div>
);

const Spin = ({ size = 24, color = T.primary }) => (
  <Loader2
    size={size}
    color={color}
    aria-hidden="true"
    style={{ animation: 'adSpin 0.9s linear infinite', flexShrink: 0 }}
  />
);

const PageLoader = () => (
  <div style={{ display: 'flex', justifyContent: 'center', padding: '64px 0' }}>
    <Spin size={28} />
  </div>
);

const ErrBox = ({ msg, onRetry }) => (
  <div style={{
    background: '#FEF2F2', border: `1px solid #FCA5A5`,
    borderRadius: T.radius, padding: '16px 20px',
    display: 'flex', alignItems: 'flex-start', gap: 12,
  }}>
    <AlertTriangle size={16} color={T.danger} style={{ flexShrink: 0, marginTop: 2 }} aria-hidden="true" />
    <div style={{ flex: 1 }}>
      <p style={{ color: '#991B1B', fontSize: 13, margin: 0, lineHeight: 1.5 }}>{msg}</p>
      {onRetry && (
        <button onClick={onRetry}
          style={{ marginTop: 10, fontSize: 12, fontWeight: 600, color: T.danger,
            background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
          Try again
        </button>
      )}
    </div>
  </div>
);

const Badge = ({ status }) => {
  const map = {
    Approved:    { bg: '#DCFCE7', fg: '#166534' },
    Rejected:    { bg: '#FEE2E2', fg: '#991B1B' },
    Pending:     { bg: '#FEF9C3', fg: '#854D0E' },
    Attending:   { bg: '#DCFCE7', fg: '#166534' },
    NotAttending:{ bg: '#FEE2E2', fg: '#991B1B' },
    Maybe:       { bg: '#FEF9C3', fg: '#854D0E' },
  };
  const s = map[status] || { bg: '#F3F4F6', fg: '#374151' };
  return (
    <span style={{
      fontSize: 10, fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase',
      background: s.bg, color: s.fg, borderRadius: 99, padding: '3px 8px', whiteSpace: 'nowrap',
    }}>
      {status}
    </span>
  );
};

const SectionHeader = ({ title, children }) => (
  <div style={{
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    flexWrap: 'wrap', gap: 12, marginBottom: 20,
  }}>
    <h2 style={{ fontFamily: "'Cormorant Garamond',Georgia,serif", fontSize: 24, fontWeight: 600,
      color: T.fg, margin: 0, lineHeight: 1.2 }}>
      {title}
    </h2>
    {children && <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>{children}</div>}
  </div>
);

// Button variants
const Btn = ({ children, onClick, variant = 'ghost', size = 'md', disabled, style: s }) => {
  const sizes  = { sm: '7px 12px', md: '9px 16px', lg: '11px 20px' };
  const fSizes = { sm: 11, md: 12, lg: 13 };
  const variants = {
    ghost:   { background: 'none', border: `1px solid ${T.border}`, color: T.muted },
    primary: { background: T.primary, border: 'none', color: T.primaryFg },
    success: { background: T.success, border: 'none', color: '#fff' },
    danger:  { background: T.danger, border: 'none', color: '#fff' },
    amber:   { background: T.amber, border: 'none', color: '#fff' },
  };
  return (
    <button onClick={onClick} disabled={disabled}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 6,
        padding: sizes[size], borderRadius: 6,
        fontSize: fSizes[size], fontWeight: 600, cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        transition: T.transition, fontFamily: "'Jost',sans-serif",
        ...variants[variant], ...s,
      }}>
      {children}
    </button>
  );
};

// ─────────────────────────────────────────────────────────────────
// Overview
// ─────────────────────────────────────────────────────────────────

function Overview() {
  const [stats,   setStats]   = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState('');

  const load = useCallback(() => {
    setLoading(true); setError('');
    getAdminDashboard()
      .then(setStats)
      .catch(e => setError(e.message || 'Failed to load dashboard.'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  if (loading) return <PageLoader />;
  if (error)   return <ErrBox msg={error} onRetry={load} />;
  if (!stats)  return null;

  const attending    = stats.attending    ?? stats.attendingCount    ?? 0;
  const notAttending = stats.notAttending ?? stats.notAttendingCount ?? 0;
  const maybe        = stats.maybe        ?? stats.maybeCount        ?? 0;

  const statCards = [
    { label: 'Total Photos',    value: stats.totalPhotos,    color: T.violet, Icon: Images        },
    { label: 'Pending Review',  value: stats.pendingPhotos,  color: T.warning, Icon: Clock        },
    { label: 'Approved',        value: stats.approvedPhotos, color: T.success, Icon: CheckCircle  },
    { label: 'Total RSVPs',     value: stats.totalRsvps,     color: T.teal,    Icon: Users        },
    { label: 'Attending',       value: attending,             color: T.success, Icon: UserCheck   },
    { label: 'Not Attending',   value: notAttending,          color: T.danger,  Icon: UserX       },
  ];

  return (
    <div>
      <SectionHeader title="Overview">
        <Btn variant="ghost" size="sm" onClick={load}><RefreshCw size={13} /> Refresh</Btn>
      </SectionHeader>

      {/* Stat grid */}
      <div className="ad-stat-grid">
        {statCards.map(({ label, value, color, Icon }) => (
          <Card key={label} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '18px 20px' }}>
            <div style={{ width: 44, height: 44, borderRadius: 10, background: `${color}14`,
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Icon size={20} color={color} aria-hidden="true" />
            </div>
            <div style={{ minWidth: 0 }}>
              <p style={{ fontSize: 11, fontWeight: 600, color: T.faint, letterSpacing: '0.07em',
                textTransform: 'uppercase', margin: '0 0 4px' }}>
                {label}
              </p>
              <p style={{ fontSize: 28, fontWeight: 700, color: T.fg, margin: 0, lineHeight: 1,
                fontFamily: "'Cormorant Garamond',Georgia,serif" }}>
                {value ?? 0}
              </p>
            </div>
          </Card>
        ))}
      </div>

      {/* RSVP breakdown */}
      <Card style={{ marginTop: 20, padding: '20px 24px' }}>
        <p style={{ fontSize: 12, fontWeight: 600, color: T.muted, letterSpacing: '0.06em',
          textTransform: 'uppercase', margin: '0 0 16px' }}>
          RSVP Breakdown
        </p>
        {[
          { label: 'Attending',     value: attending,    total: stats.totalRsvps, color: T.success },
          { label: 'Not Attending', value: notAttending, total: stats.totalRsvps, color: T.danger  },
          { label: 'Maybe',         value: maybe,        total: stats.totalRsvps, color: T.warning },
        ].map(({ label, value, total, color }) => {
          const pct = total > 0 ? Math.round((value / total) * 100) : 0;
          return (
            <div key={label} style={{ marginBottom: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                <span style={{ fontSize: 12, fontWeight: 500, color: T.fg }}>{label}</span>
                <span style={{ fontSize: 12, fontWeight: 700, color }}>
                  {value} <span style={{ color: T.faint, fontWeight: 400 }}>({pct}%)</span>
                </span>
              </div>
              <div style={{ height: 5, background: T.border, borderRadius: 99, overflow: 'hidden' }}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: 0.9, ease: [0.2, 0.8, 0.2, 1] }}
                  style={{ height: '100%', background: color, borderRadius: 99 }}
                />
              </div>
            </div>
          );
        })}
      </Card>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// RSVP
// ─────────────────────────────────────────────────────────────────

function RsvpSection() {
  const [stats,   setStats]   = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState('');

  const load = useCallback(() => {
    setLoading(true); setError('');
    getAdminDashboard()
      .then(setStats)
      .catch(e => setError(e.message || 'Failed to load RSVP data.'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  if (loading) return <PageLoader />;
  if (error)   return <ErrBox msg={error} onRetry={load} />;
  if (!stats)  return null;

  const attending    = stats.attending    ?? stats.attendingCount    ?? 0;
  const notAttending = stats.notAttending ?? stats.notAttendingCount ?? 0;
  const maybe        = stats.maybe        ?? stats.maybeCount        ?? 0;
  const total        = stats.totalRsvps   ?? 0;

  return (
    <div>
      <SectionHeader title="RSVPs">
        <Btn variant="ghost" size="sm" onClick={load}><RefreshCw size={13} /> Refresh</Btn>
      </SectionHeader>

      {/* Banner */}
      <div style={{
        background: 'linear-gradient(135deg,#1A1714,#2E2721)', color: '#F5F0EC',
        borderRadius: T.radius, padding: '22px 24px', marginBottom: 16,
      }}>
        <p style={{ fontSize: 10, letterSpacing: '0.12em', color: '#C4A6B2',
          fontWeight: 600, margin: '0 0 6px', textTransform: 'uppercase' }}>
          Total RSVPs
        </p>
        <p style={{ fontSize: 48, fontWeight: 700, margin: 0, lineHeight: 1,
          fontFamily: "'Cormorant Garamond',Georgia,serif" }}>
          {total}
        </p>
      </div>

      <div className="ad-stat-grid">
        {[
          { label: 'Attending',     value: attending,    color: T.success, bg: '#DCFCE7' },
          { label: 'Not Attending', value: notAttending, color: T.danger,  bg: '#FEE2E2' },
          { label: 'Maybe',         value: maybe,        color: T.warning, bg: '#FEF9C3' },
        ].map(({ label, value, color, bg }) => (
          <Card key={label} p={18}>
            <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.07em',
              textTransform: 'uppercase', color: T.faint, margin: '0 0 8px' }}>
              {label}
            </p>
            <p style={{ fontSize: 36, fontWeight: 700, color: T.fg, margin: '0 0 10px', lineHeight: 1,
              fontFamily: "'Cormorant Garamond',Georgia,serif" }}>
              {value}
            </p>
            <div style={{ height: 4, background: T.border, borderRadius: 99, overflow: 'hidden' }}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${total > 0 ? (value / total) * 100 : 0}%` }}
                transition={{ duration: 0.9, ease: [0.2, 0.8, 0.2, 1] }}
                style={{ height: '100%', background: color, borderRadius: 99 }}
              />
            </div>
            <p style={{ fontSize: 10, color, fontWeight: 600, margin: '6px 0 0' }}>
              {total > 0 ? `${Math.round((value / total) * 100)}%` : '—'}
            </p>
          </Card>
        ))}
      </div>

      <Card style={{ padding: '14px 18px', marginTop: 14 }}>
        <p style={{ fontSize: 12, color: T.faint, margin: 0, lineHeight: 1.6 }}>
          The backend provides aggregate counts only. Individual RSVP records are not available in the current API version.
        </p>
      </Card>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// Photo card
// ─────────────────────────────────────────────────────────────────

function PhotoCard({ photo, onApprove, onReject, onDelete, onPreview, selectable, selected, onToggle, busy }) {
  const [confirmDel, setConfirmDel] = useState(false);

  return (
    <div style={{
      borderRadius: T.radius, overflow: 'hidden', background: T.surface,
      border: selected ? `2px solid ${T.primary}` : `1px solid ${T.border}`,
      transition: 'border-color 0.15s',
    }}>
      <div style={{ position: 'relative' }}>
        {selectable && (
          <label style={{ position: 'absolute', top: 8, left: 8, zIndex: 3, cursor: 'pointer',
            width: 20, height: 20, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <input type="checkbox" checked={selected} onChange={onToggle}
              aria-label={`Select photo by ${photo.uploadedByName || 'guest'}`}
              style={{ width: 16, height: 16, accentColor: T.primary, cursor: 'pointer' }} />
          </label>
        )}
        <div style={{ position: 'absolute', top: 8, right: 8, zIndex: 3 }}>
          <Badge status={photo.status} />
        </div>
        <button
          onClick={() => onPreview(photo)}
          aria-label={`Preview photo by ${photo.uploadedByName || 'guest'}`}
          style={{ display: 'block', width: '100%', padding: 0, border: 'none', cursor: 'pointer', background: 'none' }}
        >
          <img
            src={photo.thumbnailUrl || photo.imageUrl}
            alt={`Photo by ${photo.uploadedByName || 'guest'}`}
            loading="lazy"
            style={{ width: '100%', aspectRatio: '4/3', objectFit: 'cover', display: 'block' }}
          />
        </button>
      </div>

      <div style={{ padding: '10px 12px 12px' }}>
        <p style={{ fontSize: 11, fontWeight: 600, color: T.fg, margin: '0 0 2px',
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {photo.uploadedByName || 'Anonymous'}
        </p>
        <p style={{ fontSize: 10, color: T.faint, margin: '0 0 10px' }}>
          {new Date(photo.uploadedAtUtc).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
        </p>

        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {photo.status !== 'Approved' && onApprove && (
            <Btn variant="success" size="sm" disabled={busy} style={{ flex: 1, justifyContent: 'center' }}
              onClick={() => onApprove(photo.id)}>
              <Check size={12} /> Approve
            </Btn>
          )}
          {photo.status !== 'Rejected' && onReject && (
            <Btn variant="amber" size="sm" disabled={busy} style={{ flex: 1, justifyContent: 'center' }}
              onClick={() => onReject(photo.id)}>
              <X size={12} /> Reject
            </Btn>
          )}
          {!confirmDel ? (
            <Btn variant="ghost" size="sm" disabled={busy} onClick={() => setConfirmDel(true)}
              style={{ padding: '7px 10px', color: T.danger, borderColor: `${T.danger}30` }}
              title="Delete permanently">
              <Trash2 size={12} />
            </Btn>
          ) : (
            <div style={{ display: 'flex', gap: 4, width: '100%' }}>
              <Btn variant="danger" size="sm" style={{ flex: 1, justifyContent: 'center' }}
                disabled={busy}
                onClick={() => { setConfirmDel(false); onDelete(photo.id); }}>
                Delete
              </Btn>
              <Btn variant="ghost" size="sm" onClick={() => setConfirmDel(false)}>
                Cancel
              </Btn>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// Lightbox
// ─────────────────────────────────────────────────────────────────

function Lightbox({ photo, onClose }) {
  useEffect(() => {
    const h = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', h);
    return () => document.removeEventListener('keydown', h);
  }, [onClose]);

  return (
    <motion.div
      role="dialog" aria-modal="true"
      aria-label={`Photo by ${photo.uploadedByName || 'guest'}`}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      onClick={onClose}
      style={{ position: 'fixed', inset: 0, zIndex: 999,
        background: 'rgba(10,8,6,0.94)', backdropFilter: 'blur(6px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}
    >
      <button onClick={onClose} aria-label="Close"
        style={{ position: 'fixed', top: 14, right: 14, width: 44, height: 44,
          borderRadius: '50%', background: 'rgba(255,255,255,0.1)',
          border: '1px solid rgba(255,255,255,0.2)', color: '#fff',
          cursor: 'pointer', display: 'grid', placeItems: 'center' }}>
        <X size={18} />
      </button>
      <motion.div initial={{ scale: 0.92 }} animate={{ scale: 1 }}
        transition={{ duration: 0.25, ease: [0.2, 0.8, 0.2, 1] }}
        onClick={e => e.stopPropagation()}
        style={{ maxWidth: 'min(1000px,95vw)', textAlign: 'center' }}>
        <img src={photo.imageUrl} alt={`Photo by ${photo.uploadedByName || 'guest'}`}
          style={{ maxHeight: '85vh', maxWidth: '100%', objectFit: 'contain',
            borderRadius: 6, boxShadow: '0 24px 80px rgba(0,0,0,0.6)' }} />
        {(photo.uploadedByName || photo.caption) && (
          <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: 12, marginTop: 12 }}>
            {photo.caption || `Shared by ${photo.uploadedByName}`}
            <span style={{ marginLeft: 8 }}><Badge status={photo.status} /></span>
          </p>
        )}
      </motion.div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────
// Photo moderation
// ─────────────────────────────────────────────────────────────────

function PhotoModeration() {
  const [pending,  setPending]  = useState([]);
  const [all,      setAll]      = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState('');
  const [selected, setSelected] = useState(new Set());
  const [busy,     setBusy]     = useState(false);
  const [toast,    setToast]    = useState(null);
  const [preview,  setPreview]  = useState(null);

  const showToast = (text, ok = true) => {
    setToast({ text, ok });
    setTimeout(() => setToast(null), 3200);
  };

  const load = useCallback(async () => {
    setLoading(true); setError('');
    try {
      const [pend, allPhotos] = await Promise.allSettled([getPendingPhotos(), getAllAdminPhotos()]);
      setPending(Array.isArray(pend.value) ? pend.value : (Array.isArray(pend.value?.items) ? pend.value.items : []));
      const raw = Array.isArray(allPhotos.value) ? allPhotos.value : (Array.isArray(allPhotos.value?.items) ? allPhotos.value.items : []);
      setAll(raw);
      setSelected(new Set());
    } catch (e) {
      setError(e.message || 'Failed to load photos.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const act = async (fn, msg) => {
    setBusy(true);
    try { await fn(); showToast(msg, true); load(); }
    catch (e) { showToast(e.message || 'Action failed.', false); }
    finally { setBusy(false); }
  };

  const toggleAll = () => setSelected(prev =>
    prev.size === pending.length ? new Set() : new Set(pending.map(p => p.id))
  );

  if (loading) return <PageLoader />;
  if (error)   return <ErrBox msg={error} onRetry={load} />;

  const approved = all.filter(p => p.status === 'Approved');
  const rejected  = all.filter(p => p.status === 'Rejected');

  const SectionDot = ({ color, label, count }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 14 }}>
      <div style={{ width: 9, height: 9, borderRadius: '50%', background: color, flexShrink: 0 }} aria-hidden="true" />
      <h3 style={{ fontSize: 16, fontWeight: 600, color: T.fg, margin: 0, fontFamily: "'Jost',sans-serif" }}>
        {label}
      </h3>
      {count > 0 && (
        <span style={{ fontSize: 11, fontWeight: 700, background: color, color: '#fff',
          borderRadius: 99, padding: '2px 8px' }}>
          {count}
        </span>
      )}
    </div>
  );

  const EmptyState = ({ msg }) => (
    <Card style={{ padding: '32px 20px', textAlign: 'center', background: T.bg }}>
      <p style={{ color: T.faint, fontSize: 13, margin: 0 }}>{msg}</p>
    </Card>
  );

  return (
    <div>
      <SectionHeader title="Photos">
        <Btn variant="ghost" size="sm" onClick={load} disabled={busy}><RefreshCw size={13} /> Refresh</Btn>
      </SectionHeader>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            role={toast.ok ? 'status' : 'alert'} aria-live="polite"
            style={{ marginBottom: 16, padding: '10px 14px', borderRadius: 6, fontSize: 12, fontWeight: 500,
              background: toast.ok ? '#DCFCE7' : '#FEE2E2',
              color: toast.ok ? '#166534' : '#991B1B' }}>
            {toast.text}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Pending */}
      <section style={{ marginBottom: 40 }} aria-label="Pending approval">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          flexWrap: 'wrap', gap: 10, marginBottom: 14 }}>
          <SectionDot color={T.amber} label="Pending Approval" count={pending.length} />
          {pending.length > 0 && (
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <Btn variant="ghost" size="sm" onClick={toggleAll}>
                {selected.size === pending.length ? 'Deselect all' : 'Select all'}
              </Btn>
              {selected.size > 0 && (
                <Btn variant="success" size="sm" disabled={busy}
                  onClick={() => act(() => bulkApprovePhotos([...selected]), `${selected.size} approved.`)}>
                  <Check size={13} /> Approve {selected.size}
                </Btn>
              )}
            </div>
          )}
        </div>
        {pending.length === 0
          ? <EmptyState msg="No photos awaiting approval." />
          : <div className="ad-photo-grid">
              {pending.map(p => (
                <PhotoCard key={p.id} photo={p}
                  selectable selected={selected.has(p.id)} onToggle={() => {
                    setSelected(prev => { const n = new Set(prev); n.has(p.id) ? n.delete(p.id) : n.add(p.id); return n; });
                  }}
                  onApprove={id => act(() => approvePhoto(id), 'Photo approved.')}
                  onReject={id  => act(() => rejectPhoto(id),  'Photo rejected.')}
                  onDelete={id  => act(() => deletePhoto(id),  'Photo deleted.')}
                  onPreview={setPreview} busy={busy} />
              ))}
            </div>
        }
      </section>

      {/* Approved */}
      <section style={{ marginBottom: 40 }} aria-label="Approved photos">
        <SectionDot color={T.success} label="Approved" count={approved.length} />
        {approved.length === 0
          ? <EmptyState msg="No approved photos yet." />
          : <div className="ad-photo-grid">
              {approved.map(p => (
                <PhotoCard key={p.id} photo={p}
                  onReject={id => act(() => rejectPhoto(id), 'Moved to rejected.')}
                  onDelete={id => act(() => deletePhoto(id), 'Photo deleted.')}
                  onPreview={setPreview} busy={busy} />
              ))}
            </div>
        }
      </section>

      {/* Rejected */}
      {rejected.length > 0 && (
        <section aria-label="Rejected photos">
          <SectionDot color={T.danger} label="Rejected" count={rejected.length} />
          <div className="ad-photo-grid">
            {rejected.map(p => (
              <PhotoCard key={p.id} photo={p}
                onApprove={id => act(() => approvePhoto(id), 'Photo approved.')}
                onDelete={id  => act(() => deletePhoto(id),  'Photo deleted.')}
                onPreview={setPreview} busy={busy} />
            ))}
          </div>
        </section>
      )}

      <AnimatePresence>
        {preview && <Lightbox key="lb" photo={preview} onClose={() => setPreview(null)} />}
      </AnimatePresence>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// Wedding Settings
// ─────────────────────────────────────────────────────────────────

function WeddingSettings() {
  const BLANK = { name: '', venue: '', eventDateUtc: '', rsvpEnabled: true, guestUploadsEnabled: true, autoApprovePhotos: false };
  const [form,    setForm]    = useState(BLANK);
  const [orig,    setOrig]    = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving,  setSaving]  = useState(false);
  const [msg,     setMsg]     = useState('');
  const [error,   setError]   = useState('');

  const isDirty = orig !== null && JSON.stringify(form) !== JSON.stringify(orig);

  useEffect(() => {
    getAdminWeddingConfig()
      .then(cfg => {
        const v = {
          name:                cfg.name               ?? '',
          venue:               cfg.venue              ?? '',
          eventDateUtc:        cfg.eventDateUtc ? cfg.eventDateUtc.replace('Z','').substring(0,16) : '',
          rsvpEnabled:         cfg.rsvpEnabled         ?? true,
          guestUploadsEnabled: cfg.guestUploadsEnabled ?? true,
          autoApprovePhotos:   cfg.autoApprovePhotos   ?? false,
        };
        setForm(v); setOrig(v);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const save = async (e) => {
    e.preventDefault();
    setSaving(true); setMsg(''); setError('');
    try {
      const payload = {};
      if (form.name)         payload.name         = form.name;
      if (form.venue)        payload.venue        = form.venue;
      if (form.eventDateUtc) payload.eventDateUtc = new Date(form.eventDateUtc).toISOString();
      payload.rsvpEnabled         = form.rsvpEnabled;
      payload.guestUploadsEnabled = form.guestUploadsEnabled;
      payload.autoApprovePhotos   = form.autoApprovePhotos;
      await updateWeddingConfig(payload);
      setMsg('Settings saved.'); setOrig({ ...form });
    } catch (err) {
      setError(err.message || 'Update failed.');
    } finally { setSaving(false); }
  };

  if (loading) return <PageLoader />;

  const Field = ({ label, name, type = 'text', placeholder }) => (
    <label className="ad-field">
      <span className="ad-field-label">{label}</span>
      <input
        type={type}
        value={form[name]}
        placeholder={placeholder}
        onChange={e => setForm(f => ({ ...f, [name]: e.target.value }))}
        className="ad-input"
      />
    </label>
  );

  const Toggle = ({ name, label, desc }) => (
    <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      cursor: 'pointer', padding: '14px 16px', borderRadius: 8,
      background: form[name] ? '#F0FDF4' : T.bg,
      border: `1px solid ${form[name] ? '#86EFAC' : T.border}`,
      transition: 'all 0.2s', minHeight: 64, gap: 12 }}>
      <div style={{ minWidth: 0 }}>
        <p style={{ fontSize: 13, fontWeight: 600, color: T.fg, margin: 0 }}>{label}</p>
        <p style={{ fontSize: 11, color: T.faint, margin: '2px 0 0' }}>{desc}</p>
      </div>
      <input type="checkbox" checked={form[name]}
        onChange={e => setForm(f => ({ ...f, [name]: e.target.checked }))}
        aria-label={label} style={{ display: 'none' }} />
      {form[name]
        ? <ToggleRight size={28} color={T.success} style={{ flexShrink: 0 }} aria-hidden="true" />
        : <ToggleLeft  size={28} color={T.faint}   style={{ flexShrink: 0 }} aria-hidden="true" />
      }
    </label>
  );

  return (
    <div>
      <SectionHeader title="Settings" />

      <form onSubmit={save}>
        <Card style={{ padding: '22px 24px', marginBottom: 16 }}>
          <p className="ad-section-label">Wedding Details</p>
          <div className="ad-form-grid">
            <Field label="Wedding name" name="name" placeholder="Rahul & Priya Wedding" />
            <Field label="Venue" name="venue" placeholder="Grand Hall, Bangalore" />
            <Field label="Event date & time (UTC)" name="eventDateUtc" type="datetime-local" />
          </div>
        </Card>

        <Card style={{ padding: '22px 24px', marginBottom: 20 }}>
          <p className="ad-section-label">Feature Flags</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <Toggle name="rsvpEnabled" label="RSVPs open" desc="Allow guests to submit RSVPs" />
            <Toggle name="guestUploadsEnabled" label="Guest uploads open" desc="Allow guests to upload photos" />
            <Toggle name="autoApprovePhotos" label="Auto-approve photos" desc="Automatically approve all uploaded photos" />
          </div>
        </Card>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          <Btn variant="primary" disabled={!isDirty || saving}>
            {saving
              ? <><Spin size={13} color="#fff" /> Saving…</>
              : <><Save size={13} /> Save changes</>
            }
          </Btn>
          {isDirty && !saving && (
            <span style={{ fontSize: 12, color: T.warning, fontWeight: 500 }}>
              You have unsaved changes
            </span>
          )}
          {msg   && <span style={{ fontSize: 12, color: T.success }} role="status">{msg}</span>}
          {error && <span style={{ fontSize: 12, color: T.danger  }} role="alert">{error}</span>}
        </div>
      </form>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// Change Password
// ─────────────────────────────────────────────────────────────────

function ChangePassword({ onSuccess }) {
  const [form,    setForm]    = useState({ cur: '', next: '', confirm: '' });
  const [show,    setShow]    = useState(false);
  const [saving,  setSaving]  = useState(false);
  const [msg,     setMsg]     = useState('');
  const [error,   setError]   = useState('');

  const submit = async (e) => {
    e.preventDefault();
    if (form.next !== form.confirm) { setError('Passwords do not match.'); return; }
    if (form.next.length < 8)       { setError('Password must be at least 8 characters.'); return; }
    setSaving(true); setMsg(''); setError('');
    try {
      await changePassword({ currentPassword: form.cur, newPassword: form.next });
      setMsg('Password updated successfully.');
      setForm({ cur: '', next: '', confirm: '' });
      onSuccess?.();
    } catch (err) { setError(err.message || 'Failed to change password.'); }
    finally { setSaving(false); }
  };

  return (
    <div>
      <SectionHeader title="Password" />
      <Card style={{ padding: '24px', maxWidth: 460 }}>
        <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {[
            { key: 'cur',     label: 'Current password',      auto: 'current-password' },
            { key: 'next',    label: 'New password',           auto: 'new-password'     },
            { key: 'confirm', label: 'Confirm new password',   auto: 'new-password'     },
          ].map(({ key, label, auto }) => (
            <label key={key} className="ad-field">
              <span className="ad-field-label">{label}</span>
              <input type={show ? 'text' : 'password'} autoComplete={auto} required
                value={form[key]}
                onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                className="ad-input" />
            </label>
          ))}

          <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: T.muted,
            cursor: 'pointer', userSelect: 'none' }}>
            <input type="checkbox" checked={show} onChange={e => setShow(e.target.checked)}
              style={{ width: 14, height: 14, accentColor: T.primary }} />
            Show passwords
          </label>

          {msg   && <p style={{ fontSize: 12, color: T.success, margin: 0 }} role="status">{msg}</p>}
          {error && <p style={{ fontSize: 12, color: T.danger,  margin: 0 }} role="alert">{error}</p>}

          <Btn variant="primary" disabled={saving}>
            {saving ? <><Spin size={13} color="#fff" /> Saving…</> : 'Update password'}
          </Btn>
        </form>
      </Card>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// Shell — mobile-first navigation
// ─────────────────────────────────────────────────────────────────

const NAV = [
  { id: 'dashboard', label: 'Overview',  Icon: LayoutDashboard },
  { id: 'rsvp',      label: 'RSVPs',     Icon: Users           },
  { id: 'photos',    label: 'Photos',    Icon: Images          },
  { id: 'settings',  label: 'Settings',  Icon: Settings        },
  { id: 'password',  label: 'Password',  Icon: Key             },
];

export function AdminDashboard({ me, mustChange, onMustChangeResolved, onLogout, page, setPage }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (mustChange) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center',
        justifyContent: 'center', padding: 24, background: T.bg, fontFamily: "'Jost',sans-serif" }}>
        <div style={{ maxWidth: 480, width: '100%' }}>
          <div style={{ background: '#FEF9C3', border: `1px solid #FDE047`, borderRadius: 8,
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
    <div className="ad-root" style={{ fontFamily: "'Jost',sans-serif" }}>

      {/* ── Desktop sidebar ── */}
      <aside className="ad-sidebar" aria-label="Admin navigation">
        <div className="ad-sidebar-header">
          <Heart size={16} fill="#C4A6B2" color="#C4A6B2" aria-hidden="true" />
          <span className="ad-sidebar-title">Admin</span>
        </div>
        {me && (
          <div className="ad-sidebar-user">
            <div className="ad-sidebar-avatar">
              {(me.fullName || me.username || '?').charAt(0).toUpperCase()}
            </div>
            <span className="ad-sidebar-username">{me.fullName || me.username}</span>
          </div>
        )}
        <nav className="ad-sidebar-nav" aria-label="Admin sections">
          {NAV.map(({ id, label, Icon }) => (
            <button key={id} className={`ad-nav-item${page === id ? ' ad-nav-item--active' : ''}`}
              onClick={() => setPage(id)} aria-current={page === id ? 'page' : undefined}>
              <Icon size={16} aria-hidden="true" />
              <span>{label}</span>
            </button>
          ))}
        </nav>
        <button className="ad-nav-item ad-signout" onClick={onLogout}>
          <LogOut size={16} aria-hidden="true" />
          <span>Sign out</span>
        </button>
      </aside>

      {/* ── Mobile header ── */}
      <header className="ad-mobile-header" role="banner">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Heart size={15} fill="#C4A6B2" color="#C4A6B2" aria-hidden="true" />
          <span style={{ fontFamily: "'Cormorant Garamond',Georgia,serif", fontSize: 16, fontWeight: 600, color: '#fff' }}>
            {me ? (me.fullName || me.username) : 'Admin'}
          </span>
        </div>
        <span style={{ fontSize: 13, fontWeight: 600, color: '#C4A6B2', letterSpacing: '0.02em' }}>
          {NAV.find(n => n.id === page)?.label}
        </span>
        <button onClick={onLogout} aria-label="Sign out"
          style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none',
            cursor: 'pointer', color: '#9A9088', fontSize: 12 }}>
          <LogOut size={15} />
        </button>
      </header>

      {/* ── Main content ── */}
      <main className="ad-main" id="admin-main-content">
        <AnimatePresence mode="wait">
          <motion.div key={page}
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
            {page === 'dashboard' && <Overview />}
            {page === 'rsvp'      && <RsvpSection />}
            {page === 'photos'    && <PhotoModeration />}
            {page === 'settings'  && <WeddingSettings />}
            {page === 'password'  && <ChangePassword />}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* ── Mobile bottom tab bar ── */}
      <nav className="ad-bottom-nav" aria-label="Admin navigation">
        {NAV.map(({ id, label, Icon }) => (
          <button key={id}
            className={`ad-bottom-tab${page === id ? ' ad-bottom-tab--active' : ''}`}
            onClick={() => setPage(id)}
            aria-current={page === id ? 'page' : undefined}
            aria-label={label}>
            <Icon size={20} aria-hidden="true" />
            <span>{label}</span>
          </button>
        ))}
      </nav>

      <style>{`
        /* ── CSS reset for admin ── */
        .ad-root * { box-sizing: border-box; }

        /* ── Layout ── */
        .ad-root {
          display: grid;
          grid-template-columns: 220px 1fr;
          grid-template-rows: auto 1fr;
          min-height: 100svh;
          background: ${T.bg};
        }

        /* ── Sidebar (desktop only) ── */
        .ad-sidebar {
          grid-row: 1 / -1;
          background: ${T.sidebar};
          display: flex;
          flex-direction: column;
          position: sticky;
          top: 0;
          height: 100svh;
          overflow-y: auto;
          overflow-x: hidden;
        }

        .ad-sidebar-header {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 22px 20px 14px;
          border-bottom: 1px solid rgba(255,255,255,0.07);
        }

        .ad-sidebar-title {
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: 18px;
          font-weight: 600;
          color: ${T.sidebarFg};
        }

        .ad-sidebar-user {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px 20px;
          border-bottom: 1px solid rgba(255,255,255,0.07);
        }

        .ad-sidebar-avatar {
          width: 32px; height: 32px;
          border-radius: 50%;
          background: rgba(196,166,178,0.2);
          display: grid; place-items: center;
          font-size: 13px; font-weight: 700;
          color: #C4A6B2; flex-shrink: 0;
        }

        .ad-sidebar-username {
          font-size: 12px;
          color: ${T.sidebarMuted};
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .ad-sidebar-nav {
          flex: 1;
          padding: 10px 10px;
        }

        .ad-nav-item {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 11px 13px;
          border: none;
          border-radius: 7px;
          cursor: pointer;
          background: transparent;
          color: ${T.sidebarMuted};
          font-size: 13px;
          font-weight: 400;
          font-family: 'Jost', sans-serif;
          margin-bottom: 2px;
          text-align: left;
          transition: background 0.15s, color 0.15s;
          min-height: 44px;
        }

        .ad-nav-item:hover { background: rgba(255,255,255,0.07); color: ${T.sidebarFg}; }

        .ad-nav-item--active {
          background: rgba(196,166,178,0.16);
          color: #E8D4DC;
          font-weight: 600;
        }

        .ad-signout {
          margin: 10px 10px 16px;
          color: ${T.sidebarMuted};
        }

        .ad-signout:hover { color: ${T.sidebarFg}; background: rgba(255,255,255,0.06); }

        /* ── Mobile header ── */
        .ad-mobile-header {
          display: none;
          align-items: center;
          justify-content: space-between;
          height: 56px;
          padding: 0 18px;
          background: ${T.sidebar};
          position: sticky;
          top: 0;
          z-index: 30;
          grid-column: 1 / -1;
        }

        /* ── Main content ── */
        .ad-main {
          padding: clamp(20px, 3vw, 36px) clamp(16px, 3vw, 36px);
          overflow-y: auto;
          grid-column: 2;
          /* room for bottom nav on mobile */
          padding-bottom: clamp(20px, 3vw, 36px);
        }

        /* ── Bottom nav (mobile only) ── */
        .ad-bottom-nav {
          display: none;
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          z-index: 40;
          background: ${T.sidebar};
          border-top: 1px solid rgba(255,255,255,0.08);
          /* safe area for notched phones */
          padding-bottom: env(safe-area-inset-bottom, 0px);
        }

        .ad-bottom-tab {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 3px;
          padding: 10px 4px;
          min-height: 56px;
          border: none;
          background: none;
          cursor: pointer;
          color: ${T.sidebarMuted};
          font-size: 9px;
          font-weight: 500;
          font-family: 'Jost', sans-serif;
          letter-spacing: 0.04em;
          transition: color 0.15s;
        }

        .ad-bottom-tab--active { color: #E8D4DC; }
        .ad-bottom-tab:hover   { color: ${T.sidebarFg}; }

        /* ── Stat grid ── */
        .ad-stat-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(min(180px, 100%), 1fr));
          gap: 12px;
          margin-bottom: 16px;
        }

        /* ── Photo grid ── */
        .ad-photo-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(min(190px, 100%), 1fr));
          gap: 14px;
          margin-bottom: 14px;
        }

        /* ── Form fields ── */
        .ad-field {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .ad-field-label {
          font-size: 11px;
          font-weight: 600;
          color: #4A4540;
          letter-spacing: 0.04em;
        }

        .ad-input {
          display: block;
          width: 100%;
          padding: 10px 12px;
          font-size: 13px;
          font-family: 'Jost', sans-serif;
          border: 1px solid ${T.border};
          border-radius: 6px;
          background: ${T.bg};
          color: ${T.fg};
          outline: none;
          transition: border-color 0.2s;
        }

        .ad-input:focus { border-color: ${T.primary}; }

        .ad-form-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(min(240px, 100%), 1fr));
          gap: 16px;
        }

        .ad-section-label {
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.1em;
          color: #C4B8B0;
          text-transform: uppercase;
          margin: 0 0 14px;
        }

        /* ── Mobile breakpoint ── */
        @media (max-width: 768px) {
          .ad-root {
            grid-template-columns: 1fr;
            grid-template-rows: 56px 1fr auto;
          }

          .ad-sidebar      { display: none; }
          .ad-mobile-header { display: flex; }

          .ad-main {
            grid-column: 1;
            padding-bottom: calc(72px + env(safe-area-inset-bottom, 0px));
          }

          .ad-bottom-nav { display: flex; }

          .ad-stat-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 10px;
          }

          .ad-photo-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 10px;
          }

          .ad-form-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 400px) {
          .ad-stat-grid  { grid-template-columns: 1fr; }
          .ad-photo-grid { grid-template-columns: 1fr; }
        }

        @keyframes adSpin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

        @media (prefers-reduced-motion: reduce) {
          .ad-root * { transition: none !important; animation: none !important; }
        }
      `}</style>
    </div>
  );
}

export default AdminDashboard;
