'use client';

/* ==========================================================================
   Dashboard Page
   Main dashboard view with stats, charts, tables, and activity feed
   FreelanceFlow SaaS Dashboard
   ========================================================================== */

import React, { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import StatCard from '@/components/cards/StatCard';
import InvoicesTable from '@/components/tables/InvoicesTable';
import RevenueChart from '@/components/charts/RevenueChart';
import ActivityFeed from '@/components/activity/ActivityFeed';
import { statsData } from '@/data/placeholder';
import { exportDashboardToPDF } from '@/utils/export';

// ==========================================================================
// Dashboard Page Component
// ==========================================================================

export default function DashboardPage() {
  const [isExporting, setIsExporting] = useState(false);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');
  const [invoicesFilter, setInvoicesFilter] = useState<'all' | 'paid' | 'pending' | 'overdue'>('all');

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const result = await exportDashboardToPDF({
        title: 'FreelanceFlow Dashboard Report',
        filename: `freelanceflow-dashboard-${new Date().toISOString().split('T')[0]}.pdf`
      });

      if (result.success) {
        console.log('PDF exported successfully:', result.filename);
      } else {
        console.error('Export failed:', result.error);
      }
    } catch (error) {
      console.error('Export error:', error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <DashboardLayout>
      {/* ==========================================================================
         Page Header
         ========================================================================== */}
      <div className="mb-4 sm:mb-6">
        <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
          <div className="min-w-0 flex-1">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 truncate">
              Dashboard
            </h1>
            <p className="text-sm sm:text-base text-gray-500 mt-1">
              Welcome back! Here&apos;s what&apos;s happening with your business today.
            </p>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Time Range Selector */}
            <div className="relative min-w-0">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value as typeof timeRange)}
                className="appearance-none bg-white border border-gray-200 rounded-lg px-3 py-2 pr-8 sm:px-4 sm:py-2.5 sm:pr-10 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary cursor-pointer w-full sm:w-auto"
              >
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
                <option value="1y">This year</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:pr-3 pointer-events-none">
                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            {/* Export Button */}
            <button
              onClick={handleExport}
              disabled={isExporting}
              className="flex items-center gap-1 sm:gap-2 px-3 py-2 sm:px-4 sm:py-2.5 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
            >
              {isExporting ? (
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
              )}
              <span className="hidden xs:inline sm:inline">
                {isExporting ? 'Exporting...' : 'Export'}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* ==========================================================================
         Stats Cards Section
         Grid of 3 stat cards: Projects, Revenue, Invoices (removed Clients)
         ========================================================================== */}
      <section className="mb-4 sm:mb-6" data-dashboard-content>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
          {statsData.filter(stat => stat.icon !== 'clients').map((stat) => (
            <div
              key={stat.id}
              className="cursor-pointer transform transition-transform hover:scale-105 active:scale-95"
              onClick={() => {
                // Navigate to relevant page based on stat type
                switch (stat.icon) {
                  case 'clients':
                    console.log('Navigate to clients page');
                    break;
                  case 'projects':
                    console.log('Navigate to projects page');
                    break;
                  case 'revenue':
                    console.log('Navigate to reports page');
                    break;
                  case 'invoices':
                    console.log('Navigate to invoices page');
                    break;
                }
              }}
            >
              <StatCard
                title={stat.title}
                value={stat.value}
                change={stat.change}
                changeType={stat.changeType}
                icon={stat.icon}
              />
            </div>
          ))}
        </div>
      </section>

      {/* ==========================================================================
         Charts Section
         Revenue Overview Only (removed Project Status Chart)
         ========================================================================== */}
      <section className="mb-4 sm:mb-6">
        <RevenueChart timeRange={timeRange} onTimeRangeChange={setTimeRange} />
      </section>

      {/* ==========================================================================
         Invoices and Activity Section
         Two-column layout on large screens (removed Projects table)
         ========================================================================== */}
      <section className="mb-4 sm:mb-6">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 lg:gap-6">
          {/* Invoices Table - Takes 2/3 width on large screens */}
          <div className="xl:col-span-2 order-2 xl:order-1">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Recent Invoices</h2>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3">
                <select
                  value={invoicesFilter}
                  onChange={(e) => setInvoicesFilter(e.target.value as typeof invoicesFilter)}
                  className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary w-full sm:w-auto"
                >
                  <option value="all">All Invoices</option>
                  <option value="paid">Paid Only</option>
                  <option value="pending">Pending Only</option>
                  <option value="overdue">Overdue Only</option>
                </select>
                <button className="px-3 py-2 text-sm text-primary hover:text-primary-dark font-medium hover:bg-primary/5 rounded-lg transition-colors w-full sm:w-auto text-center">
                  View All →
                </button>
              </div>
            </div>
            <InvoicesTable filter={invoicesFilter} />
          </div>

          {/* Activity Feed - Takes 1/3 width on large screens */}
          <div className="xl:col-span-1 order-1 xl:order-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
              <button className="px-3 py-2 text-sm text-primary hover:text-primary-dark font-medium hover:bg-primary/5 rounded-lg transition-colors hidden sm:block">
                View All →
              </button>
            </div>
            <ActivityFeed />
          </div>
        </div>
      </section>

    </DashboardLayout>
  );
}
