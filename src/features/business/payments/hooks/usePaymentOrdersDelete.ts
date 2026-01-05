import { useCallback, useState } from 'react';

import { openSnackbar } from 'api/snackbar';
import useBoolean from 'hooks/useBoolean';
import type { SnackbarProps } from 'types/snackbar';

import paymentOrderService from '../api/index';
import type { PaymentOrder } from '../types';

// ==============================|| PAYMENT ORDERS DELETE HOOK ||============================== //

interface UsePaymentOrdersDeleteProps {
  onSuccess?: () => void;
}

/**
 * Hook to manage delete operations for Payment Orders
 * Handles both single and bulk delete with confirmation dialogs
 */
export function usePaymentOrdersDelete({ onSuccess }: UsePaymentOrdersDeleteProps = {}) {
  const confirmDialog = useBoolean(false);
  const [selectedItems, setSelectedItems] = useState<PaymentOrder[]>([]);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isBulkDelete, setIsBulkDelete] = useState(false);

  // Handle single delete action - opens confirmation dialog
  const handleDelete = useCallback(
    (paymentOrder: PaymentOrder) => {
      setSelectedItems([paymentOrder]);
      setIsBulkDelete(false);
      confirmDialog.onTrue();
    },
    [confirmDialog]
  );

  // Handle bulk delete action - opens confirmation dialog
  const handleBulkDelete = useCallback(
    (paymentOrders: PaymentOrder[]) => {
      setSelectedItems(paymentOrders);
      setIsBulkDelete(true);
      confirmDialog.onTrue();
    },
    [confirmDialog]
  );

  // Confirm delete action - calls API and shows notification
  const handleConfirmDelete = useCallback(async () => {
    if (selectedItems.length === 0) return;

    setIsDeleting(true);
    try {
      let response;
      if (isBulkDelete) {
        const ids = selectedItems.map((item) => item.id);
        response = await paymentOrderService.bulkDeletePaymentOrders(ids);
      } else {
        response = await paymentOrderService.deletePaymentOrder(selectedItems[0].id);
      }

      if (response.success) {
        confirmDialog.onFalse();
        setSelectedItems([]);
        setIsBulkDelete(false);

        // Show success notification
        const message = isBulkDelete
          ? `Đã xóa ${selectedItems.length} phiếu chi thành công`
          : `Đã xóa phiếu chi "${selectedItems[0].code}" thành công`;

        openSnackbar({
          open: true,
          message,
          variant: 'alert',
          alert: { color: 'success' }
        } as SnackbarProps);

        onSuccess?.();
      } else {
        // Show error notification for failed response
        openSnackbar({
          open: true,
          message: 'Có lỗi xảy ra khi xóa phiếu chi',
          variant: 'alert',
          alert: { color: 'error' }
        } as SnackbarProps);
      }
    } catch (error) {
      console.error('Error deleting payment order:', error);
      // Show error notification for exception
      openSnackbar({
        open: true,
        message: 'Có lỗi xảy ra khi xóa phiếu chi',
        variant: 'alert',
        alert: { color: 'error' }
      } as SnackbarProps);
    } finally {
      setIsDeleting(false);
    }
  }, [selectedItems, isBulkDelete, confirmDialog, onSuccess]);

  // Cancel delete action
  const handleCancelDelete = useCallback(() => {
    confirmDialog.onFalse();
    setSelectedItems([]);
    setIsBulkDelete(false);
  }, [confirmDialog]);

  return {
    confirmDialog,
    selectedItems,
    isDeleting,
    isBulkDelete,
    handleDelete,
    handleBulkDelete,
    handleConfirmDelete,
    handleCancelDelete
  };
}
