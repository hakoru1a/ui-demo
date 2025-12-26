import { useCallback, useState } from 'react';

import { openSnackbar } from 'api/snackbar';
import useBoolean from 'hooks/useBoolean';
import type { SnackbarProps } from 'types/snackbar';

import { forestAreaService } from '../api';
import type { ForestArea } from '../types';

// ==============================|| FOREST AREA DISABLE HOOK ||============================== //

/**
 * Hook to manage disable/delete action for forest areas
 * Handles dialog state, confirmation, and API call with notifications
 */
export function useForestAreaDisable(onSuccess?: (disabledArea: ForestArea) => void) {
  const confirmDialog = useBoolean(false);
  const [selectedForestArea, setSelectedForestArea] = useState<ForestArea | null>(null);
  const [isDisabling, setIsDisabling] = useState(false);

  // Handle disable action - opens confirmation dialog
  const handleDisable = useCallback(
    (forestArea: ForestArea) => {
      setSelectedForestArea(forestArea);
      confirmDialog.onTrue();
    },
    [confirmDialog]
  );

  // Confirm disable action - calls API and shows notification
  const handleConfirmDisable = useCallback(async () => {
    if (!selectedForestArea) return;

    setIsDisabling(true);
    try {
      const response = await forestAreaService.updateForestArea(selectedForestArea.id, {
        status: 'inactive'
      });

      if (response.success && response.data) {
        const disabledArea = { ...selectedForestArea, status: 'inactive' as const };
        confirmDialog.onFalse();
        setSelectedForestArea(null);

        // Show success notification
        openSnackbar({
          open: true,
          message: `Vô hiệu hóa khu rừng "${disabledArea.name}" thành công`,
          variant: 'alert',
          alert: { color: 'success' }
        } as SnackbarProps);

        onSuccess?.(disabledArea);
      } else {
        // Show error notification for failed response
        openSnackbar({
          open: true,
          message: 'Có lỗi xảy ra khi vô hiệu hóa khu rừng',
          variant: 'alert',
          alert: { color: 'error' }
        } as SnackbarProps);
      }
    } catch (error) {
      console.error('Error disabling forest area:', error);
      // Show error notification for exception
      openSnackbar({
        open: true,
        message: 'Có lỗi xảy ra khi vô hiệu hóa khu rừng',
        variant: 'alert',
        alert: { color: 'error' }
      } as SnackbarProps);
    } finally {
      setIsDisabling(false);
    }
  }, [selectedForestArea, confirmDialog, onSuccess]);

  // Cancel disable action
  const handleCancelDisable = useCallback(() => {
    confirmDialog.onFalse();
    setSelectedForestArea(null);
  }, [confirmDialog]);

  return {
    confirmDialog,
    selectedForestArea,
    isDisabling,
    handleDisable,
    handleConfirmDisable,
    handleCancelDisable
  };
}
