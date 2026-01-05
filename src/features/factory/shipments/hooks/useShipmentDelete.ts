import { useCallback, useState } from 'react';

import { openSnackbar } from 'api/snackbar';
import useBoolean from 'hooks/useBoolean';
import type { SnackbarProps } from 'types/snackbar';

import { shipmentService } from '../api';
import type { Shipment } from '../types';

// ==============================|| SHIPMENT DELETE HOOK ||============================== //

/**
 * Hook to manage delete action for shipments
 * Handles dialog state, confirmation, and API call with notifications
 */
export function useShipmentDelete(onSuccess?: (deletedIds: string[]) => void) {
  const confirmDialog = useBoolean(false);
  const [selectedItems, setSelectedItems] = useState<Shipment[]>([]);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isBulkDelete, setIsBulkDelete] = useState(false);

  // Handle single delete action - opens confirmation dialog
  const handleDelete = useCallback(
    (shipment: Shipment) => {
      setSelectedItems([shipment]);
      setIsBulkDelete(false);
      confirmDialog.onTrue();
    },
    [confirmDialog]
  );

  // Handle bulk delete action - opens confirmation dialog
  const handleBulkDelete = useCallback(
    (shipments: Shipment[]) => {
      setSelectedItems(shipments);
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
      const ids = selectedItems.map((item) => item.id);
      let response;

      if (isBulkDelete) {
        response = await shipmentService.bulkDeleteShipments(ids);
      } else {
        response = await shipmentService.deleteShipment(ids[0]);
      }

      if (response.success) {
        confirmDialog.onFalse();
        const deletedIds = ids;
        setSelectedItems([]);

        // Show success notification
        openSnackbar({
          open: true,
          message: isBulkDelete
            ? `Đã xóa ${deletedIds.length} phiếu xuất thành công`
            : `Đã xóa phiếu xuất "${selectedItems[0].code}" thành công`,
          variant: 'alert',
          alert: { color: 'success' }
        } as SnackbarProps);

        onSuccess?.(deletedIds);
      } else {
        // Show error notification for failed response
        openSnackbar({
          open: true,
          message: 'Có lỗi xảy ra khi xóa phiếu xuất',
          variant: 'alert',
          alert: { color: 'error' }
        } as SnackbarProps);
      }
    } catch (error) {
      console.error('Error deleting shipment:', error);
      // Show error notification for exception
      openSnackbar({
        open: true,
        message: 'Có lỗi xảy ra khi xóa phiếu xuất',
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
