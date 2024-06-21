import React from 'react';

interface FeatureProps {
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureProps> = ({ title, description }) => {
  return (
    <div className="p-6 bg-white rounded shadow-md hover:shadow-lg transition-shadow duration-300">
      <h3 className="text-xl font-bold mb-4">{title}</h3>
      <p className="text-gray-700">{description}</p>
    </div>
  );
};

export default FeatureCard;
