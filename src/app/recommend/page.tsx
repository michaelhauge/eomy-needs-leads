import { Suspense } from 'react';
import Link from 'next/link';
import { getRecommendations, getCategoriesWithCounts, getTopCategories, SortOption, Category } from '@/lib/db';
import RecommendCard from '@/components/RecommendCard';
import RecommendFilters from '@/components/RecommendFilters';
import CategoryPills from '@/components/CategoryPills';
import Navigation from '@/components/Navigation';
import EmptyState from '@/components/EmptyState';
import { SkeletonGrid } from '@/components/SkeletonCard';

interface PageProps {
  searchParams: Promise<{
    search?: string;
    category?: string;
    minRating?: string;
    sort?: SortOption;
  }>;
}

async function RecommendationsGrid({
  searchParams,
  topCategories
}: {
  searchParams: PageProps['searchParams'];
  topCategories: Category[];
}) {
  const params = await searchParams;
  const minRating = params.minRating ? parseInt(params.minRating, 10) : undefined;
  const sort = params.sort || 'rating';
  const recommendations = await getRecommendations({
    search: params.search,
    categorySlug: params.category,
    minRating,
    sort,
    limit: 100,
  });

  const hasFilters = params.search || params.category || params.minRating;

  if (recommendations.length === 0) {
    // Fetch popular recommendations to show as alternatives
    const popularRecommendations = hasFilters
      ? await getRecommendations({ sort: 'rating', limit: 3 })
      : [];

    return (
      <EmptyState
        searchTerm={params.search}
        hasFilters={!!hasFilters}
        popularRecommendations={popularRecommendations}
        topCategories={topCategories}
      />
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
  const minRating = params.minRating ? parseInt(params.minRating, 10) : undefined;
  const sort = params.sort || 'rating';

  const categories = await getCategoriesWithCounts();

  // Get total count (no filters)
  const totalRecommendations = await getRecommendations({ limit: 1000 });
  const totalCount = totalRecommendations.length;

  // Get filtered count
  const filteredRecommendations = await getRecommendations({
    search: params.search,
    categorySlug: params.category,
    minRating,
    sort,
    limit: 1000,
  });
  const filteredCount = filteredRecommendations.length;

  return <RecommendFilters categories={categories} totalCount={totalCount} filteredCount={filteredCount} />;
}

async function PopularCategories({ categories }: { categories: Category[] }) {
  return <CategoryPills categories={categories} />;
}

export default async function RecommendPage({ searchParams }: PageProps) {
  // Fetch top categories once and pass to both PopularCategories and RecommendationsGrid
  const topCategories = await getTopCategories(8);

  return (
    <div className="min-h-screen bg-slate-50">
      <Navigation />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6 sm:py-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2">EO Members Recommend</h1>
          <p className="text-slate-600 text-sm sm:text-base">
            Trusted businesses and services recommended by EO Malaysia members
          </p>
        </div>

        {/* Filters */}
        <div className="mb-6">
          <Suspense fallback={<div className="h-24 sm:h-12 bg-slate-200 rounded-lg animate-shimmer" />}>
            <Filters searchParams={searchParams} />
          </Suspense>
        </div>

        {/* Popular Categories */}
        <div className="mb-6">
          <h2 className="text-sm font-medium text-slate-600 mb-3">Popular Categories</h2>
          <Suspense fallback={<div className="h-10 bg-slate-200 rounded-full animate-shimmer w-3/4" />}>
            <PopularCategories categories={topCategories} />
          </Suspense>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
          <Suspense fallback={<SkeletonGrid count={6} variant="recommend" />}>
            <RecommendationsGrid searchParams={searchParams} topCategories={topCategories} />
          </Suspense>
        </div>
      </main>
    </div>
  );
}
