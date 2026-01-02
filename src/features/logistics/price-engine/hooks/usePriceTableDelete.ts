import { useCallback, useState } from 'react';

import { openSnackbar } from 'api/snackbar';
import useBoolean from 'hooks/useBoolean';
import type { SnackbarProps } from 'types/snackbar';

import { priceTableService } from '../api';
import type { PriceTable } from '../types';

// ==============================|| PRICE TABLE DELETE HOOK ||============================== //

/**
 * Hook to manage delete action for price tables (single and bulk)
 * Handles dialog state, confirmation, and API call with notifications
 */
export function usePriceTableDelete(onSuccess?: (deletedIds: string[]) => void) {
  const confirmDialog = useBoolean(false);
  const [selectedPriceTables, setSelectedPriceTables] = useState<PriceTable[]>([]);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isBulkDelete, setIsBulkDelete] = useState(false);

  // Handle single delete action - opens confirmation dialog
  const handleDelete = useCallback(
    (priceTable: PriceTable) => {
      setSelectedPriceTables([priceTable]);
      setIsBulkDelete(false);
      confirmDialog.onTrue();
    },
    [confirmDialog]
  );

  // Handle bulk delete action - opens confirmation dialog
  const handleBulkDelete = useCallback(
    (priceTables: PriceTable[]) => {
      if (priceTables.length === 0) return;
      setSelectedPriceTables(priceTables);
      setIsBulkDelete(true);
      confirmDialog.onTrue();
    },
    [confirmDialog]
  );

  // Confirm delete action - calls API and shows notification
  const handleConfirmDelete = useCallback(async () => {
    if (selectedPriceTables.length === 0) return;

    setIsDeleting(true);
    try {
      if (isBulkDelete && selectedPriceTables.length > 1) {
        // Bulk delete
        const ids = selectedPriceTables.map((pt) => pt.id);
        const response = await priceTableService.bulkDeletePriceTables(ids);

        if (response.success) {
          confirmDialog.onFalse();
          const deletedIds = ids;
          setSelectedPriceTables([]);

          // Show success notification
          openSnackbar({
            open: true,
            message: `Đã xóa ${deletedIds.length} bảng giá thành công`,
            variant: 'alert',
            alert: { color: 'success' }
          } as SnackbarProps);

          onSuccess?.(deletedIds);
        } else {
          // Show error notification for failed response
          openSnackbar({
            open: true,
            message: 'Có lỗi xảy ra khi xóa bảng giá',
            variant: 'alert',
            alert: { color: 'error' }
          } as SnackbarProps);
        }
      } else {
        // Single delete
        const priceTable = selectedPriceTables[0];
        const response = await priceTableService.deletePriceTable(priceTable.id);

        if (response.success) {
          confirmDialog.onFalse();
          const deletedIds = [priceTable.id];
          setSelectedPriceTables([]);

          // Show success notification
          openSnackbar({
            open: true,
            message: `Đã xóa bảng giá "${priceTable.name}" thành công`,
            variant: 'alert',
            alert: { color: 'success' }
          } as SnackbarProps);

          onSuccess?.(deletedIds);
        } else {
          // Show error notification for failed response
          openSnackbar({
            open: true,
            message: 'Có lỗi xảy ra khi xóa bảng giá',
            variant: 'alert',
            alert: { color: 'error' }
          } as SnackbarProps);
        }
      }
    } catch (error) {
      console.error('Error deleting price table(s):', error);
      // Show error notification for exception
      openSnackbar({
        open: true,
        message: 'Có lỗi xảy ra khi xóa bảng giá',
        variant: 'alert',
        alert: { color: 'error' }
      } as SnackbarProps);
    } finally {
      setIsDeleting(false);
    }
  }, [selectedPriceTables, isBulkDelete, confirmDialog, onSuccess]);

  // Cancel delete action
  const handleCancelDelete = useCallback(() => {
    confirmDialog.onFalse();
    setSelectedPriceTables([]);
  }, [confirmDialog]);

  return {
    confirmDialog,
    selectedPriceTables,
    isDeleting,
    isBulkDelete,
    handleDelete,
    handleBulkDelete,
    handleConfirmDelete,
    handleCancelDelete
  };
}
