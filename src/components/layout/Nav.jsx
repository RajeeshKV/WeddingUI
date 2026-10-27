import React, { useState, useEffect, useRef } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Menu, X, Music2, ArrowUpRight, Palette } from 'lucide-react';
import { ThemeSelector } from '../ui/ThemeSelector.jsx';
import { THEMES } from '../../theme/registry.js';

export function Nav({ activeThemeId, onThemeSelect, onReplayIntro, onScrollTo }) {
  const [menuOpen,  setMenuOpen]  = useState(false);
  const [themeOpen, setThemeOpen] = useState(false);
  const [sound,     setSound]     = useState(false);
  const [scrolled,  setScrolled]  = useState(false);
  const navRef = useRef(null);

  const activeTheme = THEMES.find(t => t.id === activeThemeId);
  const themeNum = (THEMES.findIndex(t => t.id === activeThemeId) + 1).toString().padStart(2, '0');

  /* Compact nav on scroll + keep --nav-h CSS var in sync */
  useEffect(() => {
    const onScroll = () => {
      const past = window.scrollY > 60;
      setScrolled(past);
      if (navRef.current) {
        const h = navRef.current.getBoundingClientRect().height;
        document.documentElement.style.setProperty('--nav-h', `${h}px`);
      }
    };
    onScroll(); // run once on mount
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* Close mobile menu on outside click */
  useEffect(() => {
    if (!menuOpen) return;
    const close = (e) => {
      if (navRef.current && !navRef.current.contains(e.target)) setMenuOpen(false);
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, [menuOpen]);

  const navLinks = [
    ['Home',       'home'],
    ['Our Story',  'story'],
    ['Events',     'events'],
    ['Gallery',    '/gallery'],
    ['RSVP',       'rsvp'],
    ['Travel',     'travel'],
  ];

  const navClass = [
    'site-nav',
    scrolled  ? 'site-nav--scrolled'  : '',
  ].filter(Boolean).join(' ');

  return (
    <>
      <header ref={navRef} className={navClass} role="banner">

        {/* Logo */}
        <button
          className="nav-monogram"
          onClick={() => onScrollTo('home')}
          aria-label="Scroll to top"
        >
          A<span>&amp;</span>S
        </button>

        {/* Desktop + mobile nav links */}
        <nav
          className={`nav-links${menuOpen ? ' nav-links--open' : ''}`}
          aria-label="Main navigation"
        >
          {navLinks.map(([label, id]) =>
            id === '/gallery' ? (
              <a key={id} href="/gallery" onClick={() => setMenuOpen(false)}>
                {label}
              </a>
            ) : (
              <button
                key={id}
                onClick={() => { onScrollTo(id); setMenuOpen(false); }}
              >
                {label}
              </button>
            )
          )}
        </nav>

        {/* Actions */}
        <div className="nav-actions">

          {/* Theme picker trigger */}
          <button
            className="nav-icon-btn nav-theme-btn"
            onClick={() => setThemeOpen(v => !v)}
            aria-expanded={themeOpen}
            aria-haspopup="dialog"
            aria-label={`Theme: ${activeTheme?.name}`}
          >
            <Palette size={15} aria-hidden="true" />
            <span className="nav-theme-label">Theme</span>
            <span className="nav-theme-num">{themeNum}</span>
          </button>

          {/* Sound toggle */}
          <button
            className="nav-icon-btn nav-sound-btn"
            onClick={() => setSound(v => !v)}
            aria-label={sound ? 'Mute music' : 'Play music'}
            aria-pressed={sound}
          >
            <Music2 size={15} aria-hidden="true" />
            <span>{sound ? 'On' : 'Off'}</span>
          </button>

          {/* RSVP CTA */}
          <button
            className="btn btn-primary nav-rsvp-btn"
            onClick={() => { onScrollTo('rsvp'); setMenuOpen(false); }}
          >
            RSVP Now <ArrowUpRight size={14} aria-hidden="true" />
          </button>

          {/* Hamburger (mobile only) */}
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

      {/* Theme selector panel */}
      <ThemeSelector
        activeThemeId={activeThemeId}
        onSelect={onThemeSelect}
        onReplayIntro={() => { onReplayIntro(); setThemeOpen(false); }}
        open={themeOpen}
        onClose={() => setThemeOpen(false)}
      />
    </>
  );
}

export default Nav;
