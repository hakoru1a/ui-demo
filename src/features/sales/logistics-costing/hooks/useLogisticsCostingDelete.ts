import { useCallback, useState } from 'react';

import { openSnackbar } from 'api/snackbar';
import useBoolean from 'hooks/useBoolean';
import type { SnackbarProps } from 'types/snackbar';

import { logisticsCostingService } from '../api';
import type { LogisticsCost } from '../types';

// ==============================|| LOGISTICS COSTING DELETE HOOK ||============================== //

/**
 * Hook to manage delete action for logistics costs (single and bulk)
 * Handles dialog state, confirmation, and API call with notifications
 */
export function useLogisticsCostingDelete(onSuccess?: (deletedIds: string[]) => void) {
  const confirmDialog = useBoolean(false);
  const [selectedCosts, setSelectedCosts] = useState<LogisticsCost[]>([]);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isBulkDelete, setIsBulkDelete] = useState(false);

  // Handle single delete action - opens confirmation dialog
  const handleDelete = useCallback(
    (cost: LogisticsCost) => {
      setSelectedCosts([cost]);
      setIsBulkDelete(false);
      confirmDialog.onTrue();
    },
    [confirmDialog]
  );

  // Handle bulk delete action - opens confirmation dialog
  const handleBulkDelete = useCallback(
    (costs: LogisticsCost[]) => {
      if (costs.length === 0) return;
      setSelectedCosts(costs);
      setIsBulkDelete(true);
      confirmDialog.onTrue();
    },
    [confirmDialog]
  );

  // Confirm delete action - calls API and shows notification
  const handleConfirmDelete = useCallback(async () => {
    if (selectedCosts.length === 0) return;

    setIsDeleting(true);
    try {
      if (isBulkDelete && selectedCosts.length > 1) {
        // Bulk delete
        const ids = selectedCosts.map((c) => c.id);
        const response = await logisticsCostingService.bulkDeleteLogisticsCosts(ids);

        if (response.success) {
          confirmDialog.onFalse();
          const deletedIds = ids;
          setSelectedCosts([]);

          // Show success notification
          openSnackbar({
            open: true,
            message: `Đã xóa ${deletedIds.length} chi phí thành công`,
            variant: 'alert',
            alert: { color: 'success' }
          } as SnackbarProps);

          onSuccess?.(deletedIds);
        } else {
          // Show error notification for failed response
          openSnackbar({
            open: true,
            message: 'Có lỗi xảy ra khi xóa chi phí',
            variant: 'alert',
            alert: { color: 'error' }
          } as SnackbarProps);
        }
      } else {
        // Single delete
        const cost = selectedCosts[0];
        const response = await logisticsCostingService.deleteLogisticsCost(cost.id);

        if (response.success) {
          confirmDialog.onFalse();
          const deletedIds = [cost.id];
          setSelectedCosts([]);

          // Show success notification
          openSnackbar({
            open: true,
            message: `Đã xóa chi phí "${cost.costCode}" thành công`,
            variant: 'alert',
            alert: { color: 'success' }
          } as SnackbarProps);

          onSuccess?.(deletedIds);
        } else {
          // Show error notification for failed response
          openSnackbar({
            open: true,
            message: 'Có lỗi xảy ra khi xóa chi phí',
            variant: 'alert',
            alert: { color: 'error' }
          } as SnackbarProps);
        }
      }
    } catch (error) {
      console.error('Error deleting logistics cost(s):', error);
      // Show error notification for exception
      openSnackbar({
        open: true,
        message: 'Có lỗi xảy ra khi xóa chi phí',
        variant: 'alert',
        alert: { color: 'error' }
      } as SnackbarProps);
    } finally {
      setIsDeleting(false);
    }
  }, [selectedCosts, isBulkDelete, confirmDialog, onSuccess]);

  // Cancel delete action
  const handleCancelDelete = useCallback(() => {
    confirmDialog.onFalse();
    setSelectedCosts([]);
  }, [confirmDialog]);

  return {
    confirmDialog,
    selectedCosts,
    isDeleting,
    isBulkDelete,
    handleDelete,
    handleBulkDelete,
    handleConfirmDelete,
    handleCancelDelete
  };
}
