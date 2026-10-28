import React from 'react';
import { AnimatePresence } from 'framer-motion';
import { InvitationExperience } from './InvitationExperience.jsx';

export function IntroDispatcher({ themeId, visible, onOpen, coupleName }) {
  return <AnimatePresence>
    {visible && <InvitationExperience key={themeId} themeId={themeId} onOpen={onOpen} coupleName={coupleName} />}
  </AnimatePresence>;
}

export default IntroDispatcher;
