import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getRecommendationById } from '@/lib/db';
import Navigation from '@/components/Navigation';
import StarRating from '@/components/StarRating';
import ReviewsSection from '@/components/ReviewsSection';
import BottomNav from '@/components/BottomNav';

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
    <div className="min-h-screen bg-slate-50 pb-20 lg:pb-0">
      <Navigation />

      {/* Hero Area with Gradient */}
      <div className="bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-4xl mx-auto px-4 pt-4 sm:pt-8 pb-6 sm:pb-8">
          {/* Back link */}
          <Link
            href="/recommend"
            className="inline-flex items-center gap-2 text-teal-600 hover:text-teal-700 mb-6 transition-colors text-sm sm:text-base"
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Recommendations
          </Link>

          {/* Category Badge */}
          <span className="inline-block bg-teal-100 text-teal-700 text-sm font-medium px-4 py-1.5 rounded-full mb-4">
            {recommendation.category_name || 'General'}
          </span>

          {/* Business Name */}
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            {recommendation.name}
          </h1>

          {/* Star Rating - Prominent */}
          <div className="flex items-center gap-3">
            <StarRating
              rating={recommendation.average_rating}
              size="lg"
              showNumeric
            />
            <span className="text-xl font-semibold text-slate-900 tabular-nums">
              {recommendation.average_rating?.toFixed(1) || '0.0'}
            </span>
            {recommendation.review_count > 0 && (
              <span className="text-slate-500">
                ({recommendation.review_count} {recommendation.review_count === 1 ? 'review' : 'reviews'})
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 pb-8">
        {/* About Section */}
        {recommendation.description && (
          <div className="mb-6 sm:mb-8">
            <h2 className="text-lg font-semibold text-slate-900 mb-3">About</h2>
            <p className="text-slate-700 max-w-3xl leading-relaxed whitespace-pre-wrap">
              {recommendation.description}
            </p>
          </div>
        )}

        {/* Contact Card */}
        <div className="bg-white shadow-md rounded-xl p-6 mb-6 sm:mb-8">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Contact Information</h2>

          <div className="space-y-4">
            {/* Address */}
            {recommendation.address && (
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-slate-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <div className="flex-1 min-w-0">
                  <p className="text-slate-700 whitespace-pre-wrap break-words">
                    {recommendation.address}
                  </p>
                  <a
                    href={getGoogleMapsUrl(recommendation.address)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-teal-600 hover:text-teal-700 text-sm mt-1 transition-colors"
                  >
                    View on Google Maps
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </div>
              </div>
            )}

            {/* Website URL display */}
            {recommendation.website_url && (
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-slate-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                </svg>
                <div className="flex-1 min-w-0">
                  <a
                    href={formatWebsiteUrl(recommendation.website_url)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-teal-600 hover:text-teal-700 break-all transition-colors"
                  >
                    {getDisplayUrl(recommendation.website_url)}
                  </a>
                </div>
              </div>
            )}

            {/* Contact Info (Phone) */}
            {recommendation.contact_info && (
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-slate-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <div className="flex-1 min-w-0">
                  <p className="text-slate-700 whitespace-pre-wrap break-words">
                    {recommendation.contact_info}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-3 mt-6 pt-6 border-t border-slate-200">
            {recommendation.website_url && (
              <a
                href={formatWebsiteUrl(recommendation.website_url)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center h-12 px-8 bg-teal-600 text-white text-base font-semibold rounded-lg hover:bg-teal-700 hover:shadow-md active:bg-teal-800 active:scale-[0.98] transition-all duration-150"
              >
                Visit Website
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            )}
            {recommendation.contact_info && (
              <a
                href={`tel:${recommendation.contact_info.replace(/\D/g, '')}`}
                className="inline-flex items-center justify-center h-12 px-8 bg-white border border-slate-300 text-slate-700 text-base font-semibold rounded-lg hover:bg-slate-50 hover:shadow-md active:scale-[0.98] transition-all duration-150"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                Call
              </a>
            )}
          </div>
        </div>

        {/* Meta info */}
        <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-sm text-slate-500 mb-8">
          <span>
            Recommended by <strong className="text-teal-700">{recommendation.recommended_by}</strong>
          </span>
          <span className="text-slate-300">•</span>
          <span>
            Added on {formatDate(recommendation.created_at)}
          </span>
        </div>

        {/* Reviews Section */}
        <ReviewsSection
          recommendationId={recommendation.id}
          recommendationName={recommendation.name}
          initialReviewCount={recommendation.review_count}
        />
      </main>

      {/* Mobile Bottom Navigation */}
      <BottomNav />
    </div>
  );
}
