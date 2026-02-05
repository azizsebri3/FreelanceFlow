'use client';

/* ==========================================================================
   RevenueTrendChart Component
   Displays revenue trend over time
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
} from 'recharts';

interface RevenueData {
  month: string;
  revenue: number;
}

interface RevenueTrendChartProps {
  data: RevenueData[];
  height?: number;
}

export default function RevenueTrendChart({ data, height = 300 }: RevenueTrendChartProps) {
  const formatCurrency = (value: number) => `$${(value / 1000).toFixed(0)}k`;

  return (
    <div style={{ height: `${height}px` }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
          <XAxis
            dataKey="month"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 11, fill: '#64748B' }}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 11, fill: '#64748B' }}
            tickFormatter={formatCurrency}
          />
          <Tooltip
            formatter={(value: number | undefined) => value ? [`$${value.toLocaleString()}`, 'Revenue'] : ['N/A', 'Revenue']}
          />
          <defs>
            <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3C50E0" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#3C50E0" stopOpacity={0} />
            </linearGradient>
          </defs>
          <Area
            type="monotone"
            dataKey="revenue"
            stroke="#3C50E0"
            strokeWidth={2}
            fill="url(#revenueGrad)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}