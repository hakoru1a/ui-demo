import { useCallback, useState } from 'react';

import { openSnackbar } from 'api/snackbar';
import useBoolean from 'hooks/useBoolean';
import type { SnackbarProps } from 'types/snackbar';

import advanceService from '../api/index';
import type { Advance } from '../types';

// ==============================|| ADVANCES DELETE HOOK ||============================== //

interface UseAdvancesDeleteProps {
  onSuccess?: () => void;
}

/**
 * Hook to manage delete operations for Advances
 * Handles both single and bulk delete with confirmation dialogs
 */
export function useAdvancesDelete({ onSuccess }: UseAdvancesDeleteProps = {}) {
  const confirmDialog = useBoolean(false);
  const [selectedItems, setSelectedItems] = useState<Advance[]>([]);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isBulkDelete, setIsBulkDelete] = useState(false);

  // Handle single delete action - opens confirmation dialog
  const handleDelete = useCallback(
    (advance: Advance) => {
      setSelectedItems([advance]);
      setIsBulkDelete(false);
      confirmDialog.onTrue();
    },
    [confirmDialog]
  );

  // Handle bulk delete action - opens confirmation dialog
  const handleBulkDelete = useCallback(
    (advances: Advance[]) => {
      setSelectedItems(advances);
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
        response = await advanceService.bulkDeleteAdvances(ids);
      } else {
        response = await advanceService.deleteAdvance(selectedItems[0].id);
      }

      if (response.success) {
        confirmDialog.onFalse();
        setSelectedItems([]);
        setIsBulkDelete(false);

        // Show success notification
        const message = isBulkDelete
          ? `Đã xóa ${selectedItems.length} phiếu tạm ứng thành công`
          : `Đã xóa phiếu tạm ứng "${selectedItems[0].code}" thành công`;

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
          message: 'Có lỗi xảy ra khi xóa phiếu tạm ứng',
          variant: 'alert',
          alert: { color: 'error' }
        } as SnackbarProps);
      }
    } catch (error) {
      console.error('Error deleting advance:', error);
      // Show error notification for exception
      openSnackbar({
        open: true,
        message: 'Có lỗi xảy ra khi xóa phiếu tạm ứng',
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
