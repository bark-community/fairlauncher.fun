'use client';

import React from 'react';
import MintFeatures from '@/components/mint/mint-features';
import FeatureCards from '@/components/fairlauncher.fun/fairlauncher.fun-features';

const FeaturesPage: React.FC = () => {
  return (
    <div className="container mx-auto py-16 px-6">
      <h1 className="text-4xl font-bold text-center mb-8 font-poppins text-custom-orange">Features</h1>
      <p className="text-lg text-gray-500 mb-12 font-poppins text-center">
        Creating, Minting and Trading secured NFTs and memecoins with an easy way.
      </p>
      <MintFeatures />
      <FeatureCards />
    </div>
  );
};

export default FeaturesPage;
