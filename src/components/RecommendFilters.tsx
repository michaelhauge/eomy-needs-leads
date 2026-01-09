'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useState, useEffect, useCallback } from 'react';
import { Category, SortOption } from '@/lib/db';

interface RecommendFiltersProps {
  categories: Category[];
  totalCount: number;
  filteredCount: number;
}

export default function RecommendFilters({ categories, totalCount, filteredCount }: RecommendFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get('category') || '';
  const currentSearch = searchParams.get('search') || '';
  const currentMinRating = searchParams.get('minRating') || '';
  const currentSort = (searchParams.get('sort') || 'rating') as SortOption;

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

  const handleRatingChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const params = new URLSearchParams(searchParams.toString());
    if (e.target.value) {
      params.set('minRating', e.target.value);
    } else {
      params.delete('minRating');
    }
    router.push(`/recommend?${params.toString()}`);
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const params = new URLSearchParams(searchParams.toString());
    if (e.target.value && e.target.value !== 'rating') {
      params.set('sort', e.target.value);
    } else {
      params.delete('sort'); // 'rating' is default, no need to include in URL
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

      {/* Category dropdown, Rating filter, and Add button */}
      <div className="flex flex-col sm:flex-row gap-3">
        <select
          value={currentCategory}
          onChange={handleCategoryChange}
          className={`flex-1 sm:flex-none w-full sm:w-auto min-h-[48px] px-4 py-3 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none cursor-pointer text-base ${
            currentCategory
              ? 'border-teal-500 bg-teal-50 text-teal-700 font-medium'
              : 'border-gray-200 bg-white'
          }`}
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.slug}>
              {cat.name} ({cat.recommendation_count})
            </option>
          ))}
        </select>

        {/* Rating filter */}
        <select
          value={currentMinRating}
          onChange={handleRatingChange}
          className={`flex-1 sm:flex-none w-full sm:w-auto min-h-[48px] px-4 py-3 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none cursor-pointer text-base ${
            currentMinRating
              ? 'border-teal-500 bg-teal-50 text-teal-700 font-medium'
              : 'border-gray-200 bg-white'
          }`}
        >
          <option value="">All Ratings</option>
          <option value="4">4+ Stars</option>
          <option value="3">3+ Stars</option>
        </select>

        {/* Sort dropdown */}
        <select
          value={currentSort}
          onChange={handleSortChange}
          className={`flex-1 sm:flex-none w-full sm:w-auto min-h-[48px] px-4 py-3 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none cursor-pointer text-base ${
            currentSort !== 'rating'
              ? 'border-teal-500 bg-teal-50 text-teal-700 font-medium'
              : 'border-gray-200 bg-white'
          }`}
        >
          <option value="rating">Highest Rated</option>
          <option value="reviews">Most Reviewed</option>
          <option value="newest">Newest</option>
          <option value="name">A-Z</option>
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

      {/* Results count */}
      <div className="text-sm text-gray-600">
        {filteredCount === totalCount ? (
          <span>Showing {totalCount} recommendation{totalCount !== 1 ? 's' : ''}</span>
        ) : (
          <span>Showing {filteredCount} of {totalCount} recommendation{totalCount !== 1 ? 's' : ''}</span>
        )}
      </div>
    </div>
  );
}
