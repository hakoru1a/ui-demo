// ==============================|| QUALITY INSPECTION DELETE HOOK ||============================== //

import { useCallback, useState } from 'react';

import { openSnackbar } from 'api/snackbar';
import useBoolean from 'hooks/useBoolean';
import type { SnackbarProps } from 'types/snackbar';

import { qualityInspectionService } from '../api';
import type { QualityInspection } from '../types';

// ==============================|| QUALITY INSPECTION DELETE HOOK ||============================== //

/**
 * Hook to manage delete action for quality inspections
 * Handles dialog state, confirmation, and API call with notifications
 * Supports both single and bulk delete
 */
export function useQualityInspectionDelete(onSuccess?: (deletedIds: string[]) => void) {
  const confirmDialog = useBoolean(false);
  const [selectedItems, setSelectedItems] = useState<QualityInspection[]>([]);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isBulkDelete, setIsBulkDelete] = useState(false);

  // Handle single delete action - opens confirmation dialog
  const handleDelete = useCallback(
    (inspection: QualityInspection) => {
      setSelectedItems([inspection]);
      setIsBulkDelete(false);
      confirmDialog.onTrue();
    },
    [confirmDialog]
  );

  // Handle bulk delete action - opens confirmation dialog
  const handleBulkDelete = useCallback(
    (inspections: QualityInspection[]) => {
      setSelectedItems(inspections);
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
      let deletedIds: string[] = [];

      if (isBulkDelete) {
        // Bulk delete
        const ids = selectedItems.map((item) => item.id);
        const response = await qualityInspectionService.bulkDeleteQualityInspections(ids);

        if (response.success) {
          deletedIds = ids;
          confirmDialog.onFalse();
          setSelectedItems([]);

          // Show success notification
          openSnackbar({
            open: true,
            message: `Đã xóa ${ids.length} phiếu kiểm định thành công`,
            variant: 'alert',
            alert: { color: 'success' }
          } as SnackbarProps);

          onSuccess?.(deletedIds);
        } else {
          // Show error notification for failed response
          openSnackbar({
            open: true,
            message: 'Có lỗi xảy ra khi xóa phiếu kiểm định',
            variant: 'alert',
            alert: { color: 'error' }
          } as SnackbarProps);
        }
      } else {
        // Single delete
        const inspection = selectedItems[0];
        const response = await qualityInspectionService.deleteQualityInspection(inspection.id);

        if (response.success) {
          deletedIds = [inspection.id];
          confirmDialog.onFalse();
          setSelectedItems([]);

          // Show success notification
          openSnackbar({
            open: true,
            message: `Đã xóa phiếu kiểm định "${inspection.code}" thành công`,
            variant: 'alert',
            alert: { color: 'success' }
          } as SnackbarProps);

          onSuccess?.(deletedIds);
        } else {
          // Show error notification for failed response
          openSnackbar({
            open: true,
            message: 'Có lỗi xảy ra khi xóa phiếu kiểm định',
            variant: 'alert',
            alert: { color: 'error' }
          } as SnackbarProps);
        }
      }
    } catch (error) {
      console.error('Error deleting quality inspection:', error);
      // Show error notification for exception
      openSnackbar({
        open: true,
        message: 'Có lỗi xảy ra khi xóa phiếu kiểm định',
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
