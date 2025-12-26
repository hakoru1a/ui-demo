import type { ColumnFiltersState } from '@tanstack/react-table';
import { useState } from 'react';

// ==============================|| TABLE FILTERS HOOK (GENERIC) ||============================== //

/**
 * Generic hook to manage table column filters state
 * Can be reused for any table type
 *
 * @example
 * ```tsx
 * const { columnFilters, setColumnFilters } = useTableFilters();
 * ```
 */
export function useTableFilters(initialFilters: ColumnFiltersState = []) {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(initialFilters);

  return {
    columnFilters,
    setColumnFilters
  };
}
