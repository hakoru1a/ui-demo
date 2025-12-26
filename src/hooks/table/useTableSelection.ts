import type { RowSelectionState, Table } from '@tanstack/react-table';
import { useMemo, useEffect, useState, useRef } from 'react';

// ==============================|| TABLE SELECTION HOOKS (GENERIC) ||============================== //

/**
 * Generic hook to manage table row selection state
 * Can be reused for any table type
 *
 * @example
 * ```tsx
 * const { rowSelection, setRowSelection } = useTableSelection();
 * ```
 */
export function useTableSelection(initialSelection: RowSelectionState = {}) {
  const [rowSelection, setRowSelection] = useState<RowSelectionState>(initialSelection);

  return {
    rowSelection,
    setRowSelection
  };
}

/**
 * Generic hook to compute selected rows from table
 * Separate hook for computing selected rows after table is created
 *
 * @example
 * ```tsx
 * const selectedRows = useSelectedRows<MyType>(table, true);
 * ```
 */
export function useSelectedRows<T>(table: Table<T>, enabled: boolean = false) {
  // Get rowSelection state from table to track changes
  const rowSelection = table.getState().rowSelection;

  const selectedRows = useMemo(() => {
    if (!enabled) return [];
    return table.getFilteredSelectedRowModel().rows.map((row) => row.original);
  }, [table, enabled, rowSelection]);

  return selectedRows;
}

/**
 * Generic hook to notify parent of selection changes
 *
 * @example
 * ```tsx
 * useSelectionChange(selectedRows, true, handleSelectionChange);
 * ```
 */
export function useSelectionChange<T>(selectedRows: T[], enabled: boolean, onSelectionChange?: (rows: T[]) => void) {
  const prevSelectedRowsRef = useRef<T[]>([]);
  const callbackRef = useRef(onSelectionChange);

  // Keep callback ref up to date
  useEffect(() => {
    callbackRef.current = onSelectionChange;
  }, [onSelectionChange]);

  useEffect(() => {
    if (!enabled || !callbackRef.current) return;

    // Only call if selection actually changed (compare by reference or length)
    const prev = prevSelectedRowsRef.current;
    const hasChanged = prev.length !== selectedRows.length || prev.some((row, index) => row !== selectedRows[index]);

    if (hasChanged) {
      prevSelectedRowsRef.current = selectedRows;
      callbackRef.current(selectedRows);
    }
  }, [selectedRows, enabled]);
}
