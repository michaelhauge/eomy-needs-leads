import { Suspense } from 'react';
import { getNeeds, getCategories, getLeaderboard } from '@/lib/db';
import NeedCard from '@/components/NeedCard';
import SearchBar from '@/components/SearchBar';
import CategoryFilter from '@/components/CategoryFilter';
import StatusFilter from '@/components/StatusFilter';
import LeaderboardSidebar from '@/components/LeaderboardSidebar';
import Navigation from '@/components/Navigation';

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
    <div className="min-h-screen bg-gray-50">
      <Navigation />

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
