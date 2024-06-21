'use client';

import React from 'react';
import BotFeature from './fairlauncher.fun-feature';

const BotUI: React.FC = () => {
  const features = [
    {
      title: 'Instant Transactions',
      description: 'Paste a token address into Telegram and instantly send a purchase transaction.',
    },
    {
      title: 'Powered by Jupiter',
      description: 'Routing powered by Jupiter ensures the fastest and most efficient trades.',
    },
    {
      title: 'Comprehensive Analytics',
      description: 'Gain insights into your trading performance with detailed analytics.',
    },
  ];

  return (
    <section id="features" className="py-16 bg-gradient-to-r from-light-gray to-white">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center">Features</h2>
        <p className="text-lg text-gray-700 text-center mt-4">
          Explore the powerful features of FairLauncher.fund designed to enhance your memecoins experience on the Solana blockchain.
        </p>
        <div className="flex flex-wrap mt-8">
          {features.map((feature, index) => (
            <div key={index} className="w-full p-4 md:w-1/3">
              <div className="p-6 bg-white rounded shadow-md hover:shadow-lg transition-shadow duration-300">
                <h3 className="text-xl font-bold mb-4">{feature.title}</h3>
                <p className="text-gray-700">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BotUI;
