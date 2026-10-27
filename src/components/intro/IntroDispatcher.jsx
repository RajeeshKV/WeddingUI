import React from 'react';
import { AnimatePresence } from 'framer-motion';
import { EternalBloomIntro } from './EternalBloomIntro';
import { MidnightVowsIntro } from './MidnightVowsIntro';
import { MarigoldMandapIntro } from './MarigoldMandapIntro';
import { TuscanRomanceIntro } from './TuscanRomanceIntro';
import { PearlAtelierIntro } from './PearlAtelierIntro';
import { SakuraReverieIntro } from './SakuraReverieIntro';
import { SecretGardenIntro } from './SecretGardenIntro';
import { OceanSerenadeIntro } from './OceanSerenadeIntro';
import { CinemaParadisoIntro } from './CinemaParadisoIntro';
import { CelestialPromiseIntro } from './CelestialPromiseIntro';

const INTRO_MAP = {
  'eternal-bloom': EternalBloomIntro,
  'midnight-vows': MidnightVowsIntro,
  'marigold-mandap': MarigoldMandapIntro,
  'tuscan-romance': TuscanRomanceIntro,
  'pearl-atelier': PearlAtelierIntro,
  'sakura-reverie': SakuraReverieIntro,
  'secret-garden': SecretGardenIntro,
  'ocean-serenade': OceanSerenadeIntro,
  'cinema-paradiso': CinemaParadisoIntro,
  'celestial-promise': CelestialPromiseIntro,
};

/**
 * Selects and renders the correct intro component for the active theme.
 * Wrapped in AnimatePresence so the exit animation fires on onOpen.
 */
export function IntroDispatcher({ themeId, visible, onOpen }) {
  const IntroComponent = INTRO_MAP[themeId] || EternalBloomIntro;

  return (
    <AnimatePresence>
      {visible && (
        <IntroComponent key={themeId} onOpen={onOpen} />
      )}
    </AnimatePresence>
  );
}

export default IntroDispatcher;
