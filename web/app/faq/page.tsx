'use client';

import React, { useState } from 'react';

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
  {
    question: 'What is the Solana token-2022 standard?',
    answer: 'The Solana token-2022 standard includes features like transaction fees, which help reduce bot activity and ensure fair participation in token launches.',
  },
  {
    question: 'How does FairLauncher.fun prevent bot attacks?',
    answer: 'FairLauncher.fun implements advanced anti-bot mechanisms such as transaction limits, CAPTCHA verification, and randomized airdrops to ensure a fair and secure token launch process.',
  },
  {
    question: 'What are the benefits of using FairLauncher.fun for token launches?',
    answer: 'FairLauncher.fun offers a secure, scalable, and user-friendly environment for launching meme coins. It includes features like user deposits, token burn, and admin controls to manage token launches efficiently.',
  },
  {
    question: 'How can investors ensure the projects they invest in are legitimate?',
    answer: 'Investors can use comprehensive analytics and due diligence tools provided by FairLauncher.fun, as well as rely on smart contract audits and transparent project vetting processes to make informed decisions.',
  },
];

const FAQ: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-8 font-poppins">Frequently Asked Questions</h1>
        <p className="text-lg text-gray-700 text-center mb-12">
          Here are some of the most common questions about FairLauncher.fun and how it works.
        </p>
        <div className="space-y-8">
          {faqItems.map((item, index) => (
            <div
              key={index}
              className="bg-gray-100 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer"
              onClick={() => toggleFAQ(index)}
            >
              <h2 className="text-2xl font-bold mb-2 font-poppins">{item.question}</h2>
              {activeIndex === index && <p className="text-gray-700">{item.answer}</p>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
