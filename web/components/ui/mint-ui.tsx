'use client';

import React from 'react';
import JupiterTerminal from '@/components/mint/integrated-terminal';
import MintFeatures from '@/components/mint/mint-features';
import FairLauncherFeatures from '@/components/fairlauncher.fun/FairLauncherFeatures';

const MintUI: React.FC = () => {
  return (
    <div className="container mx-auto">
      <JupiterTerminal />
      <MintFeatures />
      <FairLauncherFeatures />
    </div>
  );
};

export default MintUI;
