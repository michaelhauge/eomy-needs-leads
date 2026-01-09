/**
 * Database Migration Script
 * Creates tables and inserts categories for Supabase
 *
 * Run with: DATABASE_URL="your-connection-string" npm run db:migrate
 */

import postgres from 'postgres';

const categories = [
  // Business Services (1-10)
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

  // Professional Services (11-20)
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

  // Property & Construction (21-27)
  { name: 'Real Estate Sales', slug: 'real-estate-sales' },
  { name: 'Property Leasing', slug: 'property-leasing' },
  { name: 'Renovation & Fit-out', slug: 'renovation-fitout' },
  { name: 'Construction', slug: 'construction' },
  { name: 'Facilities Management', slug: 'facilities-management' },
  { name: 'Interior Design', slug: 'interior-design' },
  { name: 'Feng Shui Consulting', slug: 'feng-shui-consulting' },

  // Home & Living (28-34)
  { name: 'Domestic Helpers', slug: 'domestic-helpers' },
  { name: 'Cleaning Services', slug: 'cleaning-services' },
  { name: 'Home Maintenance', slug: 'home-maintenance' },
  { name: 'Solar & Energy', slug: 'solar-energy' },
  { name: 'Water Filtration', slug: 'water-filtration' },
  { name: 'Air Conditioning', slug: 'air-conditioning' },
  { name: 'Security Services', slug: 'security-services' },

  // Transportation (35-39)
  { name: 'Personal Drivers', slug: 'personal-drivers' },
  { name: 'Car Sales & Dealers', slug: 'car-sales-dealers' },
  { name: 'Vehicle Services', slug: 'vehicle-services' },
  { name: 'Logistics & Shipping', slug: 'logistics-shipping' },
  { name: 'International Freight', slug: 'international-freight' },

  // Food & Hospitality (40-44)
  { name: 'Restaurants & Catering', slug: 'restaurants-catering' },
  { name: 'Food Suppliers', slug: 'food-suppliers' },
  { name: 'Hotels & Venues', slug: 'hotels-venues' },
  { name: 'Event Planning', slug: 'event-planning' },
  { name: 'Entertainment & Performers', slug: 'entertainment-performers' },

  // Education & Training (45-47)
  { name: 'Schools & Education', slug: 'schools-education' },
  { name: 'Coaching & Training', slug: 'coaching-training' },
  { name: 'Language Services', slug: 'language-services' },

  // Government & Compliance (48-50)
  { name: 'Immigration & Visas', slug: 'immigration-visas' },
  { name: 'Licensing & Permits', slug: 'licensing-permits' },
  { name: 'Customs & Trade', slug: 'customs-trade' },
];

async function migrate() {
  if (!process.env.DATABASE_URL) {
    console.error('Error: DATABASE_URL environment variable is required');
    process.exit(1);
  }

  const sql = postgres(process.env.DATABASE_URL);

  console.log('Starting database migration...');

  try {
    // Create categories table
    await sql`
      CREATE TABLE IF NOT EXISTS categories (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) UNIQUE NOT NULL,
        slug VARCHAR(100) UNIQUE NOT NULL
      )
    `;
    console.log('Created categories table');

    // Create members table
    await sql`
      CREATE TABLE IF NOT EXISTS members (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) UNIQUE NOT NULL,
        leads_count INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `;
    console.log('Created members table');

    // Create needs table
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
    console.log('Created needs table');

    // Create leads table
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
    console.log('Created leads table');

    // Insert categories
    console.log('Inserting categories...');
    for (const category of categories) {
      await sql`
        INSERT INTO categories (name, slug)
        VALUES (${category.name}, ${category.slug})
        ON CONFLICT (name) DO NOTHING
      `;
    }
    console.log(`Inserted ${categories.length} categories`);

    console.log('Migration complete!');
  } finally {
    await sql.end();
  }
}

migrate().catch(console.error);
