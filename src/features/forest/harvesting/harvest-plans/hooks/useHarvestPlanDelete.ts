import { useCallback, useState } from 'react';

import { openSnackbar } from 'api/snackbar';
import useBoolean from 'hooks/useBoolean';
import type { SnackbarProps } from 'types/snackbar';

import { harvestPlanService } from '../api';
import type { HarvestPlan } from '../types';

// ==============================|| HARVEST PLAN DELETE HOOK ||============================== //

/**
 * Hook to manage delete action for harvest plans
 * Handles dialog state, confirmation, and API call with notifications
 */
export function useHarvestPlanDelete(onSuccess?: (deletedPlan: HarvestPlan) => void) {
  const confirmDialog = useBoolean(false);
  const [selectedHarvestPlan, setSelectedHarvestPlan] = useState<HarvestPlan | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Handle delete action - opens confirmation dialog
  const handleDelete = useCallback(
    (harvestPlan: HarvestPlan) => {
      setSelectedHarvestPlan(harvestPlan);
      confirmDialog.onTrue();
    },
    [confirmDialog]
  );

  // Confirm delete action - calls API and shows notification
  const handleConfirmDelete = useCallback(async () => {
    if (!selectedHarvestPlan) return;

    setIsDeleting(true);
    try {
      const response = await harvestPlanService.deleteHarvestPlan(selectedHarvestPlan.id);

      if (response.success) {
        confirmDialog.onFalse();
        const deletedPlan = selectedHarvestPlan;
        setSelectedHarvestPlan(null);

        // Show success notification
        openSnackbar({
          open: true,
          message: `Xóa vùng trồng "${deletedPlan.name}" thành công`,
          variant: 'alert',
          alert: { color: 'success' }
        } as SnackbarProps);

        onSuccess?.(deletedPlan);
      } else {
        // Show error notification for failed response
        openSnackbar({
          open: true,
          message: 'Có lỗi xảy ra khi xóa vùng trồng',
          variant: 'alert',
          alert: { color: 'error' }
        } as SnackbarProps);
      }
    } catch (error) {
      console.error('Error deleting harvest plan:', error);
      // Show error notification for exception
      openSnackbar({
        open: true,
        message: 'Có lỗi xảy ra khi xóa vùng trồng',
        variant: 'alert',
        alert: { color: 'error' }
      } as SnackbarProps);
    } finally {
      setIsDeleting(false);
    }
  }, [selectedHarvestPlan, confirmDialog, onSuccess]);

  // Cancel delete action
  const handleCancelDelete = useCallback(() => {
    confirmDialog.onFalse();
    setSelectedHarvestPlan(null);
  }, [confirmDialog]);

  return {
    confirmDialog,
    selectedHarvestPlan,
    isDeleting,
    handleDelete,
    handleConfirmDelete,
    handleCancelDelete
  };
}
