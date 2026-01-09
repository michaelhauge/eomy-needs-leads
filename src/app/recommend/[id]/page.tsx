import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getRecommendationById } from '@/lib/db';
import Navigation from '@/components/Navigation';
import StarRating from '@/components/StarRating';
import ReviewsSection from '@/components/ReviewsSection';

interface PageProps {
  params: Promise<{ id: string }>;
}

function formatDate(date: Date | string): string {
  const d = new Date(date);
  return d.toLocaleDateString('en-MY', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

function getGoogleMapsUrl(address: string): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
}

function formatWebsiteUrl(url: string): string {
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    return `https://${url}`;
  }
  return url;
}

function getDisplayUrl(url: string): string {
  return url.replace(/^https?:\/\//, '').replace(/\/$/, '');
}

export default async function RecommendDetailPage({ params }: PageProps) {
  const { id } = await params;
  const recId = parseInt(id, 10);

  if (isNaN(recId)) {
    notFound();
  }

  const recommendation = await getRecommendationById(recId);

  if (!recommendation) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 py-4 sm:py-8">
        {/* Back link */}
        <Link
          href="/recommend"
          className="inline-flex items-center gap-2 text-teal-600 hover:text-teal-800 mb-4 transition-colors text-sm sm:text-base"
        >
          <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Recommendations
        </Link>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Category Header */}
          <div className="bg-gradient-to-r from-teal-600 to-teal-500 px-4 sm:px-6 py-3 sm:py-4">
            <span className="text-white font-medium text-sm sm:text-base">
              {recommendation.category_name || 'General'}
            </span>
          </div>

          {/* Details */}
          <div className="p-4 sm:p-6">
            {/* Business Name and Rating */}
            <div className="mb-4 sm:mb-6">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
                {recommendation.name}
              </h1>

              {/* Star Rating Summary */}
              <div className="flex items-center gap-2">
                <StarRating
                  rating={recommendation.average_rating}
                  size="md"
                  showNumeric
                  reviewCount={recommendation.review_count}
                />
              </div>
            </div>

            {/* Description */}
            {recommendation.description && (
              <div className="bg-gray-50 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6">
                <h2 className="text-sm font-semibold text-gray-600 mb-2">About</h2>
                <p className="text-gray-700 text-sm sm:text-base whitespace-pre-wrap">
                  {recommendation.description}
                </p>
              </div>
            )}

            {/* Contact Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4 sm:mb-6">
              {/* Address */}
              {recommendation.address && (
                <div className="bg-gray-50 rounded-lg p-3 sm:p-4 border border-gray-100">
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-teal-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-semibold text-gray-600 mb-1">Address</h3>
                      <p className="text-gray-700 text-sm whitespace-pre-wrap break-words">
                        {recommendation.address}
                      </p>
                      <a
                        href={getGoogleMapsUrl(recommendation.address)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-teal-600 hover:text-teal-800 text-sm mt-2"
                      >
                        View on Google Maps
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>
              )}

              {/* Website */}
              {recommendation.website_url && (
                <div className="bg-gray-50 rounded-lg p-3 sm:p-4 border border-gray-100">
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-teal-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                    </svg>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-semibold text-gray-600 mb-1">Website</h3>
                      <a
                        href={formatWebsiteUrl(recommendation.website_url)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-teal-600 hover:text-teal-800 text-sm break-all"
                      >
                        {getDisplayUrl(recommendation.website_url)}
                      </a>
                    </div>
                  </div>
                </div>
              )}

              {/* Contact Info */}
              {recommendation.contact_info && (
                <div className="bg-gray-50 rounded-lg p-3 sm:p-4 border border-gray-100 sm:col-span-2">
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-teal-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-semibold text-gray-600 mb-1">Contact</h3>
                      <p className="text-gray-700 text-sm whitespace-pre-wrap break-words">
                        {recommendation.contact_info}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Meta info */}
            <div className="border-t pt-4 flex flex-wrap items-center gap-3 sm:gap-4 text-sm text-gray-500">
              <span>
                Recommended by <strong className="text-teal-700">{recommendation.recommended_by}</strong>
              </span>
              <span>
                Added on {formatDate(recommendation.created_at)}
              </span>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <ReviewsSection
          recommendationId={recommendation.id}
          recommendationName={recommendation.name}
          initialReviewCount={recommendation.review_count}
        />
      </main>
    </div>
  );
}
