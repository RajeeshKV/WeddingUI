import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Images, Settings, LogOut, Heart,
  Users, CheckCircle, XCircle, Clock, Check, X, Trash2,
  Key, AlertTriangle, Loader2, UserCheck, UserX,
  RefreshCw, ToggleLeft, ToggleRight, Save, Eye,
} from 'lucide-react';
import {
  getAdminDashboard,
  getPendingPhotos, getAllAdminPhotos,
  approvePhoto, rejectPhoto, deletePhoto, bulkApprovePhotos,
  updateWeddingConfig, changePassword, getAdminWeddingConfig,
} from '../../services/api/admin.js';

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

  if (loading) return <Spinner />;
  if (error)   return <ErrBox msg={error} />;
  if (!stats)  return null;

  // API returns: attending, notAttending, maybe (not attendingCount etc.)
  const attending    = stats.attending    ?? stats.attendingCount    ?? 0;
  const notAttending = stats.notAttending ?? stats.notAttendingCount ?? 0;
  const maybe        = stats.maybe        ?? stats.maybeCount        ?? 0;
  const totalGuests  = attending + maybe;

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
              { label: 'Attending',     value: attending,    color: '#6EE7B7' },
              { label: 'Maybe',         value: maybe,        color: '#FCD34D' },
              { label: 'Not Attending', value: notAttending, color: '#FCA5A5' },
              { label: 'Total RSVPs',   value: stats.totalRsvps, color: '#C4B5FD' },
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
          { label: 'Attending',     value: attending,    total: stats.totalRsvps, color: '#059669', Icon: UserCheck },
          { label: 'Not Attending', value: notAttending, total: stats.totalRsvps, color: '#DC2626', Icon: UserX    },
          { label: 'Maybe',         value: maybe,        total: stats.totalRsvps, color: '#D97706', Icon: Clock    },
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
// Photo grid — shared card component
// ─────────────────────────────────────────────────────────────────

