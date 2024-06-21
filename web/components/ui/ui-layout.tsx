'use client';

import React from 'react';

interface UiLayoutProps {
  children: React.ReactNode;
  links: { label: string; path: string }[];
}

export const UiLayout: React.FC<UiLayoutProps> = ({ children, links }) => {
  return (
    <div className="min-h-screen flex flex-col font-poppins">
      <header className="bg-white dark:bg-dark-gray text-black dark:text-white py-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center px-4">
          <div className="flex items-center space-x-4">
            <img src="/barkbot-logo-dark.svg" alt="BARK Protocol Logo" className="h-12" />
            <h1 className="text-3xl font-bold"></h1>
          </div>
          <nav className="space-x-4 hidden md:flex">
            {links.map((link, index) => (
              <a key={index} href={link.path} target="_blank" rel="noopener noreferrer" className="hover:text-custom-orange">
                {link.label}
              </a>
            ))}
          </nav>
          <button className="md:hidden text-custom-black dark:text-white">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
          </button>
        </div>
      </header>
      <main className="flex-grow">
        {children}
      </main>
      <footer className="py-8 bg-white dark:bg-dark-gray text-black dark:text-white border-t border-gray-300 dark:border-gray-700">
        <div className="container mx-auto text-center">
          <p className="text-lg font-bold mb-4">Follow Us</p>
          <div className="flex justify-center space-x-4 mb-4">
            {links.map((link, index) => (
              <a key={index} href={link.path} target="_blank" rel="noopener noreferrer">
                <img src={`/icons/${link.label.toLowerCase()}.svg`} alt={link.label} width={32} height={32} className="hover:opacity-75 transition-opacity duration-300" />
              </a>
            ))}
          </div>
          <p>&copy; 2024 BARK Protocol. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default UiLayout;
