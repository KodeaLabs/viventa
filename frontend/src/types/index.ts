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

export type ListingType = 'sale';

export type PropertyStatus = 'draft' | 'active' | 'pending' | 'sold' | 'inactive';

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

export type UserRole = 'admin' | 'agent' | 'project_admin' | 'buyer';

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

// ==================== Projects Module ====================

export type ProjectStatus = 'draft' | 'presale' | 'under_construction' | 'delivered' | 'cancelled';

export interface ProjectListItem {
  id: string;
  slug: string;
  title: string;
  title_es?: string;
  developer_name: string;
  city: string;
  state: string;
  location_display: string;
  status: ProjectStatus;
  total_units: number;
  available_units: number;
  sold_units: number;
  price_range_min: number | null;
  price_range_max: number | null;
  delivery_date: string | null;
  cover_image_url: string | null;
  progress_percentage: number;
  is_featured: boolean;
  created_at: string;
}

export interface ProjectDetail extends ProjectListItem {
  description: string;
  description_es?: string;
  developer_logo: string | null;
  address: string;
  latitude: number | null;
  longitude: number | null;
  construction_start_date: string | null;
  amenities: string[];
  master_plan_url: string;
  brochure_url: string;
  video_url: string;
  cover_image: string | null;
  gallery_images: ProjectGalleryImage[];
  milestones: ProjectMilestone[];
  available_assets_count: number;
  updated_at: string;
}

export interface ProjectGalleryImage {
  id: string;
  image: string | null;
  image_url: string;
  caption: string;
  order: number;
}

export type AssetType = 'apartment' | 'parking' | 'storage' | 'commercial' | 'land_lot';
export type AssetStatus = 'available' | 'reserved' | 'sold' | 'delivered';

export interface SellableAsset {
  id: string;
  identifier: string;
  asset_type: AssetType;
  floor: number | null;
  area_sqm: number | null;
  bedrooms: number;
  bathrooms: number;
  price_usd: number;
  status: AssetStatus;
  floor_plan_url: string;
  features?: string[];
  project_title?: string;
  project_slug?: string;
  created_at?: string;
  updated_at?: string;
}

export type MilestoneStatus = 'pending' | 'in_progress' | 'completed' | 'delayed';

export interface ProjectMilestone {
  id: string;
  title: string;
  title_es?: string;
  description: string;
  description_es?: string;
  target_date: string | null;
  completed_date: string | null;
  percentage: number;
  status: MilestoneStatus;
  order: number;
}

export type ContractStatus = 'reserved' | 'signed' | 'active' | 'completed' | 'cancelled';

export interface BuyerContractListItem {
  id: string;
  asset_identifier: string;
  project_title: string;
  project_slug: string;
  buyer_email: string;
  buyer_name: string;
  contract_date: string | null;
  total_price: number;
  initial_payment: number;
  payment_plan_months: number;
  status: ContractStatus;
  created_at: string;
}

export interface BuyerContractDetail extends BuyerContractListItem {
  asset: SellableAsset;
  payments: PaymentScheduleItem[];
  notes: string;
  updated_at: string;
}

export type PaymentConcept = 'initial' | 'monthly' | 'milestone' | 'final' | 'other';
export type PaymentItemStatus = 'pending' | 'paid' | 'overdue' | 'waived';

export interface PaymentScheduleItem {
  id: string;
  due_date: string;
  amount_usd: number;
  concept: PaymentConcept;
  status: PaymentItemStatus;
  paid_date: string | null;
  payment_reference: string;
  notes: string;
}

export interface ProjectUpdateItem {
  id: string;
  title: string;
  title_es?: string;
  content?: string;
  content_es?: string;
  author_name: string;
  image: string | null;
  is_public: boolean;
  published_at: string | null;
  created_at: string;
}

export interface ProjectFilters {
  search?: string;
  status?: ProjectStatus;
  city?: string;
  state?: string;
  min_price?: number;
  max_price?: number;
  is_featured?: boolean;
  ordering?: string;
  page?: number;
  page_size?: number;
}
