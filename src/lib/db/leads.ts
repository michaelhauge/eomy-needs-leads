import { sql } from './connection';
import type { Lead } from './types';

export async function getLeadsForNeed(needId: number): Promise<Lead[]> {
  if (!sql) return [];
  const rows = await sql<Lead[]>`
    SELECT
      l.id, l.need_id, l.contact_name, l.contact_info, l.provided_by_id, l.created_at,
      m.name as provided_by_name
    FROM leads l
    LEFT JOIN members m ON l.provided_by_id = m.id
    WHERE l.need_id = ${needId}
    ORDER BY l.created_at
  `;
  return rows;
}
