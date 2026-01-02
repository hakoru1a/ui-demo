import { useState, useCallback } from 'react';

import type { Partner } from '../types';

// ==============================|| PARTNERS DELETE HOOK ||============================== //

interface UsePartnersDeleteProps {
  onSuccess?: () => void;
}

/**
 * Hook to manage delete operations for Partners
 * Handles both single and bulk delete with confirmation dialogs
 */
export function usePartnersDelete({ onSuccess }: UsePartnersDeleteProps = {}) {
  const [confirmDialog, setConfirmDialog] = useState<{ open: boolean; partners: Partner[]; isBulk: boolean }>({
    open: false,
    partners: [],
    isBulk: false
  });
  const [isDeleting, setIsDeleting] = useState(false);

  // Handle single delete
  const handleDelete = useCallback((partner: Partner) => {
    setConfirmDialog({ open: true, partners: [partner], isBulk: false });
  }, []);

  // Handle bulk delete
  const handleBulkDelete = useCallback((partners: Partner[]) => {
    setConfirmDialog({ open: true, partners, isBulk: true });
  }, []);

  // Handle confirm delete
  const handleConfirmDelete = useCallback(async () => {
    if (confirmDialog.partners.length === 0) return;

    setIsDeleting(true);
    try {
      // TODO: Call API to delete
      // For single delete: await partnerService.deletePartner(confirmDialog.partners[0].id);
      // For bulk delete: await partnerService.bulkDeletePartners(confirmDialog.partners.map(p => p.id));

      // Mock API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Close dialog and notify parent
      setConfirmDialog({ open: false, partners: [], isBulk: false });
      onSuccess?.();
    } catch (error) {
      console.error('Delete error:', error);
      // TODO: Show error notification
    } finally {
      setIsDeleting(false);
    }
  }, [confirmDialog.partners, onSuccess]);

  // Handle cancel delete
  const handleCancelDelete = useCallback(() => {
    setConfirmDialog({ open: false, partners: [], isBulk: false });
  }, []);

  return {
    confirmDialog,
    selectedItems: confirmDialog.partners,
    isDeleting,
    isBulkDelete: confirmDialog.isBulk,
    handleDelete,
    handleBulkDelete,
    handleConfirmDelete,
    handleCancelDelete
  };
}
