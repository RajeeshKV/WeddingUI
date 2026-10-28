/**
 * useWeddingData
 * Fetches all public wedding data on mount: config, events, gallery.
 * Falls back gracefully when VITE_WEDDING_SLUG is not set (demo mode).
 */
import { useState, useEffect, useCallback } from 'react';
import { getWeddingConfig, getAllWeddingEvents, getPublicGallery, normalizePage } from '../services/api/public.js';

const SLUG = import.meta.env.VITE_WEDDING_SLUG || '';

export function useWeddingData() {
  const [config,  setConfig]  = useState(null);
  const [events,  setEvents]  = useState([]);
  const [gallery, setGallery] = useState([]);
  const [loading, setLoading] = useState(Boolean(SLUG));
  const [error,   setError]   = useState(null);

  const reload = useCallback(async () => {
    if (!SLUG) return; // no slug = demo mode, use static data
    setLoading(true);
    setError(null);
    try {
      const [cfg, evts, gal] = await Promise.all([
        getWeddingConfig(),
        getAllWeddingEvents(),
        getPublicGallery({ page: 1, pageSize: 4 }),
      ]);
      setConfig(cfg);
      setEvents(Array.isArray(evts) ? evts : []);
      setGallery(normalizePage(gal, 1, 4).items);
    } catch (e) {
      setError(e.message || 'Failed to load wedding data.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { reload(); }, [reload]);

  return { config, events, gallery, loading, error, reload, hasSlug: Boolean(SLUG) };
}
