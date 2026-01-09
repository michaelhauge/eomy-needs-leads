'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function BottomNav() {
  const pathname = usePathname();

  const isHomeActive = pathname === '/' || pathname.startsWith('/need');
  const isSearchActive = pathname === '/search';
  const isRecommendActive = pathname.startsWith('/recommend') && pathname !== '/recommend/new';
  const isAddActive = pathname === '/recommend/new';

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white shadow-[0_-1px_3px_rgba(0,0,0,0.1)] block lg:hidden">
      <div className="flex items-center justify-around h-14 pb-safe max-w-lg mx-auto">
        {/* Home */}
        <Link
          href="/"
          className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
            isHomeActive ? 'text-teal-600' : 'text-slate-400'
          }`}
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
          </svg>
          <span className="text-xs mt-0.5">Home</span>
        </Link>

        {/* Search */}
        <Link
          href="/recommend"
          className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
            isSearchActive ? 'text-teal-600' : 'text-slate-400'
          }`}
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
          </svg>
          <span className="text-xs mt-0.5">Search</span>
        </Link>

        {/* Add - Elevated button */}
        <Link
          href="/recommend/new"
          className={`flex items-center justify-center w-14 h-14 -mt-5 rounded-full shadow-lg transition-all duration-150 ${
            isAddActive
              ? 'bg-teal-700 scale-95'
              : 'bg-teal-600 hover:bg-teal-700 active:scale-95'
          }`}
        >
          <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
        </Link>

        {/* Recommend */}
        <Link
          href="/recommend"
          className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
            isRecommendActive ? 'text-teal-600' : 'text-slate-400'
          }`}
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
          </svg>
          <span className="text-xs mt-0.5">Recommend</span>
        </Link>

        {/* Profile/More */}
        <Link
          href="/login"
          className="flex flex-col items-center justify-center flex-1 h-full text-slate-400 transition-colors"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
          </svg>
          <span className="text-xs mt-0.5">Profile</span>
        </Link>
      </div>
    </nav>
  );
}
