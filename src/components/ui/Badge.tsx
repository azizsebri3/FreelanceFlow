'use client';

/* ==========================================================================
   Badge Component
   Reusable status badge component
   ========================================================================== */

import React from 'react';

// ==========================================================================
// Props Interface
// ==========================================================================

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'success' | 'warning' | 'danger' | 'info' | 'secondary' | 'primary';
  size?: 'sm' | 'md';
  dot?: boolean;
}

// ==========================================================================
// Badge Component
// ==========================================================================

const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'secondary',
  size = 'md',
  dot = false,
}) => {
  // Variant styles
  const variantStyles = {
    success: 'bg-green-100 text-green-700',
    warning: 'bg-yellow-100 text-yellow-700',
    danger: 'bg-red-100 text-red-700',
    info: 'bg-blue-100 text-blue-700',
    secondary: 'bg-gray-100 text-gray-700',
    primary: 'bg-primary/10 text-primary',
  };

  // Dot colors
  const dotColors = {
    success: 'bg-green-500',
    warning: 'bg-yellow-500',
    danger: 'bg-red-500',
    info: 'bg-blue-500',
    secondary: 'bg-gray-500',
    primary: 'bg-primary',
  };

  // Size styles
  const sizeStyles = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
  };

  return (
    <span className={`
      inline-flex items-center gap-1.5
      font-medium rounded-full
      ${variantStyles[variant]}
      ${sizeStyles[size]}
    `}>
      {dot && (
        <span className={`w-1.5 h-1.5 rounded-full ${dotColors[variant]}`} />
      )}
      {children}
    </span>
  );
};

export default Badge;
