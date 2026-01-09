/**
 * Seed Script for Malaysian Business Recommendations
 *
 * This script populates the recommendations table with real Malaysian businesses
 * across 15 priority categories with sample reviews.
 *
 * Run with: npx tsx scripts/seed-recommendations.ts
 */

import postgres from 'postgres';

interface Business {
  name: string;
  category_slug: string;
  description: string;
  address: string;
  website_url: string;
  contact_info: string;
  recommended_by: string;
  reviews: Array<{
    reviewer_name: string;
    rating: number;
    review_text: string;
  }>;
}

const businesses: Business[] = [
  // ===== LEGAL SERVICES =====
  {
    name: 'Wong & Partners',
    category_slug: 'legal-services',
    description: 'Wong & Partners is a leading full-service Malaysian law firm and a member of Baker McKenzie. Named Malaysia Law Firm of the Year by Chambers Asia Pacific 2025, they specialize in corporate/M&A, banking & finance, tax, IP, and regulatory compliance. With 87 lawyers, they advise on major cross-border transactions.',
    address: 'Level 21, The Gardens South Tower, Mid Valley City, Lingkaran Syed Putra, 59200 Kuala Lumpur',
    website_url: 'www.wongpartners.com',
    contact_info: '+603-2298 7888',
    recommended_by: 'David Chen',
    reviews: [
      { reviewer_name: 'Sarah Tan', rating: 5, review_text: 'Excellent corporate lawyers. They handled our M&A deal professionally and efficiently. Highly recommended for complex transactions.' },
      { reviewer_name: 'Michael Wong', rating: 5, review_text: 'Outstanding legal team. Their cross-border expertise made our regional expansion seamless.' },
    ],
  },
  {
    name: 'Shearn Delamore & Co',
    category_slug: 'legal-services',
    description: 'Malaysia\'s largest law firm with 128 lawyers and over 100 years of history. Shearn Delamore provides comprehensive legal services including corporate law, dispute resolution, intellectual property, and real estate. Known for excellence in litigation and commercial transactions.',
    address: '7th Floor, Wisma Hamzah-Kwong Hing, No. 1, Leboh Ampang, 50100 Kuala Lumpur',
    website_url: 'www.shearndelamore.com',
    contact_info: '+603-2027 2727',
    recommended_by: 'Ahmad Razak',
    reviews: [
      { reviewer_name: 'Jennifer Lee', rating: 5, review_text: 'Top-notch dispute resolution team. They won our case with impressive legal strategy.' },
      { reviewer_name: 'Vincent Lim', rating: 4, review_text: 'Very professional and thorough. Good for corporate matters though premium pricing.' },
    ],
  },
  {
    name: 'Lee Hishammuddin Allen & Gledhill',
    category_slug: 'legal-services',
    description: 'LHAG is a premier Malaysian law firm with 107 lawyers, renowned for corporate law, banking, and dispute resolution. Successfully represented major multinational corporations in high-profile litigation matters. Strong focus on client service and practical legal solutions.',
    address: 'Level 6, Menara 1 Dutamas, Solaris Dutamas, No. 1, Jalan Dutamas 1, 50480 Kuala Lumpur',
    website_url: 'www.lh-ag.com',
    contact_info: '+603-6208 5888',
    recommended_by: 'Tan Wei Ming',
    reviews: [
      { reviewer_name: 'Robert Ng', rating: 5, review_text: 'Exceptional banking lawyers. They understand complex financial regulations inside out.' },
    ],
  },

  // ===== ACCOUNTING & TAX =====
  {
    name: 'KPMG Malaysia',
    category_slug: 'accounting-tax',
    description: 'KPMG Malaysia, established in 1928, is one of the oldest and largest audit firms in Malaysia. Headquartered at KPMG Tower in Petaling Jaya with 8 offices nationwide and about 2,200 employees. Renowned for audit excellence, they serve major conglomerates, banks, and government-linked companies.',
    address: 'KPMG Tower, 8 First Avenue, Bandar Utama, 47800 Petaling Jaya, Selangor',
    website_url: 'www.kpmg.com.my',
    contact_info: '+603-7721 3388',
    recommended_by: 'Lim Siew Ling',
    reviews: [
      { reviewer_name: 'Andrew Chong', rating: 5, review_text: 'Excellent audit team with deep industry knowledge. Their tax advisory has saved us significantly.' },
      { reviewer_name: 'Grace Tan', rating: 4, review_text: 'Professional service and good technical expertise. Response time could be faster during peak season.' },
    ],
  },
  {
    name: 'PwC Malaysia',
    category_slug: 'accounting-tax',
    description: 'PwC started operations in Malaysia in 1900 and has over 3,000 employees across 7 offices including Kuala Lumpur, Penang, and Johor Bahru. They provide comprehensive solutions including audit & assurance, tax, consulting, strategy consulting, and legal services.',
    address: 'Level 10, 1 Sentral, Jalan Rakyat, Kuala Lumpur Sentral, 50706 Kuala Lumpur',
    website_url: 'www.pwc.com/my',
    contact_info: '+603-2173 1188',
    recommended_by: 'Wong Mei Ling',
    reviews: [
      { reviewer_name: 'Daniel Tan', rating: 5, review_text: 'Outstanding advisory services. Their transfer pricing team is exceptional.' },
      { reviewer_name: 'Siti Aminah', rating: 5, review_text: 'Very thorough audit process. They identified risks we hadn\'t considered.' },
    ],
  },
  {
    name: 'Deloitte Malaysia',
    category_slug: 'accounting-tax',
    description: 'Deloitte Malaysia was established in 1968 and is headquartered in Kuala Lumpur with 8 offices nationwide and approximately 2,400 employees. Highly regarded for work with government bodies and corporate giants, particularly in financial services, energy, and healthcare sectors.',
    address: 'Level 16, Menara LGB, 1 Jalan Wan Kadir, Taman Tun Dr Ismail, 60000 Kuala Lumpur',
    website_url: 'www.deloitte.com/my',
    contact_info: '+603-7610 8888',
    recommended_by: 'Raj Kumar',
    reviews: [
      { reviewer_name: 'Michelle Lee', rating: 4, review_text: 'Great consulting practice. They helped us with digital transformation strategy.' },
    ],
  },

  // ===== MEDICAL SPECIALISTS =====
  {
    name: 'Sunway Medical Centre',
    category_slug: 'medical-specialists',
    description: 'Ranked 193rd among World\'s Best Hospitals 2025 by Newsweek - the top-ranked hospital in Malaysia. A leading private tertiary medical centre with over 2,600 healthcare professionals, offering comprehensive medical services including advanced medical technologies for outpatient and inpatient care, and 24-hour emergency services.',
    address: '5, Jalan Lagoon Selatan, Bandar Sunway, 47500 Subang Jaya, Selangor',
    website_url: 'www.sunwaymedical.com',
    contact_info: '+603-7491 9191',
    recommended_by: 'Dr. James Ooi',
    reviews: [
      { reviewer_name: 'Linda Chew', rating: 5, review_text: 'World-class facilities and caring staff. My surgery went smoothly with excellent follow-up care.' },
      { reviewer_name: 'Eric Tan', rating: 5, review_text: 'Best hospital experience in Malaysia. Clean, efficient, and the doctors are top-notch.' },
      { reviewer_name: 'Farah Ahmad', rating: 4, review_text: 'Good overall service. The specialists are excellent though parking can be challenging.' },
    ],
  },
  {
    name: 'Gleneagles Hospital Kuala Lumpur',
    category_slug: 'medical-specialists',
    description: 'Ranked 204th among World\'s Best Hospitals 2025 by Newsweek. Located in Jalan Ampang, Gleneagles has been providing trusted healthcare since 1996. They combine advanced medical technology with a compassionate, highly skilled medical team across multiple specialties.',
    address: '286 & 288, Jalan Ampang, 50450 Kuala Lumpur',
    website_url: 'gleneagles.com.my/kuala-lumpur',
    contact_info: '+603-4141 3000',
    recommended_by: 'Dr. Lisa Wong',
    reviews: [
      { reviewer_name: 'Peter Lau', rating: 5, review_text: 'Excellent cardiac care centre. The cardiologists here are among the best in SEA.' },
      { reviewer_name: 'Anna Yap', rating: 5, review_text: 'Had my knee replacement here. Fantastic orthopedic team and rehabilitation services.' },
    ],
  },
  {
    name: 'Prince Court Medical Centre',
    category_slug: 'medical-specialists',
    description: 'A premier tertiary hospital known for its spacious ambience and sophistication. PCMC has set the benchmark for premium family-centric healthcare facilities with 277 single beds and 147 specialists across 35+ specialties and subspecialties.',
    address: '39, Jalan Kia Peng, 50450 Kuala Lumpur',
    website_url: 'www.princecourt.com',
    contact_info: '+603-2160 0000',
    recommended_by: 'Dato\' Ahmad Shah',
    reviews: [
      { reviewer_name: 'Susan Tan', rating: 5, review_text: 'Luxurious facilities with hotel-like service. The VIP suites are exceptional.' },
      { reviewer_name: 'James Ong', rating: 4, review_text: 'Premium pricing but excellent care. Great for international patients.' },
    ],
  },

  // ===== DENTAL SERVICES =====
  {
    name: 'White Dental Group',
    category_slug: 'dental-services',
    description: 'One of Malaysia\'s most established dental clinic chains with multiple locations across Klang Valley. Offers comprehensive dental treatments from general dentistry to cosmetic procedures, orthodontics, and dental implants. Known for modern equipment and comfortable patient experience.',
    address: 'Lot 1-05 & 1-06, Block A, Jaya One, 72A Jalan Universiti, 46200 Petaling Jaya',
    website_url: 'www.whitedental.com.my',
    contact_info: '+603-7932 1521',
    recommended_by: 'Jenny Lim',
    reviews: [
      { reviewer_name: 'Karen Wong', rating: 5, review_text: 'Got my Invisalign here. The orthodontist was very thorough and results were perfect!' },
      { reviewer_name: 'David Tan', rating: 4, review_text: 'Good dental clinic. Professional service and clean environment.' },
    ],
  },
  {
    name: 'Beverly Wilshire Dental Centre',
    category_slug: 'dental-services',
    description: 'Premium dental centre located at Beverly Wilshire Medical Centre, offering advanced dental care including smile makeovers, dental implants, veneers, and full mouth rehabilitation. Features state-of-the-art technology and experienced specialists.',
    address: 'Level 6, Beverly Wilshire Medical Centre, Jalan Bukit Bintang, 55100 Kuala Lumpur',
    website_url: 'www.beverlywilshiredental.com',
    contact_info: '+603-2118 2888',
    recommended_by: 'Amanda Chen',
    reviews: [
      { reviewer_name: 'Michelle Tan', rating: 5, review_text: 'Had my dental veneers done here. Amazing results - my smile has never looked better!' },
    ],
  },

  // ===== REAL ESTATE SALES =====
  {
    name: 'IQI Global',
    category_slug: 'real-estate-sales',
    description: 'Malaysia\'s No. 1 Agency with the most Real Estate Negotiators. IQI has 23 branches in Malaysia and over 60,000 agents across 30+ countries. They assist developers with marketing and selling properties, guide individuals in buying and selling, and offer property management and interior design services.',
    address: 'Level 8, Mercu 3, KL Eco City, No. 3, Jalan Bangsar, 59200 Kuala Lumpur',
    website_url: 'www.iqiglobal.com',
    contact_info: '+603-2201 2272',
    recommended_by: 'Alex Tan',
    reviews: [
      { reviewer_name: 'Steven Lee', rating: 5, review_text: 'Great experience buying my first property through IQI. Agent was very knowledgeable about the market.' },
      { reviewer_name: 'Rachel Lim', rating: 4, review_text: 'Good service and extensive property listings. Helped us find our dream home.' },
    ],
  },
  {
    name: 'Rahim & Co International',
    category_slug: 'real-estate-sales',
    description: 'One of the oldest and most established real estate consultancy firms in Malaysia, founded in 1976 by Tan Sri Abdul Rahim Abdul Rahman. With 20+ offices nationwide and around 500 staff, they offer property valuations, consultancy, research, estate agency, and property management services.',
    address: 'Level 9, Symphony House, Pusat Dagangan Dana 1, Jalan PJU 1A/46, 47301 Petaling Jaya',
    website_url: 'www.rahim-co.com',
    contact_info: '+603-7842 3838',
    recommended_by: 'Datuk Wong KC',
    reviews: [
      { reviewer_name: 'Henry Lau', rating: 5, review_text: 'The gold standard for property valuation in Malaysia. Very thorough and professional reports.' },
      { reviewer_name: 'Mei Ling Tan', rating: 4, review_text: 'Excellent market research insights. Helped us make informed investment decisions.' },
    ],
  },
  {
    name: 'PropNex Malaysia',
    category_slug: 'real-estate-sales',
    description: 'A branch of PropNex Singapore since 2018, rapidly expanding with around 1,200 real estate agents. Prioritizes leadership development and offers all-inclusive brokerage services including business strategies, consultation, training, marketing support, and technological innovations.',
    address: 'Level 15, Menara Ken TTDI, 37 Jalan Burhanuddin Helmi, Taman Tun Dr Ismail, 60000 Kuala Lumpur',
    website_url: 'www.propnex.com.my',
    contact_info: '+603-7733 1988',
    recommended_by: 'Richard Ong',
    reviews: [
      { reviewer_name: 'Jason Tan', rating: 4, review_text: 'Professional agents with good knowledge of TTDI and surrounding areas.' },
    ],
  },

  // ===== RENOVATION & FIT-OUT =====
  {
    name: 'ID.WORKS Design Studio',
    category_slug: 'renovation-fitout',
    description: 'Award-winning interior design and renovation firm specializing in residential and commercial projects. Known for innovative designs, quality craftsmanship, and timely project delivery. Portfolio includes luxury condominiums, landed properties, and office spaces.',
    address: '51-1, Jalan PJU 5/20D, The Strand, Kota Damansara, 47810 Petaling Jaya',
    website_url: 'www.idworksdesign.com',
    contact_info: '+603-6142 1688',
    recommended_by: 'Christine Yap',
    reviews: [
      { reviewer_name: 'Kevin Lee', rating: 5, review_text: 'Transformed our old condo into a modern masterpiece. Great attention to detail and met all deadlines.' },
      { reviewer_name: 'Emma Tan', rating: 5, review_text: 'Professional team from design to completion. Highly recommend for quality renovations.' },
    ],
  },
  {
    name: 'Blox Interior Architecture',
    category_slug: 'renovation-fitout',
    description: 'Boutique interior design and renovation company focusing on contemporary residential and commercial spaces. Known for space optimization, modern aesthetics, and sustainable design practices. Offers turnkey solutions from concept to completion.',
    address: 'A-3-2, Tropicana Avenue, Persiaran Tropicana, 47410 Petaling Jaya',
    website_url: 'www.bloxinterior.com',
    contact_info: '+6016-222 8866',
    recommended_by: 'William Chong',
    reviews: [
      { reviewer_name: 'Sophia Wong', rating: 4, review_text: 'Creative designs and good project management. Minor delays but overall satisfied with the result.' },
    ],
  },

  // ===== INTERIOR DESIGN =====
  {
    name: 'Pocket Square Interior Design',
    category_slug: 'interior-design',
    description: 'Premium interior design firm specializing in high-end residential projects. Known for timeless elegance, attention to detail, and personalized service. Featured in multiple design publications for their sophisticated approach to luxury interiors.',
    address: 'Suite 12-01, Level 12, Menara Hap Seng 2, Plaza Hap Seng, Jalan P. Ramlee, 50250 Kuala Lumpur',
    website_url: 'www.pocketsquare.com.my',
    contact_info: '+603-2022 1280',
    recommended_by: 'Datin Lisa Ng',
    reviews: [
      { reviewer_name: 'Angela Lim', rating: 5, review_text: 'Impeccable taste and flawless execution. Our bungalow looks like it\'s straight out of a magazine.' },
      { reviewer_name: 'Marcus Tan', rating: 5, review_text: 'Worth every sen. The designer understood exactly what we wanted and exceeded expectations.' },
    ],
  },

  // ===== RESTAURANTS & CATERING =====
  {
    name: 'Dewakan',
    category_slug: 'restaurants-catering',
    description: 'A modern restaurant that highlights Malaysia\'s local produce in thoughtful, ever-evolving tasting menus. The team creates meaningful connections between diners and the region\'s diverse culture through innovative cuisine. Multiple awards including Asia\'s 50 Best Restaurants.',
    address: 'Level 48, The LINC KL, 360 Jalan Tun Razak, 50400 Kuala Lumpur',
    website_url: 'www.dewakan.my',
    contact_info: '+603-2181 2888',
    recommended_by: 'Chef Raymond Wong',
    reviews: [
      { reviewer_name: 'Food Critic Tony', rating: 5, review_text: 'A culinary journey through Malaysia. Chef Darren Teoh is a genius. World-class dining experience.' },
      { reviewer_name: 'Sarah Koh', rating: 5, review_text: 'The best fine dining in KL. Each course tells a story about Malaysian ingredients.' },
    ],
  },
  {
    name: 'Beta KL',
    category_slug: 'restaurants-catering',
    description: 'Beta KL highlights Malaysian heritage by using local ingredients in modern ways. Offering a distinct perspective on familiar flavors while staying true to regional roots. Perfect for business dinners and special occasions with contemporary Malaysian cuisine.',
    address: '163 Fraser Place, 10 Jalan Perak, 50450 Kuala Lumpur',
    website_url: 'www.betakl.com',
    contact_info: '+603-2181 2990',
    recommended_by: 'Emily Tan',
    reviews: [
      { reviewer_name: 'Jason Yeo', rating: 5, review_text: 'Modern Malaysian cuisine at its finest. The bar program is equally impressive.' },
      { reviewer_name: 'Linda Wong', rating: 4, review_text: 'Great food and ambiance. Perfect for impressing business clients.' },
    ],
  },
  {
    name: 'Teaffani Catering',
    category_slug: 'restaurants-catering',
    description: 'Known for high-class banquet services, specializing in Halal Chinese banquets to Western plated services. Particularly well-regarded for corporate events, private functions, and large-scale catering. Experience with major corporate clients and luxury venues.',
    address: '48, Jalan PJS 11/7, Bandar Sunway, 47500 Subang Jaya',
    website_url: 'www.teaffani.com',
    contact_info: '+603-5638 8688',
    recommended_by: 'Event Planner Amy',
    reviews: [
      { reviewer_name: 'Corporate Events Sdn Bhd', rating: 5, review_text: 'Our go-to caterer for all corporate events. Consistent quality and excellent presentation.' },
    ],
  },

  // ===== HOTELS & VENUES =====
  {
    name: 'Mandarin Oriental Kuala Lumpur',
    category_slug: 'hotels-venues',
    description: 'A perennial favorite situated between KLCC Park and the Petronas Towers. Features 643 rooms and 51 chic apartments, the city\'s largest club lounge, an award-winning spa, and the best outdoor rooftop infinity pool in KL. Eight restaurants and lounges including acclaimed Lai Po Heen.',
    address: 'Kuala Lumpur City Centre, 50088 Kuala Lumpur',
    website_url: 'www.mandarinoriental.com/kuala-lumpur',
    contact_info: '+603-2380 8888',
    recommended_by: 'Dato\' Richard Tan',
    reviews: [
      { reviewer_name: 'Luxury Traveler', rating: 5, review_text: 'The epitome of luxury in KL. KLCC views, impeccable service, and the spa is world-class.' },
      { reviewer_name: 'Business Executive', rating: 5, review_text: 'My home away from home in KL. The club lounge is outstanding for business entertaining.' },
    ],
  },
  {
    name: 'The Ritz-Carlton Kuala Lumpur',
    category_slug: 'hotels-venues',
    description: 'A timeless symbol of elegance in the heart of the Golden Triangle district. Classic European charm with marble-clad lobbies, crystal chandeliers, and polished wood accents. Features award-winning Li Yen Cantonese restaurant and The Library for fine dining.',
    address: '168 Jalan Imbi, 55100 Kuala Lumpur',
    website_url: 'www.ritzcarlton.com/kualalumpur',
    contact_info: '+603-2142 8000',
    recommended_by: 'Caroline Wong',
    reviews: [
      { reviewer_name: 'Wedding Planner', rating: 5, review_text: 'Perfect venue for elegant weddings. The ballroom is stunning and service is impeccable.' },
      { reviewer_name: 'Anthony Lim', rating: 5, review_text: 'Li Yen serves the best dim sum in KL. The hotel maintains exceptional standards.' },
    ],
  },
  {
    name: 'Four Seasons Hotel Kuala Lumpur',
    category_slug: 'hotels-venues',
    description: 'The newest and most luxurious hotel in KL\'s city centre, featuring 209 rooms including 11 suites with showstopping views from the 8th-18th floors. Yun House offers fine Cantonese cuisine, while the Tiffany & Co. afternoon tea is a signature experience.',
    address: '145, Jalan Ampang, 50450 Kuala Lumpur',
    website_url: 'www.fourseasons.com/kualalumpur',
    contact_info: '+603-2382 8888',
    recommended_by: 'Travel Editor Jane',
    reviews: [
      { reviewer_name: 'Luxury Enthusiast', rating: 5, review_text: 'Four Seasons legendary service delivered perfectly. The spa and pool are exceptional.' },
      { reviewer_name: 'Food Blogger KL', rating: 5, review_text: 'Yun House is incredible. Best Cantonese fine dining with stunning KLCC views.' },
    ],
  },

  // ===== IT SERVICES =====
  {
    name: 'VeecoTech',
    category_slug: 'it-services',
    description: 'One of Malaysia\'s premier homegrown software development companies, founded in 2012 in Kuala Lumpur. Over 100 skilled professionals known for combining technical excellence with deep understanding of Asian business dynamics. Expertise in mobile apps, web development, and enterprise solutions.',
    address: 'Unit 25-7, Tower A, The Vertical Business Suite, Avenue 3, Bangsar South, 59200 Kuala Lumpur',
    website_url: 'www.veecotech.com.my',
    contact_info: '+603-2242 2260',
    recommended_by: 'CTO Mark Lim',
    reviews: [
      { reviewer_name: 'Startup Founder', rating: 5, review_text: 'Built our entire mobile platform. Great technical skills and they truly understand startups.' },
      { reviewer_name: 'E-commerce Director', rating: 4, review_text: 'Solid development team. Good communication and delivered on time.' },
    ],
  },
  {
    name: 'VADS Berhad',
    category_slug: 'it-services',
    description: 'The first MSC status company in East Malaysia, providing managed ICT services and outsourcing services from Kuala Lumpur. A TM subsidiary offering cloud services, data center solutions, cybersecurity, and digital transformation services to enterprise clients.',
    address: 'Level 6, Tower 3, Avenue 5, Bangsar South, No. 8 Jalan Kerinchi, 59200 Kuala Lumpur',
    website_url: 'www.vads.com.my',
    contact_info: '+603-2280 3300',
    recommended_by: 'Enterprise IT Director',
    reviews: [
      { reviewer_name: 'Bank IT Head', rating: 4, review_text: 'Reliable managed services provider. Good for enterprise-level IT infrastructure.' },
    ],
  },
  {
    name: 'Adventus',
    category_slug: 'it-services',
    description: 'Established in 2005, Adventus specializes in providing comprehensive IT products and services. They help businesses achieve more efficient workflows and have served major clients including Deloitte, Heineken, and KPMG. Strong in enterprise solutions and digital workplace services.',
    address: 'Menara Southpoint, Mid Valley City, Lingkaran Syed Putra, 59200 Kuala Lumpur',
    website_url: 'www.adventus.com',
    contact_info: '+603-2282 7887',
    recommended_by: 'IT Manager Kevin',
    reviews: [
      { reviewer_name: 'Operations Director', rating: 5, review_text: 'Transformed our office IT infrastructure. Excellent service and support.' },
    ],
  },

  // ===== MARKETING & ADVERTISING =====
  {
    name: 'Publicis Groupe Malaysia',
    category_slug: 'marketing-advertising',
    description: 'Part of the global Publicis Groupe network, offering integrated marketing communications, digital marketing, creative services, and media planning. Home to agencies like Leo Burnett, Saatchi & Saatchi, and Publicis Malaysia. Strong portfolio of major multinational and local brands.',
    address: 'Level 18, The Gardens North Tower, Mid Valley City, 59200 Kuala Lumpur',
    website_url: 'www.publicisgroupe.com',
    contact_info: '+603-2296 9800',
    recommended_by: 'CMO Patricia',
    reviews: [
      { reviewer_name: 'Brand Manager', rating: 5, review_text: 'Creative powerhouse. They took our brand campaign to a whole new level.' },
      { reviewer_name: 'Marketing Director', rating: 4, review_text: 'Strong creative capabilities and good strategic thinking. Premium pricing but worth it.' },
    ],
  },
  {
    name: 'Ogilvy Malaysia',
    category_slug: 'marketing-advertising',
    description: 'Legendary advertising agency known for iconic brand building. Offers advertising, PR, digital marketing, and customer engagement services. Strong heritage in creating memorable campaigns with deep understanding of Malaysian consumer behavior.',
    address: 'Level 23, Axiata Tower, No. 9, Jalan Stesen Sentral 5, KL Sentral, 50470 Kuala Lumpur',
    website_url: 'www.ogilvy.com/my',
    contact_info: '+603-2303 1700',
    recommended_by: 'Brand Strategist Alan',
    reviews: [
      { reviewer_name: 'CEO Consumer Brand', rating: 5, review_text: 'Created our award-winning Raya campaign. They truly understand Malaysian culture.' },
    ],
  },

  // ===== HR & RECRUITMENT =====
  {
    name: 'Randstad Malaysia',
    category_slug: 'hr-recruitment',
    description: 'Award-winning recruitment agency - Best Recruitment Agency Malaysia by APAC Insider 2022. Specializes in IT, construction, healthcare, accounting & finance, banking, manufacturing, and technology sectors. Blends technology with human-focused staffing solutions.',
    address: 'Level 25, Menara 3 Petronas, Persiaran KLCC, 50088 Kuala Lumpur',
    website_url: 'www.randstad.com.my',
    contact_info: '+603-2036 3388',
    recommended_by: 'HR Director Susan',
    reviews: [
      { reviewer_name: 'Hiring Manager', rating: 5, review_text: 'They found us excellent candidates fast. Great understanding of our tech requirements.' },
      { reviewer_name: 'Finance Director', rating: 5, review_text: 'Best recruitment experience. Quality candidates and professional service throughout.' },
    ],
  },
  {
    name: 'Hays Malaysia',
    category_slug: 'hr-recruitment',
    description: 'Leading specialized recruiter with 50+ years of global experience, established in Malaysia since 2012. Expertly connects professionals with ideal jobs across industries from IT to finance. Offers temporary, permanent and contractual recruitment services.',
    address: 'Level 23, Menara 3 Petronas, Persiaran KLCC, 50088 Kuala Lumpur',
    website_url: 'www.hays.com.my',
    contact_info: '+603-2786 8600',
    recommended_by: 'Talent Acquisition Lead',
    reviews: [
      { reviewer_name: 'IT Department Head', rating: 4, review_text: 'Good specialized recruitment for senior tech roles. Professional consultants.' },
    ],
  },
  {
    name: 'JAC Recruitment Malaysia',
    category_slug: 'hr-recruitment',
    description: 'Founded in London in 1975, headquartered in Japan, operating in Malaysia since 1994. Provides recruitment and placement service, professional consultancy and career change support. Strong in executive search and specialized professional recruitment.',
    address: 'Level 25, GTower, 199 Jalan Tun Razak, 50400 Kuala Lumpur',
    website_url: 'www.jac-recruitment.com.my',
    contact_info: '+603-2168 8700',
    recommended_by: 'Managing Director',
    reviews: [
      { reviewer_name: 'Japanese MNC HR', rating: 5, review_text: 'Excellent for Japanese company recruitment needs. Bilingual consultants are very helpful.' },
    ],
  },

  // ===== SCHOOLS & EDUCATION =====
  {
    name: 'The International School of Kuala Lumpur (ISKL)',
    category_slug: 'schools-education',
    description: 'Malaysia\'s first American curriculum international school, established in the 1960s. One of Malaysia\'s longest-running IB World Schools, providing the prestigious International Baccalaureate Diploma Programme since 1989. Outstanding track record of university placements worldwide.',
    address: '2, Lorong Kelab Polo Di Raja, Ampang Hilir, 55000 Kuala Lumpur',
    website_url: 'www.iskl.edu.my',
    contact_info: '+603-4259 5600',
    recommended_by: 'Expat Parent David',
    reviews: [
      { reviewer_name: 'Parent of Alumni', rating: 5, review_text: 'Our children received world-class education. Both are now at top US universities.' },
      { reviewer_name: 'Corporate Expat', rating: 5, review_text: 'Best international school in KL. Strong community and excellent facilities.' },
    ],
  },
  {
    name: 'Garden International School',
    category_slug: 'schools-education',
    description: 'One of the most experienced (founded 1951) and prestigious private schools in Malaysia, offering British-based education for students aged 3-18. 99% of graduates go on to study at their first or second choice university, with many at Oxbridge and Ivy League colleges.',
    address: '16, Jalan Kiara 3, Mont Kiara, 50480 Kuala Lumpur',
    website_url: 'www.gardenschool.edu.my',
    contact_info: '+603-6209 6888',
    recommended_by: 'Education Consultant',
    reviews: [
      { reviewer_name: 'British Expat Parent', rating: 5, review_text: 'Excellent British curriculum. Our daughter got into Oxford from here.' },
      { reviewer_name: 'Malaysian Parent', rating: 5, review_text: 'High academic standards with great extracurricular activities. Worth the investment.' },
    ],
  },
  {
    name: 'Fairview International School',
    category_slug: 'schools-education',
    description: 'Malaysia\'s best-rated IB school, ranked among the top 100 IB schools worldwide since 2020. Multiple campuses across Malaysia including Kuala Lumpur, Subang Jaya, Johor Bahru, Penang, and Ipoh. The KL flagship campus is the oldest and largest IB school in Malaysia since 1978.',
    address: 'Jalan Lembah Fairview, Off Jalan U-Thant, 55000 Kuala Lumpur',
    website_url: 'www.fairview.edu.my',
    contact_info: '+603-4253 0888',
    recommended_by: 'IB Coordinator',
    reviews: [
      { reviewer_name: 'Parent of IB Graduate', rating: 5, review_text: 'Outstanding IB programme. The teachers are dedicated and results speak for themselves.' },
    ],
  },

  // ===== INSURANCE =====
  {
    name: 'Great Eastern Life Assurance',
    category_slug: 'insurance',
    description: 'The largest insurance company in Malaysia with around 22,000 agents nationwide. Founded in 1892, one of the world\'s oldest life insurance companies. Deep roots in Southeast Asia with products tailored for the region\'s unique needs.',
    address: 'Menara Great Eastern, 303 Jalan Ampang, 50450 Kuala Lumpur',
    website_url: 'www.greateasternlife.com/my',
    contact_info: '+603-4259 8888',
    recommended_by: 'Financial Planner Lisa',
    reviews: [
      { reviewer_name: 'Policy Holder 20 Years', rating: 5, review_text: 'Reliable company with good claim processing. My family has been with them for decades.' },
      { reviewer_name: 'Young Professional', rating: 4, review_text: 'Good range of products. Medical card coverage is comprehensive.' },
    ],
  },
  {
    name: 'Prudential Assurance Malaysia',
    category_slug: 'insurance',
    description: 'Leading insurance provider established in Malaysia since 1924 with over 90 years of presence in Asia. 45 branches nationwide with more than 1,700 employees. Part of the UK-based Prudential group, known for innovative insurance solutions.',
    address: 'Level 20, Menara Prudential, 10 Jalan Sultan Ismail, 50250 Kuala Lumpur',
    website_url: 'www.prudential.com.my',
    contact_info: '+603-2116 8888',
    recommended_by: 'Insurance Agent Wong',
    reviews: [
      { reviewer_name: 'Long-term Customer', rating: 5, review_text: 'Excellent investment-linked products. Good returns and comprehensive protection.' },
    ],
  },
  {
    name: 'AIA Bhd',
    category_slug: 'insurance',
    description: 'Leading insurer in Malaysia since 1948. Part of the largest independent pan-Asian life insurance group. Offers comprehensive insurance including Life Protection, Health, Personal Accident, Employee Benefits, General Insurance, and Family Takaful products. Over 3 million customers nationwide.',
    address: 'Menara AIA, 99 Jalan Ampang, 50450 Kuala Lumpur',
    website_url: 'www.aia.com.my',
    contact_info: '+603-2056 1111',
    recommended_by: 'Corporate HR Manager',
    reviews: [
      { reviewer_name: 'Corporate Client', rating: 5, review_text: 'Best employee benefits provider. Their health coverage is top-notch.' },
      { reviewer_name: 'Individual Policy Holder', rating: 4, review_text: 'Good products and strong brand. Claim process is straightforward.' },
    ],
  },

  // ===== BANKING & FINANCE =====
  {
    name: 'Maybank',
    category_slug: 'banking-finance',
    description: 'Malaysia\'s largest bank by total assets (RM947.8 billion) and market capitalization. Founded in 1960, provides a wide range of financial services through an extensive network across Southeast Asia. Recently ranked top bank in Malaysia in a global survey.',
    address: 'Menara Maybank, 100 Jalan Tun Perak, 50050 Kuala Lumpur',
    website_url: 'www.maybank.com.my',
    contact_info: '1300-88-6688',
    recommended_by: 'Business Banking Client',
    reviews: [
      { reviewer_name: 'SME Owner', rating: 5, review_text: 'Best SME banking support. Their business account services are comprehensive.' },
      { reviewer_name: 'Personal Banking', rating: 4, review_text: 'Extensive branch network and good online banking. Occasional queue at branches.' },
    ],
  },
  {
    name: 'CIMB Bank',
    category_slug: 'banking-finance',
    description: 'Second largest bank in Malaysia with RM733.6 billion in assets. One of the largest investment banks in Asia and one of the largest Islamic banks in the world. Extensive regional presence with over 1,000 branches across ASEAN countries.',
    address: 'Menara CIMB, Jalan Stesen Sentral 2, KL Sentral, 50470 Kuala Lumpur',
    website_url: 'www.cimb.com.my',
    contact_info: '+603-6204 7788',
    recommended_by: 'Investment Banker',
    reviews: [
      { reviewer_name: 'Regional Business Owner', rating: 5, review_text: 'Best for ASEAN banking needs. Their international ATM network is unmatched.' },
      { reviewer_name: 'Young Professional', rating: 4, review_text: 'Good digital banking features. CIMB Clicks and e-wallet integration work well.' },
    ],
  },
  {
    name: 'Public Bank',
    category_slug: 'banking-finance',
    description: 'Third largest bank in Malaysia with RM493.3 billion in assets. Known for financial prudence and strong shareholder returns. Particularly popular for residential property financing and passenger vehicle financing. Presence in Hong Kong, China, Cambodia, Vietnam, Laos, and Sri Lanka.',
    address: 'Menara Public Bank, 146 Jalan Ampang, 50450 Kuala Lumpur',
    website_url: 'www.publicbank.com.my',
    contact_info: '+603-2176 6000',
    recommended_by: 'Property Investor',
    reviews: [
      { reviewer_name: 'Home Buyer', rating: 5, review_text: 'Best mortgage rates and smooth loan processing. Highly recommended for property financing.' },
      { reviewer_name: 'Car Buyer', rating: 5, review_text: 'Got my car loan through Public Bank. Competitive rates and fast approval.' },
    ],
  },
];

