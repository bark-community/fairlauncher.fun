'use client';

import React from 'react';
import { AppHero } from '@/components/ui/app-hero';
import FeatureCards from '@/components/features/feature-cards';
import FaqCards from '@/components/faq/faq-cards';

const LandingPage: React.FC = () => {
  return (
    <>
      <AppHero 
        title="Welcome to FairLauncher.fun" 
        subtitle="The decentralized application for launching memecoins with enhanced anti-bot mechanisms on the Solana blockchain." 
        demoLink="https://demo.fairlauncher.fun" 
        documentationLink="https://" 
      />
      <FeatureCards />
      <FaqCards />
    </>
  );
};

export default LandingPage;
