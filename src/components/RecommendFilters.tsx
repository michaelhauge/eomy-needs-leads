'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Category } from '@/lib/db';

interface RecommendFiltersProps {
  categories: Category[];
}

export default function RecommendFilters({ categories }: RecommendFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get('category') || '';
  const currentSearch = searchParams.get('search') || '';

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const params = new URLSearchParams(searchParams.toString());
    if (e.target.value) {
      params.set('category', e.target.value);
    } else {
      params.delete('category');
    }
    router.push(`/recommend?${params.toString()}`);
  };

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const search = formData.get('search') as string;
    const params = new URLSearchParams(searchParams.toString());
    if (search?.trim()) {
      params.set('search', search.trim());
    } else {
      params.delete('search');
    }
    router.push(`/recommend?${params.toString()}`);
  };

  return (
    <div className="flex flex-col gap-3">
      {/* Search */}
      <form onSubmit={handleSearchSubmit} className="relative">
        <input
          type="text"
          name="search"
          defaultValue={currentSearch}
          placeholder="Search recommendations..."
          className="w-full min-h-[48px] px-4 py-3 pl-11 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none bg-white text-base"
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
      </form>

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
