// Property Types
export interface Property {
  id: string;
  slug: string;
  title: string;
  description: string;
  description_es?: string;
  price: number;
  price_negotiable: boolean;
  property_type: PropertyType;
  listing_type: ListingType;
  status: PropertyStatus;
  bedrooms: number;
  bathrooms: number;
  area_sqm: number | null;
  lot_size_sqm: number | null;
  year_built: number | null;
  parking_spaces: number;
  address: string;
  city: string;
  state: string;
  zip_code: string;
  country: string;
  latitude: number | null;
  longitude: number | null;
  location_display: string;
  features: string[];
  agent: Agent;
  images: PropertyImage[];
  main_image: string | null;
  is_featured: boolean;
  is_new_construction: boolean;
  is_beachfront: boolean;
  is_investment_opportunity: boolean;
  is_saved?: boolean;
  view_count: number;
  created_at: string;
  updated_at: string;
}

export type PropertyType =
  | 'beach_apartment'
  | 'apartment'
  | 'house'
  | 'villa'
  | 'penthouse'
  | 'finca'
  | 'townhouse'
  | 'beach_house'
  | 'land'
  | 'commercial';

export type ListingType = 'sale' | 'rent';

export type PropertyStatus = 'draft' | 'active' | 'pending' | 'sold' | 'rented' | 'inactive';

export interface PropertyImage {
  id: string;
  image: string;
  thumbnail_url: string | null;
  large_url: string | null;
  caption: string;
  is_main: boolean;
  order: number;
}

// Agent Types
export interface Agent {
  id: string;
  full_name: string;
  avatar: string | null;
  avatar_url: string | null;
  company_name: string;
  bio: string;
  is_verified_agent: boolean;
}

export type AgentType = 'individual' | 'company';

export interface AgentListItem {
  id: number;
  slug: string;
  display_name: string;
  avatar: string | null;
  avatar_url: string | null;
  logo: string | null;
  agent_type: AgentType;
  company_name: string;
  is_verified_agent: boolean;
  location_display: string;
  active_listings_count: number;
  total_listings: number;
  total_sales: number;
}

export interface AgentProfile extends AgentListItem {
  first_name: string;
  last_name: string;
  full_name: string;
  license_number: string;
  bio: string;
  bio_es: string;
  website: string;
  founded_year: number | null;
  team_size: number;
  city: string;
  state: string;
  phone: string;
  whatsapp: string;
  instagram: string;
  facebook: string;
  linkedin: string;
  team_members: AgentListItem[];
  parent_company_info: {
    id: string;
    slug: string;
    display_name: string;
    logo: string | null;
    is_verified: boolean;
  } | null;
  created_at: string;
  properties: Property[];
}

// User Types
export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  full_name: string;
  phone: string;
  avatar: string | null;
  role: UserRole;
  company_name: string;
  license_number: string;
  bio: string;
  is_verified_agent: boolean;
  preferred_language: 'en' | 'es';
  created_at: string;
}

export type UserRole = 'admin' | 'agent' | 'buyer';

// Inquiry Types
export interface Inquiry {
  id: string;
  property: Property;
  full_name: string;
  email: string;
  phone: string;
  country: string;
  message: string;
  preferred_contact_method: ContactMethod;
  preferred_language: 'en' | 'es';
  budget_min: number | null;
  budget_max: number | null;
  status: InquiryStatus;
  internal_notes: string;
  notes: InquiryNote[];
  created_at: string;
  updated_at: string;
}

export type ContactMethod = 'email' | 'phone' | 'whatsapp';

export type InquiryStatus =
  | 'new'
  | 'contacted'
  | 'in_progress'
  | 'qualified'
  | 'closed'
  | 'spam';

export interface InquiryNote {
  id: string;
  content: string;
  author_name: string;
  created_at: string;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: {
    code?: string;
    message: string;
    details?: Record<string, string[]>;
  };
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  meta: {
    page: number;
    page_size: number;
    total_pages: number;
    total_count: number;
    has_next: boolean;
    has_previous: boolean;
  };
}

// Filter Types
export interface PropertyFilters {
  search?: string;
  property_type?: PropertyType;
  listing_type?: ListingType;
  city?: string;
  state?: string;
  min_price?: number;
  max_price?: number;
  min_bedrooms?: number;
  max_bedrooms?: number;
  min_bathrooms?: number;
  min_area?: number;
  max_area?: number;
  is_featured?: boolean;
  is_beachfront?: boolean;
  is_new_construction?: boolean;
  is_investment_opportunity?: boolean;
  ordering?: string;
  page?: number;
  page_size?: number;
}

// Form Types
export interface InquiryFormData {
  property: string;
  full_name: string;
  email: string;
  phone?: string;
  country?: string;
  message: string;
  preferred_contact_method: ContactMethod;
  preferred_language: 'en' | 'es';
  budget_min?: number;
  budget_max?: number;
}

export interface PropertyFormData {
  title: string;
  description: string;
  description_es?: string;
  price: number;
  price_negotiable?: boolean;
  property_type: PropertyType;
  listing_type: ListingType;
  status?: PropertyStatus;
  bedrooms: number;
  bathrooms: number;
  area_sqm?: number;
  lot_size_sqm?: number;
  year_built?: number;
  parking_spaces?: number;
  address: string;
  city: string;
  state: string;
  zip_code?: string;
  latitude?: number;
  longitude?: number;
  features?: string[];
  is_new_construction?: boolean;
  is_beachfront?: boolean;
  is_investment_opportunity?: boolean;
}
