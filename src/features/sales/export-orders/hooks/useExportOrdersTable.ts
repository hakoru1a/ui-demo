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

import { useExportOrderColumns } from '../components/ExportOrderColumns';
import type { ExportOrder } from '../types';
import type { ExportOrderStatusFilter } from '../types/filters';

// ==============================|| EXPORT ORDERS TABLE HOOK ||============================== //

interface UseExportOrdersTableProps {
  data: ExportOrder[];
  statusFilter: ExportOrderStatusFilter;
  searchValue: string;
  onEdit?: (order: ExportOrder) => void;
  onDelete?: (order: ExportOrder) => void;
  onSelectionChange?: (selected: ExportOrder[]) => void;
  initialPageSize?: number;
}

/**
 * Hook to manage all table-related logic for Export Orders
 * Consolidates table setup, filtering, selection, and CSV export
 */
export function useExportOrdersTable({
  data,
  statusFilter,
  searchValue,
  onEdit,
  onDelete,
  onSelectionChange,
  initialPageSize = 25
}: UseExportOrdersTableProps) {
  // Memoize search filter function
  const searchFilterFn = useCallback((item: ExportOrder, search: string) => {
    const searchLower = search.toLowerCase();
    return !!(
      item.orderNo.toLowerCase().includes(searchLower) ||
      (item.customerName && item.customerName.toLowerCase().includes(searchLower)) ||
      item.country.toLowerCase().includes(searchLower)
    );
  }, []);

  // Status filter function for export order status
  const orderStatusFilterFn = useCallback(
    (item: ExportOrder) => {
      if (statusFilter === 'all') return true;
      return item.status === statusFilter;
    },
    [statusFilter]
  );

  // Get columns
  const columns = useExportOrderColumns({ onEdit, onDelete });

  // Table filters
  const { columnFilters, setColumnFilters } = useTableFilters();

  // Table data filtering with custom status filter
  const filteredData = useMemo(() => {
    let result = data;

    // Filter by order status
    if (statusFilter !== 'all') {
      result = result.filter(orderStatusFilterFn);
    }

    // Filter by search
    if (searchValue.trim()) {
      result = result.filter((item) => searchFilterFn(item, searchValue.trim()));
    }

    return result;
  }, [data, statusFilter, searchValue, orderStatusFilterFn, searchFilterFn]);

  // Table columns with selection
  const { tableColumns } = useTableColumns<ExportOrder>({
    columns,
    enableRowSelection: true
  });

  // Table selection state
  const { rowSelection, setRowSelection } = useTableSelection();

  // Create table instance
  const { table, sorting, setSorting, columnVisibility, setColumnVisibility } = useTable<ExportOrder>({
    data: filteredData,
    columns: tableColumns,
    columnFilters,
    rowSelection,
    onRowSelectionChange: setRowSelection,
    initialPageSize,
    enableRowSelection: true
  });

  // Compute selected rows from table
  const selectedRows = useSelectedRows<ExportOrder>(table, true);

  // Handle row selection change
  const handleRowSelectionChange = useCallback(
    (selected: ExportOrder[]) => {
      onSelectionChange?.(selected);
    },
    [onSelectionChange]
  );

  // Notify parent of selection changes
  useSelectionChange(selectedRows, true, handleRowSelectionChange);

  // Table CSV export
  const { csvData, csvHeadersData } = useTableCSV<ExportOrder>({
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