async function seedRecommendations() {
  console.log('Starting recommendation seed...');

  if (!process.env.DATABASE_URL) {
    console.error('Error: DATABASE_URL environment variable is required');
    console.error('Usage: DATABASE_URL="postgres://..." npx tsx scripts/seed-recommendations.ts');
    process.exit(1);
  }

  const sql = postgres(process.env.DATABASE_URL);

  try {
    // Get category lookup map
    console.log('\n1. Fetching categories...');
    const categoryResult = await sql`SELECT id, slug FROM categories`;
    const categoryMap: Record<string, number> = {};
    for (const row of categoryResult) {
      categoryMap[row.slug] = row.id;
    }
    console.log(`   Found ${Object.keys(categoryMap).length} categories`);

    // Clear existing recommendations and reviews (optional - comment out to append)
    console.log('\n2. Clearing existing recommendations and reviews...');
    await sql`DELETE FROM reviews`;
    await sql`DELETE FROM recommendations`;
    console.log('   Cleared existing data');

    // Insert recommendations
    console.log('\n3. Inserting recommendations...');
    let recCount = 0;
    let reviewCount = 0;

    for (const business of businesses) {
      const categoryId = categoryMap[business.category_slug];
      if (!categoryId) {
        console.warn(`   Warning: Category '${business.category_slug}' not found, skipping ${business.name}`);
        continue;
      }

      // Insert recommendation
      const recResult = await sql`
        INSERT INTO recommendations (
          name, description, category_id, address, website_url, contact_info, recommended_by,
          average_rating, review_count
        )
        VALUES (
          ${business.name},
          ${business.description},
          ${categoryId},
          ${business.address},
          ${business.website_url},
          ${business.contact_info},
          ${business.recommended_by},
          0,
          0
        )
        RETURNING id
      `;
      const recId = recResult[0].id;
      recCount++;

      // Insert reviews
      if (business.reviews && business.reviews.length > 0) {
        for (const review of business.reviews) {
          await sql`
            INSERT INTO reviews (recommendation_id, reviewer_name, rating, review_text)
            VALUES (${recId}, ${review.reviewer_name}, ${review.rating}, ${review.review_text})
          `;
          reviewCount++;
        }

        // Update average rating
        const avgResult = await sql`
          SELECT
            COALESCE(AVG(rating), 0) as avg_rating,
            COUNT(*) as review_count
          FROM reviews
          WHERE recommendation_id = ${recId}
        `;

        await sql`
          UPDATE recommendations
          SET average_rating = ${avgResult[0].avg_rating}, review_count = ${avgResult[0].review_count}
          WHERE id = ${recId}
        `;
      }

      console.log(`   Added: ${business.name} (${business.reviews.length} reviews)`);
    }

    console.log(`\n4. Summary:`);
    console.log(`   Total recommendations: ${recCount}`);
    console.log(`   Total reviews: ${reviewCount}`);

    // Verify data
    console.log('\n5. Verifying data...');
    const verifyRecs = await sql`SELECT COUNT(*) as count FROM recommendations`;
    const verifyRevs = await sql`SELECT COUNT(*) as count FROM reviews`;
    console.log(`   Recommendations in database: ${verifyRecs[0].count}`);
    console.log(`   Reviews in database: ${verifyRevs[0].count}`);

    console.log('\n✅ Recommendation seeding complete!');

  } finally {
    await sql.end();
  }
}

seedRecommendations().catch(console.error);
