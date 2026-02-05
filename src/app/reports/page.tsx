'use client';

/* ==========================================================================
   Reports Page
   Analytics and reporting dashboard
   ========================================================================== */

import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import StatCard from '@/components/cards/StatCard';
import RevenueTrendChart from '@/components/charts/RevenueTrendChart';
import ProjectsByClientChart from '@/components/charts/ProjectsByClientChart';
import IncomeByTypeChart from '@/components/charts/IncomeByTypeChart';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { useReports } from '@/hooks/reports';

// ==========================================================================
// Reports Page Component
// ==========================================================================

export default function ReportsPage() {
  const { data, loading, error, timeRange, setTimeRange, exportReports } = useReports();

  const handleTimeRangeChange = (range: '6months' | '1year' | 'all') => {
    setTimeRange(range);
  };

  const handleExport = async () => {
    await exportReports();
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-500">Loading reports...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="text-red-500 mb-4">
              <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Failed to Load Reports</h3>
            <p className="text-gray-500 mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!data) {
    return null;
  }

  return (
    <DashboardLayout>
      {/* Page Header */}
      <div className="mb-4 sm:mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">Reports</h1>
            <p className="text-gray-500 mt-1 text-sm sm:text-base">Analytics and business insights</p>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
            <select
              value={timeRange}
              onChange={(e) => handleTimeRangeChange(e.target.value as '6months' | '1year' | 'all')}
              className="px-3 sm:px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm sm:text-base"
            >
              <option value="6months">Last 6 months</option>
              <option value="1year">Last year</option>
              <option value="all">All time</option>
            </select>
            <Button onClick={handleExport} className="flex items-center justify-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
              <span className="hidden sm:inline">Export PDF</span>
              <span className="sm:hidden">Export</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6">
        <StatCard
          title="Total Revenue"
          value={`$${data.summary.totalRevenue.toLocaleString()}`}
          change={data.summary.revenueChange}
          changeType={data.summary.revenueChange >= 0 ? 'increase' : 'decrease'}
          icon="revenue"
        />
        <StatCard
          title="Projects Completed"
          value={data.summary.totalProjects.toString()}
          change={data.summary.projectsChange}
          changeType="increase"
          icon="projects"
        />
        <StatCard
          title="New Clients"
          value={data.summary.totalClients.toString()}
          change={data.summary.clientsChange}
          changeType="increase"
          icon="clients"
        />
        <StatCard
          title="Avg. Project Value"
          value={`$${data.summary.avgProjectValue.toLocaleString()}`}
          change={data.summary.avgValueChange}
          changeType={data.summary.avgValueChange >= 0 ? 'increase' : 'decrease'}
          icon="revenue"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6">
        {/* Revenue Trend */}
        <Card className="p-4 sm:p-6">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Revenue Trend</h3>
          <RevenueTrendChart data={data.revenueTrend} height={300} />
        </Card>

        {/* Projects by Client */}
        <Card className="p-4 sm:p-6">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Projects by Client</h3>
          <ProjectsByClientChart data={data.projectsByClient} height={300} />
        </Card>
      </div>

      {/* Income by Type and Performance Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Income by Type */}
        <Card className="p-4 sm:p-6">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Income by Service Type</h3>
          <IncomeByTypeChart data={data.incomeByType} height={250} />
          <div className="space-y-2 mt-3 sm:mt-4">
            {data.incomeByType.map((item) => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-xs sm:text-sm text-gray-600 truncate">{item.name}</span>
                </div>
                <span className="text-xs sm:text-sm font-medium text-gray-900">{item.value}%</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Performance Summary */}
        <div className="lg:col-span-2">
          <Card className="p-4 sm:p-6">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Performance Summary</h3>
            <div className="overflow-x-auto -mx-4 sm:mx-0">
              <div className="inline-block min-w-full align-middle">
                <table className="min-w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-2 sm:py-3 text-xs sm:text-sm font-semibold text-gray-500">Month</th>
                      <th className="text-left py-2 sm:py-3 text-xs sm:text-sm font-semibold text-gray-500">Revenue</th>
                      <th className="text-left py-2 sm:py-3 text-xs sm:text-sm font-semibold text-gray-500">Projects</th>
                      <th className="text-left py-2 sm:py-3 text-xs sm:text-sm font-semibold text-gray-500">Clients</th>
                      <th className="text-left py-2 sm:py-3 text-xs sm:text-sm font-semibold text-gray-500">Growth</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {data.performanceData.map((row, index) => (
                      <tr key={index}>
                        <td className="py-2 sm:py-3 text-xs sm:text-sm text-gray-900">{row.month}</td>
                        <td className="py-2 sm:py-3 text-xs sm:text-sm font-medium text-gray-900">${row.revenue.toLocaleString()}</td>
                        <td className="py-2 sm:py-3 text-xs sm:text-sm text-gray-600">{row.projects}</td>
                        <td className="py-2 sm:py-3 text-xs sm:text-sm text-gray-600">{row.clients}</td>
                        <td className={`py-2 sm:py-3 text-xs sm:text-sm ${row.growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {row.growth >= 0 ? '+' : ''}{row.growth}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
