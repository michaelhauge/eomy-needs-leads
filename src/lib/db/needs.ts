import { sql } from './connection';
import type { Need } from './types';

export async function getNeeds(options?: {
  categorySlug?: string;
  status?: string;
  search?: string;
  limit?: number;
  offset?: number;
}): Promise<Need[]> {
  if (!sql) return [];
  const { categorySlug, status, search, limit = 50, offset = 0 } = options || {};

  // Build dynamic query with conditions
  const rows = await sql<Need[]>`
    SELECT
      n.id, n.title, n.original_text, n.category_id, n.date_of_need, n.status, n.created_at,
      c.name as category_name, c.slug as category_slug,
      COUNT(l.id)::int as leads_count
    FROM needs n
    LEFT JOIN categories c ON n.category_id = c.id
    LEFT JOIN leads l ON n.id = l.need_id
    WHERE 1=1
      ${categorySlug ? sql`AND c.slug = ${categorySlug}` : sql``}
      ${status ? sql`AND n.status = ${status}` : sql``}
      ${search ? sql`AND n.title ILIKE ${'%' + search + '%'}` : sql``}
    GROUP BY n.id, c.name, c.slug
    ORDER BY n.date_of_need DESC
    LIMIT ${limit} OFFSET ${offset}
  `;

  return rows;
}

export async function getNeedById(id: number): Promise<Need | null> {
  if (!sql) return null;
  const rows = await sql<Need[]>`
    SELECT
      n.id, n.title, n.original_text, n.category_id, n.date_of_need, n.status, n.created_at,
      c.name as category_name, c.slug as category_slug
    FROM needs n
    LEFT JOIN categories c ON n.category_id = c.id
    WHERE n.id = ${id}
  `;
  return rows[0] || null;
}

export async function searchNeeds(query: string): Promise<Need[]> {
  return getNeeds({ search: query, limit: 50 });
}
