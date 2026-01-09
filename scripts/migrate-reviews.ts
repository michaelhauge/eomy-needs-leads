/**
 * Database Migration Script for Reviews Feature
 * Adds address/website columns to recommendations and creates reviews table
 *
 * Run with: DATABASE_URL="your-connection-string" npx tsx scripts/migrate-reviews.ts
 */

import postgres from 'postgres';

async function migrate() {
  if (!process.env.DATABASE_URL) {
    console.error('Error: DATABASE_URL environment variable is required');
    process.exit(1);
  }

  const sql = postgres(process.env.DATABASE_URL);

  console.log('Starting reviews feature migration...');

  try {
    // Add new columns to recommendations table
    console.log('Adding new columns to recommendations table...');

    await sql`
      ALTER TABLE recommendations
      ADD COLUMN IF NOT EXISTS address TEXT
    `;
    console.log('  - Added address column');

    await sql`
      ALTER TABLE recommendations
      ADD COLUMN IF NOT EXISTS website_url VARCHAR(500)
    `;
    console.log('  - Added website_url column');

    await sql`
      ALTER TABLE recommendations
      ADD COLUMN IF NOT EXISTS average_rating DECIMAL(2,1) DEFAULT 0
    `;
    console.log('  - Added average_rating column');

    await sql`
      ALTER TABLE recommendations
      ADD COLUMN IF NOT EXISTS review_count INTEGER DEFAULT 0
    `;
    console.log('  - Added review_count column');

    // Create reviews table
    console.log('Creating reviews table...');
    await sql`
      CREATE TABLE IF NOT EXISTS reviews (
        id SERIAL PRIMARY KEY,
        recommendation_id INTEGER REFERENCES recommendations(id) ON DELETE CASCADE,
        reviewer_name VARCHAR(100) NOT NULL,
        rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
        review_text TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `;
    console.log('  - Created reviews table');

    // Create index for faster queries
    await sql`
      CREATE INDEX IF NOT EXISTS idx_reviews_recommendation
      ON reviews(recommendation_id)
    `;
    console.log('  - Created recommendation_id index');

    await sql`
      CREATE INDEX IF NOT EXISTS idx_reviews_created_at
      ON reviews(created_at DESC)
    `;
    console.log('  - Created created_at index');

    console.log('\nMigration complete!');
  } catch (error) {
    console.error('Migration failed:', error);
    throw error;
  } finally {
    await sql.end();
  }
}

migrate().catch(console.error);
