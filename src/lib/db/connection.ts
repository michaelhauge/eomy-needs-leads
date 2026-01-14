import postgres from 'postgres';

// Initialize connection (works with Supabase or any Postgres)
const connectionString = process.env.DATABASE_URL || '';
export const sql = connectionString ? postgres(connectionString) : null;
