/**
 * Database Seed Script for Supabase
 *
 * This script inserts the processed data into Supabase Postgres.
 * Requires DATABASE_URL environment variable to be set.
 *
 * Run with: DATABASE_URL="your-connection-string" npm run db:seed
 */

import postgres from 'postgres';
import * as fs from 'fs';
import * as path from 'path';

// All 50 categories
const categories = [
  { name: 'Legal Services', slug: 'legal-services' },
  { name: 'Accounting & Tax', slug: 'accounting-tax' },
  { name: 'HR & Recruitment', slug: 'hr-recruitment' },
  { name: 'Marketing & Advertising', slug: 'marketing-advertising' },
  { name: 'PR & Communications', slug: 'pr-communications' },
  { name: 'Business Consulting', slug: 'business-consulting' },
  { name: 'IT Services', slug: 'it-services' },
  { name: 'Software Development', slug: 'software-development' },
  { name: 'Web & Mobile Apps', slug: 'web-mobile-apps' },
  { name: 'Cybersecurity', slug: 'cybersecurity' },
  { name: 'Medical Specialists', slug: 'medical-specialists' },
  { name: 'Traditional Medicine', slug: 'traditional-medicine' },
  { name: 'Mental Health', slug: 'mental-health' },
  { name: 'Dental Services', slug: 'dental-services' },
  { name: 'Architecture & Design', slug: 'architecture-design' },
  { name: 'Engineering', slug: 'engineering' },
  { name: 'Financial Advisory', slug: 'financial-advisory' },
  { name: 'Insurance', slug: 'insurance' },
  { name: 'Banking & Finance', slug: 'banking-finance' },
  { name: 'Investment Services', slug: 'investment-services' },
  { name: 'Real Estate Sales', slug: 'real-estate-sales' },
  { name: 'Property Leasing', slug: 'property-leasing' },
  { name: 'Renovation & Fit-out', slug: 'renovation-fitout' },
  { name: 'Construction', slug: 'construction' },
  { name: 'Facilities Management', slug: 'facilities-management' },
  { name: 'Interior Design', slug: 'interior-design' },
  { name: 'Feng Shui Consulting', slug: 'feng-shui-consulting' },
  { name: 'Domestic Helpers', slug: 'domestic-helpers' },
  { name: 'Cleaning Services', slug: 'cleaning-services' },
  { name: 'Home Maintenance', slug: 'home-maintenance' },
  { name: 'Solar & Energy', slug: 'solar-energy' },
  { name: 'Water Filtration', slug: 'water-filtration' },
  { name: 'Air Conditioning', slug: 'air-conditioning' },
  { name: 'Security Services', slug: 'security-services' },
  { name: 'Personal Drivers', slug: 'personal-drivers' },
  { name: 'Car Sales & Dealers', slug: 'car-sales-dealers' },
  { name: 'Vehicle Services', slug: 'vehicle-services' },
  { name: 'Logistics & Shipping', slug: 'logistics-shipping' },
  { name: 'International Freight', slug: 'international-freight' },
  { name: 'Restaurants & Catering', slug: 'restaurants-catering' },
  { name: 'Food Suppliers', slug: 'food-suppliers' },
  { name: 'Hotels & Venues', slug: 'hotels-venues' },
  { name: 'Event Planning', slug: 'event-planning' },
  { name: 'Entertainment & Performers', slug: 'entertainment-performers' },
  { name: 'Schools & Education', slug: 'schools-education' },
  { name: 'Coaching & Training', slug: 'coaching-training' },
  { name: 'Language Services', slug: 'language-services' },
  { name: 'Immigration & Visas', slug: 'immigration-visas' },
  { name: 'Licensing & Permits', slug: 'licensing-permits' },
  { name: 'Customs & Trade', slug: 'customs-trade' },
];

