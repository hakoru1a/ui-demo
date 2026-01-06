import { useCallback } from 'react';

import {
  useTableFilters,
  useTableSelection,
  useSelectedRows,
  useSelectionChange,
  useTableData,
  useTableColumns,
  useTable,
  useTableCSV
} from 'hooks/table';
import { StatusFilter } from 'types/status';

import { useSkuColumns } from '../components/SkuColumns';
import type { Sku } from '../types';

// ==============================|| SKU TABLE HOOK ||============================== //

interface UseSkuTableProps {
  data: Sku[];
  statusFilter: StatusFilter | string;
  searchValue: string;
  onEdit?: (sku: Sku) => void;
  onDelete?: (sku: Sku) => void;
  onSelectionChange?: (selected: Sku[]) => void;
  initialPageSize?: number;
}

/**
 * Hook to manage all table-related logic for SKUs
 * Consolidates table setup, filtering, selection, and CSV export
 */
export function useSkuTable({
  data,
  statusFilter,
  searchValue,
  onEdit,
  onDelete,
  onSelectionChange,
  initialPageSize = 25
}: UseSkuTableProps) {
  // Memoize search filter function
  const searchFilterFn = useCallback((item: Sku, search: string) => {
    const searchLower = search.toLowerCase();
    return !!(
      item.code.toLowerCase().includes(searchLower) ||
      item.name.toLowerCase().includes(searchLower) ||
      item.warehouseName.toLowerCase().includes(searchLower)
    );
  }, []);

  // Get columns
  const columns = useSkuColumns({ onEdit, onDelete });

  // Table filters
  const { columnFilters, setColumnFilters } = useTableFilters();

  // Table data filtering
  const { filteredData } = useTableData<Sku>({
    data,
    statusFilter: statusFilter as StatusFilter | undefined,
    searchValue,
    searchFilterFn
  });

  // Table columns with selection
  const { tableColumns } = useTableColumns<Sku>({
    columns,
    enableRowSelection: true
  });

  // Table selection state
  const { rowSelection, setRowSelection } = useTableSelection();

  // Create table instance
  const { table, sorting, setSorting, columnVisibility, setColumnVisibility } = useTable<Sku>({
    data: filteredData,
    columns: tableColumns,
    columnFilters,
    rowSelection,
    onRowSelectionChange: setRowSelection,
    initialPageSize,
    enableRowSelection: true
  });

  // Compute selected rows from table
  const selectedRows = useSelectedRows<Sku>(table, true);

  // Handle row selection change - only notify if callback is provided
  const handleRowSelectionChange = useCallback(
    (selected: Sku[]) => {
      onSelectionChange?.(selected);
    },
    [onSelectionChange]
  );

  // Notify parent of selection changes - only if callback is provided
  useSelectionChange(selectedRows, !!onSelectionChange, onSelectionChange ? handleRowSelectionChange : undefined);

  // Table CSV export
  const { csvData, csvHeadersData } = useTableCSV<Sku>({
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
