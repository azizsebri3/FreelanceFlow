/* ==========================================================================
   Error Handling System
   Production-ready error handling for API calls and user feedback
   ========================================================================== */

export interface AppError {
  code: string;
  message: string;
  details?: any;
  timestamp: Date;
}

export type ErrorType =
  | 'NETWORK_ERROR'
  | 'VALIDATION_ERROR'
  | 'AUTHENTICATION_ERROR'
  | 'AUTHORIZATION_ERROR'
  | 'NOT_FOUND_ERROR'
  | 'SERVER_ERROR'
  | 'UNKNOWN_ERROR';

// ==========================================================================
// Error Class
// ==========================================================================

export class FreelanceFlowError extends Error {
  public readonly type: ErrorType;
  public readonly code: string;
  public readonly details?: any;
  public readonly timestamp: Date;

  constructor(type: ErrorType, message: string, code?: string, details?: any) {
    super(message);
    this.name = 'FreelanceFlowError';
    this.type = type;
    this.code = code || type;
    this.details = details;
    this.timestamp = new Date();
  }
}

// ==========================================================================
// Error Factory Functions
// ==========================================================================

export const createNetworkError = (message = 'Network connection failed'): FreelanceFlowError => {
  return new FreelanceFlowError('NETWORK_ERROR', message);
};

export const createValidationError = (message: string, details?: any): FreelanceFlowError => {
  return new FreelanceFlowError('VALIDATION_ERROR', message, 'VALIDATION_ERROR', details);
};

export const createAuthenticationError = (message = 'Authentication required'): FreelanceFlowError => {
  return new FreelanceFlowError('AUTHENTICATION_ERROR', message);
};

export const createAuthorizationError = (message = 'Access denied'): FreelanceFlowError => {
  return new FreelanceFlowError('AUTHORIZATION_ERROR', message);
};

export const createNotFoundError = (resource = 'Resource'): FreelanceFlowError => {
  return new FreelanceFlowError('NOT_FOUND_ERROR', `${resource} not found`);
};

export const createServerError = (message = 'Server error occurred'): FreelanceFlowError => {
  return new FreelanceFlowError('SERVER_ERROR', message);
};

export const createUnknownError = (message = 'An unexpected error occurred'): FreelanceFlowError => {
  return new FreelanceFlowError('UNKNOWN_ERROR', message);
};

// ==========================================================================
// Error Parser for API Responses
// ==========================================================================

export const parseApiError = (error: any): FreelanceFlowError => {
  // Network errors
  if (!error.response) {
    return createNetworkError();
  }

  const { status, data } = error.response;

  // Server errors
  if (status >= 500) {
    return createServerError(data?.message || 'Server error occurred');
  }

  // Client errors
  switch (status) {
    case 400:
      return createValidationError(data?.message || 'Invalid request', data?.errors);
    case 401:
      return createAuthenticationError(data?.message || 'Authentication required');
    case 403:
      return createAuthorizationError(data?.message || 'Access denied');
    case 404:
      return createNotFoundError(data?.resource || 'Resource');
    case 422:
      return createValidationError(data?.message || 'Validation failed', data?.errors);
    default:
      return createUnknownError(data?.message || `Request failed with status ${status}`);
  }
};

// ==========================================================================
// Error Handler Hook (commented out due to circular dependency)
// ==========================================================================

/*
export const useErrorHandler = () => {
  const { showToast } = useToast();

  const handleError = useCallback((error: unknown, context?: string) => {
    let appError: FreelanceFlowError;

    if (error instanceof FreelanceFlowError) {
      appError = error;
    } else if (error instanceof Error) {
      appError = createUnknownError(error.message);
    } else {
      appError = createUnknownError('An unexpected error occurred');
    }

    // Log error for monitoring
    console.error(`[${appError.type}] ${context ? `${context}: ` : ''}${appError.message}`, {
      code: appError.code,
      details: appError.details,
      timestamp: appError.timestamp,
      stack: appError.stack,
    });

    // Show user-friendly message
    const userMessage = getUserFriendlyMessage(appError);

    showToast({
      type: 'error',
      title: 'Error',
      message: userMessage,
      duration: 6000,
    });

    return appError;
  }, [showToast]);

  return { handleError };
};
*/

// ==========================================================================
// User-Friendly Error Messages
// ==========================================================================

const getUserFriendlyMessage = (error: FreelanceFlowError): string => {
  switch (error.type) {
    case 'NETWORK_ERROR':
      return 'Connection failed. Please check your internet connection and try again.';
    case 'VALIDATION_ERROR':
      return error.message || 'Please check your input and try again.';
    case 'AUTHENTICATION_ERROR':
      return 'Please log in to continue.';
    case 'AUTHORIZATION_ERROR':
      return 'You don\'t have permission to perform this action.';
    case 'NOT_FOUND_ERROR':
      return 'The requested item was not found.';
    case 'SERVER_ERROR':
      return 'Server error occurred. Please try again later.';
    case 'UNKNOWN_ERROR':
    default:
      return 'Something went wrong. Please try again.';
  }
};

// ==========================================================================
// Async Operation Wrapper
// ==========================================================================

export const withErrorHandling = async <T>(
  operation: () => Promise<T>,
  errorHandler: (error: FreelanceFlowError) => void,
  context?: string
): Promise<T | null> => {
  try {
    return await operation();
  } catch (error) {
    const appError = error instanceof FreelanceFlowError
      ? error
      : parseApiError(error);

    errorHandler(appError);
    return null;
  }
};

// ==========================================================================
// Retry Mechanism
// ==========================================================================

export const withRetry = async <T>(
  operation: () => Promise<T>,
  maxRetries = 3,
  delay = 1000
): Promise<T> => {
  let lastError: unknown;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;

      if (attempt === maxRetries) {
        throw error;
      }

      // Exponential backoff
      await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, attempt - 1)));
    }
  }

  throw lastError;
};