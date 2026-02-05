'use client';

/* ==========================================================================
   useReports Hook
   Custom hook for reports data management
   ========================================================================== */

import { useState, useEffect, useCallback } from 'react';
import { reportsService, ReportsData, ReportSummary, RevenueData, ClientProjectData, IncomeTypeData, PerformanceData } from '../services/reports';

export interface UseReportsReturn {
  data: ReportsData | null;
  loading: boolean;
  error: string | null;
  timeRange: '6months' | '1year' | 'all';
  setTimeRange: (range: '6months' | '1year' | 'all') => void;
  refresh: () => Promise<void>;
  exportReports: () => Promise<void>;
}

// Mock data for development - replace with actual API calls
const mockReportsData: ReportsData = {
  summary: {
    totalRevenue: 142780,
    totalProjects: 34,
    totalClients: 12,
    avgProjectValue: 4199,
    revenueChange: 12.5,
    projectsChange: 8,
    clientsChange: 4,
    avgValueChange: -2.3,
  },
  revenueTrend: [
    { month: 'Jan', revenue: 18500 },
    { month: 'Feb', revenue: 22300 },
    { month: 'Mar', revenue: 19800 },
    { month: 'Apr', revenue: 26400 },
    { month: 'May', revenue: 31200 },
    { month: 'Jun', revenue: 24580 },
  ],
  projectsByClient: [
    { client: 'TechCorp', projects: 8 },
    { client: 'StartupXYZ', projects: 5 },
    { client: 'Enterprise', projects: 12 },
    { client: 'GrowthHub', projects: 3 },
    { client: 'Local Biz', projects: 6 },
  ],
  incomeByType: [
    { name: 'Web Development', value: 45, color: '#3C50E0' },
    { name: 'Mobile Apps', value: 25, color: '#10B981' },
    { name: 'Design', value: 20, color: '#F59E0B' },
    { name: 'Consulting', value: 10, color: '#64748B' },
  ],
  performanceData: [
    { month: 'January 2026', revenue: 18500, projects: 5, clients: 3, growth: 8.2 },
    { month: 'December 2025', revenue: 31200, projects: 8, clients: 5, growth: 18.2 },
    { month: 'November 2025', revenue: 26400, projects: 6, clients: 4, growth: 33.3 },
    { month: 'October 2025', revenue: 19800, projects: 4, clients: 2, growth: -11.2 },
  ],
};

export function useReports(): UseReportsReturn {
  const [data, setData] = useState<ReportsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState<'6months' | '1year' | 'all'>('6months');

  const fetchReportsData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // TODO: Replace with actual API call
      // const reportsData = await reportsService.getReportsData(timeRange);

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));

      // Use mock data for now
      setData(mockReportsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load reports data');
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [timeRange]);

  const refresh = useCallback(async () => {
    await fetchReportsData();
  }, [fetchReportsData]);

  const handleExportReports = useCallback(async () => {
    try {
      // TODO: Replace with actual API call
      // const blob = await reportsService.exportReports(timeRange);

      // Simulate export delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // For now, just show an alert
      alert('Export functionality will be implemented when backend is ready');

      // In production, you would:
      // const url = URL.createObjectURL(blob);
      // const a = document.createElement('a');
      // a.href = url;
      // a.download = `reports-${timeRange}.pdf`;
      // a.click();
      // URL.revokeObjectURL(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to export reports');
    }
  }, [timeRange]);

  useEffect(() => {
    fetchReportsData();
  }, [fetchReportsData]);

  return {
    data,
    loading,
    error,
    timeRange,
    setTimeRange,
    refresh,
    exportReports: handleExportReports,
  };
}