import { sql } from './connection';
import type { Recommendation, SortOption } from './types';

export async function getRecommendations(options?: {
  categorySlug?: string;
  search?: string;
  minRating?: number;
  sort?: SortOption;
  limit?: number;
  offset?: number;
}): Promise<Recommendation[]> {
  if (!sql) return [];
  const { categorySlug, search, minRating, sort = 'rating', limit = 50, offset = 0 } = options || {};

  // Build ORDER BY clause based on sort option
  const orderByClause = sort === 'rating'
    ? sql`ORDER BY r.average_rating DESC, r.review_count DESC, r.created_at DESC`
    : sort === 'reviews'
    ? sql`ORDER BY r.review_count DESC, r.average_rating DESC, r.created_at DESC`
    : sort === 'newest'
    ? sql`ORDER BY r.created_at DESC, r.average_rating DESC`
    : sql`ORDER BY r.name ASC, r.average_rating DESC`; // sort === 'name' (A-Z)

  const rows = await sql<Recommendation[]>`
    SELECT
      r.id, r.name, r.description, r.category_id, r.contact_info,
      r.address, r.website_url,
      r.recommended_by, r.upvotes,
      COALESCE(r.average_rating, 0)::float as average_rating,
      COALESCE(r.review_count, 0)::int as review_count,
      r.created_at,
      c.name as category_name, c.slug as category_slug
    FROM recommendations r
    LEFT JOIN categories c ON r.category_id = c.id
    WHERE 1=1
      ${categorySlug ? sql`AND c.slug = ${categorySlug}` : sql``}
      ${search ? sql`AND (r.name ILIKE ${'%' + search + '%'} OR r.description ILIKE ${'%' + search + '%'} OR c.name ILIKE ${'%' + search + '%'})` : sql``}
      ${minRating ? sql`AND COALESCE(r.average_rating, 0) >= ${minRating}` : sql``}
    ${orderByClause}
    LIMIT ${limit} OFFSET ${offset}
  `;

  return rows;
}

export async function getRecommendationById(id: number): Promise<Recommendation | null> {
  if (!sql) return null;
  const rows = await sql<Recommendation[]>`
    SELECT
      r.id, r.name, r.description, r.category_id, r.contact_info,
      r.address, r.website_url,
      r.recommended_by, r.upvotes,
      COALESCE(r.average_rating, 0)::float as average_rating,
      COALESCE(r.review_count, 0)::int as review_count,
      r.created_at,
      c.name as category_name, c.slug as category_slug
    FROM recommendations r
    LEFT JOIN categories c ON r.category_id = c.id
    WHERE r.id = ${id}
  `;
  return rows[0] || null;
}

export async function createRecommendation(data: {
  name: string;
  description?: string;
  category_id?: number;
  contact_info?: string;
  address?: string;
  website_url?: string;
  recommended_by: string;
}): Promise<Recommendation | null> {
  if (!sql) return null;
  const rows = await sql<Recommendation[]>`
    INSERT INTO recommendations (name, description, category_id, contact_info, address, website_url, recommended_by)
    VALUES (
      ${data.name},
      ${data.description || null},
      ${data.category_id || null},
      ${data.contact_info || null},
      ${data.address || null},
      ${data.website_url || null},
      ${data.recommended_by}
    )
    RETURNING id, name, description, category_id, contact_info, address, website_url, recommended_by, upvotes, average_rating, review_count, created_at
  `;
  return rows[0] || null;
}
