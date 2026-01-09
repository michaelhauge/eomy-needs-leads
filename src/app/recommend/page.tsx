import { Suspense } from 'react';
import Link from 'next/link';
import { getRecommendations, getCategories } from '@/lib/db';
import RecommendCard from '@/components/RecommendCard';
import Navigation from '@/components/Navigation';

interface PageProps {
  searchParams: Promise<{
    search?: string;
    category?: string;
  }>;
}

async function RecommendationsGrid({ searchParams }: { searchParams: PageProps['searchParams'] }) {
  const params = await searchParams;
  const recommendations = await getRecommendations({
    search: params.search,
    categorySlug: params.category,
    limit: 100,
  });

  if (recommendations.length === 0) {
    return (
      <div className="col-span-full text-center py-12">
        <p className="text-gray-500 text-lg">No recommendations found.</p>
        <p className="text-gray-400 mt-2">Be the first to recommend a business!</p>
        <Link
          href="/recommend/new"
          className="inline-block mt-4 px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
        >
          Add Recommendation
        </Link>
      </div>
    );
  }

  return (
    <>
      {recommendations.map((rec) => (
        <RecommendCard key={rec.id} recommendation={rec} />
      ))}
    </>
  );
}

async function Filters({ searchParams }: { searchParams: PageProps['searchParams'] }) {
  const params = await searchParams;
  const categories = await getCategories();
  const currentCategory = params.category || '';
  const currentSearch = params.search || '';

  return (
    <div className="flex flex-col gap-3">
      {/* Search */}
      <form className="relative">
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
        <input type="hidden" name="category" value={currentCategory} />
      </form>

      {/* Category dropdown */}
      <div className="flex flex-col sm:flex-row gap-3">
        <form className="flex-1 sm:flex-none">
          <select
            name="category"
            defaultValue={currentCategory}
            onChange={(e) => {
              const form = e.target.form;
              if (form) form.submit();
            }}
            className="w-full sm:w-auto min-h-[48px] px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none bg-white cursor-pointer text-base"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.slug}>
                {cat.name}
              </option>
            ))}
          </select>
          <input type="hidden" name="search" value={currentSearch} />
        </form>

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

export default async function RecommendPage({ searchParams }: PageProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6 sm:py-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">EO Members Recommend</h1>
          <p className="text-gray-600 text-sm sm:text-base">
            Trusted businesses and services recommended by EO Malaysia members
          </p>
        </div>

        {/* Filters */}
        <div className="mb-6">
          <Suspense fallback={<div className="h-24 sm:h-12 bg-gray-200 rounded-lg animate-pulse" />}>
            <Filters searchParams={searchParams} />
          </Suspense>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
          <Suspense
            fallback={
              <>
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-white rounded-xl shadow-md h-40 sm:h-48 animate-pulse" />
                ))}
              </>
            }
          >
            <RecommendationsGrid searchParams={searchParams} />
          </Suspense>
        </div>
      </main>
    </div>
  );
}
