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

import { useInventoryIssueColumns } from '../components/InventoryIssueColumns';
import type { InventoryIssue } from '../types';

// ==============================|| INVENTORY ISSUES TABLE HOOK ||============================== //

interface UseInventoryIssuesTableProps {
  data: InventoryIssue[];
  statusFilter?: string;
  searchValue: string;
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
      (item.destinationName && item.destinationName.toLowerCase().includes(searchLower)) ||
      (item.customerName && item.customerName.toLowerCase().includes(searchLower)) ||
      (item.productName && item.productName.toLowerCase().includes(searchLower))
    );
  }, []);

  // Get columns
  const columns = useInventoryIssueColumns({ onDelete });

  // Table filters
  const { columnFilters, setColumnFilters } = useTableFilters();

  // Table data filtering
  const { filteredData } = useTableData<InventoryIssue>({
    data,
    statusFilter,
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

  // Handle row selection change
  const handleRowSelectionChange = useCallback(
    (selected: InventoryIssue[]) => {
      onSelectionChange?.(selected);
    },
    [onSelectionChange]
  );

  // Notify parent of selection changes
  useSelectionChange(selectedRows, true, handleRowSelectionChange);

  // Table CSV export
  const { csvData, csvHeadersData } = useTableCSV<InventoryIssue>({
    table,
    columns: tableColumns,
    filename: 'inventory-issues-export'
  });

  return {
    table,
    columnFilters,
    setColumnFilters,
    filteredData,
    csvData,
    csvHeadersData,
    selectedRows,
    sorting,
    setSorting,
    columnVisibility,
    setColumnVisibility
  };
}
