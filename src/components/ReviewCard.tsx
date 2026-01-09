'use client';

import { Review } from '@/lib/db';
import StarRating from './StarRating';

interface ReviewCardProps {
  review: Review;
}

function formatRelativeTime(date: Date | string): string {
  const now = new Date();
  const reviewDate = new Date(date);
  const diffMs = now.getTime() - reviewDate.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    if (diffHours === 0) {
      const diffMinutes = Math.floor(diffMs / (1000 * 60));
      if (diffMinutes < 1) return 'Just now';
      return `${diffMinutes} minute${diffMinutes !== 1 ? 's' : ''} ago`;
    }
    return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
  }
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) {
    const weeks = Math.floor(diffDays / 7);
    return `${weeks} week${weeks !== 1 ? 's' : ''} ago`;
  }
  if (diffDays < 365) {
    const months = Math.floor(diffDays / 30);
    return `${months} month${months !== 1 ? 's' : ''} ago`;
  }
  const years = Math.floor(diffDays / 365);
  return `${years} year${years !== 1 ? 's' : ''} ago`;
}

export default function ReviewCard({ review }: ReviewCardProps) {
  return (
    <div className="border border-slate-200 rounded-lg p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-medium text-slate-900">{review.reviewer_name}</span>
            <StarRating rating={review.rating} size="sm" />
          </div>
          <span className="text-xs text-slate-500 mt-0.5 block">
            {formatRelativeTime(review.created_at)}
          </span>
        </div>
      </div>

      {review.review_text && (
        <p className="mt-3 text-slate-700 text-sm leading-relaxed whitespace-pre-wrap">
          {review.review_text}
        </p>
      )}
    </div>
  );
}
