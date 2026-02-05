'use client';

/* ==========================================================================
   ProjectsByClientChart Component
   Displays projects distribution by client
   ========================================================================== */

import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface ClientProjectData {
  client: string;
  projects: number;
}

interface ProjectsByClientChartProps {
  data: ClientProjectData[];
  height?: number;
}

export default function ProjectsByClientChart({ data, height = 300 }: ProjectsByClientChartProps) {
  return (
    <div style={{ height: `${height}px` }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical">
          <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" horizontal={false} />
          <XAxis
            type="number"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 11, fill: '#64748B' }}
          />
          <YAxis
            type="category"
            dataKey="client"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 11, fill: '#64748B' }}
            width={70}
          />
          <Tooltip />
          <Bar dataKey="projects" fill="#3C50E0" radius={[0, 4, 4, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}