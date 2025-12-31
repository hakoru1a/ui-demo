import { useCallback, useState } from 'react';

import { openSnackbar } from 'api/snackbar';
import useBoolean from 'hooks/useBoolean';
import type { SnackbarProps } from 'types/snackbar';

import { fleetService } from '../api';
import type { Vehicle } from '../types';

// ==============================|| FLEET DELETE HOOK ||============================== //

/**
 * Hook to manage delete action for vehicles (single and bulk)
 * Handles dialog state, confirmation, and API call with notifications
 */
export function useFleetDelete(onSuccess?: (deletedIds: string[]) => void) {
  const confirmDialog = useBoolean(false);
  const [selectedVehicles, setSelectedVehicles] = useState<Vehicle[]>([]);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isBulkDelete, setIsBulkDelete] = useState(false);

  // Handle single delete action - opens confirmation dialog
  const handleDelete = useCallback(
    (vehicle: Vehicle) => {
      setSelectedVehicles([vehicle]);
      setIsBulkDelete(false);
      confirmDialog.onTrue();
    },
    [confirmDialog]
  );

  // Handle bulk delete action - opens confirmation dialog
  const handleBulkDelete = useCallback(
    (vehicles: Vehicle[]) => {
      if (vehicles.length === 0) return;
      setSelectedVehicles(vehicles);
      setIsBulkDelete(true);
      confirmDialog.onTrue();
    },
    [confirmDialog]
  );

  // Confirm delete action - calls API and shows notification
  const handleConfirmDelete = useCallback(async () => {
    if (selectedVehicles.length === 0) return;

    setIsDeleting(true);
    try {
      if (isBulkDelete && selectedVehicles.length > 1) {
        // Bulk delete
        const ids = selectedVehicles.map((v) => v.id);
        const response = await fleetService.bulkDeleteVehicles(ids);

        if (response.success) {
          confirmDialog.onFalse();
          const deletedIds = ids;
          setSelectedVehicles([]);

          // Show success notification
          openSnackbar({
            open: true,
            message: `Đã xóa ${deletedIds.length} xe thành công`,
            variant: 'alert',
            alert: { color: 'success' }
          } as SnackbarProps);

          onSuccess?.(deletedIds);
        } else {
          // Show error notification for failed response
          openSnackbar({
            open: true,
            message: 'Có lỗi xảy ra khi xóa xe',
            variant: 'alert',
            alert: { color: 'error' }
          } as SnackbarProps);
        }
      } else {
        // Single delete
        const vehicle = selectedVehicles[0];
        const response = await fleetService.deleteVehicle(vehicle.id);

        if (response.success) {
          confirmDialog.onFalse();
          const deletedIds = [vehicle.id];
          setSelectedVehicles([]);

          // Show success notification
          openSnackbar({
            open: true,
            message: `Đã xóa xe "${vehicle.licensePlate}" thành công`,
            variant: 'alert',
            alert: { color: 'success' }
          } as SnackbarProps);

          onSuccess?.(deletedIds);
        } else {
          // Show error notification for failed response
          openSnackbar({
            open: true,
            message: 'Có lỗi xảy ra khi xóa xe',
            variant: 'alert',
            alert: { color: 'error' }
          } as SnackbarProps);
        }
      }
    } catch (error) {
      console.error('Error deleting vehicle(s):', error);
      // Show error notification for exception
      openSnackbar({
        open: true,
        message: 'Có lỗi xảy ra khi xóa xe',
        variant: 'alert',
        alert: { color: 'error' }
      } as SnackbarProps);
    } finally {
      setIsDeleting(false);
    }
  }, [selectedVehicles, isBulkDelete, confirmDialog, onSuccess]);

  // Cancel delete action
  const handleCancelDelete = useCallback(() => {
    confirmDialog.onFalse();
    setSelectedVehicles([]);
  }, [confirmDialog]);

  return {
    confirmDialog,
    selectedVehicles,
    isDeleting,
    isBulkDelete,
    handleDelete,
    handleBulkDelete,
    handleConfirmDelete,
    handleCancelDelete
  };
}
