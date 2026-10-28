import React, { useState, useEffect, useRef } from 'react';
import { Menu, X, ArrowUpRight } from 'lucide-react';

export function Nav({ onScrollTo, weddingConfig = null }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navRef = useRef(null);

  // Derive monogram from config name — e.g. "Rahul & Priya Wedding" → "R&P"
  const monogram = (() => {
    if (!weddingConfig?.name) return null;
    const match = weddingConfig.name.match(/^(.+?)\s*&\s*(.+?)(?:\s+Wedding)?$/i);
    if (match) return `${match[1].trim()[0]}&${match[2].trim()[0]}`;
    return null;
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
        aria-label="Scroll to top"
      >
        {monogram
          ? <>{monogram.split('&')[0]}<span>&amp;</span>{monogram.split('&')[1]}</>
          : <>A<span>&amp;</span>S</>
        }
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
