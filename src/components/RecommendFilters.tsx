'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useState, useEffect, useCallback, useRef } from 'react';
import { Category, SortOption } from '@/lib/db';

interface RecommendFiltersProps {
  categories: Category[];
  totalCount: number;
  filteredCount: number;
}

// Helper to get category name from slug
function getCategoryName(categories: Category[], slug: string): string {
  const cat = categories.find((c) => c.slug === slug);
  return cat?.name || slug;
}

// Helper to get rating label
function getRatingLabel(rating: string): string {
  return rating === '4' ? '4+ Stars' : rating === '3' ? '3+ Stars' : rating;
}

// Helper to get sort label
function getSortLabel(sort: SortOption): string {
  const labels: Record<SortOption, string> = {
    rating: 'Highest Rated',
    reviews: 'Most Reviewed',
    newest: 'Newest',
    name: 'A-Z',
  };
  return labels[sort];
}

// Custom dropdown option interface
interface DropdownOption {
  value: string;
  label: string;
}

// Custom dropdown component with check icons
function FilterDropdown({
  options,
  value,
  onChange,
  placeholder,
  activeLabel,
}: {
  options: DropdownOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  activeLabel?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close on escape key
  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    }
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  const displayLabel = value ? (activeLabel || options.find(o => o.value === value)?.label || placeholder) : placeholder;
  const isActive = !!value;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 h-10 px-4 rounded-full border transition-all duration-200 text-sm font-medium ${
          isActive
            ? 'bg-teal-100 text-teal-700 border-teal-300'
            : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:border-slate-300'
        }`}
      >
        <span>{displayLabel}</span>
        <svg
          className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 min-w-[180px] bg-white rounded-lg shadow-lg border border-slate-200 py-1 z-50">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
              className={`w-full flex items-center justify-between h-11 px-4 text-left text-sm transition-colors ${
                value === option.value
                  ? 'bg-teal-50 text-teal-700 font-medium'
                  : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <span>{option.label}</span>
              {value === option.value && (
                <svg className="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function RecommendFilters({ categories, totalCount, filteredCount }: RecommendFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get('category') || '';
  const currentSearch = searchParams.get('search') || '';
  const currentMinRating = searchParams.get('minRating') || '';
  const currentSort = (searchParams.get('sort') || 'rating') as SortOption;

  const [searchValue, setSearchValue] = useState(currentSearch);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  // Count active filters (excluding default sort)
  const activeFilterCount =
    (currentCategory ? 1 : 0) +
    (currentMinRating ? 1 : 0) +
    (currentSort !== 'rating' ? 1 : 0);

  // Sync search value with URL when URL changes (e.g., browser back/forward)
  useEffect(() => {
    setSearchValue(currentSearch);
  }, [currentSearch]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isFilterModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isFilterModalOpen]);

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

  const clearFilter = (filterType: 'category' | 'minRating' | 'sort') => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete(filterType);
    router.push(`/recommend?${params.toString()}`);
  };

  const clearAllFilters = () => {
    const params = new URLSearchParams();
    if (currentSearch) {
      params.set('search', currentSearch);
    }
    router.push(`/recommend?${params.toString()}`);
    setIsFilterModalOpen(false);
  };

  return (
    <div className="flex flex-col gap-3">
      {/* Search row with Filters button on mobile */}
      <div className="flex gap-2">
        {/* Search */}
        <div className="relative flex-1">
          <input
            type="text"
            value={searchValue}
            onChange={handleSearchChange}
            placeholder="Search recommendations..."
            className="w-full h-10 px-4 pl-10 pr-10 border border-slate-200 rounded-full focus:border-teal-500 focus:ring-4 focus:ring-teal-500/20 outline-none bg-white text-sm transition-all duration-200"
          />
          <svg
            className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"
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
              className="absolute right-2 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
              aria-label="Clear search"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* Filters button - visible only on mobile */}
        <button
          type="button"
          onClick={() => setIsFilterModalOpen(true)}
          className="sm:hidden flex items-center justify-center gap-2 h-10 px-4 border border-slate-200 rounded-full bg-white hover:bg-slate-50 transition-all duration-200 relative"
          aria-label="Open filters"
        >
          <svg className="w-4 h-4 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          <span className="text-slate-700 font-medium text-sm">Filters</span>
          {activeFilterCount > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-teal-600 text-white text-xs rounded-full flex items-center justify-center font-medium">
              {activeFilterCount}
            </span>
          )}
        </button>
      </div>

      {/* Active filter pills - visible on mobile when filters are applied */}
      {activeFilterCount > 0 && (
        <div className="flex flex-wrap gap-2 sm:hidden">
          {currentCategory && (
            <button
              type="button"
              onClick={() => clearFilter('category')}
              className="inline-flex items-center gap-1.5 min-h-[44px] px-3 py-2 bg-teal-100 text-teal-700 rounded-full text-sm font-medium hover:bg-teal-200 transition-colors"
            >
              {getCategoryName(categories, currentCategory)}
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
          {currentMinRating && (
            <button
              type="button"
              onClick={() => clearFilter('minRating')}
              className="inline-flex items-center gap-1.5 min-h-[44px] px-3 py-2 bg-teal-100 text-teal-700 rounded-full text-sm font-medium hover:bg-teal-200 transition-colors"
            >
              {getRatingLabel(currentMinRating)}
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
          {currentSort !== 'rating' && (
            <button
              type="button"
              onClick={() => clearFilter('sort')}
              className="inline-flex items-center gap-1.5 min-h-[44px] px-3 py-2 bg-teal-100 text-teal-700 rounded-full text-sm font-medium hover:bg-teal-200 transition-colors"
            >
              {getSortLabel(currentSort)}
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      )}

      {/* Desktop filters row - hidden on mobile */}
      <div className="hidden sm:flex flex-row items-center gap-3">
        {/* Category dropdown */}
        <FilterDropdown
          options={[
            { value: '', label: 'All Categories' },
            ...categories.map((cat) => ({
              value: cat.slug,
              label: `${cat.name} (${cat.recommendation_count})`,
            })),
          ]}
          value={currentCategory}
          onChange={(value) => {
            const params = new URLSearchParams(searchParams.toString());
            if (value) {
              params.set('category', value);
            } else {
              params.delete('category');
            }
            router.push(`/recommend?${params.toString()}`);
          }}
          placeholder="Category"
          activeLabel={currentCategory ? getCategoryName(categories, currentCategory) : undefined}
        />

        {/* Rating dropdown */}
        <FilterDropdown
          options={[
            { value: '', label: 'All Ratings' },
            { value: '4', label: '4+ Stars' },
            { value: '3', label: '3+ Stars' },
          ]}
          value={currentMinRating}
          onChange={(value) => {
            const params = new URLSearchParams(searchParams.toString());
            if (value) {
              params.set('minRating', value);
            } else {
              params.delete('minRating');
            }
            router.push(`/recommend?${params.toString()}`);
          }}
          placeholder="Rating"
          activeLabel={currentMinRating ? getRatingLabel(currentMinRating) : undefined}
        />

        {/* Sort dropdown */}
        <FilterDropdown
          options={[
            { value: 'rating', label: 'Highest Rated' },
            { value: 'reviews', label: 'Most Reviewed' },
            { value: 'newest', label: 'Newest' },
            { value: 'name', label: 'A-Z' },
          ]}
          value={currentSort}
          onChange={(value) => {
            const params = new URLSearchParams(searchParams.toString());
            if (value && value !== 'rating') {
              params.set('sort', value);
            } else {
              params.delete('sort');
            }
            router.push(`/recommend?${params.toString()}`);
          }}
          placeholder="Sort"
          activeLabel={currentSort !== 'rating' ? getSortLabel(currentSort) : undefined}
        />

        {/* Add button */}
        <Link
          href="/recommend/new"
          className="flex items-center justify-center gap-2 h-12 px-8 bg-teal-600 text-white text-base rounded-lg font-semibold hover:bg-teal-700 hover:shadow-md active:bg-teal-800 motion-safe:active:scale-[0.98] transition-all duration-150"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add
        </Link>
      </div>

      {/* Mobile Add button - visible only on mobile, below filters */}
      <Link
        href="/recommend/new"
        className="sm:hidden flex items-center justify-center gap-2 h-12 px-8 bg-teal-600 text-white text-base rounded-lg font-semibold hover:bg-teal-700 hover:shadow-md active:bg-teal-800 motion-safe:active:scale-[0.98] transition-all duration-150"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        Add Recommendation
      </Link>

      {/* Results count and search summary */}
      <div className="text-sm text-slate-600">
        {currentSearch ? (
          <span>
            {filteredCount} result{filteredCount !== 1 ? 's' : ''} for &ldquo;{currentSearch}&rdquo;
            {filteredCount !== totalCount && (
              <span className="text-slate-400"> (of {totalCount} total)</span>
            )}
          </span>
        ) : filteredCount === totalCount ? (
          <span>Showing {totalCount} recommendation{totalCount !== 1 ? 's' : ''}</span>
        ) : (
          <span>Showing {filteredCount} of {totalCount} recommendation{totalCount !== 1 ? 's' : ''}</span>
        )}
      </div>

      {/* Mobile Filter Bottom Sheet Modal */}
      {isFilterModalOpen && (
        <div className="fixed inset-0 z-50 sm:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setIsFilterModalOpen(false)}
          />

          {/* Bottom Sheet */}
          <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl max-h-[85vh] overflow-hidden animate-slide-up">
            {/* Handle */}
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-10 h-1 bg-slate-300 rounded-full" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-4 pb-3 border-b border-slate-200">
              <h2 className="text-lg font-semibold text-slate-900">Filters</h2>
              <button
                type="button"
                onClick={() => setIsFilterModalOpen(false)}
                className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full hover:bg-slate-100 text-slate-500 transition-colors"
                aria-label="Close filters"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Filter Options */}
            <div className="overflow-y-auto px-4 py-4 space-y-6" style={{ maxHeight: 'calc(85vh - 180px)' }}>
              {/* Category Filter */}
              <div>
                <label htmlFor="mobile-category" className="block text-sm font-medium text-slate-700 mb-2">
                  Category
                </label>
                <select
                  id="mobile-category"
                  value={currentCategory}
                  onChange={handleCategoryChange}
                  className={`w-full h-11 px-4 border rounded-lg focus:ring-4 focus:ring-teal-500/20 focus:border-teal-500 outline-none cursor-pointer text-sm transition-all duration-200 ${
                    currentCategory
                      ? 'border-teal-300 bg-teal-100 text-teal-700 font-medium'
                      : 'border-slate-200 bg-white text-slate-700'
                  }`}
                >
                  <option value="">All Categories</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.slug}>
                      {cat.name} ({cat.recommendation_count})
                    </option>
                  ))}
                </select>
              </div>

              {/* Rating Filter */}
              <div>
                <label htmlFor="mobile-rating" className="block text-sm font-medium text-slate-700 mb-2">
                  Minimum Rating
                </label>
                <select
                  id="mobile-rating"
                  value={currentMinRating}
                  onChange={handleRatingChange}
                  className={`w-full h-11 px-4 border rounded-lg focus:ring-4 focus:ring-teal-500/20 focus:border-teal-500 outline-none cursor-pointer text-sm transition-all duration-200 ${
                    currentMinRating
                      ? 'border-teal-300 bg-teal-100 text-teal-700 font-medium'
                      : 'border-slate-200 bg-white text-slate-700'
                  }`}
                >
                  <option value="">All Ratings</option>
                  <option value="4">4+ Stars</option>
                  <option value="3">3+ Stars</option>
                </select>
              </div>

              {/* Sort Option */}
              <div>
                <label htmlFor="mobile-sort" className="block text-sm font-medium text-slate-700 mb-2">
                  Sort By
                </label>
                <select
                  id="mobile-sort"
                  value={currentSort}
                  onChange={handleSortChange}
                  className={`w-full h-11 px-4 border rounded-lg focus:ring-4 focus:ring-teal-500/20 focus:border-teal-500 outline-none cursor-pointer text-sm transition-all duration-200 ${
                    currentSort !== 'rating'
                      ? 'border-teal-300 bg-teal-100 text-teal-700 font-medium'
                      : 'border-slate-200 bg-white text-slate-700'
                  }`}
                >
                  <option value="rating">Highest Rated</option>
                  <option value="reviews">Most Reviewed</option>
                  <option value="newest">Newest</option>
                  <option value="name">A-Z</option>
                </select>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="px-4 py-4 border-t border-slate-200 bg-white">
              <div className="flex gap-3">
                {activeFilterCount > 0 && (
                  <button
                    type="button"
                    onClick={clearAllFilters}
                    className="flex-1 h-12 px-8 bg-white border border-slate-300 text-slate-700 text-base rounded-lg font-semibold hover:bg-slate-50 hover:shadow-md motion-safe:active:scale-[0.98] transition-all duration-150"
                  >
                    Clear All
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setIsFilterModalOpen(false)}
                  className="flex-1 h-12 px-8 bg-teal-600 text-white text-base rounded-lg font-semibold hover:bg-teal-700 hover:shadow-md active:bg-teal-800 motion-safe:active:scale-[0.98] transition-all duration-150"
                >
                  Show Results
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
