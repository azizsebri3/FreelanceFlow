'use client';

/* ==========================================================================
   ProjectsTable Component
   Displays recent projects with status, progress, and quick actions
   ========================================================================== */

import React from 'react';
import { Project, projectsData } from '@/data/placeholder';

// ==========================================================================
// Status Badge Component
// ==========================================================================

interface StatusBadgeProps {
  status: Project['status'];
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const statusConfig: Record<Project['status'], { label: string; className: string }> = {
    'in-progress': { label: 'In Progress', className: 'badge-info' },
    'completed': { label: 'Completed', className: 'badge-success' },
    'on-hold': { label: 'On Hold', className: 'badge-warning' },
    'pending': { label: 'Pending', className: 'badge-secondary' },
  };

  const config = statusConfig[status];

  return (
    <span className={`badge ${config.className}`}>
      {config.label}
    </span>
  );
};

// ==========================================================================
// Progress Bar Component
// ==========================================================================

interface ProgressBarProps {
  progress: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ progress }) => {
  // Determine color based on progress
  const getProgressColor = () => {
    if (progress === 100) return 'bg-green-500';
    if (progress >= 60) return 'bg-blue-500';
    if (progress >= 30) return 'bg-yellow-500';
    return 'bg-gray-400';
  };

  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-300 ${getProgressColor()}`}
          style={{ width: `${progress}%` }}
        />
      </div>
      <span className="text-sm font-medium text-gray-600 w-12 text-right">
        {progress}%
      </span>
    </div>
  );
};

// ==========================================================================
// ProjectsTable Component
// ==========================================================================

interface ProjectsTableProps {
  filter: 'all' | 'active' | 'completed';
}

const ProjectsTable: React.FC<ProjectsTableProps> = ({ filter }) => {
  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  // Filter projects based on the filter prop
  const filteredProjects = projectsData.filter((project) => {
    switch (filter) {
      case 'active':
        return project.status === 'in-progress';
      case 'completed':
        return project.status === 'completed';
      default:
        return true;
    }
  });

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
      {/* ==========================================================================
         Table Header
         ========================================================================== */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Recent Projects</h2>
        <button className="text-sm text-primary hover:text-primary-dark font-medium transition-colors">
          View All
        </button>
      </div>

      {/* ==========================================================================
         Table Content
         ========================================================================== */}
      <div className="overflow-x-auto">
        <table className="w-full">
          {/* Table Head */}
          <thead>
            <tr className="bg-gray-50">
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Project
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Client
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Progress
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Deadline
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Budget
              </th>
              <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="divide-y divide-gray-200">
            {filteredProjects.map((project) => (
              <tr
                key={project.id}
                className="table-row hover:bg-gray-50 transition-colors"
              >
                {/* Project Name */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    {/* Project Icon */}
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                      </svg>
                    </div>
                    <span className="font-medium text-gray-900">
                      {project.name}
                    </span>
                  </div>
                </td>

                {/* Client */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-gray-600">{project.client}</span>
                </td>

                {/* Status */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <StatusBadge status={project.status} />
                </td>

                {/* Progress */}
                <td className="px-6 py-4 whitespace-nowrap min-w-40">
                  <ProgressBar progress={project.progress} />
                </td>

                {/* Deadline */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-gray-600">{formatDate(project.deadline)}</span>
                </td>

                {/* Budget */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="font-medium text-gray-900">
                    {formatCurrency(project.budget)}
                  </span>
                </td>

                {/* Actions */}
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <div className="flex items-center justify-end gap-2">
                    {/* View Button */}
                    <button
                      className="p-2 text-gray-500 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                      title="View project"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </button>

                    {/* Edit Button */}
                    <button
                      className="p-2 text-gray-500 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                      title="Edit project"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>

                    {/* More Options Button */}
                    <button
                      className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                      title="More options"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ==========================================================================
         Table Footer - Pagination placeholder
         ========================================================================== */}
      <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
        <p className="text-sm text-gray-500">
          Showing <span className="font-medium">1</span> to <span className="font-medium">{filteredProjects.length}</span> of{' '}
          <span className="font-medium">{filteredProjects.length}</span> projects
        </p>
        <div className="flex items-center gap-2">
          <button className="px-3 py-1.5 text-sm text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50" disabled>
            Previous
          </button>
          <button className="px-3 py-1.5 text-sm text-white bg-primary rounded-lg hover:bg-primary-dark transition-colors">
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectsTable;
