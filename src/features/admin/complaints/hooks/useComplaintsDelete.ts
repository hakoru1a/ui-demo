import { useState, useCallback } from 'react';

import type { Complaint } from '../types';

// ==============================|| COMPLAINTS DELETE HOOK ||============================== //

interface UseComplaintsDeleteProps {
  onSuccess?: () => void;
}

/**
 * Hook to manage delete operations for Complaints
 * Handles both single and bulk delete with confirmation dialogs
 */
export function useComplaintsDelete({ onSuccess }: UseComplaintsDeleteProps = {}) {
  const [confirmDialog, setConfirmDialog] = useState<{ open: boolean; complaints: Complaint[]; isBulk: boolean }>({
    open: false,
    complaints: [],
    isBulk: false
  });
  const [isDeleting, setIsDeleting] = useState(false);

  // Handle single delete
  const handleDelete = useCallback((complaint: Complaint) => {
    setConfirmDialog({ open: true, complaints: [complaint], isBulk: false });
  }, []);

  // Handle bulk delete
  const handleBulkDelete = useCallback((complaints: Complaint[]) => {
    setConfirmDialog({ open: true, complaints, isBulk: true });
  }, []);

  // Handle confirm delete
  const handleConfirmDelete = useCallback(async () => {
    if (confirmDialog.complaints.length === 0) return;

    setIsDeleting(true);
    try {
      // TODO: Call API to delete
      // For single delete: await complaintService.deleteComplaint(confirmDialog.complaints[0].id);
      // For bulk delete: await complaintService.bulkDeleteComplaints(confirmDialog.complaints.map(c => c.id));

      // Mock API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Close dialog and notify parent
      setConfirmDialog({ open: false, complaints: [], isBulk: false });
      onSuccess?.();
    } catch (error) {
      console.error('Delete error:', error);
      // TODO: Show error notification
    } finally {
      setIsDeleting(false);
    }
  }, [confirmDialog.complaints, onSuccess]);

  // Handle cancel delete
  const handleCancelDelete = useCallback(() => {
    setConfirmDialog({ open: false, complaints: [], isBulk: false });
  }, []);

  return {
    confirmDialog,
    selectedItems: confirmDialog.complaints,
    isDeleting,
    isBulkDelete: confirmDialog.isBulk,
    handleDelete,
    handleBulkDelete,
    handleConfirmDelete,
    handleCancelDelete
  };
}
