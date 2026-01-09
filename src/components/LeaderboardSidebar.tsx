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
  if (members.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Leaderboard</h2>
        <p className="text-gray-500 text-sm">No leads provided yet.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4">
        Top Lead Providers
      </h2>

      <div className="space-y-3">
        {members.map((member, index) => {
          const rank = index + 1;
          const medal = getMedalEmoji(rank);

          return (
            <div
              key={member.id}
              className={`flex items-center gap-3 p-3 rounded-lg ${
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
  );
}