async function seedDatabase() {
  console.log('Starting database seed...');

  // Check for environment variable
  if (!process.env.DATABASE_URL) {
    console.error('Error: DATABASE_URL environment variable is required');
    console.error('Usage: DATABASE_URL="postgres://..." npm run db:seed');
    process.exit(1);
  }

  const sql = postgres(process.env.DATABASE_URL);

  // Read the processed data
  const dataPath = path.join(process.env.HOME || '', 'eomy-import-data.json');
  if (!fs.existsSync(dataPath)) {
    console.error(`Data file not found: ${dataPath}`);
    console.error('Please run: npm run data:process first');
    process.exit(1);
  }

  const data = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));

  try {
    // Create tables
    console.log('\n1. Creating tables...');

    await sql`
      CREATE TABLE IF NOT EXISTS categories (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) UNIQUE NOT NULL,
        slug VARCHAR(100) UNIQUE NOT NULL
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS members (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) UNIQUE NOT NULL,
        leads_count INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS needs (
        id SERIAL PRIMARY KEY,
        title VARCHAR(200) NOT NULL,
        original_text TEXT,
        category_id INTEGER REFERENCES categories(id),
        date_of_need DATE NOT NULL,
        status VARCHAR(20) DEFAULT 'Open',
        created_at TIMESTAMP DEFAULT NOW()
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS leads (
        id SERIAL PRIMARY KEY,
        need_id INTEGER REFERENCES needs(id) ON DELETE CASCADE,
        contact_name VARCHAR(200),
        contact_info TEXT,
        provided_by_id INTEGER REFERENCES members(id),
        created_at TIMESTAMP DEFAULT NOW()
      )
    `;

    console.log('   Tables created successfully');

    // Clear existing data
    console.log('\n2. Clearing existing data...');
    await sql`DELETE FROM leads`;
    await sql`DELETE FROM needs`;
    await sql`DELETE FROM members`;
    await sql`DELETE FROM categories`;
    console.log('   Existing data cleared');

    // Insert categories
    console.log('\n3. Inserting categories...');
    for (const cat of categories) {
      await sql`
        INSERT INTO categories (name, slug)
        VALUES (${cat.name}, ${cat.slug})
        ON CONFLICT (name) DO NOTHING
      `;
    }
    console.log(`   Inserted ${categories.length} categories`);

    // Create category lookup map
    const categoryResult = await sql`SELECT id, slug FROM categories`;
    const categoryMap: Record<string, number> = {};
    for (const row of categoryResult) {
      categoryMap[row.slug] = row.id;
    }

    // Insert members
    console.log('\n4. Inserting members...');
    const memberMap: Record<string, number> = {};
    for (const member of data.members) {
      const result = await sql`
        INSERT INTO members (name, leads_count)
        VALUES (${member.name}, ${member.leads_count})
        RETURNING id
      `;
      memberMap[member.name] = result[0].id;
    }
    console.log(`   Inserted ${data.members.length} members`);

    // Insert needs
    console.log('\n5. Inserting needs...');
    const needIdMap: Record<number, number> = {};
    for (const need of data.needs) {
      const categoryId = categoryMap[need.category_slug] || categoryMap['business-consulting'];
      const result = await sql`
        INSERT INTO needs (title, original_text, category_id, date_of_need, status)
        VALUES (${need.title}, ${need.original_text}, ${categoryId}, ${need.date_of_need}, ${need.status})
        RETURNING id
      `;
      needIdMap[need.id] = result[0].id;
    }
    console.log(`   Inserted ${data.needs.length} needs`);

    // Insert leads
    console.log('\n6. Inserting leads...');
    for (const lead of data.leads) {
      const needId = needIdMap[lead.need_id];
      const providedById = lead.provided_by ? memberMap[lead.provided_by] : null;
      await sql`
        INSERT INTO leads (need_id, contact_name, contact_info, provided_by_id)
        VALUES (${needId}, ${lead.contact_name}, ${lead.contact_info}, ${providedById})
      `;
    }
    console.log(`   Inserted ${data.leads.length} leads`);

    // Verify data
    console.log('\n7. Verifying data...');
    const needsCount = await sql`SELECT COUNT(*) as count FROM needs`;
    const leadsCount = await sql`SELECT COUNT(*) as count FROM leads`;
    const membersCount = await sql`SELECT COUNT(*) as count FROM members`;

    console.log(`   Needs in database: ${needsCount[0].count}`);
    console.log(`   Leads in database: ${leadsCount[0].count}`);
    console.log(`   Members in database: ${membersCount[0].count}`);

    console.log('\n✅ Database seeding complete!');

  } finally {
    await sql.end();
  }
}

seedDatabase().catch(console.error);
