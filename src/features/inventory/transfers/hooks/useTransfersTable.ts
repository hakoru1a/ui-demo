// ==============================|| TRANSFERS TABLE HOOK ||============================== //

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

import { useTransferColumns } from '../components/TransferColumns';
import type { Transfer } from '../types';

// ==============================|| TRANSFERS TABLE HOOK ||============================== //

interface UseTransfersTableProps {
  data: Transfer[];
  statusFilter: StatusFilter | string;
  searchValue: string;
  onEdit?: (transfer: Transfer) => void;
  onDelete?: (transfer: Transfer) => void;
  onSelectionChange?: (selected: Transfer[]) => void;
  initialPageSize?: number;
}

/**
 * Hook to manage all table-related logic for Transfers
 * Consolidates table setup, filtering, selection, and CSV export
 */
export function useTransfersTable({
  data,
  statusFilter,
  searchValue,
  onEdit,
  onDelete,
  onSelectionChange,
  initialPageSize = 25
}: UseTransfersTableProps) {
  // Memoize search filter function
  const searchFilterFn = useCallback((item: Transfer, search: string) => {
    const searchLower = search.toLowerCase();
    return !!(
      item.code.toLowerCase().includes(searchLower) ||
      (item.sourceWarehouseName || '').toLowerCase().includes(searchLower) ||
      (item.destinationWarehouseName || '').toLowerCase().includes(searchLower)
    );
  }, []);

  // Get columns
  const columns = useTransferColumns({ onEdit, onDelete });

  // Table filters
  const { columnFilters, setColumnFilters } = useTableFilters();

  // Table data filtering
  const { filteredData } = useTableData<Transfer>({
    data,
    statusFilter: statusFilter as StatusFilter | undefined,
    searchValue,
    searchFilterFn
  });

  // Table columns with selection
  const { tableColumns } = useTableColumns<Transfer>({
    columns,
    enableRowSelection: true
  });

  // Table selection state
  const { rowSelection, setRowSelection } = useTableSelection();

  // Create table instance
  const { table, sorting, setSorting, columnVisibility, setColumnVisibility } = useTable<Transfer>({
    data: filteredData,
    columns: tableColumns,
    columnFilters,
    rowSelection,
    onRowSelectionChange: setRowSelection,
    initialPageSize,
    enableRowSelection: true
  });

  // Compute selected rows from table
  const selectedRows = useSelectedRows<Transfer>(table, true);

  // Handle row selection change - only notify if callback is provided
  const handleRowSelectionChange = useCallback(
    (selected: Transfer[]) => {
      onSelectionChange?.(selected);
    },
    [onSelectionChange]
  );

  // Notify parent of selection changes - only if callback is provided
  useSelectionChange(selectedRows, !!onSelectionChange, onSelectionChange ? handleRowSelectionChange : undefined);

  // Table CSV export
  const { csvData, csvHeadersData } = useTableCSV<Transfer>({
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
