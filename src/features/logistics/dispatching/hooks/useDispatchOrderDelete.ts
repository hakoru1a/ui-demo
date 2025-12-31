import { useCallback, useState } from 'react';

import { openSnackbar } from 'api/snackbar';
import useBoolean from 'hooks/useBoolean';
import type { SnackbarProps } from 'types/snackbar';

import { dispatchOrderService } from '../api';
import type { DispatchOrder } from '../types';

// ==============================|| DISPATCH ORDER DELETE HOOK ||============================== //

/**
 * Hook to manage delete action for dispatch orders (single and bulk)
 * Handles dialog state, confirmation, and API call with notifications
 */
export function useDispatchOrderDelete(onSuccess?: (deletedIds: string[]) => void) {
  const confirmDialog = useBoolean(false);
  const [selectedOrders, setSelectedOrders] = useState<DispatchOrder[]>([]);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isBulkDelete, setIsBulkDelete] = useState(false);

  // Handle single delete action - opens confirmation dialog
  const handleDelete = useCallback(
    (order: DispatchOrder) => {
      setSelectedOrders([order]);
      setIsBulkDelete(false);
      confirmDialog.onTrue();
    },
    [confirmDialog]
  );

  // Handle bulk delete action - opens confirmation dialog
  const handleBulkDelete = useCallback(
    (orders: DispatchOrder[]) => {
      if (orders.length === 0) return;
      setSelectedOrders(orders);
      setIsBulkDelete(true);
      confirmDialog.onTrue();
    },
    [confirmDialog]
  );

  // Confirm delete action - calls API and shows notification
  const handleConfirmDelete = useCallback(async () => {
    if (selectedOrders.length === 0) return;

    setIsDeleting(true);
    try {
      if (isBulkDelete && selectedOrders.length > 1) {
        // Bulk delete
        const ids = selectedOrders.map((o) => o.id);
        const response = await dispatchOrderService.bulkDeleteDispatchOrders(ids);

        if (response.success) {
          confirmDialog.onFalse();
          const deletedIds = ids;
          setSelectedOrders([]);

          // Show success notification
          openSnackbar({
            open: true,
            message: `Đã xóa ${deletedIds.length} lệnh điều động thành công`,
            variant: 'alert',
            alert: { color: 'success' }
          } as SnackbarProps);

          onSuccess?.(deletedIds);
        } else {
          // Show error notification for failed response
          openSnackbar({
            open: true,
            message: 'Có lỗi xảy ra khi xóa lệnh điều động',
            variant: 'alert',
            alert: { color: 'error' }
          } as SnackbarProps);
        }
      } else {
        // Single delete
        const order = selectedOrders[0];
        const response = await dispatchOrderService.deleteDispatchOrder(order.id);

        if (response.success) {
          confirmDialog.onFalse();
          const deletedIds = [order.id];
          setSelectedOrders([]);

          // Show success notification
          openSnackbar({
            open: true,
            message: `Đã xóa lệnh điều động "${order.orderCode}" thành công`,
            variant: 'alert',
            alert: { color: 'success' }
          } as SnackbarProps);

          onSuccess?.(deletedIds);
        } else {
          // Show error notification for failed response
          openSnackbar({
            open: true,
            message: 'Có lỗi xảy ra khi xóa lệnh điều động',
            variant: 'alert',
            alert: { color: 'error' }
          } as SnackbarProps);
        }
      }
    } catch (error) {
      console.error('Error deleting dispatch order(s):', error);
      // Show error notification for exception
      openSnackbar({
        open: true,
        message: 'Có lỗi xảy ra khi xóa lệnh điều động',
        variant: 'alert',
        alert: { color: 'error' }
      } as SnackbarProps);
    } finally {
      setIsDeleting(false);
    }
  }, [selectedOrders, isBulkDelete, confirmDialog, onSuccess]);

  // Cancel delete action
  const handleCancelDelete = useCallback(() => {
    confirmDialog.onFalse();
    setSelectedOrders([]);
  }, [confirmDialog]);

  return {
    confirmDialog,
    selectedOrders,
    isDeleting,
    isBulkDelete,
    handleDelete,
    handleBulkDelete,
    handleConfirmDelete,
    handleCancelDelete
  };
}
