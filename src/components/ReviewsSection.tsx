'use client';

import { useState, useEffect } from 'react';
import { Review } from '@/lib/db';
import ReviewCard from './ReviewCard';
import ReviewForm from './ReviewForm';
import StarRating from './StarRating';

interface ReviewsSectionProps {
  recommendationId: number;
  recommendationName: string;
  initialReviewCount: number;
}

export default function ReviewsSection({
  recommendationId,
  recommendationName,
  initialReviewCount,
}: ReviewsSectionProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const fetchReviews = async () => {
    try {
      const res = await fetch(`/api/reviews?recommendation_id=${recommendationId}`);
      if (res.ok) {
        const data = await res.json();
        setReviews(data);
      }
    } catch (error) {
      console.error('Failed to fetch reviews:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [recommendationId]);

  const handleReviewSuccess = () => {
    // Refresh reviews after successful submission
    fetchReviews();
    setShowForm(false);
    // Reload the page to update the average rating in the header
    setTimeout(() => {
      window.location.reload();
    }, 1500);
  };

  // Calculate rating breakdown and average
  const ratingBreakdown = [5, 4, 3, 2, 1].map((rating) => {
    const count = reviews.filter((r) => r.rating === rating).length;
    const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
    return { rating, count, percentage };
  });

  const averageRating = reviews.length > 0
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : 0;

  return (
    <div className="mt-8 sm:mt-10">
      {/* Section Header with Review Count and Average */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div className="flex items-center gap-4">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
            Reviews
          </h2>
          {reviews.length > 0 && (
            <div className="flex items-center gap-2">
              <StarRating rating={averageRating} size="sm" />
              <span className="text-lg font-semibold text-slate-900 tabular-nums">
                {averageRating.toFixed(1)}
              </span>
              <span className="text-slate-500">
                ({reviews.length} {reviews.length === 1 ? 'review' : 'reviews'})
              </span>
            </div>
          )}
        </div>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="h-10 px-6 bg-teal-600 text-white rounded-lg font-semibold hover:bg-teal-700 hover:shadow-md active:bg-teal-800 active:scale-[0.98] transition-all duration-150 text-sm"
          >
            Write a Review
          </button>
        )}
      </div>

      {/* Review Form */}
      {showForm && (
        <div className="mb-6">
          <ReviewForm
            recommendationId={recommendationId}
            recommendationName={recommendationName}
            onSuccess={handleReviewSuccess}
          />
          <button
            onClick={() => setShowForm(false)}
            className="mt-2 text-sm text-slate-500 hover:text-slate-700 transition-colors"
          >
            Cancel
          </button>
        </div>
      )}

      {/* Rating Breakdown */}
      {reviews.length > 0 && (
        <div className="bg-slate-50 rounded-xl p-5 mb-6 border border-slate-100">
          <h3 className="text-sm font-semibold text-slate-700 mb-4">Rating Breakdown</h3>
          <div className="space-y-3">
            {ratingBreakdown.map(({ rating, count, percentage }) => (
              <div key={rating} className="flex items-center gap-3">
                <span className="text-sm font-medium text-slate-600 w-14 tabular-nums">{rating} stars</span>
                <div className="flex-1 h-2.5 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-amber-400 rounded-full transition-all duration-300"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="text-sm text-slate-500 w-10 text-right tabular-nums">{count}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Reviews List */}
      {isLoading ? (
        <div className="space-y-4">
          {[...Array(Math.min(initialReviewCount, 3))].map((_, i) => (
            <div key={i} className="bg-slate-200 rounded-lg h-28 animate-shimmer" />
          ))}
        </div>
      ) : reviews.length === 0 ? (
        <div className="bg-slate-50 rounded-xl p-8 text-center border border-slate-100">
          {/* Encouraging illustration */}
          <div className="w-16 h-16 mx-auto mb-4 text-slate-300">
            <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M32 8L39.8 23.8L57 26.2L44.5 38.3L47.6 55.4L32 47.1L16.4 55.4L19.5 38.3L7 26.2L24.2 23.8L32 8Z"
                className="fill-slate-100 stroke-slate-300"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-slate-900 mb-2">Be the first to review</h3>
          <p className="text-base text-slate-600 max-w-md mx-auto mb-6">
            Share your experience with {recommendationName} and help other EO members make informed decisions.
          </p>
          {!showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="h-12 px-8 bg-teal-600 text-white rounded-lg font-semibold hover:bg-teal-700 hover:shadow-md active:bg-teal-800 active:scale-[0.98] transition-all duration-150"
            >
              Write a Review
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>
      )}
    </div>
  );
}
