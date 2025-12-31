import { useCallback, useState } from 'react';

import { openSnackbar } from 'api/snackbar';
import useBoolean from 'hooks/useBoolean';
import type { SnackbarProps } from 'types/snackbar';

import { fleetService } from '../api';
import type { Vehicle } from '../types';

// ==============================|| FLEET DISABLE HOOK ||============================== //

/**
 * Hook to manage disable action for vehicles
 * Handles dialog state, confirmation, and API call with notifications
 */
export function useFleetDisable(onSuccess?: (disabledVehicle: Vehicle) => void) {
  const confirmDialog = useBoolean(false);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [isDisabling, setIsDisabling] = useState(false);

  // Handle disable action - opens confirmation dialog
  const handleDisable = useCallback(
    (vehicle: Vehicle) => {
      setSelectedVehicle(vehicle);
      confirmDialog.onTrue();
    },
    [confirmDialog]
  );

  // Confirm disable action - calls API and shows notification
  const handleConfirmDisable = useCallback(async () => {
    if (!selectedVehicle) return;

    setIsDisabling(true);
    try {
      const response = await fleetService.updateVehicle(selectedVehicle.id, {
        vehicleStatus: 'maintenance'
      });

      if (response.success && response.data) {
        const disabledVehicle = { ...selectedVehicle, vehicleStatus: 'maintenance' as const };
        confirmDialog.onFalse();
        setSelectedVehicle(null);

        // Show success notification
        openSnackbar({
          open: true,
          message: `Ngưng sử dụng xe "${disabledVehicle.licensePlate}" thành công`,
          variant: 'alert',
          alert: { color: 'success' }
        } as SnackbarProps);

        onSuccess?.(disabledVehicle);
      } else {
        // Show error notification for failed response
        openSnackbar({
          open: true,
          message: 'Có lỗi xảy ra khi ngưng sử dụng xe',
          variant: 'alert',
          alert: { color: 'error' }
        } as SnackbarProps);
      }
    } catch (error) {
      console.error('Error disabling vehicle:', error);
      // Show error notification for exception
      openSnackbar({
        open: true,
        message: 'Có lỗi xảy ra khi ngưng sử dụng xe',
        variant: 'alert',
        alert: { color: 'error' }
      } as SnackbarProps);
    } finally {
      setIsDisabling(false);
    }
  }, [selectedVehicle, confirmDialog, onSuccess]);

  // Cancel disable action
  const handleCancelDisable = useCallback(() => {
    confirmDialog.onFalse();
    setSelectedVehicle(null);
  }, [confirmDialog]);

  return {
    confirmDialog,
    selectedVehicle,
    isDisabling,
    handleDisable,
    handleConfirmDisable,
    handleCancelDisable
  };
}
