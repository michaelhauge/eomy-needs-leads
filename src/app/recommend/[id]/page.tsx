import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getRecommendationById } from '@/lib/db';
import Navigation from '@/components/Navigation';

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
            <h1 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3 sm:mb-4">
              {recommendation.name}
            </h1>

            {recommendation.description && (
              <div className="bg-gray-50 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6">
                <p className="text-gray-700 text-sm sm:text-base whitespace-pre-wrap">
                  {recommendation.description}
                </p>
              </div>
            )}

            {/* Contact Info Section */}
            {recommendation.contact_info && (
              <div className="border-t pt-4 sm:pt-6 mb-4 sm:mb-6">
                <h2 className="text-base sm:text-lg font-semibold text-gray-800 mb-3">
                  Contact Information
                </h2>
                <div className="bg-teal-50 rounded-lg p-3 sm:p-4 border border-teal-100">
                  <p className="text-gray-700 text-sm sm:text-base whitespace-pre-wrap break-words">
                    {recommendation.contact_info}
                  </p>
                </div>
              </div>
            )}

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
      </main>
    </div>
  );
}
