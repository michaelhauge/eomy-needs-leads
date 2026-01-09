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
    <Link href={`/need/${need.id}`}>
      <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden border border-gray-100 h-full flex flex-col">
        {/* Category Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-500 px-4 py-2">
          <span className="text-white text-xs font-medium">
            {need.category_name || 'Uncategorized'}
          </span>
        </div>

        {/* Content */}
        <div className="p-4 flex-1 flex flex-col">
          <h3 className="font-semibold text-gray-800 text-lg mb-2 line-clamp-2">
            {need.title}
          </h3>

          <div className="mt-auto pt-4 flex items-center justify-between">
            {/* Date */}
            <span className="text-gray-500 text-sm">
              {formatDate(need.date_of_need)}
            </span>

            {/* Status & Leads */}
            <div className="flex items-center gap-2">
              {leadsCount > 0 && (
                <span className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full">
                  {leadsCount} lead{leadsCount !== 1 ? 's' : ''}
                </span>
              )}
              <span className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusColor(need.status)}`}>
                {need.status}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
