import { sql } from './connection';
import type { Category } from './types';

export async function getCategories(): Promise<Category[]> {
  if (!sql) return [];
  const rows = await sql<Category[]>`
    SELECT id, name, slug FROM categories ORDER BY name
  `;
  return rows;
}

export async function getCategoriesWithCounts(): Promise<Category[]> {
  if (!sql) return [];
  const rows = await sql<Category[]>`
    SELECT
      c.id, c.name, c.slug,
      COUNT(r.id)::int as recommendation_count
    FROM categories c
    LEFT JOIN recommendations r ON c.id = r.category_id
    GROUP BY c.id, c.name, c.slug
    HAVING COUNT(r.id) > 0
    ORDER BY c.name
  `;
  return rows;
}

export async function getTopCategories(limit: number = 8): Promise<Category[]> {
  if (!sql) return [];
  const rows = await sql<Category[]>`
    SELECT
      c.id, c.name, c.slug,
      COUNT(r.id)::int as recommendation_count
    FROM categories c
    LEFT JOIN recommendations r ON c.id = r.category_id
    GROUP BY c.id, c.name, c.slug
    HAVING COUNT(r.id) > 0
    ORDER BY COUNT(r.id) DESC, c.name ASC
    LIMIT ${limit}
  `;
  return rows;
}
