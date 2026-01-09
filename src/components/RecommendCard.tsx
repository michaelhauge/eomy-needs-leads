'use client';

import Link from 'next/link';
import { Recommendation } from '@/lib/db';

interface RecommendCardProps {
  recommendation: Recommendation;
}

export default function RecommendCard({ recommendation }: RecommendCardProps) {
  return (
    <Link href={`/recommend/${recommendation.id}`} className="block active:scale-[0.98] transition-transform">
      <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden border border-gray-100 h-full flex flex-col min-h-[140px] sm:min-h-[160px]">
        {/* Category Header */}
        <div className="bg-gradient-to-r from-teal-600 to-teal-500 px-3 sm:px-4 py-2">
          <span className="text-white text-xs font-medium">
            {recommendation.category_name || 'General'}
          </span>
        </div>

        {/* Content */}
        <div className="p-3 sm:p-4 flex-1 flex flex-col">
          <h3 className="font-semibold text-gray-800 text-base sm:text-lg mb-1 line-clamp-2">
            {recommendation.name}
          </h3>

          {recommendation.description && (
            <p className="text-gray-600 text-xs sm:text-sm line-clamp-2 mb-2">
              {recommendation.description}
            </p>
          )}

          <div className="mt-auto pt-2 sm:pt-3 flex items-center justify-between">
            {/* Recommended by */}
            <span className="text-gray-500 text-xs sm:text-sm">
              by {recommendation.recommended_by}
            </span>

            {/* Upvotes badge - for future use */}
            {recommendation.upvotes > 0 && (
              <span className="bg-teal-100 text-teal-700 text-xs px-2 py-1 rounded-full flex items-center gap-1">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                </svg>
                {recommendation.upvotes}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
