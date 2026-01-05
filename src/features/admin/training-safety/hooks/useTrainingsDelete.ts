import { useState, useCallback } from 'react';

import type { Training } from '../types';

// ==============================|| TRAININGS DELETE HOOK ||============================== //

interface UseTrainingsDeleteProps {
  onSuccess?: () => void;
}

/**
 * Hook to manage delete operations for Trainings
 * Handles both single and bulk delete with confirmation dialogs
 */
export function useTrainingsDelete({ onSuccess }: UseTrainingsDeleteProps = {}) {
  const [confirmDialog, setConfirmDialog] = useState<{ open: boolean; trainings: Training[]; isBulk: boolean }>({
    open: false,
    trainings: [],
    isBulk: false
  });
  const [isDeleting, setIsDeleting] = useState(false);

  // Handle single delete
  const handleDelete = useCallback((training: Training) => {
    setConfirmDialog({ open: true, trainings: [training], isBulk: false });
  }, []);

  // Handle bulk delete
  const handleBulkDelete = useCallback((trainings: Training[]) => {
    setConfirmDialog({ open: true, trainings, isBulk: true });
  }, []);

  // Handle confirm delete
  const handleConfirmDelete = useCallback(async () => {
    if (confirmDialog.trainings.length === 0) return;

    setIsDeleting(true);
    try {
      // TODO: Call API to delete
      // For single delete: await trainingService.deleteTraining(confirmDialog.trainings[0].id);
      // For bulk delete: await trainingService.bulkDeleteTrainings(confirmDialog.trainings.map(t => t.id));

      // Mock API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Close dialog and notify parent
      setConfirmDialog({ open: false, trainings: [], isBulk: false });
      onSuccess?.();
    } catch (error) {
      console.error('Delete error:', error);
      // TODO: Show error notification
    } finally {
      setIsDeleting(false);
    }
  }, [confirmDialog.trainings, onSuccess]);

  // Handle cancel delete
  const handleCancelDelete = useCallback(() => {
    setConfirmDialog({ open: false, trainings: [], isBulk: false });
  }, []);

  return {
    confirmDialog,
    selectedItems: confirmDialog.trainings,
    isDeleting,
    isBulkDelete: confirmDialog.isBulk,
    handleDelete,
    handleBulkDelete,
    handleConfirmDelete,
    handleCancelDelete
  };
}
