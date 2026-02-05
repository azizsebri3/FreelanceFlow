'use client';

/* ==========================================================================
   IncomeByTypeChart Component
   Displays income distribution by service type
   ========================================================================== */

import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';

interface IncomeTypeData {
  name: string;
  value: number;
  color: string;
}

interface IncomeByTypeChartProps {
  data: IncomeTypeData[];
  height?: number;
}

export default function IncomeByTypeChart({ data, height = 250 }: IncomeByTypeChartProps) {
  return (
    <div style={{ height: `${height}px` }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={40}
            outerRadius={70}
            paddingAngle={4}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value: number | undefined) => value ? [`${value}%`, 'Percentage'] : ['N/A', 'Percentage']}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}