'use client';

import { useState } from 'react';
import { Member } from '@/lib/db';

interface LeaderboardSidebarProps {
  members: Member[];
}

function getMedalEmoji(rank: number): string {
  switch (rank) {
    case 1:
      return '🥇';
    case 2:
      return '🥈';
    case 3:
      return '🥉';
    default:
      return '';
  }
}

export default function LeaderboardSidebar({ members }: LeaderboardSidebarProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (members.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-md p-4 sm:p-6">
        <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-4">Leaderboard</h2>
        <p className="text-gray-500 text-sm">No leads provided yet.</p>
      </div>
    );
  }

  // Show top 3 on mobile when collapsed, all on desktop or when expanded
  const displayMembers = isExpanded ? members : members.slice(0, 3);

  return (
    <div className="bg-white rounded-xl shadow-md p-4 sm:p-6">
      {/* Header - clickable on mobile */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between lg:cursor-default"
      >
        <h2 className="text-lg sm:text-xl font-bold text-gray-800">
          Top Lead Providers
        </h2>
        {/* Chevron - only visible on mobile/tablet */}
        <svg
          className={`w-5 h-5 text-gray-500 lg:hidden transition-transform ${isExpanded ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Members list */}
      <div className="mt-4 space-y-2 sm:space-y-3">
        {/* On mobile: show limited list unless expanded. On desktop: always show all */}
        {displayMembers.map((member, index) => {
          const rank = index + 1;
          const medal = getMedalEmoji(rank);

          return (
            <div
              key={member.id}
              className={`flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg ${
                rank <= 3 ? 'bg-gradient-to-r from-amber-50 to-yellow-50' : 'bg-gray-50'
              }`}
            >
              <span className="w-7 sm:w-8 text-center font-bold text-gray-600 text-sm sm:text-base">
                {medal || `#${rank}`}
              </span>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-800 truncate text-sm sm:text-base">{member.name}</p>
              </div>
              <span className="bg-blue-100 text-blue-800 text-xs sm:text-sm font-semibold px-2 py-1 rounded-full">
                {member.leads_count}
              </span>
            </div>
          );
        })}

        {/* Hidden members on desktop - always show all */}
        <div className="hidden lg:block">
          {members.slice(3).map((member, index) => {
            const rank = index + 4;
            const medal = getMedalEmoji(rank);

            return (
              <div
                key={member.id}
                className={`flex items-center gap-3 p-3 rounded-lg mt-3 ${
                  rank <= 3 ? 'bg-gradient-to-r from-amber-50 to-yellow-50' : 'bg-gray-50'
                }`}
              >
                <span className="w-8 text-center font-bold text-gray-600">
                  {medal || `#${rank}`}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-800 truncate">{member.name}</p>
                </div>
                <span className="bg-blue-100 text-blue-800 text-sm font-semibold px-2 py-1 rounded-full">
                  {member.leads_count}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Show more/less button - mobile only */}
      {members.length > 3 && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="mt-3 w-full text-center text-sm text-blue-600 font-medium py-2 lg:hidden"
        >
          {isExpanded ? 'Show less' : `Show all ${members.length} members`}
        </button>
      )}
    </div>
  );
}
