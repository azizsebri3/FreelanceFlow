/* ==========================================================================
   Loading States & Skeleton Components
   Production-ready loading states and skeleton loaders
   ========================================================================== */

import React, { useState, useCallback } from 'react';

// ==========================================================================
// Loading Spinner Component
// ==========================================================================

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: string;
  className?: string;
}

export const Spinner: React.FC<SpinnerProps> = ({
  size = 'md',
  color = 'text-blue-600',
  className = ''
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  return (
    <div
      className={`animate-spin rounded-full border-2 border-gray-300 border-t-current ${color} ${sizeClasses[size]} ${className}`}
      role="status"
      aria-label="Loading"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
};

// ==========================================================================
// Loading Button Component
// ==========================================================================

interface LoadingButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  loadingText?: string;
  spinnerSize?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export const LoadingButton: React.FC<LoadingButtonProps> = ({
  loading = false,
  loadingText,
  spinnerSize = 'sm',
  children,
  disabled,
  className = '',
  ...props
}) => {
  return (
    <button
      {...props}
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center ${className}`}
    >
      {loading && (
        <Spinner size={spinnerSize} className="mr-2" />
      )}
      {loading ? (loadingText || 'Loading...') : children}
    </button>
  );
};

// ==========================================================================
// Skeleton Loader Components
// ==========================================================================

interface SkeletonProps {
  className?: string;
  animate?: boolean;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className = '',
  animate = true
}) => {
  return (
    <div
      className={`bg-gray-200 rounded ${animate ? 'animate-pulse' : ''} ${className}`}
      aria-hidden="true"
    />
  );
};

// Card Skeleton
export const CardSkeleton: React.FC = () => (
  <div className="bg-white rounded-lg shadow-sm border p-6">
    <div className="flex items-center space-x-4">
      <Skeleton className="w-12 h-12 rounded-full" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
      </div>
    </div>
  </div>
);

// Table Skeleton
interface TableSkeletonProps {
  rows?: number;
  columns?: number;
}

export const TableSkeleton: React.FC<TableSkeletonProps> = ({
  rows = 5,
  columns = 4
}) => (
  <div className="space-y-4">
    {/* Table Header */}
    <div className="flex space-x-4">
      {Array.from({ length: columns }).map((_, i) => (
        <Skeleton key={`header-${i}`} className="h-4 flex-1" />
      ))}
    </div>

    {/* Table Rows */}
    {Array.from({ length: rows }).map((_, rowIndex) => (
      <div key={`row-${rowIndex}`} className="flex space-x-4">
        {Array.from({ length: columns }).map((_, colIndex) => (
          <Skeleton key={`cell-${rowIndex}-${colIndex}`} className="h-4 flex-1" />
        ))}
      </div>
    ))}
  </div>
);

// Form Skeleton
export const FormSkeleton: React.FC = () => (
  <div className="space-y-6">
    <div className="space-y-2">
      <Skeleton className="h-4 w-20" />
      <Skeleton className="h-10 w-full" />
    </div>
    <div className="space-y-2">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-10 w-full" />
    </div>
    <div className="space-y-2">
      <Skeleton className="h-4 w-16" />
      <Skeleton className="h-24 w-full" />
    </div>
    <div className="flex space-x-4">
      <Skeleton className="h-10 w-20" />
      <Skeleton className="h-10 w-24" />
    </div>
  </div>
);

// ==========================================================================
// Loading States Hook
// ==========================================================================

export const useLoadingState = (initialLoading = false) => {
  const [loading, setLoading] = useState(initialLoading);
  const [error, setError] = useState<string | null>(null);

  const startLoading = useCallback(() => {
    setLoading(true);
    setError(null);
  }, []);

  const stopLoading = useCallback(() => {
    setLoading(false);
  }, []);

  const setLoadingError = useCallback((errorMessage: string) => {
    setLoading(false);
    setError(errorMessage);
  }, []);

  const reset = useCallback(() => {
    setLoading(false);
    setError(null);
  }, []);

  return {
    loading,
    error,
    startLoading,
    stopLoading,
    setLoadingError,
    reset,
  };
};

// ==========================================================================
// Async Operation Wrapper with Loading
// ==========================================================================

export const useAsyncOperation = () => {
  const { loading, error, startLoading, stopLoading, setLoadingError } = useLoadingState();

  const executeAsync = useCallback(<T,>(
    operation: () => Promise<T>,
    onSuccess?: (result: T) => void,
    onError?: (error: string) => void
  ): Promise<T | null> => {
    return (async () => {
      startLoading();

      try {
        const result = await operation();
        stopLoading();
        onSuccess?.(result);
        return result;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'An error occurred';
        setLoadingError(errorMessage);
        onError?.(errorMessage);
        return null;
      }
    })();
  }, [startLoading, stopLoading, setLoadingError]);

  return {
    loading,
    error,
    executeAsync,
  };
};

// ==========================================================================
// Loading Overlay Component
// ==========================================================================

interface LoadingOverlayProps {
  loading: boolean;
  children: React.ReactNode;
  message?: string;
  className?: string;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  loading,
  children,
  message = 'Loading...',
  className = ''
}) => {
  if (!loading) return <>{children}</>;

  return (
    <div className={`relative ${className}`}>
      {children}
      <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center rounded-lg">
        <div className="text-center">
          <Spinner size="lg" className="mx-auto mb-2" />
          <p className="text-sm text-gray-600">{message}</p>
        </div>
      </div>
    </div>
  );
};

// ==========================================================================
// Progressive Loading Hook (commented out for now)
// ==========================================================================

/*
export const useProgressiveLoading = <T>(
  items: T[],
  itemsPerLoad = 10,
  delay = 100
) => {
  const [visibleItems, setVisibleItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const loadMore = useCallback(() => {
    if (loading || !hasMore) return;

    setLoading(true);

    setTimeout(() => {
      const currentLength = visibleItems.length;
      const nextItems = items.slice(currentLength, currentLength + itemsPerLoad);

      setVisibleItems(prev => [...prev, ...nextItems]);
      setHasMore(currentLength + nextItems.length < items.length);
      setLoading(false);
    }, delay);
  }, [items, visibleItems.length, itemsPerLoad, delay, loading, hasMore]);

  // Initial load
  React.useEffect(() => {
    const initialItems = items.slice(0, itemsPerLoad);
    setVisibleItems(initialItems);
    setHasMore(items.length > itemsPerLoad);
  }, [items, itemsPerLoad]);

  return {
    visibleItems,
    loading,
    hasMore,
    loadMore,
  };
};
*/

// ==========================================================================
// Loading Context for Global Loading States
// ==========================================================================

interface LoadingContextType {
  globalLoading: boolean;
  setGlobalLoading: (loading: boolean) => void;
  loadingMessage: string;
  setLoadingMessage: (message: string) => void;
}

const LoadingContext = React.createContext<LoadingContextType | undefined>(undefined);

export const LoadingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [globalLoading, setGlobalLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('Loading...');

  return (
    <LoadingContext.Provider
      value={{
        globalLoading,
        setGlobalLoading,
        loadingMessage,
        setLoadingMessage,
      }}
    >
      {children}
    </LoadingContext.Provider>
  );
};

export const useGlobalLoading = () => {
  const context = React.useContext(LoadingContext);
  if (!context) {
    throw new Error('useGlobalLoading must be used within a LoadingProvider');
  }
  return context;
};

// ==========================================================================
// Global Loading Overlay
// ==========================================================================

export const GlobalLoadingOverlay: React.FC = () => {
  const { globalLoading, loadingMessage } = useGlobalLoading();

  if (!globalLoading) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 shadow-lg text-center">
        <Spinner size="lg" className="mx-auto mb-4" />
        <p className="text-gray-700">{loadingMessage}</p>
      </div>
    </div>
  );
};