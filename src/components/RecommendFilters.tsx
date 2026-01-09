'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useState, useEffect, useCallback } from 'react';
import { Category } from '@/lib/db';

interface RecommendFiltersProps {
  categories: Category[];
}

export default function RecommendFilters({ categories }: RecommendFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get('category') || '';
  const currentSearch = searchParams.get('search') || '';

  const [searchValue, setSearchValue] = useState(currentSearch);

  // Sync search value with URL when URL changes (e.g., browser back/forward)
  useEffect(() => {
    setSearchValue(currentSearch);
  }, [currentSearch]);

  // Debounced search - update URL after 300ms of no typing
  const updateSearchURL = useCallback((value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value.trim()) {
      params.set('search', value.trim());
    } else {
      params.delete('search');
    }
    router.push(`/recommend?${params.toString()}`);
  }, [router, searchParams]);

  useEffect(() => {
    const handler = setTimeout(() => {
      if (searchValue !== currentSearch) {
        updateSearchURL(searchValue);
      }
    }, 300);

    return () => clearTimeout(handler);
  }, [searchValue, currentSearch, updateSearchURL]);

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const params = new URLSearchParams(searchParams.toString());
    if (e.target.value) {
      params.set('category', e.target.value);
    } else {
      params.delete('category');
    }
    router.push(`/recommend?${params.toString()}`);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  const clearSearch = () => {
    setSearchValue('');
    const params = new URLSearchParams(searchParams.toString());
    params.delete('search');
    router.push(`/recommend?${params.toString()}`);
  };

  return (
    <div className="flex flex-col gap-3">
      {/* Search */}
      <div className="relative">
        <input
          type="text"
          value={searchValue}
          onChange={handleSearchChange}
          placeholder="Search recommendations..."
          className="w-full min-h-[48px] px-4 py-3 pl-11 pr-10 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none bg-white text-base"
        />
        <svg
          className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        {searchValue && (
          <button
            type="button"
            onClick={clearSearch}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Clear search"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Category dropdown and Add button */}
      <div className="flex flex-col sm:flex-row gap-3">
        <select
          value={currentCategory}
          onChange={handleCategoryChange}
          className="flex-1 sm:flex-none w-full sm:w-auto min-h-[48px] px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none bg-white cursor-pointer text-base"
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.slug}>
              {cat.name}
            </option>
          ))}
        </select>

        {/* Add button */}
        <Link
          href="/recommend/new"
          className="flex items-center justify-center gap-2 min-h-[48px] px-4 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors font-medium text-base"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Recommendation
        </Link>
      </div>
    </div>
  );
}
