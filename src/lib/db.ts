import postgres from 'postgres';

// Initialize connection (works with Supabase or any Postgres)
const connectionString = process.env.DATABASE_URL || '';
const sql = connectionString ? postgres(connectionString) : null;

// Types
export interface Category {
  id: number;
  name: string;
  slug: string;
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

// Database functions
export async function getCategories(): Promise<Category[]> {
  if (!sql) return [];
  const rows = await sql<Category[]>`
    SELECT id, name, slug FROM categories ORDER BY name
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
