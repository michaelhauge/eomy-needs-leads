/**
 * Data Import Script for EOMY Needs & Leads
 *
 * This script reads the CSV data and prepares it for database import.
 * Run with: npx tsx scripts/import-data.ts
 */

import * as fs from 'fs';
import * as path from 'path';

// Category mapping from old categories to new slugs
const categoryMapping: Record<string, string> = {
  'Home Services': 'domestic-helpers',
  'Professional Services': 'legal-services',
  'Beauty & Wellness': 'coaching-training',
  'Food & Dining': 'restaurants-catering',
  'Automotive': 'personal-drivers',
  'Education': 'schools-education',
  'Events & Entertainment': 'event-planning',
  'Real Estate': 'real-estate-sales',
  'Technology': 'it-services',
  'Travel': 'hotels-venues',
  'Financial': 'banking-finance',
  'Tech & Electronics': 'software-development',
  'Other': 'business-consulting',
};

// More specific category mappings based on keywords
const keywordCategoryMapping: [RegExp, string][] = [
  // Legal
  [/lawyer|solicitor|legal|conveyancing|trademark/i, 'legal-services'],
  // Medical
  [/doctor|oncologist|gastro|neurologist|pediatric|hospital|medical|health/i, 'medical-specialists'],
  [/traditional.*doctor|tcm|chinese.*medicine|shingles/i, 'traditional-medicine'],
  // HR & Recruitment
  [/hr\s|recruit|headhunt|payroll|hiring|staff/i, 'hr-recruitment'],
  // Marketing
  [/marketing|advertis|agency|telemarket/i, 'marketing-advertising'],
  // IT & Tech
  [/software|app|mobile.*app|it\s|tech.*team|developer|coding/i, 'software-development'],
  [/crm|erp|power.*bi|dashboard|sharepoint|teams/i, 'it-services'],
  // Finance & Banking
  [/bank|insurance|invest|financial|maybank|uob|standard.*chartered/i, 'banking-finance'],
  // Real Estate
  [/property|real.*estate|condo|hotel.*sale|land.*lease/i, 'real-estate-sales'],
  [/leasing|rent.*space|office.*space/i, 'property-leasing'],
  [/feng.*shui/i, 'feng-shui-consulting'],
  // Construction & Renovation
  [/renovati|fit.*out|contractor|construction|structural/i, 'renovation-fitout'],
  [/architect/i, 'architecture-design'],
  [/facilities.*management/i, 'facilities-management'],
  // Home Services
  [/maid|helper|domestic|cleaning|cleaner/i, 'domestic-helpers'],
  [/solar|energy/i, 'solar-energy'],
  [/water.*filter/i, 'water-filtration'],
  [/air.*con|aircond/i, 'air-conditioning'],
  // Transportation
  [/driver/i, 'personal-drivers'],
  [/car.*dealer|sell.*car|buy.*car/i, 'car-sales-dealers'],
  [/logistics|3pl|shipping|freight|delivery/i, 'logistics-shipping'],
  [/customs|clearance|import/i, 'customs-trade'],
  // Food & Hospitality
  [/restaurant|catering|food.*vendor|chinese.*restaurant/i, 'restaurants-catering'],
  [/seafood|supplier.*food/i, 'food-suppliers'],
  [/hotel|venue|private.*room/i, 'hotels-venues'],
  [/event|emcee|photographer|entertainer|singer/i, 'event-planning'],
  // Education
  [/school|university|education|tutor/i, 'schools-education'],
  [/coach|training|course/i, 'coaching-training'],
  [/pickle.*ball/i, 'coaching-training'],
  // Immigration & Government
  [/visa|immigration|passport|embassy|consulate|employment.*pass|mm2h/i, 'immigration-visas'],
  [/license|permit|dbkl|mppj|bomba|mida/i, 'licensing-permits'],
  [/apec.*card/i, 'immigration-visas'],
  // Accounting & Tax
  [/accountant|tax|sst|duty/i, 'accounting-tax'],
];

