'use client';

import React from 'react';

const socialLinks = [
  { label: 'x.com', path: 'https://x.com/bark_protocol', icon: '/icons/x.svg' },
  { label: 'Telegram', path: 'https://t.me/bark_protocol', icon: '/icons/telegram.svg' },
  { label: 'Discord', path: 'https://discord.gg/H9en8eHzn2', icon: '/icons/discord.svg' },
  { label: 'Medium', path: 'https://medium.com/@barkprotocol', icon: '/icons/medium.svg' },
  { label: 'GitHub', path: 'https://github.com/bark-community', icon: '/icons/github.svg' },
];

const Footer: React.FC = () => {
  return (
    <footer className="py-8 bg-white dark:bg-dark-gray border-t border-gray-300">
      <div className="container mx-auto text-center">
        <p className="text-lg font-bold mb-4 dark:text-white">Follow Us</p>
        <div className="flex justify-center space-x-4 mb-4">
          {socialLinks.map((link, index) => (
            <a key={index} href={link.path} target="_blank" rel="noopener noreferrer">
              <img src={link.icon} alt={link.label} width={32} height={32} className="hover:opacity-75 transition-opacity duration-300" />
            </a>
          ))}
        </div>
        <p className="text-black dark:text-white">&copy; 2024 BARK Protocol. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
