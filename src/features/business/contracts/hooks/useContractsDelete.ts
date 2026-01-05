import { useState, useCallback } from 'react';

import type { Contract } from '../types';

// ==============================|| CONTRACTS DELETE HOOK ||============================== //

interface UseContractsDeleteProps {
  onSuccess?: () => void;
}

/**
 * Hook to manage delete operations for Contracts
 * Handles both single and bulk delete with confirmation dialogs
 */
export function useContractsDelete({ onSuccess }: UseContractsDeleteProps = {}) {
  const [confirmDialog, setConfirmDialog] = useState<{ open: boolean; contracts: Contract[]; isBulk: boolean }>({
    open: false,
    contracts: [],
    isBulk: false
  });
  const [isDeleting, setIsDeleting] = useState(false);

  // Handle single delete
  const handleDelete = useCallback((contract: Contract) => {
    setConfirmDialog({ open: true, contracts: [contract], isBulk: false });
  }, []);

  // Handle bulk delete
  const handleBulkDelete = useCallback((contracts: Contract[]) => {
    setConfirmDialog({ open: true, contracts, isBulk: true });
  }, []);

  // Handle confirm delete
  const handleConfirmDelete = useCallback(async () => {
    if (confirmDialog.contracts.length === 0) return;

    setIsDeleting(true);
    try {
      // TODO: Call API to delete
      // For single delete: await contractService.deleteContract(confirmDialog.contracts[0].id);
      // For bulk delete: await contractService.bulkDeleteContracts(confirmDialog.contracts.map(c => c.id));

      // Mock API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Close dialog and notify parent
      setConfirmDialog({ open: false, contracts: [], isBulk: false });
      onSuccess?.();
    } catch (error) {
      console.error('Delete error:', error);
      // TODO: Show error notification
    } finally {
      setIsDeleting(false);
    }
  }, [confirmDialog.contracts, onSuccess]);

  // Handle cancel delete
  const handleCancelDelete = useCallback(() => {
    setConfirmDialog({ open: false, contracts: [], isBulk: false });
  }, []);

  return {
    confirmDialog,
    selectedItems: confirmDialog.contracts,
    isDeleting,
    isBulkDelete: confirmDialog.isBulk,
    handleDelete,
    handleBulkDelete,
    handleConfirmDelete,
    handleCancelDelete
  };
}
