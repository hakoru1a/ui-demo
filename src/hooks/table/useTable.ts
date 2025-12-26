import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getExpandedRowModel,
  type ColumnDef,
  type SortingState,
  type ColumnFiltersState,
  type VisibilityState,
  type ExpandedState,
  type RowSelectionState
} from '@tanstack/react-table';
import { useState } from 'react';

// ==============================|| TABLE HOOK (GENERIC) ||============================== //

interface UseTableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  columnFilters: ColumnFiltersState;
  rowSelection: RowSelectionState;
  onRowSelectionChange: (selection: RowSelectionState) => void;
  initialPageSize?: number;
  enableRowSelection?: boolean;
}

/**
 * Generic hook that creates and manages the table instance
 * Can be reused for any table type
 * Only handles table configuration and state management
 *
 * @example
 * ```tsx
 * const { table, sorting, setSorting } = useTable<MyType>({
 *   data,
 *   columns,
 *   columnFilters,
 *   rowSelection,
 *   onRowSelectionChange: setRowSelection,
 *   initialPageSize: 25,
 *   enableRowSelection: true
 * });
 * ```
 */
export function useTable<T>({
  data,
  columns,
  columnFilters,
  rowSelection,
  onRowSelectionChange,
  initialPageSize = 10,
  enableRowSelection = false
}: UseTableProps<T>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [expanded, setExpanded] = useState<ExpandedState>({});

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      expanded
    },
    enableRowSelection: enableRowSelection,
    onRowSelectionChange: (updater) => {
      const newSelection = typeof updater === 'function' ? updater(rowSelection) : updater;
      onRowSelectionChange(newSelection);
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: () => {}, // Controlled by parent
    onColumnVisibilityChange: setColumnVisibility,
    onExpandedChange: setExpanded,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    initialState: {
      pagination: {
        pageSize: initialPageSize
      }
    }
  });

  return {
    table,
    sorting,
    setSorting,
    columnVisibility,
    setColumnVisibility
  };
}
