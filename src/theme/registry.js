/**
 * Wedding Theme Registry
 * Central source of truth for all 10 theme configurations.
 * Components consume theme tokens via CSS custom properties — never hardcoded colors.
 */

export const THEMES = [
  {
    id: 'eternal-bloom',
    name: 'The Eternal Bloom',
    label: '01 · The Eternal Bloom',
    note: 'Lavender, dusty rose, pearl',
    cssClass: 'theme-eternal-bloom',
    palette: {
      primary: '#8B6E7F',
      secondary: '#C4A6B2',
      accent: '#D4B5C8',
      preview: ['#EDE0EB', '#C4A6B2', '#8B6E7F', '#5C3D52'],
    },
    fonts: {
      serif: "'Cormorant Garamond', Georgia, serif",
      sans: "'DM Sans', sans-serif",
      googleFonts: 'Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400',
    },
    intro: {
      type: 'envelope',
      bg: 'lavender-rose-gradient',
    },
    motion: 'delicate', // delicate | dramatic | organic | editorial | fluid | cinematic | magical
  },
  {
    id: 'midnight-vows',
    name: 'Midnight Vows',
    label: '02 · Midnight Vows',
    note: 'Near-black, burgundy, antique gold',
    cssClass: 'theme-midnight-vows',
    palette: {
      primary: '#C9A84C',
      secondary: '#8B1A1A',
      accent: '#C9A84C',
      preview: ['#0F0A0A', '#3D1515', '#8B1A1A', '#C9A84C'],
    },
    fonts: {
      serif: "'Cormorant Garamond', Georgia, serif",
      sans: "'DM Sans', sans-serif",
      googleFonts: 'Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400',
    },
    intro: {
      type: 'light-reveal',
      bg: 'dark-cinematic',
    },
    motion: 'dramatic',
  },
  {
    id: 'marigold-mandap',
    name: 'Marigold Mandap',
    label: '03 · Marigold Mandap',
    note: 'Saffron, vermilion, ivory, antique gold',
    cssClass: 'theme-marigold-mandap',
    palette: {
      primary: '#E07A30',
      secondary: '#CC4B2C',
      accent: '#D4A843',
      preview: ['#FDF6E8', '#E07A30', '#CC4B2C', '#D4A843'],
    },
    fonts: {
      serif: "'Cormorant Garamond', Georgia, serif",
      sans: "'DM Sans', sans-serif",
      googleFonts: 'Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400',
    },
    intro: {
      type: 'mandap-arch',
      bg: 'petal-fall',
    },
    motion: 'organic',
  },
  {
    id: 'tuscan-romance',
    name: 'Tuscan Romance',
    label: '04 · Tuscan Romance',
    note: 'Terracotta, olive, warm cream',
    cssClass: 'theme-tuscan-romance',
    palette: {
      primary: '#B5613A',
      secondary: '#7A8C55',
      accent: '#D4A87A',
      preview: ['#F7EFDF', '#D4A87A', '#B5613A', '#7A8C55'],
    },
    fonts: {
      serif: "'Playfair Display', Georgia, serif",
      sans: "'DM Sans', sans-serif",
      googleFonts: null,
    },
    intro: {
      type: 'landscape',
      bg: 'tuscan-hills',
    },
    motion: 'organic',
  },
  {
    id: 'pearl-atelier',
    name: 'Pearl Atelier',
    label: '05 · Pearl Atelier',
    note: 'Porcelain, pearl, charcoal, silver',
    cssClass: 'theme-pearl-atelier',
    palette: {
      primary: '#5C5C5C',
      secondary: '#9E9E9E',
      accent: '#C8C8C8',
      preview: ['#F8F6F3', '#E8E5E0', '#9E9E9E', '#3A3A3A'],
    },
    fonts: {
      serif: "'EB Garamond', Georgia, serif",
      sans: "'DM Sans', sans-serif",
      googleFonts: 'EB+Garamond:ital,wght@0,400;0,500;1,400',
    },
    intro: {
      type: 'card-reveal',
      bg: 'paper-texture',
    },
    motion: 'editorial',
  },
  {
    id: 'sakura-reverie',
    name: 'Sakura Reverie',
    label: '06 · Sakura Reverie',
    note: 'Cherry-blossom pink, cream, plum',
    cssClass: 'theme-sakura-reverie',
    palette: {
      primary: '#D4889A',
      secondary: '#8B4D6B',
      accent: '#F0C0CC',
      preview: ['#FDF5F7', '#F0C0CC', '#D4889A', '#8B4D6B'],
    },
    fonts: {
      serif: "'Cormorant Garamond', Georgia, serif",
      sans: "'DM Sans', sans-serif",
      googleFonts: 'Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400',
    },
    intro: {
      type: 'sakura-branch',
      bg: 'sakura-petals',
    },
    motion: 'delicate',
  },
  {
    id: 'secret-garden',
    name: 'The Secret Garden',
    label: '07 · The Secret Garden',
    note: 'Sage, forest green, parchment, gold',
    cssClass: 'theme-secret-garden',
    palette: {
      primary: '#5C7A5C',
      secondary: '#8B9E6B',
      accent: '#C4A85A',
      preview: ['#F3F0E5', '#C4D4B8', '#5C7A5C', '#2D4A2D'],
    },
    fonts: {
      serif: "'EB Garamond', Georgia, serif",
      sans: "'DM Sans', sans-serif",
      googleFonts: 'EB+Garamond:ital,wght@0,400;0,500;1,400',
    },
    intro: {
      type: 'botanical-letter',
      bg: 'botanical-vines',
    },
    motion: 'organic',
  },
  {
    id: 'ocean-serenade',
    name: 'Ocean Serenade',
    label: '08 · Ocean Serenade',
    note: 'Deep teal, sea glass, sand, pearl',
    cssClass: 'theme-ocean-serenade',
    palette: {
      primary: '#2A7A8C',
      secondary: '#7ABCB8',
      accent: '#D4C4A8',
      preview: ['#EFF7F7', '#7ABCB8', '#2A7A8C', '#1A4A58'],
    },
    fonts: {
      serif: "'Cormorant Garamond', Georgia, serif",
      sans: "'DM Sans', sans-serif",
      googleFonts: 'Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400',
    },
    intro: {
      type: 'wave-rise',
      bg: 'ocean-waves',
    },
    motion: 'fluid',
  },
  {
    id: 'cinema-paradiso',
    name: 'Cinema Paradiso',
    label: '09 · Cinema Paradiso',
    note: 'Sepia, espresso, parchment, faded rose',
    cssClass: 'theme-cinema-paradiso',
    palette: {
      primary: '#8B5E3C',
      secondary: '#C4977A',
      accent: '#D4B8A0',
      preview: ['#F5EDDF', '#D4B8A0', '#8B5E3C', '#3A2A1A'],
    },
    fonts: {
      serif: "'Playfair Display', Georgia, serif",
      sans: "'DM Sans', sans-serif",
      googleFonts: null,
    },
    intro: {
      type: 'film-frame',
      bg: 'film-grain',
    },
    motion: 'cinematic',
  },
  {
    id: 'celestial-promise',
    name: 'Celestial Promise',
    label: '10 · Celestial Promise',
    note: 'Indigo, midnight blue, lavender, silver',
    cssClass: 'theme-celestial-promise',
    palette: {
      primary: '#7B7EC8',
      secondary: '#9BA4E0',
      accent: '#C8C0E8',
      preview: ['#0A0A1A', '#1A1A3A', '#3A3A7A', '#7B7EC8'],
    },
    fonts: {
      serif: "'Cormorant Garamond', Georgia, serif",
      sans: "'DM Sans', sans-serif",
      googleFonts: 'Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400',
    },
    intro: {
      type: 'constellation',
      bg: 'star-field',
    },
    motion: 'magical',
  },
];

export const THEME_MAP = Object.fromEntries(THEMES.map(t => [t.id, t]));

export const DEFAULT_THEME_ID = import.meta.env?.VITE_DEFAULT_THEME || 'eternal-bloom';

export function getTheme(id) {
  return THEME_MAP[id] || THEME_MAP[DEFAULT_THEME_ID];
}

export function getThemeFromURL() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get('theme');
  return id && THEME_MAP[id] ? id : DEFAULT_THEME_ID;
}

export function setThemeInURL(id) {
  const url = new URL(window.location.href);
  url.searchParams.set('theme', id);
  window.history.replaceState({}, '', url);
}
