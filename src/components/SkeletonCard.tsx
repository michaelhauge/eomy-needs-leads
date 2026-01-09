/**
 * SkeletonCard Component
 * Loading placeholder that matches actual card layout
 * Uses shimmer animation for reduced perceived wait time
 */

interface SkeletonCardProps {
  variant?: 'recommend' | 'need';
}

export default function SkeletonCard({ variant = 'recommend' }: SkeletonCardProps) {
  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden h-full flex flex-col min-h-[180px] sm:min-h-[200px] border border-slate-100">
      <div className="p-5 sm:p-6 flex-1 flex flex-col">
        {/* Category Badge Skeleton */}
        <div className="mb-3">
          <div className="h-6 w-20 rounded-full bg-slate-200 animate-shimmer" />
        </div>

        {/* Title Skeleton - 2 lines */}
        <div className="space-y-2 mb-3">
          <div className="h-5 w-full rounded bg-slate-200 animate-shimmer" />
          <div className="h-5 w-3/4 rounded bg-slate-200 animate-shimmer" />
        </div>

        {/* Rating Skeleton (for recommend variant) or Date Skeleton (for need variant) */}
        {variant === 'recommend' ? (
          <div className="mb-2">
            <div className="h-4 w-32 rounded bg-slate-200 animate-shimmer" />
          </div>
        ) : null}

        {/* Description Skeleton */}
        <div className="space-y-2 mb-3">
          <div className="h-4 w-full rounded bg-slate-200 animate-shimmer" />
          <div className="h-4 w-2/3 rounded bg-slate-200 animate-shimmer" />
        </div>

        {/* Footer Skeleton */}
        <div className="mt-auto pt-3 flex items-center justify-between">
          <div className="h-4 w-24 rounded bg-slate-200 animate-shimmer" />
          {variant === 'need' && (
            <div className="flex gap-2">
              <div className="h-6 w-16 rounded-full bg-slate-200 animate-shimmer" />
              <div className="h-6 w-16 rounded-full bg-slate-200 animate-shimmer" />
            </div>
          )}
          {variant === 'recommend' && (
            <div className="h-4 w-16 rounded bg-slate-200 animate-shimmer" />
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * SkeletonGrid Component
 * Renders multiple skeleton cards for loading states
 */
export function SkeletonGrid({
  count = 6,
  variant = 'recommend',
}: {
  count?: number;
  variant?: 'recommend' | 'need';
}) {
  return (
    <>
      {[...Array(count)].map((_, i) => (
        <SkeletonCard key={i} variant={variant} />
      ))}
    </>
  );
}
