// ==============================|| PRODUCTION PLAN DELETE HOOK ||============================== //

import { useCallback, useState } from 'react';

import { openSnackbar } from 'api/snackbar';
import useBoolean from 'hooks/useBoolean';
import type { SnackbarProps } from 'types/snackbar';

import { productionPlanService } from '../api';
import type { ProductionPlan } from '../types';

// ==============================|| PRODUCTION PLAN DELETE HOOK ||============================== //

/**
 * Hook to manage delete action for production plans
 * Handles dialog state, confirmation, and API call with notifications
 * Supports both single and bulk delete
 */
export function useProductionPlanDelete(onSuccess?: (deletedIds: string[]) => void) {
  const confirmDialog = useBoolean(false);
  const [selectedItems, setSelectedItems] = useState<ProductionPlan[]>([]);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isBulkDelete, setIsBulkDelete] = useState(false);

  // Handle single delete action - opens confirmation dialog
  const handleDelete = useCallback(
    (plan: ProductionPlan) => {
      setSelectedItems([plan]);
      setIsBulkDelete(false);
      confirmDialog.onTrue();
    },
    [confirmDialog]
  );

  // Handle bulk delete action - opens confirmation dialog
  const handleBulkDelete = useCallback(
    (plans: ProductionPlan[]) => {
      setSelectedItems(plans);
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
        const response = await productionPlanService.bulkDeleteProductionPlans(ids);

        if (response.success) {
          deletedIds = ids;
          confirmDialog.onFalse();
          setSelectedItems([]);

          // Show success notification
          openSnackbar({
            open: true,
            message: `Đã xóa ${ids.length} kế hoạch/lệnh sản xuất thành công`,
            variant: 'alert',
            alert: { color: 'success' }
          } as SnackbarProps);

          onSuccess?.(deletedIds);
        } else {
          // Show error notification for failed response
          openSnackbar({
            open: true,
            message: 'Có lỗi xảy ra khi xóa kế hoạch/lệnh sản xuất',
            variant: 'alert',
            alert: { color: 'error' }
          } as SnackbarProps);
        }
      } else {
        // Single delete
        const plan = selectedItems[0];
        const response = await productionPlanService.deleteProductionPlan(plan.id);

        if (response.success) {
          deletedIds = [plan.id];
          confirmDialog.onFalse();
          setSelectedItems([]);

          // Show success notification
          openSnackbar({
            open: true,
            message: `Đã xóa kế hoạch/lệnh "${plan.code}" thành công`,
            variant: 'alert',
            alert: { color: 'success' }
          } as SnackbarProps);

          onSuccess?.(deletedIds);
        } else {
          // Show error notification for failed response
          openSnackbar({
            open: true,
            message: 'Có lỗi xảy ra khi xóa kế hoạch/lệnh sản xuất',
            variant: 'alert',
            alert: { color: 'error' }
          } as SnackbarProps);
        }
      }
    } catch (error) {
      console.error('Error deleting production plan:', error);
      // Show error notification for exception
      openSnackbar({
        open: true,
        message: 'Có lỗi xảy ra khi xóa kế hoạch/lệnh sản xuất',
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
