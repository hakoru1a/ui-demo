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

import { useInventoryReceiptColumns } from '../components/InventoryReceiptColumns';
import type { InventoryReceipt } from '../types';

// ==============================|| INVENTORY RECEIPTS TABLE HOOK ||============================== //

interface UseInventoryReceiptsTableProps {
  data: InventoryReceipt[];
  statusFilter: StatusFilter | string;
  searchValue: string;
  onEdit?: (receipt: InventoryReceipt) => void;
  onDelete?: (receipt: InventoryReceipt) => void;
  onSelectionChange?: (selected: InventoryReceipt[]) => void;
  initialPageSize?: number;
}

/**
 * Hook to manage all table-related logic for Inventory Receipts
 * Consolidates table setup, filtering, selection, and CSV export
 */
export function useInventoryReceiptsTable({
  data,
  statusFilter,
  searchValue,
  onEdit,
  onDelete,
  onSelectionChange,
  initialPageSize = 25
}: UseInventoryReceiptsTableProps) {
  // Memoize search filter function
  const searchFilterFn = useCallback((item: InventoryReceipt, search: string) => {
    const searchLower = search.toLowerCase();
    return !!(
      item.code.toLowerCase().includes(searchLower) ||
      item.warehouseName.toLowerCase().includes(searchLower) ||
      item.productName.toLowerCase().includes(searchLower)
    );
  }, []);

  // Get columns
  const columns = useInventoryReceiptColumns({ onEdit, onDelete });

  // Table filters
  const { columnFilters, setColumnFilters } = useTableFilters();

  // Table data filtering
  const { filteredData } = useTableData<InventoryReceipt>({
    data,
    statusFilter,
    searchValue,
    searchFilterFn
  });

  // Table columns with selection
  const { tableColumns } = useTableColumns<InventoryReceipt>({
    columns,
    enableRowSelection: true
  });

  // Table selection state
  const { rowSelection, setRowSelection } = useTableSelection();

  // Create table instance
  const { table, sorting, setSorting, columnVisibility, setColumnVisibility } = useTable<InventoryReceipt>({
    data: filteredData,
    columns: tableColumns,
    columnFilters,
    rowSelection,
    onRowSelectionChange: setRowSelection,
    initialPageSize,
    enableRowSelection: true
  });

  // Compute selected rows from table
  const selectedRows = useSelectedRows<InventoryReceipt>(table, true);

  // Handle row selection change - only notify if callback is provided
  const handleRowSelectionChange = useCallback(
    (selected: InventoryReceipt[]) => {
      onSelectionChange?.(selected);
    },
    [onSelectionChange]
  );

  // Notify parent of selection changes - only if callback is provided
  useSelectionChange(selectedRows, !!onSelectionChange, onSelectionChange ? handleRowSelectionChange : undefined);

  // Table CSV export
  const { csvData, csvHeadersData } = useTableCSV<InventoryReceipt>({
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
