'use client';

import React from 'react';

const botFeatures = [
  { title: 'Instant Transactions', description: 'Paste a token address into Telegram and instantly send a purchase transaction for faster and more efficient trading.' },
  { title: 'Powered by Jupiter', description: 'Leverage Jupiter’s routing capabilities to ensure the fastest and most efficient trades, minimizing costs and maximizing efficiency.' },
  { title: 'User-Friendly Interface', description: 'Experience a seamless and intuitive Telegram BOT interface for executing swaps with ease.' },
  { title: 'Comprehensive Analytics', description: 'Gain valuable insights into your trading performance with detailed analytics and performance metrics.' },
  { title: 'Secure Transactions', description: 'Benefit from advanced security measures designed to protect your transactions and digital assets.' },
  { title: 'Anti-Resistance', description: 'Utilize the Solana-2022 Extension to minimize pump and dump activities and foster better token holder engagement.' },
];

const FeatureCards: React.FC = () => {
  return (
    <section className="bg-white dark:bg-gray-900 py-16 px-6">
      <div className="container mx-auto text-center">
        <h2 className="text-3xl font-bold mb-2 text-custom-orange font-poppins">BarkBOT Telegram App Features</h2>
        <p className="text-lg text-gray-500 mb-8 font-poppins">Explore the powerful features of BarkBOT designed to enhance your trading experience on the Solana blockchain.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {botFeatures.map((feature, index) => (
            <div key={index} className="p-6 bg-light-gray dark:bg-gray-800 rounded shadow-md hover:shadow-lg transition-shadow duration-300">
              <h3 className="text-xl font-bold mb-4 font-poppins text-custom-orange">{feature.title}</h3>
              <p className="text-gray-700 dark:text-gray-300">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureCards;
