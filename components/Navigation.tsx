"use client";

import { ArrowRight, CirclePlus } from 'lucide-react';

export default function Navigation() {
  return(
    <nav className="mx-24 h-24 flex flex-row justify-between items-center">
      <h2>
        <span className="text-lg font-bold text-secondary-dark">
          Round        
        </span>
        <span className="text-xl font-bold text-primary-dark">
          One 
        </span>
      </h2> 
      <div className="flex flex-row gap-2">
        <button className="inline-flex items-center gap-1 text-sm font-semibold 
          px-4 py-2 text-primary-dark border border-secondary-dark rounded-4xl
          hover:bg-secondary-dark hover:text-white transition-all duration-400"
        >
          <ArrowRight size={16}/>
          Log In
        </button>
        <button className="inline-flex items-center gap-1 px-4 py-2 
          text-sm font-semibold border border-1 text-white bg-secondary-dark rounded-4xl
          hover:bg-white hover:text-secondary-dark transition-all duration-400"
        >
          <CirclePlus size={16}/>
          Sign Up
        </button>
      </div>
    </nav>
  );
}
