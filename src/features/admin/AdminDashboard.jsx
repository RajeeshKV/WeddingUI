import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Images, Settings, LogOut, Heart,
  Users, CheckCircle, Clock, Check, X, Trash2,
  Key, AlertTriangle, Loader2, UserCheck, UserX,
  RefreshCw, ToggleLeft, ToggleRight, Save,
} from 'lucide-react';
import {
  getAdminDashboard,
  getPendingPhotos, getAllAdminPhotos,
  approvePhoto, rejectPhoto, deletePhoto, bulkApprovePhotos,
  updateWeddingConfig, changePassword, getAdminWeddingConfig,
  getAdminRsvps,
} from '../../services/api/admin.js';

// ── Design tokens ──────────────────────────────────────────────
const T = {
  bg:           '#F4F2EF',
  surface:      '#FFFFFF',
  surfaceHover: '#FAFAF9',
  border:       '#E8E4DF',
  borderStrong: '#D4CFC8',
  fg:           '#1A1714',
  muted:        '#6B6560',
  faint:        '#9A9088',
  primary:      '#7B5C72',
  primaryLight: '#F5EDF3',
  primaryFg:    '#FFFFFF',
  sidebar:      '#141210',
  sidebarBorder:'rgba(255,255,255,0.06)',
  sidebarFg:    '#F0EBE6',
  sidebarMuted: '#6E665E',
  sidebarActive:'rgba(196,166,178,0.14)',
  success:      '#16a34a',
  successLight: '#DCFCE7',
  warning:      '#ca8a04',
  warningLight: '#FEF9C3',
  danger:       '#dc2626',
  dangerLight:  '#FEE2E2',
  amber:        '#d97706',
  violet:       '#7c3aed',
  teal:         '#0891b2',
  r:            8,
  ease:         '0.18s ease',
};

// ── Shared primitives ──────────────────────────────────────────

const Card = ({ children, style, p = 20 }) => (
  <div style={{ background: T.surface, borderRadius: T.r, border: `1px solid ${T.border}`, padding: p, ...style }}>
    {children}
  </div>
);

const Spin = ({ size = 22, color = T.primary }) => (
  <Loader2 size={size} color={color} aria-hidden="true"
    style={{ animation: 'adSpin 0.85s linear infinite', flexShrink: 0 }} />
);

const PageLoader = () => (
  <div style={{ display: 'flex', justifyContent: 'center', padding: '72px 0' }}>
    <Spin size={26} />
  </div>
);

const ErrBox = ({ msg, onRetry }) => (
  <div style={{ background: T.dangerLight, border: `1px solid #FCA5A5`,
    borderRadius: T.r, padding: '14px 18px', display: 'flex', alignItems: 'flex-start', gap: 12 }}>
    <AlertTriangle size={15} color={T.danger} style={{ flexShrink: 0, marginTop: 2 }} aria-hidden="true" />
    <div>
      <p style={{ color: '#991B1B', fontSize: 13, margin: 0, lineHeight: 1.5 }}>{msg}</p>
      {onRetry && (
        <button onClick={onRetry}
          style={{ marginTop: 8, fontSize: 12, fontWeight: 600, color: T.danger,
            background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
          Retry
        </button>
      )}
    </div>
  </div>
);

const StatusBadge = ({ status }) => {
  const map = {
    Approved:    { bg: T.successLight, fg: '#15803d' },
    Rejected:    { bg: T.dangerLight,  fg: '#b91c1c' },
    Pending:     { bg: T.warningLight, fg: '#92400e' },
    Attending:   { bg: T.successLight, fg: '#15803d' },
    NotAttending:{ bg: T.dangerLight,  fg: '#b91c1c' },
    Maybe:       { bg: T.warningLight, fg: '#92400e' },
  };
  const s = map[status] || { bg: '#F3F4F6', fg: '#374151' };
  return (
    <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase',
      background: s.bg, color: s.fg, borderRadius: 99, padding: '3px 9px', whiteSpace: 'nowrap' }}>
      {status}
    </span>
  );
};

// Button
const Btn = ({ children, onClick, variant = 'ghost', size = 'md', disabled, style: s, type }) => {
  const pad  = { sm: '6px 12px', md: '8px 16px', lg: '10px 20px' };
  const fs   = { sm: 11, md: 12, lg: 13 };
  const vars = {
    ghost:   { background: 'transparent', border: `1px solid ${T.border}`, color: T.muted },
    primary: { background: T.primary, border: 'none', color: T.primaryFg },
    success: { background: T.success, border: 'none', color: '#fff' },
    danger:  { background: T.danger,  border: 'none', color: '#fff' },
    amber:   { background: T.amber,   border: 'none', color: '#fff' },
    subtle:  { background: T.primaryLight, border: 'none', color: T.primary },
  };
  return (
    <button type={type || 'button'} onClick={onClick} disabled={disabled}
      style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: pad[size], borderRadius: 6,
        fontSize: fs[size], fontWeight: 600, cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.45 : 1, transition: T.ease, fontFamily: "'Jost',sans-serif",
        lineHeight: 1, ...vars[variant], ...s }}>
      {children}
    </button>
  );
};

const SectionHeader = ({ title, sub, children }) => (
  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
    flexWrap: 'wrap', gap: 10, marginBottom: 22 }}>
    <div>
      <h2 style={{ fontFamily: "'Cormorant Garamond',Georgia,serif", fontSize: 22, fontWeight: 600,
        color: T.fg, margin: 0, lineHeight: 1.2 }}>
        {title}
      </h2>
      {sub && <p style={{ fontSize: 12, color: T.faint, margin: '4px 0 0' }}>{sub}</p>}
    </div>
    {children && <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>{children}</div>}
  </div>
);

// ── Pagination (client-side) ────────────────────────────────────
const PAGE_SIZE = 10;

