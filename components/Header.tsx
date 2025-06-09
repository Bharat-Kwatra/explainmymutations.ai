
import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="bg-slate-900/80 backdrop-blur-md shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4 py-5 max-w-3xl">
        <div className="flex items-center space-x-3">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 text-primary-400 flex-shrink-0">
            <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17 17.25 21A2.652 2.652 0 0 0 21 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.73-.664 1.193-.816M11.42 15.17l-4.655 5.653a2.548 2.548 0 1 1-3.586-3.586l6.837-5.63m5.63-6.837L15.17 11.42m5.877 5.877L15.17 11.42M6.096 5.197A2.548 2.548 0 1 1 9.682 8.782m7.5 0-4.846 4.846m0 0 .94 .94m-9.353-3.03c0-1.168.56-2.207 1.413-2.87L6.963 3.44A3.27 3.27 0 0 1 11.037 3h2.167c1.817 0 3.447.879 4.478 2.249l.261.359M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
          </svg>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight bg-gradient-to-r from-primary-400 via-purple-400 to-secondary-400 text-transparent bg-clip-text">
            BioInCRO's Open Source ExplainMyMutations.AI
          </h1>
        </div>
      </div>
    </header>
  );
};
