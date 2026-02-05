/* ==========================================================================
   Reports API Service
   Service layer for reports and analytics data
   ========================================================================== */

import { FreelanceFlowError } from '../utils/errorHandling';

// ==========================================================================
// Types
// ==========================================================================

export interface ReportSummary {
  totalRevenue: number;
  totalProjects: number;
  totalClients: number;
  avgProjectValue: number;
  revenueChange: number;
  projectsChange: number;
  clientsChange: number;
  avgValueChange: number;
}

export interface RevenueData {
  month: string;
  revenue: number;
}

export interface ClientProjectData {
  client: string;
  projects: number;
}

export interface IncomeTypeData {
  name: string;
  value: number;
  color: string;
}

export interface PerformanceData {
  month: string;
  revenue: number;
  projects: number;
  clients: number;
  growth: number;
}

export interface ReportsData {
  summary: ReportSummary;
  revenueTrend: RevenueData[];
  projectsByClient: ClientProjectData[];
  incomeByType: IncomeTypeData[];
  performanceData: PerformanceData[];
}

// ==========================================================================
// Reports Service Class
// ==========================================================================

class ReportsService {
  private baseURL = '/api/reports';

  // Get all reports data
  async getReportsData(timeRange: '6months' | '1year' | 'all' = '6months'): Promise<ReportsData> {
    try {
      const response = await fetch(`${this.baseURL}?timeRange=${timeRange}`);

      if (!response.ok) {
        throw new FreelanceFlowError('SERVER_ERROR', `Failed to fetch reports data: ${response.statusText}`);
      }

      return response.json();
    } catch (error) {
      if (error instanceof FreelanceFlowError) {
        throw error;
      }
      throw new FreelanceFlowError('NETWORK_ERROR', 'Failed to load reports data');
    }
  }

  // Get summary statistics
  async getSummary(timeRange: '6months' | '1year' | 'all' = '6months'): Promise<ReportSummary> {
    try {
      const response = await fetch(`${this.baseURL}/summary?timeRange=${timeRange}`);

      if (!response.ok) {
        throw new FreelanceFlowError('SERVER_ERROR', `Failed to fetch summary data: ${response.statusText}`);
      }

      return response.json();
    } catch (error) {
      if (error instanceof FreelanceFlowError) {
        throw error;
      }
      throw new FreelanceFlowError('NETWORK_ERROR', 'Failed to load summary data');
    }
  }

  // Get revenue trend data
  async getRevenueTrend(timeRange: '6months' | '1year' | 'all' = '6months'): Promise<RevenueData[]> {
    try {
      const response = await fetch(`${this.baseURL}/revenue-trend?timeRange=${timeRange}`);

      if (!response.ok) {
        throw new FreelanceFlowError('SERVER_ERROR', `Failed to fetch revenue trend data: ${response.statusText}`);
      }

      return response.json();
    } catch (error) {
      if (error instanceof FreelanceFlowError) {
        throw error;
      }
      throw new FreelanceFlowError('NETWORK_ERROR', 'Failed to load revenue trend data');
    }
  }

  // Get projects by client data
  async getProjectsByClient(timeRange: '6months' | '1year' | 'all' = '6months'): Promise<ClientProjectData[]> {
    try {
      const response = await fetch(`${this.baseURL}/projects-by-client?timeRange=${timeRange}`);

      if (!response.ok) {
        throw new FreelanceFlowError('SERVER_ERROR', `Failed to fetch projects by client data: ${response.statusText}`);
      }

      return response.json();
    } catch (error) {
      if (error instanceof FreelanceFlowError) {
        throw error;
      }
      throw new FreelanceFlowError('NETWORK_ERROR', 'Failed to load projects by client data');
    }
  }

  // Get income by type data
  async getIncomeByType(timeRange: '6months' | '1year' | 'all' = '6months'): Promise<IncomeTypeData[]> {
    try {
      const response = await fetch(`${this.baseURL}/income-by-type?timeRange=${timeRange}`);

      if (!response.ok) {
        throw new FreelanceFlowError('SERVER_ERROR', `Failed to fetch income by type data: ${response.statusText}`);
      }

      return response.json();
    } catch (error) {
      if (error instanceof FreelanceFlowError) {
        throw error;
      }
      throw new FreelanceFlowError('NETWORK_ERROR', 'Failed to load income by type data');
    }
  }

  // Get performance data
  async getPerformanceData(timeRange: '6months' | '1year' | 'all' = '6months'): Promise<PerformanceData[]> {
    try {
      const response = await fetch(`${this.baseURL}/performance?timeRange=${timeRange}`);

      if (!response.ok) {
        throw new FreelanceFlowError('SERVER_ERROR', `Failed to fetch performance data: ${response.statusText}`);
      }

      return response.json();
    } catch (error) {
      if (error instanceof FreelanceFlowError) {
        throw error;
      }
      throw new FreelanceFlowError('NETWORK_ERROR', 'Failed to load performance data');
    }
  }

  // Export reports as PDF
  async exportReports(timeRange: '6months' | '1year' | 'all' = '6months'): Promise<Blob> {
    try {
      const response = await fetch(`${this.baseURL}/export?timeRange=${timeRange}&format=pdf`);

      if (!response.ok) {
        throw new FreelanceFlowError('SERVER_ERROR', `Failed to export reports: ${response.statusText}`);
      }

      return response.blob();
    } catch (error) {
      if (error instanceof FreelanceFlowError) {
        throw error;
      }
      throw new FreelanceFlowError('NETWORK_ERROR', 'Failed to export reports');
    }
  }
}

// ==========================================================================
// Export Singleton Instance
// ==========================================================================

export const reportsService = new ReportsService();