'use client';

/* ==========================================================================
   RevenueChart Component
   Displays monthly revenue and expenses using a bar/area chart
   ========================================================================== */

import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { revenueData } from '@/data/placeholder';

// ==========================================================================
// Custom Tooltip Component
// ==========================================================================

interface TooltipProps {
  active?: boolean;
  payload?: Array<{
    name: string;
    value: number;
    color: string;
  }>;
  label?: string;
}

const CustomTooltip: React.FC<TooltipProps> = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3">
        <p className="text-sm font-semibold text-gray-900 mb-2">{label}</p>
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-sm text-gray-600">{entry.name}:</span>
            </div>
            <span className="text-sm font-medium text-gray-900">
              ${entry.value.toLocaleString()}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

// ==========================================================================
// RevenueChart Component
// ==========================================================================

interface RevenueChartProps {
  timeRange: '7d' | '30d' | '90d' | '1y';
  onTimeRangeChange: (range: '7d' | '30d' | '90d' | '1y') => void;
}

const RevenueChart: React.FC<RevenueChartProps> = ({ timeRange, onTimeRangeChange }) => {
  // Filter data based on time range
  const getFilteredData = () => {
    switch (timeRange) {
      case '7d':
        return revenueData.slice(-1); // Last month (simplified for demo)
      case '30d':
        return revenueData.slice(-1); // Last month
      case '90d':
        return revenueData.slice(-3); // Last 3 months
      case '1y':
        return revenueData.slice(-12); // Last 12 months
      default:
        return revenueData; // All data
    }
  };

  const filteredData = getFilteredData();

  // Calculate totals for the summary based on filtered data
  const totalRevenue = filteredData.reduce((sum, item) => sum + item.revenue, 0);
  const totalExpenses = filteredData.reduce((sum, item) => sum + item.expenses, 0);
  const netProfit = totalRevenue - totalExpenses;

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
      {/* ==========================================================================
         Chart Header
         ========================================================================== */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Revenue Overview</h2>
          <p className="text-sm text-gray-500 mt-1">Monthly revenue vs expenses</p>
        </div>
        
        {/* Time Period Selector */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => onTimeRangeChange('7d')}
            className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
              timeRange === '7d'
                ? 'text-primary bg-primary/10'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            7 Days
          </button>
          <button
            onClick={() => onTimeRangeChange('30d')}
            className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
              timeRange === '30d'
                ? 'text-primary bg-primary/10'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            30 Days
          </button>
          <button
            onClick={() => onTimeRangeChange('90d')}
            className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
              timeRange === '90d'
                ? 'text-primary bg-primary/10'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            90 Days
          </button>
          <button
            onClick={() => onTimeRangeChange('1y')}
            className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
              timeRange === '1y'
                ? 'text-primary bg-primary/10'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            1 Year
          </button>
        </div>
      </div>

      {/* ==========================================================================
         Summary Cards
         ========================================================================== */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {/* Total Revenue */}
        <div className="bg-blue-50 rounded-lg p-4">
          <p className="text-sm text-blue-600 font-medium">Total Revenue</p>
          <p className="text-2xl font-bold text-blue-700 mt-1">
            ${totalRevenue.toLocaleString()}
          </p>
        </div>
        
        {/* Total Expenses */}
        <div className="bg-red-50 rounded-lg p-4">
          <p className="text-sm text-red-600 font-medium">Total Expenses</p>
          <p className="text-2xl font-bold text-red-700 mt-1">
            ${totalExpenses.toLocaleString()}
          </p>
        </div>
        
        {/* Net Profit */}
        <div className="bg-green-50 rounded-lg p-4">
          <p className="text-sm text-green-600 font-medium">Net Profit</p>
          <p className="text-2xl font-bold text-green-700 mt-1">
            ${netProfit.toLocaleString()}
          </p>
        </div>
      </div>

      {/* ==========================================================================
         Chart
         ========================================================================== */}
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={filteredData}
            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
          >
            {/* Grid */}
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#E2E8F0"
              vertical={false}
            />
            
            {/* X Axis - Months */}
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#64748B' }}
              dy={10}
            />
            
            {/* Y Axis - Values */}
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#64748B' }}
              tickFormatter={(value) => `$${value / 1000}k`}
              dx={-10}
            />
            
            {/* Custom Tooltip */}
            <Tooltip content={<CustomTooltip />} />
            
            {/* Legend */}
            <Legend
              iconType="circle"
              wrapperStyle={{ paddingTop: 20 }}
              formatter={(value) => (
                <span className="text-sm text-gray-600">{value}</span>
              )}
            />
            
            {/* Revenue Area */}
            <defs>
              <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3C50E0" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#3C50E0" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="expensesGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#EF4444" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
              </linearGradient>
            </defs>
            
            <Area
              type="monotone"
              dataKey="revenue"
              name="Revenue"
              stroke="#3C50E0"
              strokeWidth={2}
              fill="url(#revenueGradient)"
            />
            
            {/* Expenses Area */}
            <Area
              type="monotone"
              dataKey="expenses"
              name="Expenses"
              stroke="#EF4444"
              strokeWidth={2}
              fill="url(#expensesGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default RevenueChart;
