'use client';

/* ==========================================================================
   ActivityFeed Component
   Displays recent activity with icons and timestamps
   ========================================================================== */

import React from 'react';
import { Activity, activityData } from '@/data/placeholder';

// ==========================================================================
// Activity Icon Component
// ==========================================================================

interface ActivityIconProps {
  type: Activity['type'];
}

const ActivityIcon: React.FC<ActivityIconProps> = ({ type }) => {
  const iconConfig: Record<Activity['type'], { bg: string; icon: React.ReactNode }> = {
    payment: {
      bg: 'bg-green-100',
      icon: (
        <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    project: {
      bg: 'bg-blue-100',
      icon: (
        <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      ),
    },
    client: {
      bg: 'bg-purple-100',
      icon: (
        <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
    },
    invoice: {
      bg: 'bg-orange-100',
      icon: (
        <svg className="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
    },
    message: {
      bg: 'bg-pink-100',
      icon: (
        <svg className="w-4 h-4 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      ),
    },
  };

  const config = iconConfig[type];

  return (
    <div className={`
      w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0
      ${config.bg}
    `}>
      {config.icon}
    </div>
  );
};

// ==========================================================================
// Activity Item Component
// ==========================================================================

interface ActivityItemProps {
  activity: Activity;
  isLast: boolean;
}

const ActivityItem: React.FC<ActivityItemProps> = ({ activity, isLast }) => {
  return (
    <div className="relative flex gap-4">
      {/* Timeline Line */}
      {!isLast && (
        <div className="absolute left-4 top-10 w-px h-full bg-gray-200" />
      )}
      
      {/* Icon */}
      <ActivityIcon type={activity.type} />
      
      {/* Content */}
      <div className="flex-1 pb-6">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-sm font-medium text-gray-900">
              {activity.title}
            </p>
            <p className="text-sm text-gray-500 mt-0.5">
              {activity.description}
            </p>
          </div>
          <span className="text-xs text-gray-400 whitespace-nowrap">
            {activity.timestamp}
          </span>
        </div>
      </div>
    </div>
  );
};

// ==========================================================================
// ActivityFeed Component
// ==========================================================================

const ActivityFeed: React.FC = () => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
      {/* ==========================================================================
         Feed Header
         ========================================================================== */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
          <p className="text-sm text-gray-500 mt-0.5">Stay updated on your business</p>
        </div>
        <button className="text-sm text-primary hover:text-primary-dark font-medium transition-colors">
          View All
        </button>
      </div>

      {/* ==========================================================================
         Activity List
         ========================================================================== */}
      <div className="p-6">
        {activityData.map((activity, index) => (
          <ActivityItem
            key={activity.id}
            activity={activity}
            isLast={index === activityData.length - 1}
          />
        ))}
      </div>

      {/* ==========================================================================
         Feed Footer
         ========================================================================== */}
      <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-lg">
        <button className="w-full py-2 text-sm font-medium text-gray-600 hover:text-primary transition-colors flex items-center justify-center gap-2">
          <span>Load More Activity</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default ActivityFeed;
