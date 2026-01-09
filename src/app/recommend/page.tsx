import { Suspense } from 'react';
import Link from 'next/link';
import { getRecommendations, getCategoriesWithCounts } from '@/lib/db';
import RecommendCard from '@/components/RecommendCard';
import RecommendFilters from '@/components/RecommendFilters';
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

async function Filters() {
  const categories = await getCategoriesWithCounts();
  return <RecommendFilters categories={categories} />;
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
            <Filters />
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
