'use client';

/* ==========================================================================
   ProjectStatusChart Component
   Displays project distribution by status using a donut chart
   ========================================================================== */

import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from 'recharts';
import { projectStatusData } from '@/data/placeholder';

// ==========================================================================
// Custom Tooltip Component
// ==========================================================================

interface TooltipProps {
  active?: boolean;
  payload?: Array<{
    name: string;
    value: number;
    payload: {
      color: string;
      percent: number;
    };
  }>;
}

const CustomTooltip: React.FC<TooltipProps> = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0];
    return (
      <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3">
        <div className="flex items-center gap-2">
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: data.payload.color }}
          />
          <span className="text-sm font-medium text-gray-900">{data.name}</span>
        </div>
        <p className="text-lg font-bold text-gray-900 mt-1">
          {data.value} projects
        </p>
        <p className="text-sm text-gray-500">
          {(data.payload.percent * 100).toFixed(1)}% of total
        </p>
      </div>
    );
  }
  return null;
};

// ==========================================================================
// Custom Legend Component
// ==========================================================================

interface LegendPayload {
  value: string;
  color: string;
  payload: {
    value: number;
  };
}

interface CustomLegendProps {
  payload?: LegendPayload[];
}

const CustomLegend: React.FC<CustomLegendProps> = ({ payload }) => {
  if (!payload) return null;
  
  const total = payload.reduce((sum, entry) => sum + entry.payload.value, 0);
  
  return (
    <div className="flex flex-col gap-3 mt-4">
      {payload.map((entry, index) => {
        const percentage = ((entry.payload.value / total) * 100).toFixed(1);
        return (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-sm text-gray-600">{entry.value}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-gray-900">
                {entry.payload.value}
              </span>
              <span className="text-sm text-gray-500 w-12 text-right">
                {percentage}%
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

// ==========================================================================
// ProjectStatusChart Component
// ==========================================================================

const ProjectStatusChart: React.FC = () => {
  // Calculate total projects
  const totalProjects = projectStatusData.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
      {/* ==========================================================================
         Chart Header
         ========================================================================== */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Projects by Status</h2>
          <p className="text-sm text-gray-500 mt-1">
            {totalProjects} total projects
          </p>
        </div>
        
        {/* View Toggle */}
        <button className="text-sm text-primary hover:text-primary-dark font-medium transition-colors">
          View All
        </button>
      </div>

      {/* ==========================================================================
         Chart
         ========================================================================== */}
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={projectStatusData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={90}
              paddingAngle={4}
              dataKey="value"
              stroke="none"
            >
              {projectStatusData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            
            {/* Custom Tooltip */}
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
        
        {/* Center Label */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{ top: '-40px' }}>
          <div className="text-center">
            <p className="text-3xl font-bold text-gray-900">{totalProjects}</p>
            <p className="text-sm text-gray-500">Projects</p>
          </div>
        </div>
      </div>

      {/* ==========================================================================
         Legend
         ========================================================================== */}
      <CustomLegend
        payload={projectStatusData.map(item => ({
          value: item.name,
          color: item.color,
          payload: { value: item.value },
        }))}
      />

      {/* ==========================================================================
         Quick Stats
         ========================================================================== */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <p className="text-2xl font-bold text-gray-900">
              {projectStatusData.find(p => p.name === 'In Progress')?.value || 0}
            </p>
            <p className="text-sm text-gray-500">Active Now</p>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <p className="text-2xl font-bold text-green-600">
              {projectStatusData.find(p => p.name === 'Completed')?.value || 0}
            </p>
            <p className="text-sm text-gray-500">Completed</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectStatusChart;
