import type {
  ApiResponse,
  PaginatedResponse,
  Property,
  PropertyFilters,
  InquiryFormData,
  User,
  AgentListItem,
  AgentProfile,
  ProjectListItem,
  ProjectDetail,
  ProjectFilters,
  SellableAsset,
  ProjectUpdateItem,
  BuyerContractListItem,
  BuyerContractDetail,
  PaymentScheduleItem,
} from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

class ApiClient {
  private baseUrl: string;
  private accessToken: string | null = null;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  setAccessToken(token: string | null) {
    this.accessToken = token;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (this.accessToken) {
      headers['Authorization'] = `Bearer ${this.accessToken}`;
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.error?.message || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  // Health check
  async healthCheck(): Promise<{ status: string }> {
    return this.request('/health/');
  }

  // Properties - Public
  async getProperties(
    filters: PropertyFilters = {}
  ): Promise<PaginatedResponse<Property>> {
    const params = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, String(value));
      }
    });

    const queryString = params.toString();
    return this.request(`/properties/${queryString ? `?${queryString}` : ''}`);
  }

  async getProperty(slug: string): Promise<ApiResponse<Property>> {
    return this.request(`/properties/${slug}/`);
  }

  async getFeaturedProperties(): Promise<ApiResponse<Property[]>> {
    return this.request('/properties/featured/');
  }

  async getCities(): Promise<ApiResponse<{ city: string; state: string; count: number }[]>> {
    return this.request('/properties/cities/');
  }

  // Properties - Agent
  async getAgentProperties(
    filters: PropertyFilters = {}
  ): Promise<PaginatedResponse<Property>> {
    const params = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, String(value));
      }
    });

    const queryString = params.toString();
    return this.request(`/agent/properties/${queryString ? `?${queryString}` : ''}`);
  }

  async createProperty(data: FormData): Promise<ApiResponse<Property>> {
    // For FormData, we need to handle headers separately to avoid Content-Type conflicts
    const url = `${this.baseUrl}/agent/properties/`;
    const headers: HeadersInit = {};

    if (this.accessToken) {
      headers['Authorization'] = `Bearer ${this.accessToken}`;
    }
    // Note: Do NOT set Content-Type for FormData - browser sets it with boundary

    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: data,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.error?.message || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  async updateProperty(id: string, data: Partial<Property>): Promise<ApiResponse<Property>> {
    return this.request(`/agent/properties/${id}/`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async deleteProperty(id: string): Promise<void> {
    return this.request(`/agent/properties/${id}/`, {
      method: 'DELETE',
    });
  }

  async uploadPropertyImage(propertyId: string, data: FormData): Promise<ApiResponse<any>> {
    const response = await fetch(`${this.baseUrl}/agent/properties/${propertyId}/upload_image/`, {
      method: 'POST',
      headers: this.accessToken ? { Authorization: `Bearer ${this.accessToken}` } : {},
      body: data,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.error?.message || 'Failed to upload image');
    }

    return response.json();
  }

  // Inquiries - Public
  async createInquiry(data: InquiryFormData): Promise<ApiResponse<{ id: string }>> {
    return this.request('/inquiries/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Inquiries - Agent
  async getAgentInquiries(filters: Record<string, any> = {}): Promise<PaginatedResponse<any>> {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, String(value));
      }
    });
    const queryString = params.toString();
    return this.request(`/agent/inquiries/${queryString ? `?${queryString}` : ''}`);
  }

  async getInquiryStats(): Promise<ApiResponse<Record<string, number>>> {
    return this.request('/agent/inquiries/stats/');
  }

  async updateInquiry(id: string, data: { status?: string; internal_notes?: string }): Promise<ApiResponse<any>> {
    return this.request(`/agent/inquiries/${id}/`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  // User
  async getCurrentUser(): Promise<ApiResponse<User>> {
    return this.request('/auth/me/');
  }

  async updateProfile(data: Partial<User>): Promise<ApiResponse<User>> {
    return this.request('/auth/me/', {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async becomeAgent(data: { agent_type: string; referred_by?: number }): Promise<ApiResponse<User>> {
    return this.request('/auth/become-agent/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getReferrers(): Promise<ApiResponse<{ id: number; name: string; email: string }[]>> {
    return this.request('/auth/referrers/');
  }

  // Saved Properties
  async getSavedProperties(): Promise<PaginatedResponse<{ property: Property }>> {
    return this.request('/saved-properties/');
  }

  async toggleSaveProperty(propertyId: string): Promise<ApiResponse<{ is_saved: boolean }>> {
    return this.request('/saved-properties/toggle/', {
      method: 'POST',
      body: JSON.stringify({ property_id: propertyId }),
    });
  }

  // Agents - Public
  async getAgents(filters: Record<string, any> = {}): Promise<ApiResponse<AgentListItem[]> & { meta?: any }> {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, String(value));
      }
    });
    const queryString = params.toString();
    return this.request(`/agents/${queryString ? `?${queryString}` : ''}`);
  }

  async getAgentProfile(slug: string): Promise<ApiResponse<AgentProfile>> {
    return this.request(`/agents/${slug}/`);
  }

  async getFeaturedAgents(): Promise<ApiResponse<AgentListItem[]>> {
    return this.request('/agents/featured/');
  }

  async getCompanyTeam(companySlug: string): Promise<ApiResponse<AgentListItem[]>> {
    return this.request(`/agents/${companySlug}/team/`);
  }

  // Projects - Public
  async getProjects(
    filters: ProjectFilters = {}
  ): Promise<PaginatedResponse<ProjectListItem>> {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, String(value));
      }
    });
    const queryString = params.toString();
    return this.request(`/projects/${queryString ? `?${queryString}` : ''}`);
  }

  async getProject(slug: string): Promise<ApiResponse<ProjectDetail>> {
    return this.request(`/projects/${slug}/`);
  }

  async getProjectAssets(
    slug: string,
    filters: Record<string, any> = {}
  ): Promise<PaginatedResponse<SellableAsset>> {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, String(value));
      }
    });
    const queryString = params.toString();
    return this.request(`/projects/${slug}/assets/${queryString ? `?${queryString}` : ''}`);
  }

  async getProjectUpdates(slug: string): Promise<PaginatedResponse<ProjectUpdateItem>> {
    return this.request(`/projects/${slug}/updates/`);
  }

  async getFeaturedProjects(): Promise<ApiResponse<ProjectListItem[]>> {
    return this.request('/projects/featured/');
  }

  // Projects - Buyer Contracts
  async getMyContracts(): Promise<PaginatedResponse<BuyerContractListItem>> {
    return this.request('/my/contracts/');
  }

  async getMyContract(id: string): Promise<ApiResponse<BuyerContractDetail>> {
    return this.request(`/my/contracts/${id}/`);
  }

  async getMyContractPayments(id: string): Promise<ApiResponse<PaymentScheduleItem[]>> {
    return this.request(`/my/contracts/${id}/payments/`);
  }

  // Projects - Admin
  async getAdminProjects(
    filters: ProjectFilters = {}
  ): Promise<PaginatedResponse<ProjectListItem>> {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, String(value));
      }
    });
    const queryString = params.toString();
    return this.request(`/admin/projects/${queryString ? `?${queryString}` : ''}`);
  }

  async createProject(data: Partial<ProjectDetail>): Promise<ApiResponse<ProjectDetail>> {
    return this.request('/admin/projects/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateProject(id: string, data: Partial<ProjectDetail>): Promise<ApiResponse<ProjectDetail>> {
    return this.request(`/admin/projects/${id}/`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async deleteProject(id: string): Promise<void> {
    return this.request(`/admin/projects/${id}/`, { method: 'DELETE' });
  }

  async transitionProjectStatus(id: string, action: string): Promise<ApiResponse<{ status: string }>> {
    return this.request(`/admin/projects/${id}/${action}/`, { method: 'POST' });
  }

  async getAdminAssets(projectId: string): Promise<PaginatedResponse<SellableAsset>> {
    return this.request(`/admin/projects/${projectId}/assets/`);
  }

  async createAsset(projectId: string, data: Partial<SellableAsset>): Promise<ApiResponse<SellableAsset>> {
    return this.request(`/admin/projects/${projectId}/assets/`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateAsset(projectId: string, assetId: string, data: Partial<SellableAsset>): Promise<ApiResponse<SellableAsset>> {
    return this.request(`/admin/projects/${projectId}/assets/${assetId}/`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async transitionAssetStatus(projectId: string, assetId: string, action: string): Promise<ApiResponse<{ status: string }>> {
    return this.request(`/admin/projects/${projectId}/assets/${assetId}/${action}/`, { method: 'POST' });
  }

  async getAdminContracts(projectId: string): Promise<PaginatedResponse<BuyerContractListItem>> {
    return this.request(`/admin/projects/${projectId}/contracts/`);
  }

  async createContract(projectId: string, data: Record<string, any>): Promise<ApiResponse<BuyerContractDetail>> {
    return this.request(`/admin/projects/${projectId}/contracts/`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async transitionContractStatus(projectId: string, contractId: string, action: string): Promise<ApiResponse<{ status: string }>> {
    return this.request(`/admin/projects/${projectId}/contracts/${contractId}/${action}/`, { method: 'POST' });
  }

  async getAdminPayments(projectId: string, contractId: string): Promise<PaginatedResponse<PaymentScheduleItem>> {
    return this.request(`/admin/projects/${projectId}/contracts/${contractId}/payments/`);
  }

  async createPayment(projectId: string, contractId: string, data: Partial<PaymentScheduleItem>): Promise<ApiResponse<PaymentScheduleItem>> {
    return this.request(`/admin/projects/${projectId}/contracts/${contractId}/payments/`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updatePayment(projectId: string, contractId: string, paymentId: string, data: Partial<PaymentScheduleItem>): Promise<ApiResponse<PaymentScheduleItem>> {
    return this.request(`/admin/projects/${projectId}/contracts/${contractId}/payments/${paymentId}/`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }
}

export const api = new ApiClient(API_URL);

// Utility function to format price
export function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

// Utility function to format area
export function formatArea(area: number | null): string {
  if (!area) return '-';
  return `${area.toLocaleString()} m²`;
}
