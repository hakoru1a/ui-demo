import { useCallback, useState } from 'react';

import { openSnackbar } from 'api/snackbar';
import useBoolean from 'hooks/useBoolean';
import type { SnackbarProps } from 'types/snackbar';

import skuService from '../api/index';
import type { Sku } from '../types';

// ==============================|| SKU DELETE HOOK ||============================== //

interface UseSkuDeleteProps {
  onSuccess?: () => void;
}

/**
 * Hook to manage delete operations for SKUs
 * Handles both single and bulk delete with confirmation dialogs
 */
export function useSkuDelete({ onSuccess }: UseSkuDeleteProps = {}) {
  const confirmDialog = useBoolean(false);
  const [selectedItems, setSelectedItems] = useState<Sku[]>([]);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isBulkDelete, setIsBulkDelete] = useState(false);

  // Handle single delete action - opens confirmation dialog
  const handleDelete = useCallback(
    (sku: Sku) => {
      setSelectedItems([sku]);
      setIsBulkDelete(false);
      confirmDialog.onTrue();
    },
    [confirmDialog]
  );

  // Handle bulk delete action - opens confirmation dialog
  const handleBulkDelete = useCallback(
    (skus: Sku[]) => {
      setSelectedItems(skus);
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
        response = await skuService.bulkDeleteSkus(ids);
      } else {
        response = await skuService.deleteSku(selectedItems[0].id);
      }

      if (response.success) {
        confirmDialog.onFalse();
        setSelectedItems([]);
        setIsBulkDelete(false);

        // Show success notification
        const message = isBulkDelete ? `Đã xóa ${selectedItems.length} SKU thành công` : `Đã xóa SKU "${selectedItems[0].code}" thành công`;

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
          message: 'Có lỗi xảy ra khi xóa SKU',
          variant: 'alert',
          alert: { color: 'error' }
        } as SnackbarProps);
      }
    } catch (error) {
      console.error('Error deleting SKU:', error);
      // Show error notification for exception
      openSnackbar({
        open: true,
        message: 'Có lỗi xảy ra khi xóa SKU',
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
