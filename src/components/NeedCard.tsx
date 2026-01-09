'use client';

import Link from 'next/link';
import { Need } from '@/lib/db';

interface NeedCardProps {
  need: Need;
}

function formatDate(date: Date | string): string {
  const d = new Date(date);
  return d.toLocaleDateString('en-MY', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function getStatusColor(status: string): string {
  switch (status) {
    case 'Has Leads':
      return 'bg-green-100 text-green-800';
    case 'Resolved':
      return 'bg-blue-100 text-blue-800';
    default:
      return 'bg-yellow-100 text-yellow-800';
  }
}

export default function NeedCard({ need }: NeedCardProps) {
  const leadsCount = Number(need.leads_count) || 0;

  return (
    <Link href={`/need/${need.id}`} className="block active:scale-[0.98] transition-all duration-200">
      <div className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden h-full flex flex-col min-h-[180px] sm:min-h-[200px] border border-slate-100">
        {/* Content */}
        <div className="p-5 sm:p-6 flex-1 flex flex-col">
          {/* Category Badge */}
          <div className="mb-3">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
              {need.category_name || 'Uncategorized'}
            </span>
          </div>

          <h3 className="font-semibold text-slate-900 text-lg leading-snug mb-2 line-clamp-2">
            {need.title}
          </h3>

          <div className="mt-auto pt-3 flex flex-wrap items-center justify-between gap-2">
            {/* Date */}
            <span className="text-slate-500 text-sm">
              {formatDate(need.date_of_need)}
            </span>

            {/* Status & Leads */}
            <div className="flex items-center gap-2">
              {leadsCount > 0 && (
                <span className="bg-slate-100 text-slate-700 text-xs px-3 py-1 rounded-full font-medium">
                  {leadsCount} lead{leadsCount !== 1 ? 's' : ''}
                </span>
              )}
              <span className={`text-xs px-3 py-1 rounded-full font-medium ${getStatusColor(need.status)}`}>
                {need.status}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
