import React from 'react';

const mintFeatures = [
  {
    title: 'Easy Minting',
    description: 'Mint your memecoins easily with our user-friendly interface.',
  },
  {
    title: 'Anti-Bot Mechanisms',
    description: 'Integrated anti-bot mechanisms to ensure fair token launches.',
  },
  {
    title: 'Scalable Infrastructure',
    description: 'Robust infrastructure that scales with your project’s needs.',
  },
];

const MintFeatures: React.FC = () => {
  return (
    <section id="mint-features" className="py-8">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-6">Minting Features</h2>
        <div className="flex flex-wrap -mx-4">
          {mintFeatures.map((feature, index) => (
            <div key={index} className="w-full md:w-1/3 px-4 mb-8">
              <div className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-gray-700">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MintFeatures;
