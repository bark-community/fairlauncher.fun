import React from 'react';

const features = [
  {
    title: 'Instant Transactions',
    description: 'Instantly execute transactions with minimal fees on the Solana blockchain, ensuring seamless purchase operations.',
  },
  {
    title: 'Powered by Jupiter',
    description: 'Utilizes Jupiter routing for the fastest and most efficient trades, providing optimal transaction paths.',
  },
  {
    title: 'Comprehensive Analytics',
    description: 'Access detailed analytics to gain insights into your trading performance and make informed decisions.',
  },
];

const FeatureCards: React.FC = () => {
  return (
    <div className="flex flex-wrap -mx-4">
      {features.map((feature, index) => (
        <div key={index} className="w-full md:w-1/3 px-4 mb-8">
          <div className="p-6 bg-white rounded shadow-md hover:shadow-lg transition-shadow duration-300">
            <h3 className="text-xl font-bold mb-4">{feature.title}</h3>
            <p className="text-gray-700">{feature.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FeatureCards;
