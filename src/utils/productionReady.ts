/* ==========================================================================
   Production-Ready Components & Utilities Index
   Centralized exports for all production-ready features
   ========================================================================== */

// ==========================================================================
// Validation System
// ==========================================================================

export * from '../utils/validation';

// ==========================================================================
// Error Handling System
// ==========================================================================

export * from '../utils/errorHandling';

// ==========================================================================
// Performance Optimization Hooks
// ==========================================================================

export * from '../hooks/performance';

// ==========================================================================
// UI Components
// ==========================================================================

export * from '../components/ui/Toast';
export * from '../components/ui/ConfirmDialog';
export * from '../components/ui/LoadingStates';
export * from '../components/ui/ErrorBoundary';

// ==========================================================================
// API Service Layer
// ==========================================================================

export * from '../services/api';

// ==========================================================================
// Production-Ready Hook Combinations
// ==========================================================================

import { useFormHandlers, useModalState } from '../hooks/performance';
import { useAsyncOperation } from '../components/ui/LoadingStates';
import { useToast } from '../components/ui/Toast';
import { useConfirmDialog } from '../components/ui/ConfirmDialog';

// Combined hook for CRUD operations with full production features
export const useProductionCRUD = <T extends Record<string, any>>(
  initialData: T,
  onSubmit: (data: T) => Promise<void>,
  onDelete?: (id: string | number) => Promise<void>
) => {
  const { showToast } = useToast();
  const { confirm } = useConfirmDialog();

  const formHandlers = useFormHandlers(initialData, async (data) => {
    try {
      await onSubmit(data);
      showToast({
        type: 'success',
        title: 'Success',
        message: 'Operation completed successfully',
      });
    } catch (error) {
      console.error('Form submission error:', error);
      showToast({
        type: 'error',
        title: 'Error',
        message: 'An error occurred while processing your request',
      });
    }
  });

  const asyncOps = useAsyncOperation();

  const handleDelete = async (id: string | number, itemName: string) => {
    const confirmed = await confirm({
      title: 'Confirm Deletion',
      message: `Are you sure you want to delete ${itemName}? This action cannot be undone.`,
      type: 'danger',
    });

    if (confirmed && onDelete) {
      asyncOps.executeAsync(
        () => onDelete(id),
        () => {
          showToast({
            type: 'success',
            title: 'Deleted',
            message: `${itemName} has been deleted successfully`,
          });
        },
        (error) => {
          showToast({
            type: 'error',
            title: 'Delete Failed',
            message: error,
          });
        }
      );
    }
  };

  return {
    ...formHandlers,
    ...asyncOps,
    handleDelete,
  };
};

// Combined hook for modal CRUD operations
export const useModalCRUD = <T extends Record<string, any>>(
  initialData: T,
  onSubmit: (data: T) => Promise<void>,
  onDelete?: (id: string | number) => Promise<void>
) => {
  const modalState = useModalState();
  const crudOps = useProductionCRUD(initialData, onSubmit, onDelete);

  const openCreateModal = () => {
    crudOps.resetForm();
    modalState.openModal();
  };

  const openEditModal = (data: T) => {
    crudOps.setFormData(data);
    modalState.openModal(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    await crudOps.handleSubmit(e);
    if (!crudOps.isSubmitting) {
      modalState.closeModal();
    }
  };

  return {
    ...modalState,
    ...crudOps,
    openCreateModal,
    openEditModal,
    handleSubmit,
  };
};