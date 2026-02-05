'use client';

/* ==========================================================================
   Sidebar Component
   Main navigation sidebar with collapsible menu items
   Pushes content when open (not overlay)
   ========================================================================== */

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { navigationItems, NavigationItem } from '@/data/placeholder';

// ==========================================================================
// Icon Components - Reusable SVG icons for navigation
// ==========================================================================

const icons: Record<string, React.ReactNode> = {
  dashboard: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
  ),
  projects: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
    </svg>
  ),
  clients: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
  ),
  invoices: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  ),
  calendar: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  ),
  messages: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
    </svg>
  ),
  reports: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  ),
  settings: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
        d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
};

// ==========================================================================
// Props Interface
// ==========================================================================

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

// ==========================================================================
// Navigation Item Component
// ==========================================================================

interface NavItemProps {
  item: NavigationItem;
  isActive: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ item, isActive }) => {
  return (
    <Link
      href={item.href}
      className={`
        nav-item group relative
        ${isActive 
          ? 'bg-primary text-white' 
          : 'text-gray-300 hover:bg-white/5 hover:text-white'
        }
      `}
    >
      {/* Icon */}
      <span className="flex-shrink-0">
        {icons[item.icon]}
      </span>
      
      {/* Label */}
      <span className="font-medium text-sm">
        {item.label}
      </span>
      
      {/* Badge - Shows notification count */}
      {item.badge && (
        <span className={`
          ml-auto px-2 py-0.5 text-xs font-semibold rounded-full
          ${isActive 
            ? 'bg-white/20 text-white' 
            : 'bg-primary text-white'
          }
        `}>
          {item.badge}
        </span>
      )}
    </Link>
  );
};

// ==========================================================================
// Sidebar Component
// ==========================================================================

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onToggle }) => {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile Overlay - Only visible on mobile when sidebar is open */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onToggle}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`
          fixed left-0 top-0 z-50 h-screen
          bg-gray-900 text-white
          transition-all duration-300 ease-in-out
          ${isOpen ? 'w-[280px]' : 'w-0 lg:w-[280px]'}
          overflow-hidden
        `}
      >
        <div className="flex flex-col h-full w-[280px]">
          {/* ==========================================================================
             Logo Section
             ========================================================================== */}
          <div className="flex items-center justify-between h-[72px] px-6 border-b border-white/10">
            <Link href="/" className="flex items-center gap-3">
              {/* Logo Icon */}
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              {/* Logo Text */}
              <span className="text-xl font-bold">FreelanceFlow</span>
            </Link>

            {/* Close Button - Mobile only */}
            <button
              onClick={onToggle}
              className="lg:hidden p-2 rounded-lg hover:bg-white/10 transition-colors"
              aria-label="Close sidebar"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* ==========================================================================
             Navigation Menu
             ========================================================================== */}
          <nav className="flex-1 px-4 py-6 overflow-y-auto">
            {/* Menu Label */}
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4 px-3">
              Menu
            </p>

            {/* Navigation Items */}
            <div className="space-y-1">
              {navigationItems.map((item) => (
                <NavItem
                  key={item.id}
                  item={item}
                  isActive={pathname === item.href}
                />
              ))}
            </div>
          </nav>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
