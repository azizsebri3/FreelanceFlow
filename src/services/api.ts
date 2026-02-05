/* ==========================================================================
   API Service Layer
   Production-ready API service layer for data operations
   ========================================================================== */

import { FreelanceFlowError, parseApiError, withErrorHandling, withRetry } from '../utils/errorHandling';

// ==========================================================================
// API Configuration
// ==========================================================================

export interface ApiConfig {
  baseURL: string;
  timeout: number;
  retries: number;
  headers: Record<string, string>;
}

const DEFAULT_CONFIG: ApiConfig = {
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api',
  timeout: 10000,
  retries: 3,
  headers: {
    'Content-Type': 'application/json',
  },
};

// ==========================================================================
// HTTP Client Class
// ==========================================================================

class HttpClient {
  private config: ApiConfig;

  constructor(config: Partial<ApiConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.config.baseURL}${endpoint}`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);

    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          ...this.config.headers,
          ...options.headers,
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return await response.json();
      }

      return await response.text() as unknown as T;
    } catch (error) {
      clearTimeout(timeoutId);

      if (error instanceof Error && error.name === 'AbortError') {
        throw new FreelanceFlowError('NETWORK_ERROR', 'Request timeout');
      }

      throw parseApiError(error);
    }
  }

  async get<T>(endpoint: string, params?: Record<string, any>): Promise<T> {
    const url = params ? `${endpoint}?${new URLSearchParams(params)}` : endpoint;
    return this.request<T>(url);
  }

  async post<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async patch<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'DELETE',
    });
  }
}

// ==========================================================================
// API Response Types
// ==========================================================================

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
  timestamp: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ListParams {
  page?: number;
  limit?: number;
  search?: string;
  sort?: string;
  order?: 'asc' | 'desc';
  filters?: Record<string, any>;
}

// ==========================================================================
// Base API Service Class
// ==========================================================================

export abstract class BaseApiService {
  protected client: HttpClient;
  protected resource: string;

  constructor(resource: string, config?: Partial<ApiConfig>) {
    this.client = new HttpClient(config);
    this.resource = resource;
  }

  protected async request<T>(
    operation: () => Promise<T>,
    context?: string
  ): Promise<T | null> {
    return withErrorHandling(operation, (error) => {
      console.error(`API Error in ${this.resource}${context ? ` (${context})` : ''}:`, error);
    }, context);
  }

  protected async requestWithRetry<T>(
    operation: () => Promise<T>,
    context?: string
  ): Promise<T | null> {
    return withRetry(
      () => this.request(operation, context) as Promise<T>,
      3,
      1000
    );
  }

  // CRUD Operations
  async getList(params?: ListParams): Promise<any[] | null> {
    return this.request(
      () => this.client.get<PaginatedResponse<any>>(`/${this.resource}`, params).then(res => res.data),
      'getList'
    );
  }

  async getById(id: string | number): Promise<any | null> {
    return this.request(
      () => this.client.get<ApiResponse<any>>(`/${this.resource}/${id}`).then(res => res.data),
      `getById(${id})`
    );
  }

  async create(data: any): Promise<any | null> {
    return this.request(
      () => this.client.post<ApiResponse<any>>(`/${this.resource}`, data).then(res => res.data),
      'create'
    );
  }

  async update(id: string | number, data: any): Promise<any | null> {
    return this.request(
      () => this.client.put<ApiResponse<any>>(`/${this.resource}/${id}`, data).then(res => res.data),
      `update(${id})`
    );
  }

  async delete(id: string | number): Promise<boolean | null> {
    return this.request(
      () => this.client.delete<ApiResponse<boolean>>(`/${this.resource}/${id}`).then(res => res.success),
      `delete(${id})`
    );
  }
}

// ==========================================================================
// Projects API Service
// ==========================================================================

export interface ProjectData {
  id?: number;
  name: string;
  description: string;
  clientId: number;
  status: 'draft' | 'in_progress' | 'completed' | 'on_hold';
  startDate: string;
  endDate?: string;
  budget?: number;
  hourlyRate?: number;
}

export class ProjectsApiService extends BaseApiService {
  constructor() {
    super('projects');
  }

  async getProjectsByClient(clientId: number): Promise<ProjectData[] | null> {
    return this.request(
      () => this.client.get<PaginatedResponse<ProjectData>>(`/projects?clientId=${clientId}`).then(res => res.data),
      `getProjectsByClient(${clientId})`
    );
  }

  async updateStatus(id: number, status: ProjectData['status']): Promise<ProjectData | null> {
    return this.request(
      () => this.client.patch<ApiResponse<ProjectData>>(`/projects/${id}/status`, { status }).then(res => res.data),
      `updateStatus(${id}, ${status})`
    );
  }
}

// ==========================================================================
// Clients API Service
// ==========================================================================

export interface ClientData {
  id?: number;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  address?: string;
  status: 'active' | 'inactive';
  notes?: string;
}

export class ClientsApiService extends BaseApiService {
  constructor() {
    super('clients');
  }

  async getActiveClients(): Promise<ClientData[] | null> {
    return this.request(
      () => this.client.get<PaginatedResponse<ClientData>>('/clients?status=active').then(res => res.data),
      'getActiveClients'
    );
  }

  async updateStatus(id: number, status: ClientData['status']): Promise<ClientData | null> {
    return this.request(
      () => this.client.patch<ApiResponse<ClientData>>(`/clients/${id}/status`, { status }).then(res => res.data),
      `updateStatus(${id}, ${status})`
    );
  }
}

// ==========================================================================
// Invoices API Service
// ==========================================================================

export interface InvoiceData {
  id?: number;
  projectId: number;
  clientId: number;
  amount: number;
  status: 'draft' | 'sent' | 'paid' | 'overdue';
  dueDate: string;
  issuedDate: string;
  notes?: string;
}

export class InvoicesApiService extends BaseApiService {
  constructor() {
    super('invoices');
  }

  async getInvoicesByProject(projectId: number): Promise<InvoiceData[] | null> {
    return this.request(
      () => this.client.get<PaginatedResponse<InvoiceData>>(`/invoices?projectId=${projectId}`).then(res => res.data),
      `getInvoicesByProject(${projectId})`
    );
  }

  async markAsPaid(id: number): Promise<InvoiceData | null> {
    return this.request(
      () => this.client.patch<ApiResponse<InvoiceData>>(`/invoices/${id}/paid`, {}).then(res => res.data),
      `markAsPaid(${id})`
    );
  }
}

// ==========================================================================
// Dashboard API Service
// ==========================================================================

export interface DashboardStats {
  totalProjects: number;
  activeProjects: number;
  totalClients: number;
  activeClients: number;
  totalRevenue: number;
  pendingInvoices: number;
  monthlyRevenue: number;
}

export class DashboardApiService extends BaseApiService {
  constructor() {
    super('dashboard');
  }

  async getStats(): Promise<DashboardStats | null> {
    return this.request(
      () => this.client.get<ApiResponse<DashboardStats>>('/dashboard/stats').then(res => res.data),
      'getStats'
    );
  }

  async getRevenueChart(): Promise<any[] | null> {
    return this.request(
      () => this.client.get<ApiResponse<any[]>>('/dashboard/revenue-chart').then(res => res.data),
      'getRevenueChart'
    );
  }
}

// ==========================================================================
// API Service Instances
// ==========================================================================

export const projectsApi = new ProjectsApiService();
export const clientsApi = new ClientsApiService();
export const invoicesApi = new InvoicesApiService();
export const dashboardApi = new DashboardApiService();

// ==========================================================================
// Mock Data Fallback (for development)
// ==========================================================================

export const useMockData = process.env.NODE_ENV === 'development' && !process.env.NEXT_PUBLIC_API_URL;

if (useMockData) {
  console.warn('Using mock data - set NEXT_PUBLIC_API_URL to use real API');

  // Mock implementations would go here
  // These would return the same data as the current placeholder data
}