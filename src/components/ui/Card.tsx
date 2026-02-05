'use client';

/* ==========================================================================
   Card Component
   Reusable card wrapper component
   ========================================================================== */

import React from 'react';

// ==========================================================================
// Props Interface
// ==========================================================================

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

interface CardHeaderProps {
  children: React.ReactNode;
  className?: string;
  action?: React.ReactNode;
}

interface CardBodyProps {
  children: React.ReactNode;
  className?: string;
}

interface CardFooterProps {
  children: React.ReactNode;
  className?: string;
}

// ==========================================================================
// Card Component
// ==========================================================================

const Card: React.FC<CardProps> & {
  Header: React.FC<CardHeaderProps>;
  Body: React.FC<CardBodyProps>;
  Footer: React.FC<CardFooterProps>;
} = ({
  children,
  className = '',
  hover = false,
  padding = 'none',
}) => {
  const paddingStyles = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  return (
    <div className={`
      bg-white rounded-lg border border-gray-200 shadow-sm
      ${hover ? 'card-hover' : ''}
      ${paddingStyles[padding]}
      ${className}
    `}>
      {children}
    </div>
  );
};

// ==========================================================================
// Card Header Component
// ==========================================================================

const CardHeader: React.FC<CardHeaderProps> = ({
  children,
  className = '',
  action,
}) => {
  return (
    <div className={`
      flex items-center justify-between
      px-6 py-4 border-b border-gray-200
      ${className}
    `}>
      <div>{children}</div>
      {action && <div>{action}</div>}
    </div>
  );
};

// ==========================================================================
// Card Body Component
// ==========================================================================

const CardBody: React.FC<CardBodyProps> = ({
  children,
  className = '',
}) => {
  return (
    <div className={`p-6 ${className}`}>
      {children}
    </div>
  );
};

// ==========================================================================
// Card Footer Component
// ==========================================================================

const CardFooter: React.FC<CardFooterProps> = ({
  children,
  className = '',
}) => {
  return (
    <div className={`
      px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-lg
      ${className}
    `}>
      {children}
    </div>
  );
};

// Attach sub-components
Card.Header = CardHeader;
Card.Body = CardBody;
Card.Footer = CardFooter;

export default Card;
