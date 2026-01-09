import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getNeedById, getLeadsForNeed } from '@/lib/db';
import Navigation from '@/components/Navigation';
import BottomNav from '@/components/BottomNav';

interface PageProps {
  params: Promise<{ id: string }>;
}

function formatDate(date: Date | string): string {
  const d = new Date(date);
  return d.toLocaleDateString('en-MY', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

function getStatusColor(status: string): string {
  switch (status) {
    case 'Has Leads':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'Resolved':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    default:
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
  }
}

export default async function NeedDetailPage({ params }: PageProps) {
  const { id } = await params;
  const needId = parseInt(id, 10);

  if (isNaN(needId)) {
    notFound();
  }

  const need = await getNeedById(needId);

  if (!need) {
    notFound();
  }

  const leads = await getLeadsForNeed(needId);

  return (
    <div className="min-h-screen bg-slate-50 pb-20 lg:pb-0">
      <Navigation />

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 py-4 sm:py-8">
        {/* Back link */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-4 transition-colors text-sm sm:text-base"
        >
          <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Directory
        </Link>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Category Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-500 px-4 sm:px-6 py-3 sm:py-4">
            <span className="text-white font-medium text-sm sm:text-base">
              {need.category_name || 'Uncategorized'}
            </span>
          </div>

          {/* Need Details */}
          <div className="p-4 sm:p-6">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3 sm:mb-4">
              {need.title}
            </h1>

            {need.original_text && need.original_text !== need.title && (
              <div className="bg-gray-50 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6">
                <p className="text-sm text-gray-600 italic">{need.original_text}</p>
              </div>
            )}

            <div className="flex flex-wrap items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
              <span className="text-gray-500 text-sm sm:text-base">
                {formatDate(need.date_of_need)}
              </span>
              <span className={`px-3 py-1 rounded-full text-xs sm:text-sm font-medium border ${getStatusColor(need.status)}`}>
                {need.status}
              </span>
            </div>

            {/* Leads Section */}
            <div className="border-t pt-4 sm:pt-6">
              <h2 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4">
                Leads ({leads.length})
              </h2>

              {leads.length === 0 ? (
                <div className="bg-gray-50 rounded-lg p-4 sm:p-6 text-center">
                  <p className="text-gray-500 text-sm sm:text-base">No leads provided yet.</p>
                  <p className="text-gray-400 text-xs sm:text-sm mt-1">
                    Check back later or ask in the WhatsApp group.
                  </p>
                </div>
              ) : (
                <div className="space-y-3 sm:space-y-4">
                  {leads.map((lead) => (
                    <div
                      key={lead.id}
                      className="bg-gray-50 rounded-lg p-3 sm:p-4 border border-gray-100"
                    >
                      {lead.contact_name && (
                        <p className="font-medium text-gray-800 mb-1 text-sm sm:text-base">
                          {lead.contact_name}
                        </p>
                      )}
                      {lead.contact_info && (
                        <p className="text-gray-600 text-xs sm:text-sm whitespace-pre-wrap break-words">
                          {lead.contact_info}
                        </p>
                      )}
                      {lead.provided_by_name && (
                        <p className="text-blue-600 text-xs sm:text-sm mt-2">
                          Provided by: {lead.provided_by_name}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <BottomNav />
    </div>
  );
}
