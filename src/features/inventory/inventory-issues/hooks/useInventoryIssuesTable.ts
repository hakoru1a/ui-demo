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

import { useInventoryIssueColumns } from '../components/InventoryIssueColumns';
import type { InventoryIssue } from '../types';

// ==============================|| INVENTORY ISSUES TABLE HOOK ||============================== //

interface UseInventoryIssuesTableProps {
  data: InventoryIssue[];
  statusFilter: StatusFilter | string;
  searchValue: string;
  onEdit?: (issue: InventoryIssue) => void;
  onDelete?: (issue: InventoryIssue) => void;
  onSelectionChange?: (selected: InventoryIssue[]) => void;
  initialPageSize?: number;
}

/**
 * Hook to manage all table-related logic for Inventory Issues
 * Consolidates table setup, filtering, selection, and CSV export
 */
export function useInventoryIssuesTable({
  data,
  statusFilter,
  searchValue,
  onEdit,
  onDelete,
  onSelectionChange,
  initialPageSize = 25
}: UseInventoryIssuesTableProps) {
  // Memoize search filter function
  const searchFilterFn = useCallback((item: InventoryIssue, search: string) => {
    const searchLower = search.toLowerCase();
    return !!(
      item.code.toLowerCase().includes(searchLower) ||
      item.warehouseName.toLowerCase().includes(searchLower) ||
      item.productName.toLowerCase().includes(searchLower)
    );
  }, []);

  // Get columns
  const columns = useInventoryIssueColumns({ onEdit, onDelete });

  // Table filters
  const { columnFilters, setColumnFilters } = useTableFilters();

  // Table data filtering
  const { filteredData } = useTableData<InventoryIssue>({
    data,
    statusFilter: statusFilter as StatusFilter | undefined,
    searchValue,
    searchFilterFn
  });

  // Table columns with selection
  const { tableColumns } = useTableColumns<InventoryIssue>({
    columns,
    enableRowSelection: true
  });

  // Table selection state
  const { rowSelection, setRowSelection } = useTableSelection();

  // Create table instance
  const { table, sorting, setSorting, columnVisibility, setColumnVisibility } = useTable<InventoryIssue>({
    data: filteredData,
    columns: tableColumns,
    columnFilters,
    rowSelection,
    onRowSelectionChange: setRowSelection,
    initialPageSize,
    enableRowSelection: true
  });

  // Compute selected rows from table
  const selectedRows = useSelectedRows<InventoryIssue>(table, true);

  // Handle row selection change - only notify if callback is provided
  const handleRowSelectionChange = useCallback(
    (selected: InventoryIssue[]) => {
      onSelectionChange?.(selected);
    },
    [onSelectionChange]
  );

  // Notify parent of selection changes - only if callback is provided
  useSelectionChange(selectedRows, !!onSelectionChange, onSelectionChange ? handleRowSelectionChange : undefined);

  // Table CSV export
  const { csvData, csvHeadersData } = useTableCSV<InventoryIssue>({
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
