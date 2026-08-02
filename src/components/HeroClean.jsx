import React from 'react';
import { Link } from 'react-router-dom';

// Temporary clean Hero component (HeroClean) — used to recover build while original Hero.jsx is repaired
export default function HeroClean() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-3xl font-bold">Used Car Auto Parts</h1>
        <p className="mt-2 text-slate-600">Browse parts, search by category, and contact sellers.</p>
        <div className="mt-4">
          <Link to="/parts" className="px-4 py-2 bg-blue-600 text-white rounded">Browse Parts</Link>
        </div>
      </div>
    </div>
  );
}
