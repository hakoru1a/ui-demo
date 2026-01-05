import { useState, useCallback } from 'react';

import type { WorkforceDispatchOrder } from '../types';

// ==============================|| WORKFORCE DISPATCH ORDERS DELETE HOOK ||============================== //

interface UseWorkforceDispatchOrdersDeleteProps {
  onSuccess?: () => void;
}

/**
 * Hook to manage delete operations for Workforce Dispatch Orders
 * Handles both single and bulk delete with confirmation dialogs
 */
export function useWorkforceDispatchOrdersDelete({ onSuccess }: UseWorkforceDispatchOrdersDeleteProps = {}) {
  const [confirmDialog, setConfirmDialog] = useState<{ open: boolean; orders: WorkforceDispatchOrder[]; isBulk: boolean }>({
    open: false,
    orders: [],
    isBulk: false
  });
  const [isDeleting, setIsDeleting] = useState(false);

  // Handle single delete
  const handleDelete = useCallback((order: WorkforceDispatchOrder) => {
    setConfirmDialog({ open: true, orders: [order], isBulk: false });
  }, []);

  // Handle bulk delete
  const handleBulkDelete = useCallback((orders: WorkforceDispatchOrder[]) => {
    setConfirmDialog({ open: true, orders, isBulk: true });
  }, []);

  // Handle confirm delete
  const handleConfirmDelete = useCallback(async () => {
    if (confirmDialog.orders.length === 0) return;

    setIsDeleting(true);
    try {
      // TODO: Call API to delete
      // For single delete: await workforceDispatchOrderService.deleteWorkforceDispatchOrder(confirmDialog.orders[0].id);
      // For bulk delete: await workforceDispatchOrderService.bulkDeleteWorkforceDispatchOrders(confirmDialog.orders.map(o => o.id));

      // Mock API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Close dialog and notify parent
      setConfirmDialog({ open: false, orders: [], isBulk: false });
      onSuccess?.();
    } catch (error) {
      console.error('Delete error:', error);
      // TODO: Show error notification
    } finally {
      setIsDeleting(false);
    }
  }, [confirmDialog.orders, onSuccess]);

  // Handle cancel delete
  const handleCancelDelete = useCallback(() => {
    setConfirmDialog({ open: false, orders: [], isBulk: false });
  }, []);

  return {
    confirmDialog,
    selectedItems: confirmDialog.orders,
    isDeleting,
    isBulkDelete: confirmDialog.isBulk,
    handleDelete,
    handleBulkDelete,
    handleConfirmDelete,
    handleCancelDelete
  };
}
