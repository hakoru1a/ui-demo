import { useCallback, useState } from 'react';

import { openSnackbar } from 'api/snackbar';
import useBoolean from 'hooks/useBoolean';
import type { SnackbarProps } from 'types/snackbar';

import { weighTicketService } from '../api';
import type { WeighTicket } from '../types';

// ==============================|| WEIGH TICKET DELETE HOOK ||============================== //

/**
 * Hook to manage delete action for weigh tickets (single and bulk)
 * Handles dialog state, confirmation, and API call with notifications
 */
export function useWeighTicketDelete(onSuccess?: (deletedIds: string[]) => void) {
  const confirmDialog = useBoolean(false);
  const [selectedWeighTickets, setSelectedWeighTickets] = useState<WeighTicket[]>([]);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isBulkDelete, setIsBulkDelete] = useState(false);

  // Handle single delete action - opens confirmation dialog
  const handleDelete = useCallback(
    (weighTicket: WeighTicket) => {
      setSelectedWeighTickets([weighTicket]);
      setIsBulkDelete(false);
      confirmDialog.onTrue();
    },
    [confirmDialog]
  );

  // Handle bulk delete action - opens confirmation dialog
  const handleBulkDelete = useCallback(
    (weighTickets: WeighTicket[]) => {
      if (weighTickets.length === 0) return;
      setSelectedWeighTickets(weighTickets);
      setIsBulkDelete(true);
      confirmDialog.onTrue();
    },
    [confirmDialog]
  );

  // Confirm delete action - calls API and shows notification
  const handleConfirmDelete = useCallback(async () => {
    if (selectedWeighTickets.length === 0) return;

    setIsDeleting(true);
    try {
      if (isBulkDelete && selectedWeighTickets.length > 1) {
        // Bulk delete
        const ids = selectedWeighTickets.map((ticket) => ticket.id);
        const response = await weighTicketService.bulkDeleteWeighTickets(ids);

        if (response.success) {
          confirmDialog.onFalse();
          const deletedIds = ids;
          setSelectedWeighTickets([]);

          // Show success notification
          openSnackbar({
            open: true,
            message: `Đã xóa ${deletedIds.length} phiếu cân thành công`,
            variant: 'alert',
            alert: { color: 'success' }
          } as SnackbarProps);

          onSuccess?.(deletedIds);
        } else {
          // Show error notification for failed response
          openSnackbar({
            open: true,
            message: 'Có lỗi xảy ra khi xóa phiếu cân',
            variant: 'alert',
            alert: { color: 'error' }
          } as SnackbarProps);
        }
      } else {
        // Single delete
        const weighTicket = selectedWeighTickets[0];
        const response = await weighTicketService.deleteWeighTicket(weighTicket.id);

        if (response.success) {
          confirmDialog.onFalse();
          const deletedIds = [weighTicket.id];
          setSelectedWeighTickets([]);

          // Show success notification
          openSnackbar({
            open: true,
            message: `Đã xóa phiếu cân "${weighTicket.code}" thành công`,
            variant: 'alert',
            alert: { color: 'success' }
          } as SnackbarProps);

          onSuccess?.(deletedIds);
        } else {
          // Show error notification for failed response
          openSnackbar({
            open: true,
            message: 'Có lỗi xảy ra khi xóa phiếu cân',
            variant: 'alert',
            alert: { color: 'error' }
          } as SnackbarProps);
        }
      }
    } catch (error) {
      console.error('Error deleting weigh ticket(s):', error);
      // Show error notification for exception
      openSnackbar({
        open: true,
        message: 'Có lỗi xảy ra khi xóa phiếu cân',
        variant: 'alert',
        alert: { color: 'error' }
      } as SnackbarProps);
    } finally {
      setIsDeleting(false);
    }
  }, [selectedWeighTickets, isBulkDelete, confirmDialog, onSuccess]);

  // Cancel delete action
  const handleCancelDelete = useCallback(() => {
    confirmDialog.onFalse();
    setSelectedWeighTickets([]);
  }, [confirmDialog]);

  return {
    confirmDialog,
    selectedWeighTickets,
    isDeleting,
    isBulkDelete,
    handleDelete,
    handleBulkDelete,
    handleConfirmDelete,
    handleCancelDelete
  };
}
