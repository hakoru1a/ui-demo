import { useCallback, useState } from 'react';

import { openSnackbar } from 'api/snackbar';
import useBoolean from 'hooks/useBoolean';
import type { SnackbarProps } from 'types/snackbar';

import { materialReceiptService } from '../api';
import type { MaterialReceipt } from '../types';

// ==============================|| MATERIAL RECEIPT DELETE HOOK ||============================== //

/**
 * Hook to manage delete action for material receipts (single and bulk)
 * Handles dialog state, confirmation, and API call with notifications
 */
export function useMaterialReceiptDelete(onSuccess?: (deletedIds: string[]) => void) {
  const confirmDialog = useBoolean(false);
  const [selectedReceipts, setSelectedReceipts] = useState<MaterialReceipt[]>([]);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isBulkDelete, setIsBulkDelete] = useState(false);

  // Handle single delete action - opens confirmation dialog
  const handleDelete = useCallback(
    (receipt: MaterialReceipt) => {
      setSelectedReceipts([receipt]);
      setIsBulkDelete(false);
      confirmDialog.onTrue();
    },
    [confirmDialog]
  );

  // Handle bulk delete action - opens confirmation dialog
  const handleBulkDelete = useCallback(
    (receipts: MaterialReceipt[]) => {
      if (receipts.length === 0) return;
      setSelectedReceipts(receipts);
      setIsBulkDelete(true);
      confirmDialog.onTrue();
    },
    [confirmDialog]
  );

  // Confirm delete action - calls API and shows notification
  const handleConfirmDelete = useCallback(async () => {
    if (selectedReceipts.length === 0) return;

    setIsDeleting(true);
    try {
      if (isBulkDelete && selectedReceipts.length > 1) {
        // Bulk delete
        const ids = selectedReceipts.map((r) => r.id);
        const response = await materialReceiptService.bulkDeleteMaterialReceipts(ids);

        if (response.success) {
          confirmDialog.onFalse();
          const deletedIds = ids;
          setSelectedReceipts([]);

          // Show success notification
          openSnackbar({
            open: true,
            message: `Đã xóa ${deletedIds.length} phiếu nhập thành công`,
            variant: 'alert',
            alert: { color: 'success' }
          } as SnackbarProps);

          onSuccess?.(deletedIds);
        } else {
          // Show error notification for failed response
          openSnackbar({
            open: true,
            message: 'Có lỗi xảy ra khi xóa phiếu nhập',
            variant: 'alert',
            alert: { color: 'error' }
          } as SnackbarProps);
        }
      } else {
        // Single delete
        const receipt = selectedReceipts[0];
        const response = await materialReceiptService.deleteMaterialReceipt(receipt.id);

        if (response.success) {
          confirmDialog.onFalse();
          const deletedIds = [receipt.id];
          setSelectedReceipts([]);

          // Show success notification
          openSnackbar({
            open: true,
            message: `Đã xóa phiếu nhập "${receipt.code}" thành công`,
            variant: 'alert',
            alert: { color: 'success' }
          } as SnackbarProps);

          onSuccess?.(deletedIds);
        } else {
          // Show error notification for failed response
          openSnackbar({
            open: true,
            message: 'Có lỗi xảy ra khi xóa phiếu nhập',
            variant: 'alert',
            alert: { color: 'error' }
          } as SnackbarProps);
        }
      }
    } catch (error) {
      console.error('Error deleting material receipt(s):', error);
      // Show error notification for exception
      openSnackbar({
        open: true,
        message: 'Có lỗi xảy ra khi xóa phiếu nhập',
        variant: 'alert',
        alert: { color: 'error' }
      } as SnackbarProps);
    } finally {
      setIsDeleting(false);
    }
  }, [selectedReceipts, isBulkDelete, confirmDialog, onSuccess]);

  // Cancel delete action
  const handleCancelDelete = useCallback(() => {
    confirmDialog.onFalse();
    setSelectedReceipts([]);
  }, [confirmDialog]);

  return {
    confirmDialog,
    selectedReceipts,
    isDeleting,
    isBulkDelete,
    handleDelete,
    handleBulkDelete,
    handleConfirmDelete,
    handleCancelDelete
  };
}
