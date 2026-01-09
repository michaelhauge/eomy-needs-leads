import { Suspense } from 'react';
import Link from 'next/link';
import { getNeeds, getCategories, getLeaderboard, getRecommendations } from '@/lib/db';
import NeedCard from '@/components/NeedCard';
import SearchBar from '@/components/SearchBar';
import CategoryFilter from '@/components/CategoryFilter';
import StatusFilter from '@/components/StatusFilter';
import LeaderboardSidebar from '@/components/LeaderboardSidebar';
import Navigation from '@/components/Navigation';
import HomeRecommendSearch from '@/components/HomeRecommendSearch';
import RecommendCard from '@/components/RecommendCard';

interface PageProps {
  searchParams: Promise<{
    search?: string;
    category?: string;
    status?: string;
  }>;
}

async function NeedsGrid({ searchParams }: { searchParams: PageProps['searchParams'] }) {
  const params = await searchParams;
  const needs = await getNeeds({
    search: params.search,
    categorySlug: params.category,
    status: params.status,
    limit: 100,
  });

  if (needs.length === 0) {
    return (
      <div className="col-span-full text-center py-12">
        <p className="text-gray-500 text-lg">No needs found matching your criteria.</p>
        <p className="text-gray-400 mt-2">Try adjusting your search or filters.</p>
      </div>
    );
  }

  return (
    <>
      {needs.map((need) => (
        <NeedCard key={need.id} need={need} />
      ))}
    </>
  );
}

async function Leaderboard() {
  const members = await getLeaderboard(10);
  return <LeaderboardSidebar members={members} />;
}

async function TopRecommendations() {
  // Get top 4 recommendations sorted by rating (default)
  const recommendations = await getRecommendations({ limit: 4, sort: 'rating' });

  if (recommendations.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {recommendations.map((rec) => (
        <RecommendCard key={rec.id} recommendation={rec} />
      ))}
    </div>
  );
}

async function Filters() {
  const categories = await getCategories();
  return (
    <div className="flex flex-col gap-3">
      {/* Search - always full width */}
      <SearchBar />

      {/* Dropdowns - stack on mobile, row on tablet+ */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 sm:flex-none">
          <CategoryFilter categories={categories} />
        </div>
        <div className="flex-1 sm:flex-none">
          <StatusFilter />
        </div>
      </div>
    </div>
  );
}

export default async function HomePage({ searchParams }: PageProps) {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navigation />

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-slate-900 to-slate-800 min-h-[30vh] md:min-h-[40vh] flex items-center">
        <div className="max-w-3xl mx-auto px-4 py-12 md:py-16 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Find What You Need. Share What You Know.
          </h1>
          <p className="text-lg text-slate-300">
            Trusted resources from EO Malaysia members
          </p>
        </div>
      </section>

      {/* Search and Top Recommendations Section */}
      <section className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 py-8 sm:py-10">
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-8">
            <HomeRecommendSearch />
          </div>

          {/* Top Recommendations Preview */}
          <Suspense
            fallback={
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="bg-white rounded-2xl shadow-md h-40 sm:h-48 animate-pulse" />
                ))}
              </div>
            }
          >
            <TopRecommendations />
          </Suspense>

          {/* View All Button */}
          <div className="text-center mt-6">
            <Link
              href="/recommend"
              className="inline-flex items-center gap-2 h-12 px-8 bg-white border border-slate-300 text-slate-700 text-base rounded-lg font-semibold hover:bg-slate-50 hover:shadow-md active:scale-[0.98] transition-all duration-150"
            >
              View All Recommendations
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6 sm:py-8">
        {/* Filters */}
        <div className="mb-6">
          <Suspense fallback={<div className="h-24 sm:h-12 bg-gray-200 rounded-lg animate-pulse" />}>
            <Filters />
          </Suspense>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* Main Column - Needs Grid */}
          <div className="flex-1 order-1">
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
                <NeedsGrid searchParams={searchParams} />
              </Suspense>
            </div>
          </div>

          {/* Sidebar - Leaderboard (below on mobile, side on desktop) */}
          <div className="lg:w-80 order-2">
            <Suspense
              fallback={
                <div className="bg-white rounded-xl shadow-md p-6 h-64 animate-pulse" />
              }
            >
              <Leaderboard />
            </Suspense>
          </div>
        </div>
      </main>
    </div>
  );
}
