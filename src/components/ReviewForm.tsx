'use client';

import { useState } from 'react';
import StarRating from './StarRating';

interface ReviewFormProps {
  recommendationId: number;
  recommendationName: string;
  onSuccess?: () => void;
}

export default function ReviewForm({ recommendationId, recommendationName, onSuccess }: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [reviewerName, setReviewerName] = useState('');
  const [reviewText, setReviewText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (rating === 0) {
      setError('Please select a star rating');
      return;
    }

    if (!reviewerName.trim()) {
      setError('Please enter your name');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recommendation_id: recommendationId,
          reviewer_name: reviewerName.trim(),
          rating,
          review_text: reviewText.trim() || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit review');
      }

      setSuccess(true);
      setRating(0);
      setReviewerName('');
      setReviewText('');

      if (onSuccess) {
        onSuccess();
      }

      // Reset success after 3 seconds
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="bg-teal-50 border border-teal-200 rounded-lg p-4 text-center">
        <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-2">
          <svg className="w-6 h-6 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <p className="text-teal-800 font-medium">Thank you for your review!</p>
        <p className="text-teal-600 text-sm mt-1">Your feedback helps other EO members.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-slate-50 rounded-lg p-4 sm:p-5 border border-slate-200">
      <h3 className="font-semibold text-slate-900 mb-4">Write a Review for {recommendationName}</h3>

      {error && (
        <div className="bg-red-50 border border-red-400 ring-2 ring-red-400/20 text-red-700 px-3 py-2 rounded-lg text-sm mb-4">
          {error}
        </div>
      )}

      {/* Star Rating */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Your Rating <span className="text-red-500">*</span>
        </label>
        <StarRating
          rating={rating}
          size="lg"
          interactive
          onRatingChange={setRating}
        />
      </div>

      {/* Reviewer Name */}
      <div className="mb-4">
        <label htmlFor="reviewer-name" className="block text-sm font-medium text-slate-700 mb-2">
          Your Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="reviewer-name"
          value={reviewerName}
          onChange={(e) => setReviewerName(e.target.value)}
          placeholder="Enter your name"
          className="w-full h-[52px] px-4 py-3 border-[1.5px] border-slate-200 rounded-lg focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-none text-base placeholder:text-slate-400 transition-all duration-200"
        />
      </div>

      {/* Review Text */}
      <div className="mb-4">
        <label htmlFor="review-text" className="block text-sm font-medium text-slate-700 mb-2">
          Your Review <span className="text-slate-400">(optional)</span>
        </label>
        <textarea
          id="review-text"
          value={reviewText}
          onChange={(e) => setReviewText(e.target.value)}
          placeholder="Share your experience with this business..."
          className="w-full min-h-[120px] px-4 py-3 border-[1.5px] border-slate-200 rounded-lg focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-none resize-none text-base placeholder:text-slate-400 transition-all duration-200"
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full h-12 px-8 bg-teal-600 text-white text-base rounded-lg font-semibold hover:bg-teal-700 hover:shadow-md active:bg-teal-800 active:scale-[0.98] focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? 'Submitting...' : 'Submit Review'}
      </button>
    </form>
  );
}
