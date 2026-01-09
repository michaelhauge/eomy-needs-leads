'use client';

import Link from 'next/link';
import { Recommendation } from '@/lib/db';
import StarRating from './StarRating';

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

          {/* Star Rating */}
          {recommendation.review_count > 0 ? (
            <div className="mb-2">
              <StarRating
                rating={recommendation.average_rating}
                size="sm"
                showNumeric
                reviewCount={recommendation.review_count}
              />
            </div>
          ) : (
            <p className="text-gray-400 text-xs mb-2">No reviews yet</p>
          )}

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

            {/* Address snippet if available */}
            {recommendation.address && (
              <span className="text-gray-400 text-xs truncate max-w-[120px]">
                {recommendation.address.split(',')[0]}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
