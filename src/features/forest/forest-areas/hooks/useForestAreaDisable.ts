import { useState, useCallback } from 'react';

import useBoolean from 'hooks/useBoolean';

import { forestAreaService } from '../api';
import type { ForestArea } from '../types';

// ==============================|| FOREST AREA DISABLE HOOK ||============================== //

/**
 * Hook to manage disable/delete action for forest areas
 * Handles dialog state, confirmation, and API call
 */
export function useForestAreaDisable(onSuccess?: (disabledArea: ForestArea) => void) {
  const confirmDialog = useBoolean(false);
  const [selectedForestArea, setSelectedForestArea] = useState<ForestArea | null>(null);
  const [isDisabling, setIsDisabling] = useState(false);

  // Handle disable action
  const handleDisable = useCallback(
    (forestArea: ForestArea) => {
      setSelectedForestArea(forestArea);
      confirmDialog.onTrue();
    },
    [confirmDialog]
  );

  // Confirm disable action
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
        onSuccess?.(disabledArea);
        // TODO: Show success notification
      } else {
        // TODO: Show error notification
        console.error('Failed to disable forest area:', response.error);
      }
    } catch (error) {
      // TODO: Show error notification
      console.error('Error disabling forest area:', error);
    } finally {
      setIsDisabling(false);
    }
  }, [selectedForestArea, confirmDialog, onSuccess]);

  return {
    confirmDialog,
    selectedForestArea,
    isDisabling,
    handleDisable,
    handleConfirmDisable
  };
}
