'use client';

import Link from 'next/link';
import { Recommendation } from '@/lib/db';
import StarRating from './StarRating';

interface RecommendCardProps {
  recommendation: Recommendation;
}

// Extract phone number from contact_info field
function extractPhoneNumber(contactInfo: string | null): string | null {
  if (!contactInfo) return null;
  // Match common phone formats: +60 12-345 6789, 012-3456789, +6012-345-6789, etc.
  const phoneRegex = /(?:\+?\d{1,3}[-.\s]?)?\(?\d{2,4}\)?[-.\s]?\d{3,4}[-.\s]?\d{3,4}/;
  const match = contactInfo.match(phoneRegex);
  if (match) {
    // Clean the number for tel: link (remove spaces, dashes, dots)
    return match[0].replace(/[-.\s()]/g, '');
  }
  return null;
}

// Phone icon SVG
function PhoneIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
    </svg>
  );
}

// Globe icon SVG
function GlobeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
    </svg>
  );
}

export default function RecommendCard({ recommendation }: RecommendCardProps) {
  const phoneNumber = extractPhoneNumber(recommendation.contact_info);
  const websiteUrl = recommendation.website_url;
  const hasQuickActions = phoneNumber || websiteUrl;

  return (
    <Link href={`/recommend/${recommendation.id}`} className="block active:scale-[0.98] transition-all duration-200 group">
      <div className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden h-full flex flex-col min-h-[180px] sm:min-h-[200px] relative border border-slate-100">
        {/* Content */}
        <div className="p-5 sm:p-6 flex-1 flex flex-col">
          {/* Category Badge */}
          <div className="mb-3">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-teal-100 text-teal-700">
              {recommendation.category_name || 'General'}
            </span>
          </div>

          {/* Quick Action Buttons */}
          {hasQuickActions && (
            <div className="absolute top-5 right-5 flex gap-1.5 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-200">
              {phoneNumber && (
                <a
                  href={`tel:${phoneNumber}`}
                  onClick={(e) => e.stopPropagation()}
                  className="w-9 h-9 flex items-center justify-center bg-teal-50 hover:bg-teal-100 text-teal-600 rounded-full shadow-sm border border-teal-200 transition-colors"
                  title="Call"
                >
                  <PhoneIcon className="w-4 h-4" />
                </a>
              )}
              {websiteUrl && (
                <a
                  href={websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="w-9 h-9 flex items-center justify-center bg-teal-50 hover:bg-teal-100 text-teal-600 rounded-full shadow-sm border border-teal-200 transition-colors"
                  title="Visit Website"
                >
                  <GlobeIcon className="w-4 h-4" />
                </a>
              )}
            </div>
          )}

          <h3 className="font-semibold text-slate-900 text-lg leading-snug mb-2 line-clamp-2">
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
            <p className="text-slate-400 text-xs mb-2">No reviews yet</p>
          )}

          {recommendation.description && (
            <p className="text-slate-600 text-sm line-clamp-2 mb-3">
              {recommendation.description}
            </p>
          )}

          <div className="mt-auto pt-3 flex items-center justify-between">
            {/* Recommended by */}
            <span className="text-slate-500 text-sm">
              by {recommendation.recommended_by}
            </span>

            {/* Address snippet if available */}
            {recommendation.address && (
              <span className="text-slate-400 text-xs truncate max-w-[120px]">
                {recommendation.address.split(',')[0]}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
