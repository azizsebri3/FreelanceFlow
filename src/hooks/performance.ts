/* ==========================================================================
   Performance Optimization Hooks
   Memoization and callback optimization for React components
   ========================================================================== */

import { useMemo, useCallback, useRef, useEffect, useState } from 'react';

// ==========================================================================
// Memoized Values Hook
// ==========================================================================

export const useMemoizedValue = <T>(value: T, deps: React.DependencyList = []): T => {
  return useMemo(() => value, deps);
};

// ==========================================================================
// Stable Callback Hook
// ==========================================================================

export const useStableCallback = <T extends (...args: any[]) => any>(
  callback: T,
  deps: React.DependencyList = []
): T => {
  return useCallback(callback, deps);
};

// ==========================================================================
// Debounced Value Hook
// ==========================================================================

export const useDebounce = <T>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

// ==========================================================================
// Throttled Callback Hook
// ==========================================================================

export const useThrottle = <T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): T => {
  const lastRan = useRef<number>(0);

  return useCallback((...args: Parameters<T>) => {
    if (Date.now() - lastRan.current >= delay) {
      callback(...args);
      lastRan.current = Date.now();
    }
  }, [callback, delay]) as T;
};

// ==========================================================================
// Memoized Expensive Computations
// ==========================================================================

export const useMemoizedComputation = <T>(
  computation: () => T,
  deps: React.DependencyList
): T => {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useMemo(computation, deps);
};

// ==========================================================================
// Optimized Event Handlers for Forms
// ==========================================================================

export const useFormHandlers = <T extends Record<string, any>>(
  initialData: T,
  onSubmit: (data: T) => void | Promise<void>
) => {
  const [formData, setFormData] = useState<T>(initialData);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = useStableCallback((field: keyof T, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);

  const handleSubmit = useStableCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, onSubmit, isSubmitting]);

  const resetForm = useStableCallback(() => {
    setFormData(initialData);
  }, [initialData]);

  return {
    formData,
    isSubmitting,
    handleChange,
    handleSubmit,
    resetForm,
    setFormData,
  };
};

// ==========================================================================
// Optimized Modal State Management
// ==========================================================================

export const useModalState = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [modalData, setModalData] = useState<any>(null);

  const openModal = useStableCallback((data?: any) => {
    setModalData(data);
    setIsOpen(true);
  }, []);

  const closeModal = useStableCallback(() => {
    setIsOpen(false);
    setModalData(null);
  }, []);

  return {
    isOpen,
    modalData,
    openModal,
    closeModal,
  };
};

// ==========================================================================
// Optimized Table/Data Filtering
// ==========================================================================

export const useFilteredData = <T>(
  data: T[],
  filterFn: (item: T, query: string) => boolean,
  query: string
): T[] => {
  return useMemo(() => {
    if (!query.trim()) return data;
    return data.filter(item => filterFn(item, query.toLowerCase()));
  }, [data, filterFn, query]);
};

// ==========================================================================
// Optimized Sorting
// ==========================================================================

export const useSortedData = <T>(
  data: T[],
  sortFn: (a: T, b: T) => number,
  sortOrder: 'asc' | 'desc' = 'asc'
): T[] => {
  return useMemo(() => {
    const sorted = [...data].sort(sortFn);
    return sortOrder === 'desc' ? sorted.reverse() : sorted;
  }, [data, sortFn, sortOrder]);
};

// ==========================================================================
// Optimized Pagination
// ==========================================================================

export const usePagination = <T>(
  data: T[],
  itemsPerPage: number,
  currentPage: number
) => {
  const totalPages = useMemo(() => Math.ceil(data.length / itemsPerPage), [data.length, itemsPerPage]);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return data.slice(startIndex, startIndex + itemsPerPage);
  }, [data, itemsPerPage, currentPage]);

  const goToPage = useStableCallback((page: number) => {
    return Math.max(1, Math.min(page, totalPages));
  }, [totalPages]);

  return {
    paginatedData,
    totalPages,
    currentPage: Math.min(currentPage, totalPages),
    goToPage,
    hasNextPage: currentPage < totalPages,
    hasPrevPage: currentPage > 1,
  };
};

// ==========================================================================
// Performance Monitoring Hook
// ==========================================================================

export const usePerformanceMonitor = (componentName: string) => {
  const renderCount = useRef(0);
  const lastRenderTime = useRef<number>(0);

  useEffect(() => {
    renderCount.current += 1;
    const now = Date.now();
    const renderTime = now - lastRenderTime.current;

    if (process.env.NODE_ENV === 'development') {
      console.log(`${componentName} rendered ${renderCount.current} times, last render took ${renderTime}ms`);
    }

    lastRenderTime.current = now;
  });

  return renderCount.current;
};

// ==========================================================================
// Lazy Loading Hook
// ==========================================================================

export const useLazyLoad = (ref: React.RefObject<Element>, options?: IntersectionObserverInit) => {
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
      },
      options
    );

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [ref, options]);

  return isIntersecting;
};

// ==========================================================================
// Optimized API Calls with Caching
// ==========================================================================

const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export const useCachedApiCall = <T>(
  key: string,
  apiCall: () => Promise<T>,
  enabled = true
): { data: T | null; loading: boolean; error: Error | null; refetch: () => void } => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useStableCallback(async () => {
    const cached = cache.get(key);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      setData(cached.data);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await apiCall();
      setData(result);
      cache.set(key, { data: result, timestamp: Date.now() });
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [key, apiCall]);

  useEffect(() => {
    if (enabled) {
      fetchData();
    }
  }, [enabled, fetchData]);

  return { data, loading, error, refetch: fetchData };
};