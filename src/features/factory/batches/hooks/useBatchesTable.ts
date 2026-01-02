// ==============================|| BATCHES TABLE HOOK ||============================== //

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

import { useBatchColumns } from '../components/BatchColumns';
import type { BatchStatusFilter } from '../components/BatchTableHeader';
import type { Batch } from '../types';

// ==============================|| BATCHES TABLE HOOK ||============================== //

interface UseBatchesTableProps {
  data: Batch[];
  statusFilter: BatchStatusFilter;
  searchValue: string;
  onDelete?: (batch: Batch) => void;
  onSelectionChange?: (selected: Batch[]) => void;
  initialPageSize?: number;
}

/**
 * Hook to manage all table-related logic for Batches
 * Consolidates table setup, filtering, selection, and CSV export
 */
export function useBatchesTable({
  data,
  statusFilter,
  searchValue,
  onDelete,
  onSelectionChange,
  initialPageSize = 25
}: UseBatchesTableProps) {
  // Memoize search filter function
  const searchFilterFn = useCallback((item: Batch, search: string) => {
    const searchLower = search.toLowerCase();
    return !!(
      item.code.toLowerCase().includes(searchLower) ||
      item.productionOrderCode.toLowerCase().includes(searchLower) ||
      item.productName.toLowerCase().includes(searchLower)
    );
  }, []);

  // Status filter function
  const statusFilterFn = useCallback(
    (item: Batch) => {
      if (statusFilter === 'all') return true;
      return item.status === statusFilter;
    },
    [statusFilter]
  );

  // Get columns
  const columns = useBatchColumns({ onDelete });

  // Table filters
  const { columnFilters, setColumnFilters } = useTableFilters();

  // Table data filtering with custom status filter
  const filteredData = useMemo(() => {
    let result = data;

    // Filter by status
    if (statusFilter !== 'all') {
      result = result.filter(statusFilterFn);
    }

    // Filter by search
    if (searchValue.trim()) {
      result = result.filter((item) => searchFilterFn(item, searchValue.trim()));
    }

    return result;
  }, [data, statusFilter, searchValue, statusFilterFn, searchFilterFn]);

  // Table columns with selection
  const { tableColumns } = useTableColumns<Batch>({
    columns,
    enableRowSelection: true
  });

  // Table selection state
  const { rowSelection, setRowSelection } = useTableSelection();

  // Create table instance
  const { table, sorting, setSorting, columnVisibility, setColumnVisibility } = useTable<Batch>({
    data: filteredData,
    columns: tableColumns,
    columnFilters,
    rowSelection,
    onRowSelectionChange: setRowSelection,
    initialPageSize,
    enableRowSelection: true
  });

  // Compute selected rows from table
  const selectedRows = useSelectedRows<Batch>(table, true);

  // Handle row selection change
  const handleRowSelectionChange = useCallback(
    (selected: Batch[]) => {
      onSelectionChange?.(selected);
    },
    [onSelectionChange]
  );

  // Notify parent of selection changes
  useSelectionChange(selectedRows, true, handleRowSelectionChange);

  // Table CSV export
  const { csvData, csvHeadersData } = useTableCSV<Batch>({
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
