'use client';

/* ==========================================================================
   Confirmation Dialog
   Production-ready confirmation dialog for destructive actions
   ========================================================================== */

import React, { useEffect } from 'react';

export type ConfirmType = 'danger' | 'warning' | 'info';

export interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  type?: ConfirmType;
  onConfirm: () => void;
  onCancel: () => void;
}

// ==========================================================================
// Confirmation Dialog Component
// ==========================================================================

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  type = 'danger',
  onConfirm,
  onCancel,
}) => {
  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onCancel();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Prevent body scroll
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  const getTypeStyles = () => {
    switch (type) {
      case 'danger':
        return {
          icon: (
            <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          ),
          confirmButton: 'bg-red-600 hover:bg-red-700 focus:ring-red-500',
          border: 'border-red-200',
          bg: 'bg-red-50',
        };
      case 'warning':
        return {
          icon: (
            <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          ),
          confirmButton: 'bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500',
          border: 'border-yellow-200',
          bg: 'bg-yellow-50',
        };
      case 'info':
      default:
        return {
          icon: (
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ),
          confirmButton: 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500',
          border: 'border-blue-200',
          bg: 'bg-blue-50',
        };
    }
  };

  const styles = getTypeStyles();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className={`bg-white rounded-lg shadow-xl border max-w-md w-full ${styles.border}`}>
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center mb-4">
            <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${styles.bg}`}>
              {styles.icon}
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            </div>
          </div>

          {/* Message */}
          <div className="mb-6">
            <p className="text-sm text-gray-600">{message}</p>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3">
            <button
              onClick={onCancel}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
            >
              {cancelLabel}
            </button>
            <button
              onClick={onConfirm}
              className={`px-4 py-2 text-sm font-medium text-white border border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors ${styles.confirmButton}`}
            >
              {confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ==========================================================================
// Hook for Confirmation Dialog
// ==========================================================================

export const useConfirmDialog = () => {
  const context = React.useContext(ConfirmDialogContext);
  if (!context) {
    throw new Error('useConfirmDialog must be used within a ConfirmDialogProvider');
  }
  return context;
};

// ==========================================================================
// Confirm Dialog Provider
// ==========================================================================

interface ConfirmDialogContextType {
  confirm: (config: Omit<ConfirmDialogProps, 'isOpen' | 'onConfirm' | 'onCancel'>) => Promise<boolean>;
  close: () => void;
}

const ConfirmDialogContext = React.createContext<ConfirmDialogContextType | undefined>(undefined);

interface ConfirmDialogProviderProps {
  children: React.ReactNode;
}

export const ConfirmDialogProvider: React.FC<ConfirmDialogProviderProps> = ({ children }) => {
  const [dialogState, setDialogState] = React.useState<{
    isOpen: boolean;
    config?: ConfirmDialogProps;
  }>({
    isOpen: false,
  });

  const confirm = React.useCallback((config: Omit<ConfirmDialogProps, 'isOpen' | 'onConfirm' | 'onCancel'>) => {
    return new Promise<boolean>((resolve) => {
      setDialogState({
        isOpen: true,
        config: {
          ...config,
          isOpen: true,
          onConfirm: () => {
            setDialogState({ isOpen: false });
            resolve(true);
          },
          onCancel: () => {
            setDialogState({ isOpen: false });
            resolve(false);
          },
        },
      });
    });
  }, []);

  const close = React.useCallback(() => {
    setDialogState({ isOpen: false });
  }, []);

  // Store the confirm function in a ref so it can be accessed by the context
  const confirmRef = React.useRef(confirm);
  confirmRef.current = confirm;

  const contextValue = React.useMemo(() => ({
    confirm: confirmRef.current,
    close,
  }), [close]);

  return (
    <ConfirmDialogContext.Provider value={contextValue}>
      {children}
      <ConfirmDialog
        isOpen={dialogState.isOpen}
        onConfirm={() => dialogState.config?.onConfirm?.()}
        onCancel={() => dialogState.config?.onCancel?.()}
        title={dialogState.config?.title || 'Confirm'}
        message={dialogState.config?.message || 'Are you sure?'}
        confirmLabel={dialogState.config?.confirmLabel}
        cancelLabel={dialogState.config?.cancelLabel}
        type={dialogState.config?.type}
      />
    </ConfirmDialogContext.Provider>
  );
};

export default ConfirmDialog;