// Plain hook — MUST always be called, never conditionally
function usePagedSlice(items) {
  const [page, setPage] = useState(1);
  const total      = items.length;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const safePage   = Math.min(page, totalPages);
  const slice      = items.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);
  // Reset page when source changes (safe: this runs after render, not during)
  useEffect(() => { setPage(1); }, [total]); // eslint-disable-line
  return { page: safePage, setPage, totalPages, total, slice };
}

const PaginationBar = ({ pager, label = 'items' }) => {
  const { page, setPage, totalPages, total } = pager;
  if (totalPages <= 1) return null;
  const start = Math.max(1, Math.min(page - 2, totalPages - 4));
  const pills  = Array.from({ length: Math.min(5, totalPages) }, (_, i) => start + i).filter(n => n <= totalPages);
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      flexWrap: 'wrap', gap: 8, marginTop: 12,
      padding: '9px 14px', borderRadius: T.r, background: T.surface, border: `1px solid ${T.border}` }}>
      <span style={{ fontSize: 11, color: T.faint }}>
        Page {page} of {totalPages}&nbsp;&nbsp;·&nbsp;&nbsp;{total} {label}
      </span>
      <div style={{ display: 'flex', gap: 4 }}>
        <Btn size="sm" disabled={page <= 1} onClick={() => setPage(p => p - 1)} style={{ padding: '5px 10px' }}>Prev</Btn>
        {pills.map(n => (
          <Btn key={n} size="sm" variant={n === page ? 'primary' : 'ghost'}
            style={{ padding: '5px 9px', minWidth: 30, justifyContent: 'center' }}
            onClick={() => setPage(n)}>{n}</Btn>
        ))}
        <Btn size="sm" disabled={page >= totalPages} onClick={() => setPage(p => p + 1)} style={{ padding: '5px 10px' }}>Next</Btn>
      </div>
    </div>
  );
};

// ── Overview ───────────────────────────────────────────────────

function Overview() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(() => {
    setLoading(true); setError('');
    getAdminDashboard()
      .then(setStats)
      .catch(e => setError(e.message || 'Failed to load.'))
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
      <SectionHeader title="Overview">
        <Btn size="sm" onClick={load}><RefreshCw size={12} /> Refresh</Btn>
      </SectionHeader>

      {/* Photos row */}
      <p style={sLabel}>PHOTOS</p>
      <div className="ad-grid-3" style={{ marginBottom: 20 }}>
        {[
          { label: 'Total',    value: stats.totalPhotos,    color: T.violet, Icon: Images       },
          { label: 'Pending',  value: stats.pendingPhotos,  color: T.amber,  Icon: Clock        },
          { label: 'Approved', value: stats.approvedPhotos, color: T.success,Icon: CheckCircle  },
        ].map(({ label, value, color, Icon }) => (
          <Card key={label} style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 40, height: 40, borderRadius: 9, background: `${color}15`,
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Icon size={18} color={color} aria-hidden="true" />
            </div>
            <div>
              <p style={{ fontSize: 10, fontWeight: 700, color: T.faint, letterSpacing: '0.08em',
                textTransform: 'uppercase', margin: '0 0 3px' }}>{label}</p>
              <p style={{ fontSize: 26, fontWeight: 700, color: T.fg, margin: 0, lineHeight: 1,
                fontFamily: "'Cormorant Garamond',Georgia,serif" }}>{value ?? 0}</p>
            </div>
          </Card>
        ))}
      </div>

      {/* RSVPs row — 4 inline */}
      <p style={sLabel}>RSVP SUMMARY</p>
      <div className="ad-rsvp-stat-row" style={{ marginBottom: 20 }}>
        {[
          { label: 'Total RSVPs',   value: total,        color: T.primary },
          { label: 'Attending',     value: attending,    color: T.success },
          { label: 'Not Attending', value: notAttending, color: T.danger  },
          { label: 'Maybe',         value: maybe,        color: T.amber   },
        ].map(({ label, value, color }) => (
          <div key={label} style={{ flex: '1 1 0', padding: '16px 18px', background: T.surface,
            border: `1px solid ${T.border}`, borderRadius: T.r, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: color, flexShrink: 0 }} aria-hidden="true" />
              <p style={{ fontSize: 10, fontWeight: 700, color: T.faint, letterSpacing: '0.08em',
                textTransform: 'uppercase', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{label}</p>
            </div>
            <p style={{ fontSize: 30, fontWeight: 700, color: T.fg, margin: 0, lineHeight: 1,
              fontFamily: "'Cormorant Garamond',Georgia,serif" }}>{value ?? 0}</p>
          </div>
        ))}
      </div>

      {/* Breakdown bars */}
      <Card p={20}>
        <p style={{ ...sLabel, marginBottom: 12 }}>RESPONSE BREAKDOWN</p>
        {[
          { label: 'Attending',     value: attending,    color: T.success },
          { label: 'Not Attending', value: notAttending, color: T.danger  },
          { label: 'Maybe',         value: maybe,        color: T.amber   },
        ].map(({ label, value, color }) => {
          const pct = total > 0 ? Math.round((value / total) * 100) : 0;
          return (
            <div key={label} style={{ marginBottom: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ fontSize: 12, fontWeight: 500, color: T.fg }}>{label}</span>
                <span style={{ fontSize: 12, fontWeight: 700, color }}>
                  {value} <span style={{ color: T.faint, fontWeight: 400 }}>({pct}%)</span>
                </span>
              </div>
              <div style={{ height: 4, background: T.border, borderRadius: 99, overflow: 'hidden' }}>
                <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }}
                  transition={{ duration: 0.85, ease: [0.2, 0.8, 0.2, 1] }}
                  style={{ height: '100%', background: color, borderRadius: 99 }} />
              </div>
            </div>
          );
        })}
      </Card>
    </div>
  );
}

// ── RSVP Section ───────────────────────────────────────────────

