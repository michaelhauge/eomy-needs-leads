'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navigation() {
  const pathname = usePathname();

  const isNeedsActive = pathname === '/' || pathname.startsWith('/need');
  const isRecommendActive = pathname.startsWith('/recommend');

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 h-14 sm:h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="font-semibold text-slate-900 text-lg">
          EOMY Directory
        </Link>

        {/* Navigation tabs */}
        <nav className="flex gap-6">
          <Link
            href="/"
            className={`text-sm font-medium transition-colors py-1 border-b-2 ${
              isNeedsActive
                ? 'text-teal-600 border-teal-600'
                : 'text-slate-600 border-transparent hover:text-slate-900'
            }`}
          >
            Needs & Leads
          </Link>
          <Link
            href="/recommend"
            className={`text-sm font-medium transition-colors py-1 border-b-2 ${
              isRecommendActive
                ? 'text-teal-600 border-teal-600'
                : 'text-slate-600 border-transparent hover:text-slate-900'
            }`}
          >
            Members Recommend
          </Link>
        </nav>
      </div>
    </header>
  );
}
