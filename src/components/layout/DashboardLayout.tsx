'use client';

/* ==========================================================================
   Dashboard Layout Component
   Wraps dashboard pages with sidebar and header
   ========================================================================== */

import React, { useState } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';

// ==========================================================================
// Props Interface
// ==========================================================================

interface DashboardLayoutProps {
  children: React.ReactNode;
}

// ==========================================================================
// Dashboard Layout Component
// ==========================================================================

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  // State for sidebar visibility (mobile responsive)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Toggle sidebar function
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex min-h-screen bg-[#F1F5F9]">
      {/* ==========================================================================
         Sidebar - Fixed on desktop, toggleable on mobile
         ========================================================================== */}
      <Sidebar isOpen={isSidebarOpen} onToggle={toggleSidebar} />

      {/* ==========================================================================
         Main Content Area - Pushed by sidebar on desktop
         ========================================================================== */}
      <div className="flex-1 flex flex-col min-h-screen lg:ml-[280px]">
        {/* Header - Sticky at top */}
        <Header onMenuToggle={toggleSidebar} />

        {/* Main Content */}
        <main className="flex-1 p-4 lg:p-6">
          {children}
        </main>

        {/* ==========================================================================
           Footer
           ========================================================================== */}
        <footer className="py-4 px-6 text-center text-sm text-gray-500 border-t border-gray-200 bg-white">
          <p>
            © {new Date().getFullYear()} FreelanceFlow. All rights reserved.
            <span className="mx-2">|</span>
            <a href="#" className="text-primary hover:underline">Privacy Policy</a>
            <span className="mx-2">|</span>
            <a href="#" className="text-primary hover:underline">Terms of Service</a>
          </p>
        </footer>
      </div>
    </div>
  );
};

export default DashboardLayout;