// Simplify the need title
function simplifyTitle(original: string): string {
  let title = original;

  // Remove common prefixes
  title = title.replace(/^\*Need\*\s*/i, '');
  title = title.replace(/^Hi\s*(all|guys|everyone|there|hi|hello)?\s*[,.]?\s*/i, '');
  title = title.replace(/^Hello\s*(all|guys|everyone|there)?\s*[,.]?\s*/i, '');
  title = title.replace(/^Good\s*(morning|afternoon|evening)\s*[,.]?\s*/i, '');
  title = title.replace(/^Hey\s*(all|guys|everyone|peeps)?\s*[,.]?\s*/i, '');
  title = title.replace(/^Morning\s*[,.]?\s*/i, '');

  // Remove common question starters
  title = title.replace(/^(Can\s+)?anyone\s+(here\s+)?(share|recommend|know|has|have|got)\s*/i, '');
  title = title.replace(/^Does\s+anyone\s+(here\s+)?(know|have|has)\s*/i, '');
  title = title.replace(/^I('m|\s+am)\s+(looking\s+for|searching\s+for|in\s+search\s+of)\s*/i, '');
  title = title.replace(/^Looking\s+for\s*/i, '');
  title = title.replace(/^Need(ing)?\s*(help\s+with|to\s+find|a\s+lead)?\s*/i, '');
  title = title.replace(/^Seeking\s*/i, '');
  title = title.replace(/^\*Need:?\*?\s*/i, '');

  // Remove trailing punctuation questions
  title = title.replace(/\?\s*$/, '');
  title = title.replace(/please\s*(pm|dm|message)?\s*me?\s*[.!]?\s*$/i, '');
  title = title.replace(/thanks?\s*(in\s+advance)?\s*[.!]?\s*$/i, '');
  title = title.replace(/appreciate\s+(any|it)\s*[.!]?\s*$/i, '');
  title = title.replace(/[.!]+\s*$/, '');

  // Clean up whitespace
  title = title.replace(/\s+/g, ' ').trim();

  // Capitalize first letter
  if (title.length > 0) {
    title = title.charAt(0).toUpperCase() + title.slice(1);
  }

  // Truncate if too long
  if (title.length > 150) {
    title = title.substring(0, 147) + '...';
  }

  return title || original.substring(0, 150);
}

// Determine the best category for a need
function determineCategory(originalCategory: string, needText: string): string {
  // First check keyword mappings
  for (const [pattern, slug] of keywordCategoryMapping) {
    if (pattern.test(needText)) {
      return slug;
    }
  }

  // Fall back to original category mapping
  return categoryMapping[originalCategory] || 'business-consulting';
}

// Parse the CSV file
function parseCSV(csvPath: string): any[] {
  const content = fs.readFileSync(csvPath, 'utf-8');
  const lines = content.split('\n');
  const headers = lines[0].split(',').map((h) => h.trim().replace(/^"|"$/g, ''));

  const records: any[] = [];
  let currentRecord: string[] = [];
  let inQuotedField = false;
  let currentField = '';

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];

    for (let j = 0; j < line.length; j++) {
      const char = line[j];

      if (char === '"') {
        if (inQuotedField && line[j + 1] === '"') {
          currentField += '"';
          j++;
        } else {
          inQuotedField = !inQuotedField;
        }
      } else if (char === ',' && !inQuotedField) {
        currentRecord.push(currentField.trim());
        currentField = '';
      } else {
        currentField += char;
      }
    }

    if (!inQuotedField) {
      currentRecord.push(currentField.trim());
      currentField = '';

      if (currentRecord.length >= headers.length) {
        const record: Record<string, string> = {};
        headers.forEach((header, idx) => {
          record[header] = currentRecord[idx] || '';
        });
        records.push(record);
      }
      currentRecord = [];
    } else {
      currentField += '\n';
    }
  }

  return records;
}

// Main processing function
function processData() {
  const csvPath = path.join(process.env.HOME || '', 'needs_leads_v2.csv');

  if (!fs.existsSync(csvPath)) {
    console.error(`CSV file not found: ${csvPath}`);
    process.exit(1);
  }

  console.log('Reading CSV file...');
  const records = parseCSV(csvPath);
  console.log(`Found ${records.length} records`);

  // Track unique members who provide leads
  const memberLeadCounts: Record<string, number> = {};

  // Process each record
  const needs: any[] = [];
  const leads: any[] = [];

  for (const record of records) {
    const originalNeed = record['Need'] || '';
    const date = record['Date']?.split(' ')[0] || '2025-01-01';
    const originalCategory = record['Category'] || 'Other';

    if (!originalNeed.trim()) continue;

    const simplifiedTitle = simplifyTitle(originalNeed);
    const categorySlug = determineCategory(originalCategory, originalNeed);

    // Determine status based on whether there are leads
    const hasLeads =
      record['Lead 1 - Name'] ||
      record['Lead 1 - Contact'] ||
      record['Lead 2 - Name'] ||
      record['Lead 2 - Contact'];

    const status = hasLeads ? 'Has Leads' : 'Open';

    const needId = needs.length + 1;

    needs.push({
      id: needId,
      title: simplifiedTitle,
      original_text: originalNeed,
      category_slug: categorySlug,
      date_of_need: date,
      status,
    });

    // Process leads (up to 5 per need)
    for (let i = 1; i <= 5; i++) {
      const name = record[`Lead ${i} - Name`]?.trim();
      const contact = record[`Lead ${i} - Contact`]?.trim();
      const recommendedBy = record[`Lead ${i} - Recommended By`]?.trim();

      if (name || contact) {
        leads.push({
          need_id: needId,
          contact_name: name || null,
          contact_info: contact || null,
          provided_by: recommendedBy || null,
        });

        // Track lead provider
        if (recommendedBy) {
          memberLeadCounts[recommendedBy] = (memberLeadCounts[recommendedBy] || 0) + 1;
        }
      }
    }
  }

  // Create members list sorted by lead count
  const members = Object.entries(memberLeadCounts)
    .map(([name, count], idx) => ({
      id: idx + 1,
      name,
      leads_count: count,
    }))
    .sort((a, b) => b.leads_count - a.leads_count);

  // Output results
  const outputPath = path.join(process.env.HOME || '', 'eomy-import-data.json');
  const output = {
    needs,
    leads,
    members,
    stats: {
      total_needs: needs.length,
      total_leads: leads.length,
      total_members: members.length,
      needs_with_leads: needs.filter((n) => n.status === 'Has Leads').length,
    },
  };

  fs.writeFileSync(outputPath, JSON.stringify(output, null, 2));
  console.log(`\nOutput saved to: ${outputPath}`);
  console.log('\nStats:');
  console.log(`  Total needs: ${output.stats.total_needs}`);
  console.log(`  Total leads: ${output.stats.total_leads}`);
  console.log(`  Needs with leads: ${output.stats.needs_with_leads}`);
  console.log(`  Unique lead providers: ${output.stats.total_members}`);

  console.log('\nTop 10 Lead Providers:');
  members.slice(0, 10).forEach((m, i) => {
    console.log(`  ${i + 1}. ${m.name}: ${m.leads_count} leads`);
  });

  console.log('\nSample simplified titles:');
  needs.slice(0, 5).forEach((n) => {
    console.log(`  Original: "${n.original_text.substring(0, 60)}..."`);
    console.log(`  Simplified: "${n.title}"`);
    console.log(`  Category: ${n.category_slug}`);
    console.log('');
  });
}

processData();