function PhotoCard({ photo, onApprove, onReject, onDelete, onPreview, selectable, selected, onToggle, busy }) {
  const [confirmDel, setConfirmDel] = useState(false);

  return (
    <div style={{
      position: 'relative', borderRadius: 6, overflow: 'hidden',
      background: '#E8E4DF',
      boxShadow: selected ? '0 0 0 2px #8B6E7F' : '0 1px 4px rgba(0,0,0,0.08)',
      transition: 'box-shadow 0.15s',
    }}>
      {/* Checkbox overlay */}
      {selectable && (
        <label style={{ position: 'absolute', top: 8, left: 8, zIndex: 3, cursor: 'pointer' }}>
          <input type="checkbox" checked={selected} onChange={onToggle}
            style={{ width: 16, height: 16, accentColor: '#8B6E7F', cursor: 'pointer' }} />
        </label>
      )}

      {/* Status badge */}
      <div style={{ position: 'absolute', top: 8, right: 8, zIndex: 3 }}>
        <Pill status={photo.status} />
      </div>

      {/* Image */}
      <button onClick={() => onPreview(photo)} style={{
        display: 'block', width: '100%', padding: 0, border: 'none',
        cursor: 'pointer', background: 'none',
      }} aria-label={`Preview photo by ${photo.uploadedByName || 'guest'}`}>
        <img
          src={photo.thumbnailUrl || photo.imageUrl}
          alt={`Photo by ${photo.uploadedByName || 'guest'}`}
          loading="lazy"
          style={{ width: '100%', aspectRatio: '4/3', objectFit: 'cover', display: 'block' }}
        />
      </button>

      {/* Info + actions */}
      <div style={{ padding: '10px 12px 12px', background: '#fff' }}>
        <p style={{ fontSize: 11, color: '#6A6258', margin: '0 0 2px', fontWeight: 600,
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {photo.uploadedByName || 'Anonymous'}
        </p>
        <p style={{ fontSize: 10, color: '#B0A898', margin: '0 0 10px' }}>
          {new Date(photo.uploadedAtUtc).toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' })}
        </p>

        <div style={{ display: 'flex', gap: 6 }}>
          {photo.status !== 'Approved' && onApprove && (
            <button onClick={() => onApprove(photo.id)} disabled={busy}
              title="Approve" style={{ ...iconBtn('#059669'), flex: 1 }}>
              <Check size={13} /> Approve
            </button>
          )}
          {photo.status !== 'Rejected' && onReject && (
            <button onClick={() => onReject(photo.id)} disabled={busy}
              title="Reject" style={{ ...iconBtn('#D97706'), flex: 1 }}>
              <X size={13} /> Reject
            </button>
          )}
          {/* Delete with confirm */}
          {!confirmDel ? (
            <button onClick={() => setConfirmDel(true)} disabled={busy}
              title="Delete permanently" style={iconBtn('#DC2626')}>
              <Trash2 size={13} />
            </button>
          ) : (
            <div style={{ display: 'flex', gap: 4 }}>
              <button onClick={() => { setConfirmDel(false); onDelete(photo.id); }} disabled={busy}
                style={{ ...iconBtn('#DC2626'), fontSize: 10, padding: '5px 8px' }}>
                Confirm
              </button>
              <button onClick={() => setConfirmDel(false)}
                style={{ ...iconBtn('#9A9088'), fontSize: 10, padding: '5px 8px' }}>
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// Photo lightbox preview
// ─────────────────────────────────────────────────────────────────

function PhotoLightbox({ photo, onClose }) {
  useEffect(() => {
    const h = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', h);
    return () => document.removeEventListener('keydown', h);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      onClick={onClose}
      style={{ position: 'fixed', inset: 0, zIndex: 999,
        background: 'rgba(10,8,6,0.92)', backdropFilter: 'blur(6px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}
    >
      <button onClick={onClose} aria-label="Close"
        style={{ position: 'fixed', top: 16, right: 16, width: 40, height: 40,
          borderRadius: '50%', background: 'rgba(255,255,255,0.1)',
          border: '1px solid rgba(255,255,255,0.2)', color: '#fff',
          cursor: 'pointer', display: 'grid', placeItems: 'center' }}>
        <X size={18} />
      </button>
      <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }}
        transition={{ duration: 0.25, ease: [0.2,0.8,0.2,1] }}
        onClick={e => e.stopPropagation()}
        style={{ maxWidth: 'min(1000px,95vw)', textAlign: 'center' }}>
        <img src={photo.imageUrl} alt={`Photo by ${photo.uploadedByName || 'guest'}`}
          style={{ maxHeight: '85vh', maxWidth: '100%', objectFit: 'contain',
            borderRadius: 4, boxShadow: '0 24px 80px rgba(0,0,0,0.6)' }} />
        <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12, marginTop: 12 }}>
          {photo.uploadedByName && <span>Shared by <strong style={{ color: '#fff' }}>{photo.uploadedByName}</strong></span>}
          {photo.caption && <span> · {photo.caption}</span>}
          <span style={{ marginLeft: 8 }}>
            <Pill status={photo.status} />
          </span>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────
// Photo Moderation — two sections: Pending + All Photos
// ─────────────────────────────────────────────────────────────────

function PhotoModeration() {
  const [pending,  setPending]  = useState([]);
  const [all,      setAll]      = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState('');
  const [selected, setSelected] = useState(new Set());
  const [busy,     setBusy]     = useState(false);
  const [msg,      setMsg]      = useState({ text: '', ok: true });
  const [preview,  setPreview]  = useState(null);

  const load = useCallback(async () => {
    setLoading(true); setMsg({ text: '', ok: true });
    try {
      const [pend, allPhotos] = await Promise.allSettled([
        getPendingPhotos(),
        getAllAdminPhotos(),
      ]);
      setPending(pend.status === 'fulfilled' && Array.isArray(pend.value) ? pend.value : []);
      setAll(allPhotos.status === 'fulfilled' && Array.isArray(allPhotos.value) ? allPhotos.value : []);
      setSelected(new Set());
    } catch (e) {
      setError(e.message || 'Failed to load photos.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const act = async (fn, successMsg) => {
    setBusy(true);
    try {
      await fn();
      setMsg({ text: successMsg, ok: true });
      load();
    } catch (e) {
      setMsg({ text: e.message || 'Action failed.', ok: false });
    } finally { setBusy(false); }
  };

  const toggleSelect = (id) => setSelected(prev => {
    const n = new Set(prev);
    n.has(id) ? n.delete(id) : n.add(id);
    return n;
  });

  const toggleAllPending = () =>
    setSelected(prev => prev.size === pending.length
      ? new Set()
      : new Set(pending.map(p => p.id)));

  if (loading) return <Spinner />;
  if (error)   return <ErrBox msg={error} />;

  // All photos excluding pending (already shown above)
  const approved = all.filter(p => p.status === 'Approved');
  const rejected = all.filter(p => p.status === 'Rejected');

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexWrap: 'wrap', gap: 10, marginBottom: 24 }}>
        <h2 style={H2}>Photos</h2>
        <button onClick={load} disabled={busy} style={ghostBtn}>
          <RefreshCw size={13} /> Refresh
        </button>
      </div>

      {msg.text && (
        <div style={{ marginBottom: 16, padding: '10px 14px', borderRadius: 5, fontSize: 12,
          background: msg.ok ? '#DCFCE7' : '#FEE2E2',
          color: msg.ok ? '#166534' : '#991B1B' }}
          role={msg.ok ? 'status' : 'alert'} aria-live="polite">
          {msg.text}
        </div>
      )}

      {/* ── Section 1: Pending Approval ── */}
      <div style={{ marginBottom: 40 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          flexWrap: 'wrap', gap: 10, marginBottom: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#F59E0B' }} aria-hidden="true" />
            <h3 style={{ ...H3, margin: 0 }}>
              Pending Approval
              {pending.length > 0 && (
                <span style={{ marginLeft: 8, fontSize: 12, fontWeight: 700, color: '#fff',
                  background: '#F59E0B', borderRadius: 99, padding: '2px 9px' }}>
                  {pending.length}
                </span>
              )}
            </h3>
          </div>
          {pending.length > 0 && (
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={toggleAllPending} style={ghostBtn}>
                {selected.size === pending.length ? 'Deselect all' : 'Select all'}
              </button>
              {selected.size > 0 && (
                <button onClick={() => act(() => bulkApprovePhotos([...selected]),
                  `${selected.size} photo(s) approved.`)} disabled={busy}
                  style={solidBtn('#059669')}>
                  <Check size={13} /> Approve {selected.size}
                </button>
              )}
            </div>
          )}
        </div>

        {pending.length === 0 ? (
          <div style={{ padding: '32px 20px', textAlign: 'center',
            background: '#fff', borderRadius: 6, border: '1px solid #EDE8E2' }}>
            <CheckCircle size={28} color="#C4A6B2" style={{ margin: '0 auto 10px' }} aria-hidden="true" />
            <p style={{ color: '#9A9088', fontSize: 13, margin: 0 }}>No photos awaiting approval</p>
          </div>
        ) : (
          <div style={photoGrid}>
            {pending.map(photo => (
              <PhotoCard key={photo.id} photo={photo}
                selectable selected={selected.has(photo.id)} onToggle={() => toggleSelect(photo.id)}
                onApprove={(id) => act(() => approvePhoto(id), 'Photo approved.')}
                onReject={(id) => act(() => rejectPhoto(id), 'Photo rejected.')}
                onDelete={(id) => act(() => deletePhoto(id), 'Photo deleted.')}
                onPreview={setPreview}
                busy={busy} />
            ))}
          </div>
        )}
      </div>

      {/* ── Section 2: Approved Photos ── */}
      <div style={{ marginBottom: 40 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
          <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#10B981' }} aria-hidden="true" />
          <h3 style={{ ...H3, margin: 0 }}>
            Approved
            {approved.length > 0 && (
              <span style={{ marginLeft: 8, fontSize: 12, fontWeight: 700, color: '#fff',
                background: '#10B981', borderRadius: 99, padding: '2px 9px' }}>
                {approved.length}
              </span>
            )}
          </h3>
        </div>

        {approved.length === 0 ? (
          <div style={{ padding: '24px 20px', textAlign: 'center',
            background: '#fff', borderRadius: 6, border: '1px solid #EDE8E2' }}>
            <p style={{ color: '#9A9088', fontSize: 13, margin: 0 }}>No approved photos yet</p>
          </div>
        ) : (
          <div style={photoGrid}>
            {approved.map(photo => (
              <PhotoCard key={photo.id} photo={photo}
                onReject={(id) => act(() => rejectPhoto(id), 'Photo moved to rejected.')}
                onDelete={(id) => act(() => deletePhoto(id), 'Photo deleted.')}
                onPreview={setPreview}
                busy={busy} />
            ))}
          </div>
        )}
      </div>

      {/* ── Section 3: Rejected Photos ── */}
      {rejected.length > 0 && (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#EF4444' }} aria-hidden="true" />
            <h3 style={{ ...H3, margin: 0 }}>
              Rejected
              <span style={{ marginLeft: 8, fontSize: 12, fontWeight: 700, color: '#fff',
                background: '#EF4444', borderRadius: 99, padding: '2px 9px' }}>
                {rejected.length}
              </span>
            </h3>
          </div>
          <div style={photoGrid}>
            {rejected.map(photo => (
              <PhotoCard key={photo.id} photo={photo}
                onApprove={(id) => act(() => approvePhoto(id), 'Photo approved.')}
                onDelete={(id) => act(() => deletePhoto(id), 'Photo deleted.')}
                onPreview={setPreview}
                busy={busy} />
            ))}
          </div>
        </div>
      )}

      {/* Preview lightbox */}
      <AnimatePresence>
        {preview && <PhotoLightbox key="lb" photo={preview} onClose={() => setPreview(null)} />}
      </AnimatePresence>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// RSVP Section — aggregate stats from dashboard
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

  if (loading) return <Spinner />;
  if (error)   return <ErrBox msg={error} />;
  if (!stats)  return null;

  const attending    = stats.attending    ?? stats.attendingCount    ?? 0;
  const notAttending = stats.notAttending ?? stats.notAttendingCount ?? 0;
  const maybe        = stats.maybe        ?? stats.maybeCount        ?? 0;
  const total        = stats.totalRsvps   ?? 0;

  const rows = [
    { label: 'Attending',     value: attending,    color: '#059669', bg: '#DCFCE7' },
    { label: 'Not Attending', value: notAttending, color: '#DC2626', bg: '#FEE2E2' },
    { label: 'Maybe',         value: maybe,        color: '#D97706', bg: '#FEF9C3' },
  ];

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <h2 style={H2}>RSVPs</h2>
        <button onClick={load} style={{ ...ghostBtn, display: 'flex', alignItems: 'center', gap: 6 }}>
          <RefreshCw size={13} /> Refresh
        </button>
      </div>

      {/* Guest count banner */}
      <Card style={{
        padding: '24px 28px', marginBottom: 20,
        background: 'linear-gradient(135deg, #1A1714 0%, #2E2721 100%)',
        color: '#F5F0EC',
      }}>
        <p style={{ fontSize: 11, letterSpacing: '0.1em', color: '#C4A6B2',
          fontWeight: 600, margin: '0 0 8px', textTransform: 'uppercase' }}>
          Total RSVPs received
        </p>
        <p style={{ fontSize: 52, fontWeight: 700, margin: '0 0 4px', lineHeight: 1,
          fontFamily: "'Cormorant Garamond',Georgia,serif" }}>
          {total}
        </p>
        <p style={{ fontSize: 11, color: '#9A9088', margin: 0 }}>
          responses across all guests
        </p>
      </Card>

      {/* Breakdown cards */}
      <div style={gridAuto(170)}>
        {rows.map(({ label, value, color, bg }) => (
          <Card key={label} style={{ padding: '18px 20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <p style={{ fontSize: 11, fontWeight: 600, color: '#9A9088',
                letterSpacing: '0.08em', textTransform: 'uppercase', margin: 0 }}>
                {label}
              </p>
              <span style={{ fontSize: 10, fontWeight: 700, background: bg,
                color, borderRadius: 99, padding: '2px 8px' }}>
                {total > 0 ? `${Math.round((value / total) * 100)}%` : '0%'}
              </span>
            </div>
            <p style={{ fontSize: 36, fontWeight: 700, color: '#111',
              margin: 0, fontFamily: "'Cormorant Garamond',Georgia,serif", lineHeight: 1 }}>
              {value}
            </p>
            <div style={{ marginTop: 10, height: 4, background: '#F3F0EC', borderRadius: 99, overflow: 'hidden' }}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${total > 0 ? (value / total) * 100 : 0}%` }}
                transition={{ duration: 0.8, ease: [0.2, 0.8, 0.2, 1] }}
                style={{ height: '100%', background: color, borderRadius: 99 }}
              />
            </div>
          </Card>
        ))}
      </div>

      <Card style={{ padding: '18px 22px', marginTop: 16 }}>
        <p style={{ fontSize: 12, color: '#6A6258', margin: '0 0 4px', fontWeight: 600 }}>
          About RSVP data
        </p>
        <p style={{ fontSize: 12, color: '#9A9088', margin: 0, lineHeight: 1.6 }}>
          The backend provides aggregate counts only. Individual guest records are not available through the current API version. Total guest counts reflect the number of RSVP submissions, not individual headcount per submission.
        </p>
      </Card>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// Wedding Settings
// ─────────────────────────────────────────────────────────────────

function WeddingSettings() {
  const INITIAL = { name: '', venue: '', eventDateUtc: '', rsvpEnabled: true, guestUploadsEnabled: true, autoApprovePhotos: false };
  const [form,         setForm]         = useState(INITIAL);
  const [original,     setOriginal]     = useState(null); // loaded from API
  const [loadingConfig,setLoadingConfig]= useState(true);
  const [saving,       setSaving]       = useState(false);
  const [msg,          setMsg]          = useState('');
  const [error,        setError]        = useState('');

  // Dirty = form differs from original
  const isDirty = original !== null && JSON.stringify(form) !== JSON.stringify(original);

  useEffect(() => {
    getAdminWeddingConfig()
      .then(cfg => {
        const loaded = {
          name:                cfg.name               ?? '',
          venue:               cfg.venue              ?? '',
          eventDateUtc:        cfg.eventDateUtc
            ? cfg.eventDateUtc.replace('Z', '').substring(0, 16)
            : '',
          rsvpEnabled:         cfg.rsvpEnabled         ?? true,
          guestUploadsEnabled: cfg.guestUploadsEnabled ?? true,
          autoApprovePhotos:   cfg.autoApprovePhotos   ?? false,
        };
        setForm(loaded);
        setOriginal(loaded);
      })
      .catch(() => {})
      .finally(() => setLoadingConfig(false));
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
      setMsg('Settings saved.');
      setOriginal({ ...form });
    } catch (err) {
      setError(err.message || 'Update failed.');
    } finally {
      setSaving(false);
    }
  };

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
            <label style={{ ...LBL, gridColumn: '1 / -1' }}>
              Event date &amp; time (UTC)
              <input type="datetime-local" value={form.eventDateUtc}
                onChange={e => setForm(f => ({ ...f, eventDateUtc: e.target.value }))}
                style={INP} />
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
          <button type="submit" disabled={saving || !isDirty}
            style={{ ...solidBtn('#8B6E7F'), opacity: (!isDirty && !saving) ? 0.45 : 1 }}>
            {saving
              ? <><Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> Saving…</>
              : <><Save size={14} aria-hidden="true" /> Save changes</>
            }
          </button>
          {isDirty && !saving && (
            <span style={{ fontSize: 11, color: '#D97706', fontWeight: 500 }}>
              You have unsaved changes
            </span>
          )}
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
  { id: 'rsvp',      label: 'RSVPs',     Icon: Users           },
  { id: 'photos',    label: 'Photos',    Icon: Images           },
  { id: 'settings',  label: 'Settings',  Icon: Settings         },
  { id: 'password',  label: 'Password',  Icon: Key              },
];

export function AdminDashboard({ me, mustChange, onMustChangeResolved, onLogout, page, setPage }) {

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
            {page === 'dashboard' && <Overview />}
            {page === 'rsvp'      && <RsvpSection />}
            {page === 'photos'    && <PhotoModeration />}
            {page === 'settings'  && <WeddingSettings />}
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

const H3 = {
  fontFamily: "'Cormorant Garamond',Georgia,serif",
  fontSize: 18, fontWeight: 600, color: '#1A1714',
};

// 4-column grid for photos
const photoGrid = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
  gap: 12,
};

const iconBtn = (color) => ({
  display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 5,
  padding: '6px 10px', border: `1px solid ${color}20`,
  borderRadius: 4, background: `${color}10`,
  color, fontSize: 11, fontWeight: 600, cursor: 'pointer',
  fontFamily: "'Jost',sans-serif", transition: 'background 0.15s',
});
