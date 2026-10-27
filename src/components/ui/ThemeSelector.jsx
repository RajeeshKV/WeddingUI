import React, { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, Palette, RotateCcw } from 'lucide-react';
import { THEMES } from '../../theme/registry.js';

/**
 * Polished theme selector panel.
 * Shows all 10 themes with palette swatches, name, note.
 * Active theme gets a check mark. Supports keyboard navigation.
 */
export function ThemeSelector({ activeThemeId, onSelect, onReplayIntro, open, onClose }) {
  const panelRef = useRef(null);
  const firstBtnRef = useRef(null);

  // Trap focus inside panel when open
  useEffect(() => {
    if (open) {
      setTimeout(() => firstBtnRef.current?.focus(), 80);
    }
  }, [open]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open, onClose]);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) onClose();
    };
    setTimeout(() => document.addEventListener('mousedown', handler), 50);
    return () => document.removeEventListener('mousedown', handler);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop for mobile */}
          <motion.div
            key="theme-backdrop"
            aria-hidden="true"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{
              position: 'fixed', inset: 0, zIndex: 79,
              background: 'rgba(0,0,0,0.25)',
              backdropFilter: 'blur(3px)',
            }}
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            key="theme-panel"
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label="Choose wedding theme"
            initial={{ opacity: 0, y: -12, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.22, ease: [0.2, 0.8, 0.2, 1] }}
            style={{
              position: 'fixed',
              top: 'var(--nav-h, 90px)',
              right: 'clamp(12px, 4vw, 32px)',
              width: 'min(340px, calc(100vw - 24px))',
              maxHeight: 'calc(100svh - var(--nav-h, 90px) - 24px)',
              overflowY: 'auto',
              background: 'var(--t-paper)',
              border: '1px solid var(--t-border)',
              boxShadow: '0 24px 70px rgba(0,0,0,0.18)',
              zIndex: 80,
              borderRadius: 'var(--radius-md)',
            }}
          >
            {/* Header */}
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '14px 16px 12px',
              borderBottom: '1px solid var(--t-border)',
              position: 'sticky', top: 0,
              background: 'var(--t-paper)',
              zIndex: 1,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Palette size={14} color="var(--t-rose)" aria-hidden="true" />
                <span style={{
                  fontSize: 9, fontWeight: 600, letterSpacing: '0.24em',
                  color: 'var(--t-rose)', textTransform: 'uppercase',
                }}>
                  Choose Your Theme
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                {/* Replay intro */}
                <button
                  onClick={onReplayIntro}
                  title="Replay intro animation"
                  aria-label="Replay intro animation"
                  style={{
                    background: 'none', border: '1px solid var(--t-border)',
                    borderRadius: 'var(--radius-pill)',
                    padding: '5px 10px',
                    display: 'flex', alignItems: 'center', gap: 5,
                    cursor: 'pointer', color: 'var(--t-muted)', fontSize: 9,
                    letterSpacing: '0.08em',
                  }}
                >
                  <RotateCcw size={11} aria-hidden="true" /> Replay intro
                </button>
                <button
                  onClick={onClose}
                  aria-label="Close theme panel"
                  style={{
                    background: 'none', border: 'none', cursor: 'pointer',
                    color: 'var(--t-muted)', padding: 4, borderRadius: 'var(--radius-sm)',
                    display: 'flex', alignItems: 'center',
                  }}
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Theme list */}
            <ul
              role="listbox"
              aria-label="Available themes"
              style={{ listStyle: 'none', margin: 0, padding: '6px 0 8px' }}
            >
              {THEMES.map((theme, idx) => {
                const isActive = theme.id === activeThemeId;
                return (
                  <li key={theme.id} role="option" aria-selected={isActive}>
                    <button
                      ref={idx === 0 ? firstBtnRef : null}
                      onClick={() => { onSelect(theme.id); onClose(); }}
                      style={{
                        width: '100%', display: 'flex', alignItems: 'center',
                        gap: 12, padding: '11px 16px',
                        background: isActive ? 'var(--t-accent-soft)' : 'none',
                        border: 'none', cursor: 'pointer', textAlign: 'left',
                        transition: 'background 0.15s',
                        borderLeft: isActive ? '2px solid var(--t-primary)' : '2px solid transparent',
                      }}
                      onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = 'var(--t-surface)'; }}
                      onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'none'; }}
                    >
                      {/* Palette swatch preview */}
                      <div
                        aria-hidden="true"
                        style={{
                          display: 'flex', gap: 2, flexShrink: 0,
                          borderRadius: 3, overflow: 'hidden',
                          width: 44, height: 28,
                          border: '1px solid rgba(128,128,128,0.15)',
                        }}
                      >
                        {theme.palette.preview.map((color, ci) => (
                          <div
                            key={ci}
                            style={{ flex: 1, background: color }}
                          />
                        ))}
                      </div>

                      {/* Text */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{
                          fontSize: 13, fontFamily: 'var(--font-serif)',
                          color: 'var(--t-fg)', lineHeight: 1.2,
                          fontWeight: 400,
                          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                        }}>
                          {theme.label}
                        </div>
                        <div style={{
                          fontSize: 9, color: 'var(--t-muted)',
                          marginTop: 2, lineHeight: 1.5,
                          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                        }}>
                          {theme.note}
                        </div>
                      </div>

                      {/* Active check */}
                      {isActive && (
                        <Check
                          size={14}
                          color="var(--t-primary)"
                          aria-hidden="true"
                          style={{ flexShrink: 0 }}
                        />
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>

            {/* Footer hint */}
            <div style={{
              padding: '10px 16px 12px',
              borderTop: '1px solid var(--t-border)',
              fontSize: 9, color: 'var(--t-muted)', letterSpacing: '0.06em',
              textAlign: 'center',
            }}>
              Share this theme: copy the URL after selecting
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default ThemeSelector;
