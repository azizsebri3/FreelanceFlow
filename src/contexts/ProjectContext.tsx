"use client";

/* ==========================================================================
   Project Context
   Global context for project creation and management
   ========================================================================== */

import React, { createContext, useContext, useState, ReactNode } from 'react';

// ==========================================================================
// Context Types
// ==========================================================================

interface ProjectContextType {
  isCreateModalOpen: boolean;
  openCreateModal: () => void;
  closeCreateModal: () => void;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

// ==========================================================================
// Project Provider Component
// ==========================================================================

interface ProjectProviderProps {
  children: ReactNode;
}

export const ProjectProvider: React.FC<ProjectProviderProps> = ({ children }) => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const openCreateModal = () => {
    setIsCreateModalOpen(true);
  };

  const closeCreateModal = () => {
    setIsCreateModalOpen(false);
  };

  const value = {
    isCreateModalOpen,
    openCreateModal,
    closeCreateModal,
  };

  return (
    <ProjectContext.Provider value={value}>
      {children}
    </ProjectContext.Provider>
  );
};

// ==========================================================================
// Hook to use Project Context
// ==========================================================================

export const useProjectContext = () => {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error('useProjectContext must be used within a ProjectProvider');
  }
  return context;
};