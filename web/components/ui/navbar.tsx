'use client';

import React, { useState } from 'react';

const Navbar: React.FC = () => {
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    if (darkMode) {
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.add('dark');
    }
  };

  return (
    <header className="bg-white dark:bg-dark-gray py-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center px-4">
        <div className="flex items-center space-x-4">
          <img src="/barkbot-logo-dark.svg" alt="BarkBOT Logo" className="h-8" />
          <h5 className="text-2xl font-bold text-black dark:text-white"></h5>
        </div>
        <nav className="hidden md:flex space-x-4">
          <a href="#features" className="text-black dark:text-white hover:text-custom-orange transition">
            Features
          </a>
          <a href="#faq" className="text-black dark:text-white hover:text-custom-orange transition">
            FAQ
          </a>
        </nav>
        <div className="flex items-center space-x-4">
          <button
            onClick={toggleDarkMode}
            className="px-4 py-2 bg-dark-gray text-white rounded shadow-md hover:shadow-lg transition"
          >
            {darkMode ? 'Light Mode' : 'Dark Mode'}
          </button>
          <button className="px-4 py-2 bg-dark-gray text-white rounded shadow-md hover:shadow-lg transition">
            Connect Wallet
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
