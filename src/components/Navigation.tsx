'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navigation() {
  const pathname = usePathname();

  const isNeedsActive = pathname === '/' || pathname.startsWith('/need');
  const isRecommendActive = pathname.startsWith('/recommend');

  return (
    <header className="bg-gradient-to-r from-blue-700 to-blue-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        {/* Top bar */}
        <div className="py-4 sm:py-6">
          <h1 className="text-xl sm:text-2xl font-bold">EOMY Directory</h1>
          <p className="text-blue-100 text-sm sm:text-base mt-1">EO Malaysia Member Resources</p>
        </div>

        {/* Navigation tabs */}
        <nav className="flex gap-1 -mb-px">
          <Link
            href="/"
            className={`px-4 py-3 text-sm sm:text-base font-medium rounded-t-lg transition-colors ${
              isNeedsActive
                ? 'bg-gray-50 text-blue-700'
                : 'text-blue-100 hover:text-white hover:bg-blue-600'
            }`}
          >
            Needs & Leads
          </Link>
          <Link
            href="/recommend"
            className={`px-4 py-3 text-sm sm:text-base font-medium rounded-t-lg transition-colors ${
              isRecommendActive
                ? 'bg-gray-50 text-blue-700'
                : 'text-blue-100 hover:text-white hover:bg-blue-600'
            }`}
          >
            Members Recommend
          </Link>
        </nav>
      </div>
    </header>
  );
}