function RsvpSection() {
  const [items,      setItems]      = useState([]);
  const [stats,      setStats]      = useState(null);
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState('');
  const [filter,     setFilter]     = useState('');
  const [apiPage,    setApiPage]    = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const PAGE = 10;

  const load = useCallback(async (pg, st) => {
    setLoading(true); setError('');
    try {
      const [rsvpRes, statsRes] = await Promise.allSettled([
        getAdminRsvps({ page: pg, pageSize: PAGE, ...(st ? { status: st } : {}) }),
        getAdminDashboard(),
      ]);
      if (rsvpRes.status === 'fulfilled') {
        const d = rsvpRes.value;
        const rows = Array.isArray(d) ? d : (Array.isArray(d?.items) ? d.items : []);
        setItems(rows);
        setTotalCount(d?.totalCount ?? rows.length);
        setTotalPages((d?.totalPages ?? Math.ceil((d?.totalCount ?? rows.length) / PAGE)) || 1);
      } else {
        setError(rsvpRes.reason?.message || 'Failed to load RSVPs.');
      }
      if (statsRes.status === 'fulfilled') setStats(statsRes.value);
    } finally { setLoading(false); }
  }, []); // eslint-disable-line

  useEffect(() => { load(apiPage, filter); }, [apiPage, filter]); // eslint-disable-line

  const handleFilter = (st) => { setFilter(st); setApiPage(1); };

  const attending    = stats?.attending    ?? stats?.attendingCount    ?? 0;
  const notAttending = stats?.notAttending ?? stats?.notAttendingCount ?? 0;
  const maybe        = stats?.maybe        ?? stats?.maybeCount        ?? 0;
  const total        = stats?.totalRsvps   ?? 0;

  // 4 filters only — no Pending
  const FILTERS = [
    { value: '',             label: 'All' },
    { value: 'Attending',    label: 'Attending' },
    { value: 'NotAttending', label: 'Not Attending' },
    { value: 'Maybe',        label: 'Maybe' },
  ];

  const STATUS_COLOR = { Attending: T.success, NotAttending: T.danger, Maybe: T.amber, Pending: T.faint };

  return (
    <div>
      <SectionHeader title="RSVPs">
        <Btn size="sm" onClick={() => load(apiPage, filter)}><RefreshCw size={12} /> Refresh</Btn>
      </SectionHeader>

      {/* 4-in-a-row stat strip */}
      {stats && (
        <div className="ad-rsvp-stat-row" style={{ marginBottom: 20 }}>
          {[
            { label: 'Total',         value: total,        color: T.primary },
            { label: 'Attending',     value: attending,    color: T.success },
            { label: 'Not Attending', value: notAttending, color: T.danger  },
            { label: 'Maybe',         value: maybe,        color: T.amber   },
          ].map(({ label, value, color }) => (
            <div key={label} style={{ flex: '1 1 0', padding: '14px 16px', background: T.surface,
              border: `1px solid ${T.border}`, borderRadius: T.r, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 7 }}>
                <div style={{ width: 7, height: 7, borderRadius: '50%', background: color, flexShrink: 0 }} aria-hidden="true" />
                <p style={{ fontSize: 9, fontWeight: 700, color: T.faint, letterSpacing: '0.09em',
                  textTransform: 'uppercase', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{label}</p>
              </div>
              <p style={{ fontSize: 28, fontWeight: 700, color: T.fg, margin: 0, lineHeight: 1,
                fontFamily: "'Cormorant Garamond',Georgia,serif" }}>{value ?? 0}</p>
            </div>
          ))}
        </div>
      )}

      {/* Filter tabs */}
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 16 }}>
        {FILTERS.map(({ value, label }) => (
          <button key={value} onClick={() => handleFilter(value)}
            style={{ padding: '6px 14px', borderRadius: 999, fontSize: 11, fontWeight: 600,
              cursor: 'pointer', fontFamily: "'Jost',sans-serif",
              border: `1px solid ${filter === value ? T.primary : T.border}`,
              background: filter === value ? T.primary : 'transparent',
              color: filter === value ? T.primaryFg : T.muted, transition: T.ease }}>
            {label}
          </button>
        ))}
      </div>

      {loading && <PageLoader />}
      {!loading && error && <ErrBox msg={error} onRetry={() => load(apiPage, filter)} />}
      {!loading && !error && items.length === 0 && (
        <Card style={{ padding: '40px 20px', textAlign: 'center', background: T.bg }}>
          <p style={{ color: T.faint, fontSize: 13, margin: 0 }}>
            {filter ? `No ${filter} RSVPs.` : 'No RSVPs received yet.'}
          </p>
        </Card>
      )}

      {!loading && !error && items.length > 0 && (
        <>
          {/* Desktop table */}
          <div className="ad-rsvp-table-wrap">
            <table className="ad-rsvp-table" aria-label="RSVP list">
              <thead>
                <tr>
                  {['Guest', 'Status', 'Guests', 'Contact', 'Message', 'Submitted'].map(h => (
                    <th key={h}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {items.map(r => (
                  <tr key={r.id}>
                    <td className="ad-rsvp-name">{r.guestName || '—'}</td>
                    <td><StatusBadge status={r.status} /></td>
                    <td style={{ textAlign: 'center' }}>{r.guestCount ?? 1}</td>
                    <td className="ad-rsvp-contact">
                      {r.email && <span>{r.email}</span>}
                      {r.phone && <span>{r.phone}</span>}
                      {!r.email && !r.phone && <span style={{ color: T.faint }}>—</span>}
                    </td>
                    <td className="ad-rsvp-msg">{r.message || <span style={{ color: T.faint }}>—</span>}</td>
                    <td style={{ whiteSpace: 'nowrap', color: T.faint, fontSize: 11 }}>
                      {new Date(r.submittedAtUtc).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="ad-rsvp-cards">
            {items.map(r => (
              <Card key={r.id} p={14} style={{ marginBottom: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                  <p style={{ fontSize: 14, fontWeight: 600, color: T.fg, margin: 0 }}>{r.guestName || '—'}</p>
                  <StatusBadge status={r.status} />
                </div>
                <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', fontSize: 12, color: T.muted }}>
                  <span>{r.guestCount ?? 1} guest{(r.guestCount ?? 1) !== 1 ? 's' : ''}</span>
                  {r.email && <span>{r.email}</span>}
                  {r.phone && <span>{r.phone}</span>}
                </div>
                {r.message && (
                  <p style={{ fontSize: 12, color: T.muted, margin: '8px 0 0',
                    borderTop: `1px solid ${T.border}`, paddingTop: 8, lineHeight: 1.5 }}>
                    {r.message}
                  </p>
                )}
                <p style={{ fontSize: 10, color: T.faint, margin: '6px 0 0' }}>
                  {new Date(r.submittedAtUtc).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                </p>
              </Card>
            ))}
          </div>

          {/* Pagination */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            flexWrap: 'wrap', gap: 8, marginTop: 12,
            padding: '9px 14px', borderRadius: T.r, background: T.surface, border: `1px solid ${T.border}` }}>
            <span style={{ fontSize: 11, color: T.faint }}>
              Page {apiPage} of {totalPages} · {totalCount} RSVPs
            </span>
            <div style={{ display: 'flex', gap: 4 }}>
              <Btn size="sm" disabled={apiPage <= 1 || loading}
                onClick={() => setApiPage(p => p - 1)} style={{ padding: '5px 10px' }}>Prev</Btn>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const n = Math.max(1, Math.min(apiPage - 2, totalPages - 4)) + i;
                return n <= totalPages ? (
                  <Btn key={n} size="sm" variant={n === apiPage ? 'primary' : 'ghost'}
                    style={{ padding: '5px 9px', minWidth: 30, justifyContent: 'center' }}
                    onClick={() => setApiPage(n)}>{n}</Btn>
                ) : null;
              })}
              <Btn size="sm" disabled={apiPage >= totalPages || loading}
                onClick={() => setApiPage(p => p + 1)} style={{ padding: '5px 10px' }}>Next</Btn>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// ── Photo card ─────────────────────────────────────────────────

function PhotoCard({ photo, onApprove, onReject, onDelete, onPreview, selectable, selected, onToggle, busy }) {
  const [confirmDel, setConfirmDel] = useState(false);
  return (
    <div style={{ borderRadius: T.r, overflow: 'hidden', background: T.surface,
      border: selected ? `2px solid ${T.primary}` : `1px solid ${T.border}`, transition: 'border-color 0.15s' }}>
      <div style={{ position: 'relative' }}>
        {selectable && (
          <label style={{ position: 'absolute', top: 8, left: 8, zIndex: 3, cursor: 'pointer' }}>
            <input type="checkbox" checked={selected} onChange={onToggle}
              aria-label={`Select photo by ${photo.uploadedByName || 'guest'}`}
              style={{ width: 16, height: 16, accentColor: T.primary, cursor: 'pointer' }} />
          </label>
        )}
        <div style={{ position: 'absolute', top: 8, right: 8, zIndex: 3 }}>
          <StatusBadge status={photo.status} />
        </div>
        <button onClick={() => onPreview(photo)}
          aria-label={`Preview photo by ${photo.uploadedByName || 'guest'}`}
          style={{ display: 'block', width: '100%', padding: 0, border: 'none', cursor: 'pointer', background: 'none' }}>
          <img src={photo.thumbnailUrl || photo.imageUrl}
            alt={`Photo by ${photo.uploadedByName || 'guest'}`} loading="lazy"
            style={{ width: '100%', aspectRatio: '4/3', objectFit: 'cover', display: 'block' }} />
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
              onClick={() => onApprove(photo.id)}><Check size={11} /> Approve</Btn>
          )}
          {photo.status !== 'Rejected' && onReject && (
            <Btn variant="amber" size="sm" disabled={busy} style={{ flex: 1, justifyContent: 'center' }}
              onClick={() => onReject(photo.id)}><X size={11} /> Reject</Btn>
          )}
          {!confirmDel ? (
            <Btn size="sm" disabled={busy} onClick={() => setConfirmDel(true)}
              style={{ padding: '6px 10px', color: T.danger, borderColor: `${T.danger}25` }}>
              <Trash2 size={11} />
            </Btn>
          ) : (
            <div style={{ display: 'flex', gap: 4, width: '100%' }}>
              <Btn variant="danger" size="sm" style={{ flex: 1, justifyContent: 'center' }}
                disabled={busy} onClick={() => { setConfirmDel(false); onDelete(photo.id); }}>Delete</Btn>
              <Btn size="sm" onClick={() => setConfirmDel(false)}>Cancel</Btn>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Lightbox ───────────────────────────────────────────────────

function Lightbox({ photo, onClose }) {
  useEffect(() => {
    const h = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', h);
    return () => document.removeEventListener('keydown', h);
  }, [onClose]);
  return (
    <motion.div role="dialog" aria-modal="true"
      aria-label={`Photo by ${photo.uploadedByName || 'guest'}`}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      onClick={onClose}
      style={{ position: 'fixed', inset: 0, zIndex: 999, background: 'rgba(10,8,6,0.95)',
        backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <button onClick={onClose} aria-label="Close"
        style={{ position: 'fixed', top: 14, right: 14, width: 44, height: 44, borderRadius: '50%',
          background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)',
          color: '#fff', cursor: 'pointer', display: 'grid', placeItems: 'center' }}>
        <X size={18} />
      </button>
      <motion.div initial={{ scale: 0.92 }} animate={{ scale: 1 }}
        transition={{ duration: 0.22, ease: [0.2, 0.8, 0.2, 1] }}
        onClick={e => e.stopPropagation()} style={{ maxWidth: 'min(1000px,95vw)', textAlign: 'center' }}>
        <img src={photo.imageUrl} alt={`Photo by ${photo.uploadedByName || 'guest'}`}
          style={{ maxHeight: '85vh', maxWidth: '100%', objectFit: 'contain',
            borderRadius: 6, boxShadow: '0 24px 80px rgba(0,0,0,0.6)' }} />
        {(photo.uploadedByName || photo.caption) && (
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12, marginTop: 12 }}>
            {photo.caption || `Shared by ${photo.uploadedByName}`}
          </p>
        )}
      </motion.div>
    </motion.div>
  );
}

// ── Photo Moderation ────────────────────────────────────────────
// CRITICAL: ALL hooks must be called unconditionally at the top.
// usePaginateSection calls MUST come before any early returns.

function PhotoModeration() {
  const [pending,  setPending]  = useState([]);
  const [all,      setAll]      = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState('');
  const [selected, setSelected] = useState(new Set());
  const [busy,     setBusy]     = useState(false);
  const [toast,    setToast]    = useState(null);
  const [preview,  setPreview]  = useState(null);

  // ── Pagination state — MUST be here, before any early returns ──
  // Each section has its own page state (3 useState + 3 useEffect via usePagedSlice)
  const pendingPag  = usePagedSlice(pending);
  const approvedPag = usePagedSlice(all.filter(p => p.status === 'Approved'));
  const rejectedPag = usePagedSlice(all.filter(p => p.status === 'Rejected'));

  const load = useCallback(async () => {
    setLoading(true); setError('');
    try {
      const [pend, allRes] = await Promise.allSettled([getPendingPhotos(), getAllAdminPhotos()]);
      const toArr = (v) => Array.isArray(v) ? v : (Array.isArray(v?.items) ? v.items : []);
      setPending(toArr(pend.value));
      setAll(toArr(allRes.value));
      setSelected(new Set());
    } catch (e) {
      setError(e.message || 'Failed to load photos.');
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const showToast = (text, ok = true) => {
    setToast({ text, ok });
    setTimeout(() => setToast(null), 3000);
  };

  const act = async (fn, msg) => {
    setBusy(true);
    try { await fn(); showToast(msg); load(); }
    catch (e) { showToast(e.message || 'Action failed.', false); }
    finally { setBusy(false); }
  };

  // Early returns AFTER all hooks
  if (loading) return <PageLoader />;
  if (error)   return <ErrBox msg={error} onRetry={load} />;

  const approved = all.filter(p => p.status === 'Approved');
  const rejected  = all.filter(p => p.status === 'Rejected');

  const SectionLabel = ({ color, label, count }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 12 }}>
      <div style={{ width: 8, height: 8, borderRadius: '50%', background: color }} aria-hidden="true" />
      <h3 style={{ fontSize: 15, fontWeight: 600, color: T.fg, margin: 0 }}>{label}</h3>
      {count > 0 && (
        <span style={{ fontSize: 10, fontWeight: 700, background: color, color: '#fff',
          borderRadius: 99, padding: '2px 8px' }}>{count}</span>
      )}
    </div>
  );

  const Empty = ({ msg }) => (
    <Card style={{ padding: '28px 20px', textAlign: 'center', background: T.bg }}>
      <p style={{ color: T.faint, fontSize: 13, margin: 0 }}>{msg}</p>
    </Card>
  );

  return (
    <div>
      <SectionHeader title="Photos">
        <Btn size="sm" onClick={load} disabled={busy}><RefreshCw size={12} /> Refresh</Btn>
      </SectionHeader>

      <AnimatePresence>
        {toast && (
          <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            role={toast.ok ? 'status' : 'alert'} aria-live="polite"
            style={{ marginBottom: 14, padding: '10px 14px', borderRadius: 6, fontSize: 12, fontWeight: 500,
              background: toast.ok ? T.successLight : T.dangerLight,
              color: toast.ok ? '#166534' : '#991B1B' }}>
            {toast.text}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Pending */}
      <section style={{ marginBottom: 36 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          flexWrap: 'wrap', gap: 10, marginBottom: 12 }}>
          <SectionLabel color={T.amber} label="Pending Approval" count={pending.length} />
          {pending.length > 0 && (
            <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap' }}>
              <Btn size="sm" onClick={() => setSelected(prev =>
                prev.size === pending.length ? new Set() : new Set(pending.map(p => p.id)))}>
                {selected.size === pending.length ? 'Deselect all' : 'Select all'}
              </Btn>
              {selected.size > 0 && (
                <Btn variant="success" size="sm" disabled={busy}
                  onClick={() => act(() => bulkApprovePhotos([...selected]), `${selected.size} approved.`)}>
                  <Check size={12} /> Approve {selected.size}
                </Btn>
              )}
            </div>
          )}
        </div>
        {pending.length === 0
          ? <Empty msg="No photos awaiting approval." />
          : <>
              <div className="ad-photo-grid">
                {pendingPag.slice.map(p => (
                  <PhotoCard key={p.id} photo={p} selectable selected={selected.has(p.id)}
                    onToggle={() => setSelected(prev => { const n = new Set(prev); n.has(p.id) ? n.delete(p.id) : n.add(p.id); return n; })}
                    onApprove={id => act(() => approvePhoto(id), 'Photo approved.')}
                    onReject={id  => act(() => rejectPhoto(id),  'Photo rejected.')}
                    onDelete={id  => act(() => deletePhoto(id),  'Photo deleted.')}
                    onPreview={setPreview} busy={busy} />
                ))}
              </div>
              <PaginationBar pager={pendingPag} label="pending photos" />
            </>
        }
      </section>

      {/* Approved */}
      <section style={{ marginBottom: 36 }}>
        <SectionLabel color={T.success} label="Approved" count={approved.length} />
        {approved.length === 0
          ? <Empty msg="No approved photos yet." />
          : <>
              <div className="ad-photo-grid">
                {approvedPag.slice.map(p => (
                  <PhotoCard key={p.id} photo={p}
                    onReject={id => act(() => rejectPhoto(id), 'Moved to rejected.')}
                    onDelete={id => act(() => deletePhoto(id), 'Photo deleted.')}
                    onPreview={setPreview} busy={busy} />
                ))}
              </div>
              <PaginationBar pager={approvedPag} label="approved photos" />
            </>
        }
      </section>

      {/* Rejected */}
      {rejected.length > 0 && (
        <section>
          <SectionLabel color={T.danger} label="Rejected" count={rejected.length} />
          <div className="ad-photo-grid">
            {rejectedPag.slice.map(p => (
              <PhotoCard key={p.id} photo={p}
                onApprove={id => act(() => approvePhoto(id), 'Photo approved.')}
                onDelete={id  => act(() => deletePhoto(id),  'Photo deleted.')}
                onPreview={setPreview} busy={busy} />
            ))}
          </div>
          <PaginationBar pager={rejectedPag} label="rejected photos" />
        </section>
      )}

      <AnimatePresence>
        {preview && <Lightbox key="lb" photo={preview} onClose={() => setPreview(null)} />}
      </AnimatePresence>
    </div>
  );
}

// ── Settings ───────────────────────────────────────────────────

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
      const p = {};
      if (form.name)         p.name         = form.name;
      if (form.venue)        p.venue        = form.venue;
      if (form.eventDateUtc) p.eventDateUtc = new Date(form.eventDateUtc).toISOString();
      p.rsvpEnabled = form.rsvpEnabled;
      p.guestUploadsEnabled = form.guestUploadsEnabled;
      p.autoApprovePhotos   = form.autoApprovePhotos;
      await updateWeddingConfig(p);
      setMsg('Saved.'); setOrig({ ...form });
    } catch (err) { setError(err.message || 'Update failed.'); }
    finally { setSaving(false); }
  };

  if (loading) return <PageLoader />;

  const Toggle = ({ name, label, desc }) => (
    <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      cursor: 'pointer', padding: '13px 16px', borderRadius: 7, gap: 12,
      background: form[name] ? '#F0FDF4' : T.surfaceHover,
      border: `1px solid ${form[name] ? '#86EFAC' : T.border}`, transition: T.ease }}>
      <div>
        <p style={{ fontSize: 13, fontWeight: 600, color: T.fg, margin: 0 }}>{label}</p>
        <p style={{ fontSize: 11, color: T.faint, margin: '2px 0 0' }}>{desc}</p>
      </div>
      <input type="checkbox" checked={form[name]}
        onChange={e => setForm(f => ({ ...f, [name]: e.target.checked }))}
        aria-label={label} style={{ display: 'none' }} />
      {form[name]
        ? <ToggleRight size={26} color={T.success} style={{ flexShrink: 0 }} aria-hidden="true" />
        : <ToggleLeft  size={26} color={T.faint}   style={{ flexShrink: 0 }} aria-hidden="true" />}
    </label>
  );

  return (
    <div>
      <SectionHeader title="Settings" />
      <form onSubmit={save}>
        <Card style={{ padding: '20px 22px', marginBottom: 14 }}>
          <p style={sLabel}>Wedding Details</p>
          <div className="ad-form-grid">
            <label className="ad-field">
              <span className="ad-field-label">Wedding name</span>
              <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                placeholder="Rahul & Priya Wedding" className="ad-input" />
            </label>
            <label className="ad-field">
              <span className="ad-field-label">Venue</span>
              <input value={form.venue} onChange={e => setForm(f => ({ ...f, venue: e.target.value }))}
                placeholder="Grand Hall, Bangalore" className="ad-input" />
            </label>
            <label className="ad-field">
              <span className="ad-field-label">Event date &amp; time (UTC)</span>
              <input type="datetime-local" value={form.eventDateUtc}
                onChange={e => setForm(f => ({ ...f, eventDateUtc: e.target.value }))} className="ad-input" />
            </label>
          </div>
        </Card>
        <Card style={{ padding: '20px 22px', marginBottom: 18 }}>
          <p style={sLabel}>Feature Flags</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <Toggle name="rsvpEnabled" label="RSVPs open" desc="Allow guests to submit RSVPs" />
            <Toggle name="guestUploadsEnabled" label="Guest uploads open" desc="Allow guests to upload photos" />
            <Toggle name="autoApprovePhotos" label="Auto-approve photos" desc="Bypass manual review for uploaded photos" />
          </div>
        </Card>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          <Btn type="submit" variant="primary" disabled={!isDirty || saving}>
            {saving ? <><Spin size={12} color="#fff" /> Saving…</> : <><Save size={12} /> Save changes</>}
          </Btn>
          {isDirty && !saving && <span style={{ fontSize: 12, color: T.amber, fontWeight: 500 }}>Unsaved changes</span>}
          {msg   && <span style={{ fontSize: 12, color: T.success }} role="status">{msg}</span>}
          {error && <span style={{ fontSize: 12, color: T.danger  }} role="alert">{error}</span>}
        </div>
      </form>
    </div>
  );
}

// ── Password ───────────────────────────────────────────────────

function ChangePassword({ onSuccess }) {
  const [form,   setForm]   = useState({ cur: '', next: '', confirm: '' });
  const [show,   setShow]   = useState(false);
  const [saving, setSaving] = useState(false);
  const [msg,    setMsg]    = useState('');
  const [error,  setError]  = useState('');

  const submit = async (e) => {
    e.preventDefault();
    if (form.next !== form.confirm) { setError('Passwords do not match.'); return; }
    if (form.next.length < 8)       { setError('Minimum 8 characters.'); return; }
    setSaving(true); setMsg(''); setError('');
    try {
      await changePassword({ currentPassword: form.cur, newPassword: form.next });
      setMsg('Password updated.'); setForm({ cur: '', next: '', confirm: '' }); onSuccess?.();
    } catch (err) { setError(err.message || 'Failed.'); }
    finally { setSaving(false); }
  };

  return (
    <div>
      <SectionHeader title="Change Password" />
      <Card style={{ padding: '22px', maxWidth: 440 }}>
        <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {[
            { key: 'cur',     label: 'Current password',    auto: 'current-password' },
            { key: 'next',    label: 'New password',         auto: 'new-password'     },
            { key: 'confirm', label: 'Confirm new password', auto: 'new-password'     },
          ].map(({ key, label, auto }) => (
            <label key={key} className="ad-field">
              <span className="ad-field-label">{label}</span>
              <input type={show ? 'text' : 'password'} autoComplete={auto} required
                value={form[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                className="ad-input" />
            </label>
          ))}
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: T.muted, cursor: 'pointer' }}>
            <input type="checkbox" checked={show} onChange={e => setShow(e.target.checked)}
              style={{ width: 14, height: 14, accentColor: T.primary }} />
            Show passwords
          </label>
          {msg   && <p style={{ fontSize: 12, color: T.success, margin: 0 }} role="status">{msg}</p>}
          {error && <p style={{ fontSize: 12, color: T.danger,  margin: 0 }} role="alert">{error}</p>}
          <Btn type="submit" variant="primary" disabled={saving}>
            {saving ? <><Spin size={12} color="#fff" /> Saving…</> : 'Update password'}
          </Btn>
        </form>
      </Card>
    </div>
  );
}

// ── Shell ──────────────────────────────────────────────────────

const NAV = [
  { id: 'dashboard', label: 'Overview',  Icon: LayoutDashboard },
  { id: 'rsvp',      label: 'RSVPs',     Icon: Users           },
  { id: 'photos',    label: 'Photos',    Icon: Images          },
  { id: 'settings',  label: 'Settings',  Icon: Settings        },
  { id: 'password',  label: 'Password',  Icon: Key             },
];

export function AdminDashboard({ me, mustChange, onMustChangeResolved, onLogout, page, setPage }) {
  if (mustChange) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 24, background: T.bg, fontFamily: "'Jost',sans-serif" }}>
        <div style={{ maxWidth: 480, width: '100%' }}>
          <div style={{ background: T.warningLight, border: '1px solid #FDE047', borderRadius: T.r,
            padding: '13px 16px', marginBottom: 22, display: 'flex', gap: 10, alignItems: 'center' }}>
            <AlertTriangle size={15} color="#ca8a04" aria-hidden="true" />
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

      {/* ── Sidebar ── */}
      <aside className="ad-sidebar" aria-label="Admin navigation">
        <div className="ad-sidebar-header">
          <Heart size={15} fill="#C4A6B2" color="#C4A6B2" aria-hidden="true" />
          <span style={{ fontFamily: "'Cormorant Garamond',Georgia,serif", fontSize: 17, fontWeight: 600,
            color: T.sidebarFg }}>Admin</span>
        </div>

        {me && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '11px 18px',
            borderBottom: `1px solid ${T.sidebarBorder}` }}>
            <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'rgba(196,166,178,0.18)',
              display: 'grid', placeItems: 'center', fontSize: 12, fontWeight: 700, color: '#C4A6B2', flexShrink: 0 }}>
              {(me.fullName || me.username || '?').charAt(0).toUpperCase()}
            </div>
            <span style={{ fontSize: 12, color: T.sidebarMuted, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {me.fullName || me.username}
            </span>
          </div>
        )}

        <nav style={{ flex: 1, padding: '8px' }} aria-label="Admin sections">
          {NAV.map(({ id, label, Icon }) => (
            <button key={id} onClick={() => setPage(id)}
              aria-current={page === id ? 'page' : undefined}
              style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10,
                padding: '10px 12px', border: 'none', borderRadius: 7, cursor: 'pointer',
                background: page === id ? T.sidebarActive : 'transparent',
                color: page === id ? '#EDD4DC' : T.sidebarMuted,
                fontSize: 13, fontWeight: page === id ? 600 : 400,
                fontFamily: "'Jost',sans-serif", marginBottom: 1, textAlign: 'left',
                transition: 'background 0.15s, color 0.15s', minHeight: 44 }}>
              <Icon size={15} aria-hidden="true" />
              <span>{label}</span>
              {id === 'dashboard' && page !== 'dashboard' && (
                <span style={{ marginLeft: 'auto', width: 5, height: 5, borderRadius: '50%',
                  background: T.primary, opacity: 0.5 }} />
              )}
            </button>
          ))}
        </nav>

        <button onClick={onLogout}
          style={{ display: 'flex', alignItems: 'center', gap: 10,
            margin: '0 8px 14px', padding: '10px 12px', border: 'none', borderRadius: 7,
            cursor: 'pointer', background: 'transparent', color: T.sidebarMuted,
            fontSize: 13, fontFamily: "'Jost',sans-serif", transition: 'color 0.15s', minHeight: 44 }}>
          <LogOut size={15} aria-hidden="true" />
          <span>Sign out</span>
        </button>
      </aside>

      {/* ── Mobile header ── */}
      <header className="ad-mobile-header" role="banner">
        <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
          <Heart size={14} fill="#C4A6B2" color="#C4A6B2" aria-hidden="true" />
          <span style={{ fontFamily: "'Cormorant Garamond',Georgia,serif", fontSize: 15, fontWeight: 600, color: T.sidebarFg }}>
            {me ? (me.fullName || me.username) : 'Admin'}
          </span>
        </div>
        <span style={{ fontSize: 12, fontWeight: 600, color: '#C4A6B2', letterSpacing: '0.03em' }}>
          {NAV.find(n => n.id === page)?.label}
        </span>
        <button onClick={onLogout} aria-label="Sign out"
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: T.sidebarMuted }}>
          <LogOut size={15} />
        </button>
      </header>

      {/* ── Main ── */}
      <main className="ad-main" id="admin-main-content">
        <AnimatePresence mode="wait">
          <motion.div key={page}
            initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }} transition={{ duration: 0.18 }}>
            {page === 'dashboard' && <Overview />}
            {page === 'rsvp'      && <RsvpSection />}
            {page === 'photos'    && <PhotoModeration />}
            {page === 'settings'  && <WeddingSettings />}
            {page === 'password'  && <ChangePassword />}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* ── Bottom tab bar (mobile) ── */}
      <nav className="ad-bottom-nav" aria-label="Admin navigation">
        {NAV.map(({ id, label, Icon }) => (
          <button key={id}
            className={`ad-bottom-tab${page === id ? ' ad-bottom-tab--active' : ''}`}
            onClick={() => setPage(id)}
            aria-current={page === id ? 'page' : undefined}
            aria-label={label}>
            <Icon size={19} aria-hidden="true" />
            <span>{label}</span>
          </button>
        ))}
      </nav>

      <style>{`
        .ad-root * { box-sizing: border-box; margin: 0; }

        /* Layout */
        .ad-root {
          display: grid;
          grid-template-columns: 216px 1fr;
          grid-template-rows: 1fr;
          min-height: 100svh;
          background: ${T.bg};
        }

        /* Sidebar */
        .ad-sidebar {
          grid-row: 1 / -1;
          background: ${T.sidebar};
          display: flex;
          flex-direction: column;
          position: sticky;
          top: 0;
          height: 100svh;
          overflow-y: auto;
          border-right: 1px solid rgba(255,255,255,0.04);
        }

        .ad-sidebar-header {
          display: flex;
          align-items: center;
          gap: 9px;
          padding: 20px 18px 13px;
          border-bottom: 1px solid ${T.sidebarBorder};
        }

        /* Mobile header — hidden on desktop */
        .ad-mobile-header {
          display: none;
          align-items: center;
          justify-content: space-between;
          height: 54px;
          padding: 0 16px;
          background: ${T.sidebar};
          position: sticky;
          top: 0;
          z-index: 30;
          grid-column: 1 / -1;
        }

        /* Main content */
        .ad-main {
          padding: clamp(18px,2.5vw,32px) clamp(14px,2.5vw,32px) clamp(18px,2.5vw,32px);
          overflow-y: auto;
          grid-column: 2;
          max-width: 100%;
        }

        /* Bottom nav — hidden on desktop */
        .ad-bottom-nav {
          display: none;
          position: fixed;
          bottom: 0; left: 0; right: 0;
          z-index: 40;
          background: ${T.sidebar};
          border-top: 1px solid rgba(255,255,255,0.07);
          padding-bottom: env(safe-area-inset-bottom, 0px);
        }

        .ad-bottom-tab {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 3px;
          padding: 9px 4px;
          min-height: 54px;
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
        .ad-bottom-tab--active { color: #EDD4DC; }
        .ad-bottom-tab:hover   { color: ${T.sidebarFg}; }

        /* RSVP stat row — always horizontal */
        .ad-rsvp-stat-row {
          display: flex;
          gap: 10px;
          margin-bottom: 16px;
          overflow-x: auto;
        }

        /* Photo grid */
        .ad-photo-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(min(190px,100%),1fr));
          gap: 12px;
          margin-bottom: 10px;
        }

        /* 3-col grid */
        .ad-grid-3 {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(min(160px,100%),1fr));
          gap: 10px;
          margin-bottom: 10px;
        }

        /* RSVP table */
        .ad-rsvp-table-wrap {
          overflow-x: auto;
          border-radius: ${T.r}px;
          border: 1px solid ${T.border};
          background: ${T.surface};
        }
        .ad-rsvp-table { width: 100%; border-collapse: collapse; font-size: 13px; font-family: 'Jost',sans-serif; }
        .ad-rsvp-table thead tr { background: ${T.bg}; border-bottom: 1px solid ${T.border}; }
        .ad-rsvp-table th { padding: 10px 14px; text-align: left; font-size: 10px; font-weight: 700;
          letter-spacing: 0.09em; text-transform: uppercase; color: ${T.faint}; white-space: nowrap; }
        .ad-rsvp-table td { padding: 11px 14px; color: ${T.fg}; vertical-align: top;
          border-bottom: 1px solid ${T.border}; line-height: 1.4; font-size: 13px; }
        .ad-rsvp-table tbody tr:last-child td { border-bottom: none; }
        .ad-rsvp-table tbody tr:hover td { background: ${T.bg}; }
        .ad-rsvp-name { font-weight: 600; }
        .ad-rsvp-contact { display: flex; flex-direction: column; gap: 3px; font-size: 12px; color: ${T.muted}; }
        .ad-rsvp-msg { font-size: 12px; color: ${T.muted}; max-width: 180px; line-height: 1.5; }
        .ad-rsvp-cards { display: none; }

        /* Form */
        .ad-field { display: flex; flex-direction: column; gap: 5px; }
        .ad-field-label { font-size: 11px; font-weight: 600; color: #4A4540; letter-spacing: 0.04em; }
        .ad-input { display: block; width: 100%; padding: 9px 12px; font-size: 13px;
          font-family: 'Jost',sans-serif; border: 1px solid ${T.border}; border-radius: 6px;
          background: ${T.surfaceHover}; color: ${T.fg}; outline: none; transition: border-color 0.2s; }
        .ad-input:focus { border-color: ${T.primary}; background: ${T.surface}; }
        .ad-form-grid { display: grid; grid-template-columns: repeat(auto-fill,minmax(min(220px,100%),1fr)); gap: 14px; }

        /* Mobile ≤768px */
        @media (max-width: 768px) {
          .ad-root {
            grid-template-columns: 1fr;
            grid-template-rows: 54px 1fr;
          }
          .ad-sidebar       { display: none; }
          .ad-mobile-header { display: flex; }
          .ad-main          { grid-column: 1; padding-bottom: calc(62px + env(safe-area-inset-bottom,0px)); }
          .ad-bottom-nav    { display: flex; }
          .ad-photo-grid    { grid-template-columns: repeat(2,1fr); gap: 8px; }
          .ad-grid-3        { grid-template-columns: repeat(2,1fr); }
          .ad-form-grid     { grid-template-columns: 1fr; }
          .ad-rsvp-table-wrap { display: none; }
          .ad-rsvp-cards      { display: block; }
          .ad-rsvp-stat-row   { gap: 8px; }
        }

        @media (max-width: 400px) {
          .ad-grid-3 { grid-template-columns: 1fr; }
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

// Shared micro-styles
const sLabel = {
  fontSize: 10, fontWeight: 700, letterSpacing: '0.1em',
  color: '#C0B4A8', textTransform: 'uppercase', margin: '0 0 10px', display: 'block',
};
