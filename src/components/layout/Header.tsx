'use client';

/* ==========================================================================
   Header Component
   Sticky navigation header with search, notifications, and user menu
   ========================================================================== */

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { userData } from '@/data/placeholder';
import { useProjectContext } from '@/contexts/ProjectContext';

// ==========================================================================
// Props Interface
// ==========================================================================

interface HeaderProps {
  onMenuToggle: () => void;
}

// ==========================================================================
// Header Component
// ==========================================================================

const Header: React.FC<HeaderProps> = ({ onMenuToggle }) => {
  // State for dropdown menus
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  
  // Router for navigation
  const router = useRouter();
  
  // Project context for modal management
  const { openCreateModal } = useProjectContext();

  // Sample notifications - Replace with actual data
  const notifications = [
    { id: 1, title: 'New payment received', time: '2 min ago', read: false },
    { id: 2, title: 'Project deadline approaching', time: '1 hour ago', read: false },
    { id: 3, title: 'Client feedback received', time: '3 hours ago', read: true },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
      <div className="flex items-center justify-between h-[72px] px-4 lg:px-6">
        {/* ==========================================================================
           Left Section - Menu Toggle & Search
           ========================================================================== */}
        <div className="flex items-center gap-4">
          {/* Mobile Menu Toggle Button */}
          <button
            onClick={onMenuToggle}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          {/* Search Input - Hidden on mobile */}
          <div className="hidden md:block relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search projects, clients, invoices..."
              className="w-80 pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
            />
            {/* Keyboard Shortcut Hint */}
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <span className="text-xs text-gray-400 bg-gray-200 px-1.5 py-0.5 rounded">
                ⌘K
              </span>
            </div>
          </div>
        </div>

        {/* ==========================================================================
           Right Section - Actions & User Menu
           ========================================================================== */}
        <div className="flex items-center gap-3">
          {/* Mobile Search Button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Search"
          >
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>

          {/* Mobile New Project Button */}
          <button
            onClick={() => router.push('/projects?create=true')}
            className="sm:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="New Project"
          >
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>

          {/* Quick Add Button */}
          <button
            onClick={() => router.push('/projects?create=true')}
            className="hidden sm:flex items-center gap-2 px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-dark transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span>New Project</span>
          </button>

          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
              className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Notifications"
            >
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              {/* Notification Badge */}
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            {/* Notifications Dropdown Menu */}
            {isNotificationsOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 py-2 animate-fade-in">
                <div className="px-4 py-2 border-b border-gray-100">
                  <h3 className="font-semibold text-gray-900">Notifications</h3>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`
                        px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors
                        ${!notification.read ? 'bg-blue-50/50' : ''}
                      `}
                    >
                      <p className="text-sm text-gray-900">{notification.title}</p>
                      <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                    </div>
                  ))}
                </div>
                <div className="px-4 py-2 border-t border-gray-100">
                  <button className="text-sm text-primary hover:underline">
                    View all notifications
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Messages Button */}
          <button
            className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Messages"
          >
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            {/* Message Badge */}
            <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-red-500 text-white text-xs font-medium rounded-full flex items-center justify-center">
              5
            </span>
          </button>

          {/* Divider */}
          <div className="hidden sm:block w-px h-8 bg-gray-200"></div>

          {/* User Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="flex items-center gap-3 p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
            >
              {/* User Avatar */}
              <div className="w-9 h-9 bg-gradient-to-br from-primary to-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                {userData.name.split(' ').map(n => n[0]).join('')}
              </div>
              {/* User Info - Hidden on mobile */}
              <div className="hidden lg:block text-left">
                <p className="text-sm font-medium text-gray-900">{userData.name}</p>
                <p className="text-xs text-gray-500">{userData.role}</p>
              </div>
              {/* Dropdown Arrow */}
              <svg className="hidden lg:block w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* User Dropdown Menu */}
            {isUserMenuOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 animate-fade-in">
                <div className="px-4 py-3 border-b border-gray-100">
                  <p className="text-sm font-medium text-gray-900">{userData.name}</p>
                  <p className="text-xs text-gray-500">{userData.email}</p>
                </div>
                <div className="py-1">
                  <a href="#" className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    My Profile
                  </a>
                  <a href="#" className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Account Settings
                  </a>
                  <a href="#" className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Help & Support
                  </a>
                </div>
                <div className="border-t border-gray-100 pt-1">
                  <button className="flex items-center gap-3 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
