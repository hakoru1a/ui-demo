import type { ColumnFiltersState } from '@tanstack/react-table';
import { useState, useEffect } from 'react';

// ==============================|| TABLE FILTER DIALOG HOOK (GENERIC) ||============================== //

interface UseTableFilterDialogProps {
  columnFilters: ColumnFiltersState;
  onFilterChange: (filters: ColumnFiltersState) => void;
  onClose: () => void;
  open: boolean;
}

/**
 * Generic hook to manage filter dialog state and actions
 * Can be reused for any table type
 *
 * @example
 * ```tsx
 * const {
 *   filters,
 *   handleFilterChange,
 *   handleApply,
 *   handleReset,
 *   activeFilterCount
 * } = useTableFilterDialog({
 *   columnFilters,
 *   onFilterChange,
 *   onClose,
 *   open
 * });
 * ```
 */
export function useTableFilterDialog({ columnFilters, onFilterChange, onClose, open }: UseTableFilterDialogProps) {
  // Local state for filter values (before applying)
  const [filters, setFilters] = useState<Record<string, any>>({});

  // Initialize filters from columnFilters when dialog opens
  useEffect(() => {
    if (open) {
      const initialFilters: Record<string, any> = {};
      columnFilters.forEach((filter) => {
        initialFilters[filter.id] = filter.value;
      });
      setFilters(initialFilters);
    }
  }, [columnFilters, open]);

  // Update filter value
  const handleFilterChange = (columnId: string, value: any) => {
    setFilters((prev) => ({
      ...prev,
      [columnId]: value
    }));
  };

  // Apply filters
  const handleApply = () => {
    const newFilters: ColumnFiltersState = Object.entries(filters)
      .filter(([_, value]) => {
        if (value === '' || value === null || value === undefined) return false;
        if (Array.isArray(value)) return value.length > 0;
        return true;
      })
      .map(([id, value]) => ({ id, value }));

    onFilterChange(newFilters);
    onClose();
  };

  // Reset filters
  const handleReset = () => {
    setFilters({});
    onFilterChange([]);
    onClose();
  };

  const activeFilterCount = columnFilters.length;

  return {
    filters,
    handleFilterChange,
    handleApply,
    handleReset,
    activeFilterCount
  };
}
