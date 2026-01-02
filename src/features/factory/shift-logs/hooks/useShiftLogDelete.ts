import { useCallback, useState } from 'react';

import { openSnackbar } from 'api/snackbar';
import useBoolean from 'hooks/useBoolean';
import type { SnackbarProps } from 'types/snackbar';

import { shiftLogService } from '../api';
import type { ShiftLog } from '../types';

// ==============================|| SHIFT LOG DELETE HOOK ||============================== //

/**
 * Hook to manage delete action for shift logs
 * Handles dialog state, confirmation, and API call with notifications
 */
export function useShiftLogDelete(onSuccess?: (deletedLog: ShiftLog) => void) {
  const confirmDialog = useBoolean(false);
  const [selectedShiftLog, setSelectedShiftLog] = useState<ShiftLog | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isBulkDelete, setIsBulkDelete] = useState(false);
  const [selectedItems, setSelectedItems] = useState<ShiftLog[]>([]);

  // Handle single delete action - opens confirmation dialog
  const handleDelete = useCallback(
    (shiftLog: ShiftLog) => {
      setSelectedShiftLog(shiftLog);
      setSelectedItems([shiftLog]);
      setIsBulkDelete(false);
      confirmDialog.onTrue();
    },
    [confirmDialog]
  );

  // Handle bulk delete action - opens confirmation dialog
  const handleBulkDelete = useCallback(
    (shiftLogs: ShiftLog[]) => {
      setSelectedShiftLog(null);
      setSelectedItems(shiftLogs);
      setIsBulkDelete(true);
      confirmDialog.onTrue();
    },
    [confirmDialog]
  );

  // Confirm delete action - calls API and shows notification
  const handleConfirmDelete = useCallback(async () => {
    if (isBulkDelete) {
      // Bulk delete
      if (selectedItems.length === 0) return;

      setIsDeleting(true);
      try {
        const ids = selectedItems.map((item) => item.id);
        const response = await shiftLogService.bulkDeleteShiftLogs(ids);

        if (response.success) {
          confirmDialog.onFalse();
          setSelectedItems([]);

          // Show success notification
          openSnackbar({
            open: true,
            message: `Đã xóa ${selectedItems.length} nhật ký ca thành công`,
            variant: 'alert',
            alert: { color: 'success' }
          } as SnackbarProps);

          selectedItems.forEach((item) => onSuccess?.(item));
        } else {
          // Show error notification for failed response
          openSnackbar({
            open: true,
            message: 'Có lỗi xảy ra khi xóa nhật ký ca',
            variant: 'alert',
            alert: { color: 'error' }
          } as SnackbarProps);
        }
      } catch (error) {
        console.error('Error deleting shift logs:', error);
        // Show error notification for exception
        openSnackbar({
          open: true,
          message: 'Có lỗi xảy ra khi xóa nhật ký ca',
          variant: 'alert',
          alert: { color: 'error' }
        } as SnackbarProps);
      } finally {
        setIsDeleting(false);
      }
    } else {
      // Single delete
      if (!selectedShiftLog) return;

      setIsDeleting(true);
      try {
        const response = await shiftLogService.deleteShiftLog(selectedShiftLog.id);

        if (response.success) {
          confirmDialog.onFalse();
          setSelectedShiftLog(null);

          // Show success notification
          openSnackbar({
            open: true,
            message: `Đã xóa nhật ký ca "${selectedShiftLog.code}" thành công`,
            variant: 'alert',
            alert: { color: 'success' }
          } as SnackbarProps);

          onSuccess?.(selectedShiftLog);
        } else {
          // Show error notification for failed response
          openSnackbar({
            open: true,
            message: 'Có lỗi xảy ra khi xóa nhật ký ca',
            variant: 'alert',
            alert: { color: 'error' }
          } as SnackbarProps);
        }
      } catch (error) {
        console.error('Error deleting shift log:', error);
        // Show error notification for exception
        openSnackbar({
          open: true,
          message: 'Có lỗi xảy ra khi xóa nhật ký ca',
          variant: 'alert',
          alert: { color: 'error' }
        } as SnackbarProps);
      } finally {
        setIsDeleting(false);
      }
    }
  }, [selectedShiftLog, selectedItems, isBulkDelete, confirmDialog, onSuccess]);

  // Cancel delete action
  const handleCancelDelete = useCallback(() => {
    confirmDialog.onFalse();
    setSelectedShiftLog(null);
    setSelectedItems([]);
  }, [confirmDialog]);

  return {
    confirmDialog,
    selectedShiftLog,
    selectedItems,
    isDeleting,
    isBulkDelete,
    handleDelete,
    handleBulkDelete,
    handleConfirmDelete,
    handleCancelDelete
  };
}
