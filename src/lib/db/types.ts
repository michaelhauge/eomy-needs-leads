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

export type SortOption = 'rating' | 'reviews' | 'newest' | 'name';
