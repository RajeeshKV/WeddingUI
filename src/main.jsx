import React, { useState, useEffect, useCallback } from 'react';
import { createRoot } from 'react-dom/client';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUp } from 'lucide-react';

// Theme
import { getThemeFromURL, setThemeInURL, getTheme } from './theme/registry.js';
import './theme/tokens.css';

// Styles
import './tailwind.css';
import './styles.css';

// Layout
import { Nav }           from './components/layout/Nav.jsx';
import { IntroDispatcher } from './components/intro/IntroDispatcher.jsx';

// Sections
import { Hero }          from './features/Hero.jsx';
import { Welcome }       from './features/Welcome.jsx';
import { Story }         from './features/Story.jsx';
import { Events }        from './features/Events.jsx';
import { Gallery }       from './features/Gallery.jsx';
import { RSVP }          from './features/RSVP.jsx';
import { Travel }        from './features/Travel.jsx';
import { SiteFooter }    from './features/SiteFooter.jsx';
import { GalleryPage }   from './features/GalleryPage.jsx';
import { ThemeLauncher } from './features/ThemeLauncher.jsx';

/* ─── helpers ─────────────────────────────────────────────── */
function getCountdown() {
  const target = new Date('2027-02-17T09:00:00+05:30').getTime();
  const diff   = Math.max(0, target - Date.now());
  return {
    days:    Math.floor(diff / 86400000),
    hours:   Math.floor(diff / 3600000)  % 24,
    minutes: Math.floor(diff / 60000)    % 60,
    seconds: Math.floor(diff / 1000)     % 60,
  };
}

/* ─── Site configuration (from .env) ──────────────────────── */
// VITE_SITE_MODE: "launcher" (default) | "wedding"
// VITE_DEFAULT_THEME: any theme ID from registry.js
const SITE_MODE     = import.meta.env.VITE_SITE_MODE     || 'launcher';
const DEFAULT_THEME = import.meta.env.VITE_DEFAULT_THEME || 'eternal-bloom';

/* ─── Router ───────────────────────────────────────────────── */
// /gallery          → GalleryPage  (always)
// /  + ?theme=xxx   → MainSite with that theme  (always)
// /  + no ?theme    → launcher mode  → ThemeLauncher
//                  → wedding mode   → MainSite with DEFAULT_THEME
function getRoute() {
  const path  = window.location.pathname.replace(/\/$/, '');
  const theme = new URLSearchParams(window.location.search).get('theme');

  if (path === '/gallery') return { route: 'gallery' };
  if (theme)               return { route: 'site', themeId: theme };

  // No ?theme param — decide by mode
  if (SITE_MODE === 'wedding') return { route: 'site', themeId: DEFAULT_THEME };
  return { route: 'launcher' };
}

/* ─── Main Site ────────────────────────────────────────────── */
function MainSite({ initialThemeId = DEFAULT_THEME }) {
  const themeId = new URLSearchParams(window.location.search).get('theme') || initialThemeId;
  const theme   = getTheme(themeId);

  // Coming from launcher always shows intro fresh
  const [introVisible, setIntroVisible] = useState(true);
  const [showTop,  setShowTop]  = useState(false);
  const [uploads,  setUploads]  = useState([]);
  const [timeLeft, setTimeLeft] = useState(getCountdown);
  const [activeThemeId, setActiveThemeId] = useState(themeId);
  const activeTheme = getTheme(activeThemeId);

  useEffect(() => {
    const id = setInterval(() => setTimeLeft(getCountdown()), 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 500);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = introVisible ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [introVisible]);

  const handleIntroOpen = useCallback(() => setIntroVisible(false), []);

  const handleReplayIntro = useCallback(() => setIntroVisible(true), []);

  const handleThemeSelect = useCallback((id) => {
    setThemeInURL(id);
    setActiveThemeId(id);
    setIntroVisible(true); // re-show intro on theme switch
  }, []);

  const scrollTo = useCallback((id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const handleUpload = useCallback((e) => {
    const files = [...e.target.files]
      .filter(f => f.type.startsWith('image/'))
      .slice(0, 8);
    setUploads(prev =>
      [...prev, ...files.map(f => ({ file: f, url: URL.createObjectURL(f) }))].slice(0, 12)
    );
  }, []);

  return (
    <div className={`site ${activeTheme.cssClass}`}>
      <IntroDispatcher
        themeId={activeThemeId}
        visible={introVisible}
        onOpen={handleIntroOpen}
      />

      <Nav
        activeThemeId={activeThemeId}
        onThemeSelect={handleThemeSelect}
        onReplayIntro={handleReplayIntro}
        onScrollTo={scrollTo}
      />

      <main id="main-content">
        <Hero     timeLeft={timeLeft} onScrollTo={scrollTo} />
        <Welcome  />
        <Story    />
        <Events   onScrollTo={scrollTo} />
        <Gallery  uploads={uploads} onUpload={handleUpload} />
        <RSVP     />
        <Travel   />
      </main>

      <SiteFooter />

      {/* Floating back-to-top — icon only */}
      <AnimatePresence>
        {showTop && (
          <motion.button
            className="floating-top"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            aria-label="Back to top"
            initial={{ opacity: 0, y: 16, scale: 0.85 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.85 }}
            transition={{ duration: 0.3, type: 'spring', stiffness: 260, damping: 20 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.92 }}
          >
            <ArrowUp size={18} aria-hidden="true" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─── App router ───────────────────────────────────────────── */
function App() {
  const { route, themeId } = getRoute();
  if (route === 'gallery')  return <GalleryPage />;
  if (route === 'launcher') return <ThemeLauncher />;
  return <MainSite initialThemeId={themeId} />;
}

createRoot(document.getElementById('root')).render(<App />);
