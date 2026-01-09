import Link from 'next/link';
import { Category, Recommendation } from '@/lib/db';
import RecommendCard from './RecommendCard';

interface EmptyStateProps {
  searchTerm?: string;
  hasFilters: boolean;
  popularRecommendations: Recommendation[];
  topCategories: Category[];
}

export default function EmptyState({
  searchTerm,
  hasFilters,
  popularRecommendations,
  topCategories,
}: EmptyStateProps) {
  return (
    <div className="col-span-full">
      {/* Main empty state message */}
      <div className="text-center py-12 px-4">
        {/* Icon */}
        <div className="mx-auto w-16 h-16 mb-4 bg-slate-100 rounded-full flex items-center justify-center">
          <svg
            className="w-8 h-8 text-slate-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>

        {/* Message */}
        <h3 className="text-xl font-semibold text-slate-900 mb-2">
          {searchTerm
            ? `No results for "${searchTerm}"`
            : 'No recommendations found'}
        </h3>
        <p className="text-base text-slate-600 mb-6 max-w-md mx-auto">
          {hasFilters
            ? 'Try adjusting your filters or search terms to find what you\u2019re looking for.'
            : 'Be the first to recommend a business to fellow EO members!'}
        </p>

        {/* Action buttons */}
        <div className="flex flex-wrap justify-center gap-3">
          {hasFilters && (
            <Link
              href="/recommend"
              className="inline-flex items-center gap-2 h-12 px-8 bg-white border border-slate-300 text-slate-700 text-base rounded-lg font-semibold hover:bg-slate-50 hover:shadow-md active:scale-[0.98] transition-all duration-150"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
              Clear all filters
            </Link>
          )}
          <Link
            href="/recommend/new"
            className="inline-flex items-center gap-2 h-12 px-8 bg-teal-600 text-white text-base rounded-lg font-semibold hover:bg-teal-700 hover:shadow-md active:bg-teal-800 active:scale-[0.98] transition-all duration-150"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            Add Recommendation
          </Link>
        </div>
      </div>

      {/* Browse all categories section */}
      {topCategories.length > 0 && (
        <div className="border-t border-slate-200 pt-8 mt-4">
          <h4 className="text-sm font-medium text-slate-600 mb-4 text-center">
            Browse all categories
          </h4>
          <div className="flex flex-wrap justify-center gap-2">
            {topCategories.map((category) => (
              <Link
                key={category.id}
                href={`/recommend?category=${category.slug}`}
                className="inline-flex items-center px-4 py-2 bg-teal-50 text-teal-700 rounded-full text-sm font-medium hover:bg-teal-100 transition-colors"
              >
                {category.name}
                {category.recommendation_count !== undefined && (
                  <span className="ml-1.5 text-teal-500">
                    ({category.recommendation_count})
                  </span>
                )}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Popular recommendations as alternatives */}
      {popularRecommendations.length > 0 && (
        <div className="border-t border-slate-200 pt-8 mt-8">
          <h4 className="text-sm font-medium text-slate-600 mb-4 text-center">
            Popular recommendations you might like
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
            {popularRecommendations.map((rec) => (
              <RecommendCard key={rec.id} recommendation={rec} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
