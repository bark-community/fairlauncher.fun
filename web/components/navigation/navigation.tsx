'use client';

import React from 'react';
import Link from 'next/link';

const Navigation: React.FC = () => {
  return (
    <nav className="bg-white dark:bg-gray-800 shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <img src="/barkbot-logo-dark.svg" alt="BARK Protocol Logo" className="h-12" />
          <h5 className="text-2xl font-bold"></h5>
        </div>
        <div className="space-x-4">
          <Link href="/features">
            <a className="text-black dark:text-white hover:text-custom-orange">Features</a>
          </Link>
          <Link href="/mint">
            <a className="text-black dark:text-white hover:text-custom-orange">Mint</a>
          </Link>
          <Link href="/about">
            <a className="text-black dark:text-white hover:text-custom-orange">About</a>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
