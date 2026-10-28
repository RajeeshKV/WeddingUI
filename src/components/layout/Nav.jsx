import React, { useState, useEffect, useRef } from 'react';
import { Menu, X, ArrowUpRight } from 'lucide-react';

export function Nav({ onScrollTo, weddingConfig = null }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navRef = useRef(null);

  // Derive a couple-specific wordmark from configured names.
  const monogram = (() => {
    if (!weddingConfig?.name?.trim()) return ['A', 'S'];
    const parts = weddingConfig.name.trim().replace(/\s+wedding\s*$/i, '').split(/\s*&\s*|\s+and\s+/i);
    if (parts.length < 2 || !parts[0].trim() || !parts.slice(1).join(' ').trim()) return ['A', 'S'];
    return [parts[0].trim(), parts.slice(1).join(' ').trim()].map((name) => Array.from(name)[0].toLocaleUpperCase());
  })();

  useEffect(() => {
    const onScroll = () => {
      const past = window.scrollY > 60;
      setScrolled(past);
      if (navRef.current) {
        const h = navRef.current.getBoundingClientRect().height;
        document.documentElement.style.setProperty('--nav-h', `${h}px`);
      }
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const close = (e) => {
      if (navRef.current && !navRef.current.contains(e.target)) setMenuOpen(false);
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, [menuOpen]);

  const navLinks = [
    ['Home',      'home'],
    ['Our Story', 'story'],
    ['Events',    'events'],
    ['Gallery',   '/gallery'],
    ['RSVP',      'rsvp'],
    ['Travel',    'travel'],
  ];

  const navClass = ['site-nav', scrolled ? 'site-nav--scrolled' : ''].filter(Boolean).join(' ');

  return (
    <header ref={navRef} className={navClass} role="banner">
      {/* Logo / Monogram */}
      <button
        className="nav-monogram"
        onClick={() => onScrollTo('home')}
        aria-label={`Scroll to top, ${monogram[0]} and ${monogram[1]}`}
      >
        <span className="nav-logo-type">
          <span className="nav-logo-initials">
            <span>{monogram[0]}</span><i className="nav-logo-ampersand">&amp;</i><span>{monogram[1]}</span>
          </span>
          <span className="nav-logo-ornament" aria-hidden="true">
            <span />
            <span className="nav-logo-heart">♡</span>
            <span />
          </span>
        </span>
      </button>

      {/* Desktop + mobile nav links */}
      <nav
        className={`nav-links${menuOpen ? ' nav-links--open' : ''}`}
        aria-label="Main navigation"
      >
        {navLinks.map(([label, id]) =>
          id === '/gallery' ? (
            <a key={id} href="/gallery" onClick={() => setMenuOpen(false)}>{label}</a>
          ) : (
            <button key={id} onClick={() => { onScrollTo(id); setMenuOpen(false); }}>
              {label}
            </button>
          )
        )}
      </nav>

      {/* Actions — RSVP CTA + hamburger only */}
      <div className="nav-actions">
        <button
          className="btn btn-primary nav-rsvp-btn"
          onClick={() => { onScrollTo('rsvp'); setMenuOpen(false); }}
        >
          RSVP Now <ArrowUpRight size={14} aria-hidden="true" />
        </button>
        <button
          className="nav-icon-btn nav-hamburger"
          onClick={() => setMenuOpen(v => !v)}
          aria-expanded={menuOpen}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>
    </header>
  );
}

export default Nav;
