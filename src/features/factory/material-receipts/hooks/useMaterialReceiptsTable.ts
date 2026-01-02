import { useCallback, useMemo } from 'react';

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

import { useMaterialReceiptColumns } from '../components/MaterialReceiptColumns';
import type { MaterialReceipt, ReceiptStatusFilter } from '../types';

// ==============================|| MATERIAL RECEIPTS TABLE HOOK ||============================== //

interface UseMaterialReceiptsTableProps {
  data: MaterialReceipt[];
  statusFilter: ReceiptStatusFilter;
  searchValue: string;
  onDelete?: (receipt: MaterialReceipt) => void;
  onSelectionChange?: (selected: MaterialReceipt[]) => void;
  initialPageSize?: number;
}

/**
 * Hook to manage all table-related logic for Material Receipts
 * Consolidates table setup, filtering, selection, and CSV export
 */
export function useMaterialReceiptsTable({
  data,
  statusFilter,
  searchValue,
  onDelete,
  onSelectionChange,
  initialPageSize = 25
}: UseMaterialReceiptsTableProps) {
  // Filter data by status first
  const statusFilteredData = useMemo(() => {
    if (statusFilter === 'all') return data;
    return data.filter((item) => item.status === statusFilter);
  }, [data, statusFilter]);

  // Memoize search filter function
  const searchFilterFn = useCallback((item: MaterialReceipt, search: string) => {
    const searchLower = search.toLowerCase();
    return !!(
      item.code.toLowerCase().includes(searchLower) ||
      (item.supplierName && item.supplierName.toLowerCase().includes(searchLower)) ||
      (item.warehouseName && item.warehouseName.toLowerCase().includes(searchLower))
    );
  }, []);

  // Get columns
  const columns = useMaterialReceiptColumns({ onDelete });

  // Table filters
  const { columnFilters, setColumnFilters } = useTableFilters();

  // Table data filtering (only search, status already filtered)
  const { filteredData } = useTableData<MaterialReceipt>({
    data: statusFilteredData,
    statusFilter: StatusFilter.ALL, // Already filtered by status above
    searchValue,
    searchFilterFn
  });

  // Table columns with selection
  const { tableColumns } = useTableColumns<MaterialReceipt>({
    columns,
    enableRowSelection: true
  });

  // Table selection state
  const { rowSelection, setRowSelection } = useTableSelection();

  // Create table instance
  const { table, sorting, setSorting, columnVisibility, setColumnVisibility } = useTable<MaterialReceipt>({
    data: filteredData,
    columns: tableColumns,
    columnFilters,
    rowSelection,
    onRowSelectionChange: setRowSelection,
    initialPageSize,
    enableRowSelection: true
  });

  // Compute selected rows from table
  const selectedRows = useSelectedRows<MaterialReceipt>(table, true);

  // Handle row selection change
  const handleRowSelectionChange = useCallback(
    (selected: MaterialReceipt[]) => {
      onSelectionChange?.(selected);
    },
    [onSelectionChange]
  );

  // Notify parent of selection changes
  useSelectionChange(selectedRows, true, handleRowSelectionChange);

  // Table CSV export
  const { csvData, csvHeadersData } = useTableCSV<MaterialReceipt>({
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
