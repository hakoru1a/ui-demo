import { useState, useCallback } from 'react';

import type { Employee } from '../types';

// ==============================|| EMPLOYEES DELETE HOOK ||============================== //

interface UseEmployeesDeleteProps {
  onSuccess?: () => void;
}

/**
 * Hook to manage delete operations for Employees
 * Handles both single and bulk delete with confirmation dialogs
 */
export function useEmployeesDelete({ onSuccess }: UseEmployeesDeleteProps = {}) {
  const [confirmDialog, setConfirmDialog] = useState<{ open: boolean; employees: Employee[]; isBulk: boolean }>({
    open: false,
    employees: [],
    isBulk: false
  });
  const [isDeleting, setIsDeleting] = useState(false);

  // Handle single delete
  const handleDelete = useCallback((employee: Employee) => {
    setConfirmDialog({ open: true, employees: [employee], isBulk: false });
  }, []);

  // Handle bulk delete
  const handleBulkDelete = useCallback((employees: Employee[]) => {
    setConfirmDialog({ open: true, employees, isBulk: true });
  }, []);

  // Handle confirm delete
  const handleConfirmDelete = useCallback(async () => {
    if (confirmDialog.employees.length === 0) return;

    setIsDeleting(true);
    try {
      // TODO: Call API to delete
      // For single delete: await employeeService.deleteEmployee(confirmDialog.employees[0].id);
      // For bulk delete: await employeeService.bulkDeleteEmployees(confirmDialog.employees.map(e => e.id));

      // Mock API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Close dialog and notify parent
      setConfirmDialog({ open: false, employees: [], isBulk: false });
      onSuccess?.();
    } catch (error) {
      console.error('Delete error:', error);
      // TODO: Show error notification
    } finally {
      setIsDeleting(false);
    }
  }, [confirmDialog.employees, onSuccess]);

  // Handle cancel delete
  const handleCancelDelete = useCallback(() => {
    setConfirmDialog({ open: false, employees: [], isBulk: false });
  }, []);

  return {
    confirmDialog,
    selectedItems: confirmDialog.employees,
    isDeleting,
    isBulkDelete: confirmDialog.isBulk,
    handleDelete,
    handleBulkDelete,
    handleConfirmDelete,
    handleCancelDelete
  };
}
