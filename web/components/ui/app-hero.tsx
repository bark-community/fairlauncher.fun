'use client';

import React from 'react';

interface AppHeroProps {
  title: string;
  subtitle: string;
  demoLink: string;
  documentationLink: string;
}

export const AppHero: React.FC<AppHeroProps> = ({ title, subtitle, demoLink, documentationLink }) => {
  return (
    <section className="bg-light-gray py-24 px-6">
      <div className="container mx-auto text-center">
        <img src="/architecture.svg" alt="How it Works Icon" className="mx-auto mb-12 w-21 h-20" />
        <h1 className="text-4xl md:text-5xl font-bold text-black mb-4 font-poppins">{title}</h1>
        <p className="text-md md:text-lg text-gray-500 mb-8 font-poppins">{subtitle}</p>
        <div className="flex flex-col md:flex-row justify-center space-y-4 md:space-y-0 md:space-x-4">
          <a 
            href={demoLink} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="px-8 py-3 bg-custom-orange text-white rounded hover:bg-black transition duration-300"
          >
            Try Demo
          </a>
          <a 
            href={documentationLink} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="px-8 py-3 bg-dark-gray text-white rounded hover:bg-black transition duration-300"
          >
            Documentation
          </a>
        </div>
      </div>
    </section>
  );
};

export default AppHero;
