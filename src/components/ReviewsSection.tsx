'use client';

import { useState, useEffect } from 'react';
import { Review } from '@/lib/db';
import ReviewCard from './ReviewCard';
import ReviewForm from './ReviewForm';

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

  // Calculate rating breakdown
  const ratingBreakdown = [5, 4, 3, 2, 1].map((rating) => {
    const count = reviews.filter((r) => r.rating === rating).length;
    const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
    return { rating, count, percentage };
  });

  return (
    <div className="mt-6 sm:mt-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg sm:text-xl font-bold text-gray-800">
          Reviews ({reviews.length})
        </h2>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="px-4 py-2 bg-teal-600 text-white rounded-lg font-medium hover:bg-teal-700 transition-colors text-sm"
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
            className="mt-2 text-sm text-gray-500 hover:text-gray-700"
          >
            Cancel
          </button>
        </div>
      )}

      {/* Rating Breakdown */}
      {reviews.length > 0 && (
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Rating Breakdown</h3>
          <div className="space-y-2">
            {ratingBreakdown.map(({ rating, count, percentage }) => (
              <div key={rating} className="flex items-center gap-2">
                <span className="text-sm text-gray-600 w-12">{rating} star</span>
                <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-yellow-400 rounded-full transition-all"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="text-sm text-gray-500 w-8">{count}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Reviews List */}
      {isLoading ? (
        <div className="space-y-4">
          {[...Array(Math.min(initialReviewCount, 3))].map((_, i) => (
            <div key={i} className="bg-slate-200 rounded-2xl h-24 animate-shimmer" />
          ))}
        </div>
      ) : reviews.length === 0 ? (
        <div className="bg-gray-50 rounded-lg p-6 text-center">
          <p className="text-gray-500">No reviews yet.</p>
          <p className="text-gray-400 text-sm mt-1">Be the first to share your experience!</p>
          {!showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="mt-4 px-4 py-2 bg-teal-600 text-white rounded-lg font-medium hover:bg-teal-700 transition-colors text-sm"
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
