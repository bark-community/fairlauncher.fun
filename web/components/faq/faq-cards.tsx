import React from 'react';

const faqItems = [
  {
    question: 'What is FairLauncher.fun?',
    answer: 'FairLauncher.fun is a platform designed to facilitate the creation, launch, and management of meme coins on the Solana blockchain, with a focus on security, scalability, and user experience.',
  },
  {
    question: 'How does FairLauncher.fun work?',
    answer: 'FairLauncher.fun provides a seamless interface for developers to initiate token launches, manage token distribution, and engage with investors. It also offers advanced features to ensure fair participation and reduce bot activity.',
  },
  {
    question: 'How do I get started with FairLauncher.fun?',
    answer: 'You can get started by registering on our platform, connecting your wallet, and following the steps outlined in our getting started guide.',
  },
  {
    question: 'Is FairLauncher.fun secure?',
    answer: 'Yes, FairLauncher.fun uses robust security measures including JWT-based authentication, two-factor authentication (2FA), and rate limiting to protect user accounts and data.',
  },
];

const FaqCards: React.FC = () => {
  return (
    <div className="space-y-8">
      {faqItems.map((item, index) => (
        <div key={index} className="bg-gray-100 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
          <h3 className="text-2xl font-bold mb-2">{item.question}</h3>
          <p className="text-gray-700">{item.answer}</p>
        </div>
      ))}
    </div>
  );
};

export default FaqCards;
