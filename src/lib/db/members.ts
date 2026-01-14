import { sql } from './connection';
import type { Member } from './types';

export async function getLeaderboard(limit: number = 20): Promise<Member[]> {
  if (!sql) return [];
  const rows = await sql<Member[]>`
    SELECT id, name, leads_count, created_at
    FROM members
    WHERE leads_count > 0
    ORDER BY leads_count DESC
    LIMIT ${limit}
  `;
  return rows;
}
