import postgres from 'postgres';

// Initialize connection (works with Supabase or any Postgres)
const connectionString = process.env.DATABASE_URL || '';
const sql = connectionString ? postgres(connectionString) : null;

// Types
export interface Category {
  id: number;
  name: string;
  slug: string;
  recommendation_count?: number;
}

export interface Member {
  id: number;
  name: string;
  leads_count: number;
  created_at: Date;
}

export interface Need {
  id: number;
  title: string;
  original_text: string | null;
  category_id: number;
  date_of_need: Date;
  status: 'Open' | 'Has Leads' | 'Resolved';
  created_at: Date;
  // Joined fields
  category_name?: string;
  category_slug?: string;
  leads_count?: number;
}

export interface Lead {
  id: number;
  need_id: number;
  contact_name: string | null;
  contact_info: string | null;
  provided_by_id: number | null;
  created_at: Date;
  // Joined fields
  provided_by_name?: string;
}

export interface Recommendation {
  id: number;
  name: string;
  description: string | null;
  category_id: number | null;
  contact_info: string | null;
  address: string | null;
  website_url: string | null;
  recommended_by: string;
  upvotes: number;
  average_rating: number;
  review_count: number;
  created_at: Date;
  // Joined fields
  category_name?: string;
  category_slug?: string;
}

export interface Review {
  id: number;
  recommendation_id: number;
  reviewer_name: string;
  rating: number;
  review_text: string | null;
  created_at: Date;
}

// Database functions
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

export async function searchNeeds(query: string): Promise<Need[]> {
  return getNeeds({ search: query, limit: 50 });
}

// Sort options type
export type SortOption = 'rating' | 'reviews' | 'newest' | 'name';

// Recommendations functions
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

// Review functions
export async function getReviewsForRecommendation(recommendationId: number): Promise<Review[]> {
  if (!sql) return [];
  const rows = await sql<Review[]>`
    SELECT id, recommendation_id, reviewer_name, rating, review_text, created_at
    FROM reviews
    WHERE recommendation_id = ${recommendationId}
    ORDER BY created_at DESC
  `;
  return rows;
}

export async function createReview(data: {
  recommendation_id: number;
  reviewer_name: string;
  rating: number;
  review_text?: string;
}): Promise<Review | null> {
  if (!sql) return null;

  // Insert the review
  const [review] = await sql<Review[]>`
    INSERT INTO reviews (recommendation_id, reviewer_name, rating, review_text)
    VALUES (${data.recommendation_id}, ${data.reviewer_name}, ${data.rating}, ${data.review_text || null})
    RETURNING id, recommendation_id, reviewer_name, rating, review_text, created_at
  `;

  // Update the cached average rating and count on the recommendation
  await sql`
    UPDATE recommendations
    SET
      average_rating = (
        SELECT ROUND(AVG(rating)::numeric, 1)
        FROM reviews
        WHERE recommendation_id = ${data.recommendation_id}
      ),
      review_count = (
        SELECT COUNT(*)
        FROM reviews
        WHERE recommendation_id = ${data.recommendation_id}
      )
    WHERE id = ${data.recommendation_id}
  `;

  return review;
}
