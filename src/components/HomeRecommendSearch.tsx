'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';

export default function HomeRecommendSearch() {
  const [searchValue, setSearchValue] = useState('');
  const router = useRouter();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (searchValue.trim()) {
      router.push(`/recommend?search=${encodeURIComponent(searchValue.trim())}`);
    } else {
      router.push('/recommend');
    }
  };

  const handleClear = () => {
    setSearchValue('');
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto">
      <div className="relative">
        {/* Search Icon - Left */}
        <svg
          className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
        </svg>

        <input
          type="text"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          placeholder="Search accountants, lawyers, IT services..."
          className="w-full h-[52px] sm:h-14 pl-12 pr-12 bg-white border-2 border-slate-200 rounded-xl text-base text-slate-900 placeholder:text-slate-400 outline-none transition-all duration-200 focus:border-teal-500 focus:ring-4 focus:ring-teal-500/20"
        />

        {/* Clear X Button - Right */}
        {searchValue && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
    </form>
  );
}
