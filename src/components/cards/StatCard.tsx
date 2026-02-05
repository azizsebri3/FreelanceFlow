'use client';

/* ==========================================================================
   StatCard Component
   Displays key metrics with icon, value, and change indicator
   Used for Total Clients, Active Projects, Revenue, Unpaid Invoices
   ========================================================================== */

import React from 'react';

// ==========================================================================
// Props Interface
// ==========================================================================

interface StatCardProps {
  title: string;
  value: string;
  change: number;
  changeType: 'increase' | 'decrease';
  icon: 'clients' | 'projects' | 'revenue' | 'invoices';
}

// ==========================================================================
// Icon Components with Background Colors
// ==========================================================================

const iconConfig: Record<string, { icon: React.ReactNode; bgColor: string; iconColor: string }> = {
  clients: {
    bgColor: 'bg-blue-100',
    iconColor: 'text-blue-600',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
  },
  projects: {
    bgColor: 'bg-purple-100',
    iconColor: 'text-purple-600',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
      </svg>
    ),
  },
  revenue: {
    bgColor: 'bg-green-100',
    iconColor: 'text-green-600',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  invoices: {
    bgColor: 'bg-orange-100',
    iconColor: 'text-orange-600',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
  },
};

// ==========================================================================
// StatCard Component
// ==========================================================================

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  change,
  changeType,
  icon,
}) => {
  const config = iconConfig[icon];

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6 shadow-sm hover:shadow-md transition-shadow duration-200 card-hover">
      <div className="flex items-center justify-between">
        {/* Left Section - Title and Value */}
        <div className="flex-1 min-w-0">
          <p className="text-xs sm:text-sm font-medium text-gray-500 mb-1 truncate">
            {title}
          </p>
          <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 truncate">
            {value}
          </h3>
          
          {/* Change Indicator */}
          <div className="flex items-center gap-1 sm:gap-1.5 mt-1 sm:mt-2">
            {changeType === 'increase' ? (
              <>
                <span className="flex items-center text-green-600">
                  <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                  </svg>
                </span>
                <span className="text-xs sm:text-sm font-medium text-green-600">
                  +{change}%
                </span>
              </>
            ) : (
              <>
                <span className="flex items-center text-red-600">
                  <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                </span>
                <span className="text-xs sm:text-sm font-medium text-red-600">
                  -{change}%
                </span>
              </>
            )}
            <span className="text-xs sm:text-sm text-gray-500 hidden sm:inline">vs last month</span>
          </div>
        </div>

        {/* Right Section - Icon */}
        <div className={`
          w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0 ml-3 sm:ml-4
          ${config.bgColor} ${config.iconColor}
        `}>
          <div className="w-5 h-5 sm:w-6 sm:h-6">
            {config.icon}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatCard;
