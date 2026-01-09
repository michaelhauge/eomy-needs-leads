'use client';

interface StarRatingProps {
  rating: number;
  maxStars?: number;
  size?: 'sm' | 'md' | 'lg';
  interactive?: boolean;
  onRatingChange?: (rating: number) => void;
  showNumeric?: boolean;
  reviewCount?: number;
}

export default function StarRating({
  rating,
  maxStars = 5,
  size = 'md',
  interactive = false,
  onRatingChange,
  showNumeric = false,
  reviewCount,
}: StarRatingProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  const textSizes = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  };

  const handleClick = (starIndex: number) => {
    if (interactive && onRatingChange) {
      onRatingChange(starIndex + 1);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, starIndex: number) => {
    if (interactive && onRatingChange && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      onRatingChange(starIndex + 1);
    }
  };

  return (
    <div className="flex items-center gap-1">
      <div className="flex">
        {[...Array(maxStars)].map((_, index) => {
          const fillPercentage = Math.min(Math.max(rating - index, 0), 1) * 100;
          const isFilled = fillPercentage > 0;
          const isFullyFilled = fillPercentage === 100;

          return (
            <button
              key={index}
              type="button"
              onClick={() => handleClick(index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              disabled={!interactive}
              className={`${interactive ? 'cursor-pointer hover:scale-110 transition-transform' : 'cursor-default'} focus:outline-none disabled:cursor-default`}
              aria-label={interactive ? `Rate ${index + 1} stars` : `${rating} out of ${maxStars} stars`}
              tabIndex={interactive ? 0 : -1}
            >
              <svg
                className={`${sizeClasses[size]} ${isFilled ? 'text-amber-400' : 'text-slate-300'}`}
                fill={isFullyFilled ? 'currentColor' : 'none'}
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {/* Background star (gray) */}
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                  fill={isFullyFilled ? 'currentColor' : (isFilled && !isFullyFilled) ? 'url(#halfGradient)' : 'none'}
                />
                {/* Partial fill for half stars */}
                {isFilled && !isFullyFilled && (
                  <defs>
                    <linearGradient id="halfGradient">
                      <stop offset={`${fillPercentage}%`} stopColor="currentColor" />
                      <stop offset={`${fillPercentage}%`} stopColor="transparent" />
                    </linearGradient>
                  </defs>
                )}
              </svg>
            </button>
          );
        })}
      </div>

      {showNumeric && (
        <span className={`${textSizes[size]} font-medium text-slate-700 ml-1`}>
          {rating.toFixed(1)}
        </span>
      )}

      {reviewCount !== undefined && (
        <span className={`${textSizes[size]} text-slate-500 ml-1`}>
          ({reviewCount} {reviewCount === 1 ? 'review' : 'reviews'})
        </span>
      )}
    </div>
  );
}
