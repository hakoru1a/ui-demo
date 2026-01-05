import { useCallback, useState } from 'react';

import { openSnackbar } from 'api/snackbar';
import useBoolean from 'hooks/useBoolean';
import type { SnackbarProps } from 'types/snackbar';

import stocktakeService from '../api/index';
import type { Stocktake } from '../types';

// ==============================|| STOCKTAKE DELETE HOOK ||============================== //

interface UseStocktakesDeleteProps {
  onSuccess?: () => void;
}

/**
 * Hook to manage delete operations for Stocktakes
 * Handles both single and bulk delete with confirmation dialogs
 */
export function useStocktakesDelete({ onSuccess }: UseStocktakesDeleteProps = {}) {
  const confirmDialog = useBoolean(false);
  const [selectedItems, setSelectedItems] = useState<Stocktake[]>([]);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isBulkDelete, setIsBulkDelete] = useState(false);

  // Handle single delete action - opens confirmation dialog
  const handleDelete = useCallback(
    (stocktake: Stocktake) => {
      setSelectedItems([stocktake]);
      setIsBulkDelete(false);
      confirmDialog.onTrue();
    },
    [confirmDialog]
  );

  // Handle bulk delete action - opens confirmation dialog
  const handleBulkDelete = useCallback(
    (stocktakes: Stocktake[]) => {
      setSelectedItems(stocktakes);
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
        response = await stocktakeService.bulkDeleteStocktakes(ids);
      } else {
        response = await stocktakeService.deleteStocktake(selectedItems[0].id);
      }

      if (response.success) {
        confirmDialog.onFalse();
        setSelectedItems([]);
        setIsBulkDelete(false);

        // Show success notification
        const message = isBulkDelete
          ? `Đã xóa ${selectedItems.length} phiếu kiểm kê thành công`
          : `Đã xóa phiếu kiểm kê "${selectedItems[0].code}" thành công`;

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
          message: 'Có lỗi xảy ra khi xóa phiếu kiểm kê',
          variant: 'alert',
          alert: { color: 'error' }
        } as SnackbarProps);
      }
    } catch (error) {
      console.error('Error deleting stocktake:', error);
      // Show error notification for exception
      openSnackbar({
        open: true,
        message: 'Có lỗi xảy ra khi xóa phiếu kiểm kê',
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
