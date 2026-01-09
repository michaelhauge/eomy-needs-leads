import { Suspense } from 'react';
import { getNeeds, getCategories, getLeaderboard } from '@/lib/db';
import NeedCard from '@/components/NeedCard';
import SearchBar from '@/components/SearchBar';
import CategoryFilter from '@/components/CategoryFilter';
import StatusFilter from '@/components/StatusFilter';
import LeaderboardSidebar from '@/components/LeaderboardSidebar';

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
    <div className="flex flex-col sm:flex-row gap-4">
      <div className="flex-1">
        <SearchBar />
      </div>
      <CategoryFilter categories={categories} />
      <StatusFilter />
    </div>
  );
}

export default async function HomePage({ searchParams }: PageProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-700 to-blue-600 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold">EOMY Needs & Leads</h1>
          <p className="text-blue-100 mt-1">EO Malaysia Member Directory</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Column */}
          <div className="flex-1">
            {/* Filters */}
            <div className="mb-6">
              <Suspense fallback={<div className="h-12 bg-gray-200 rounded-lg animate-pulse" />}>
                <Filters />
              </Suspense>
            </div>

            {/* Gallery Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              <Suspense
                fallback={
                  <>
                    {[...Array(6)].map((_, i) => (
                      <div key={i} className="bg-white rounded-xl shadow-md h-48 animate-pulse" />
                    ))}
                  </>
                }
              >
                <NeedsGrid searchParams={searchParams} />
              </Suspense>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:w-80">
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
