import { useCallback, useMemo } from 'react';

import {
  useTableFilters,
  useTableSelection,
  useSelectedRows,
  useSelectionChange,
  useTableColumns,
  useTable,
  useTableCSV
} from 'hooks/table';

import { usePabColumns } from '../components/PabColumns';
import type { Pab, PabStatusFilter } from '../types/index';

// ==============================|| PAB TABLE HOOK ||============================== //

interface UsePabsTableProps {
  data: Pab[];
  statusFilter: PabStatusFilter;
  searchValue: string;
  onDelete?: (pab: Pab) => void;
  onSelectionChange?: (selected: Pab[]) => void;
  initialPageSize?: number;
}

/**
 * Hook to manage all table-related logic for PABs
 * Consolidates table setup, filtering, selection, and CSV export
 */
export function usePabsTable({ data, statusFilter, searchValue, onDelete, onSelectionChange, initialPageSize = 25 }: UsePabsTableProps) {
  // Memoize search filter function
  const searchFilterFn = useCallback((item: Pab, search: string) => {
    const searchLower = search.toLowerCase();
    return !!(
      item.code.toLowerCase().includes(searchLower) ||
      item.customerName.toLowerCase().includes(searchLower) ||
      item.productName.toLowerCase().includes(searchLower)
    );
  }, []);

  // Custom status filter function for PAB
  const statusFilterFn = useCallback((item: Pab, filter: PabStatusFilter) => {
    if (filter === 'all') return true;
    return item.status === filter;
  }, []);

  // Get columns
  const columns = usePabColumns({ onDelete });

  // Table filters
  const { columnFilters, setColumnFilters } = useTableFilters();

  // Filter data by status and search - memoized to prevent unnecessary re-renders
  const filteredData = useMemo(() => {
    return data.filter((item) => {
      // Status filter
      if (!statusFilterFn(item, statusFilter)) {
        return false;
      }
      // Search filter
      if (searchValue.trim() && !searchFilterFn(item, searchValue.trim())) {
        return false;
      }
      return true;
    });
  }, [data, statusFilter, searchValue, statusFilterFn, searchFilterFn]);

  // Table columns with selection
  const { tableColumns } = useTableColumns<Pab>({
    columns,
    enableRowSelection: true
  });

  // Table selection state
  const { rowSelection, setRowSelection } = useTableSelection();

  // Create table instance
  const { table, sorting, setSorting, columnVisibility, setColumnVisibility } = useTable<Pab>({
    data: filteredData,
    columns: tableColumns,
    columnFilters,
    rowSelection,
    onRowSelectionChange: setRowSelection,
    initialPageSize,
    enableRowSelection: true
  });

  // Compute selected rows from table
  const selectedRows = useSelectedRows<Pab>(table, true);

  // Handle row selection change - only if callback is provided
  const handleRowSelectionChange = useCallback(
    (selected: Pab[]) => {
      onSelectionChange?.(selected);
    },
    [onSelectionChange]
  );

  // Notify parent of selection changes - only if callback is provided
  useSelectionChange(selectedRows, !!onSelectionChange, handleRowSelectionChange);

  // Table CSV export
  const { csvData, csvHeadersData } = useTableCSV<Pab>({
    table,
    enabled: true
  });

  return {
    // Table instance
    table,
    // State
    columnFilters,
    setColumnFilters,
    sorting,
    setSorting,
    columnVisibility,
    setColumnVisibility,
    // Data
    filteredData,
    selectedRows,
    // CSV
    csvData,
    csvHeadersData
  };
}
