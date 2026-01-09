/**
 * Database Migration Script for Recommendations Table
 * Creates recommendations table for EO Members Recommend feature
 *
 * Run with: DATABASE_URL="your-connection-string" npx tsx scripts/migrate-recommendations.ts
 */

import postgres from 'postgres';

async function migrate() {
  if (!process.env.DATABASE_URL) {
    console.error('Error: DATABASE_URL environment variable is required');
    process.exit(1);
  }

  const sql = postgres(process.env.DATABASE_URL);

  console.log('Starting recommendations table migration...');

  try {
    // Create recommendations table
    await sql`
      CREATE TABLE IF NOT EXISTS recommendations (
        id SERIAL PRIMARY KEY,
        name VARCHAR(200) NOT NULL,
        description TEXT,
        category_id INTEGER REFERENCES categories(id),
        contact_info TEXT,
        recommended_by VARCHAR(100) NOT NULL,
        upvotes INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `;
    console.log('Created recommendations table');

    // Create index for faster category filtering
    await sql`
      CREATE INDEX IF NOT EXISTS idx_recommendations_category ON recommendations(category_id)
    `;
    console.log('Created category index');

    console.log('Migration complete!');
  } finally {
    await sql.end();
  }
}

migrate().catch(console.error);
