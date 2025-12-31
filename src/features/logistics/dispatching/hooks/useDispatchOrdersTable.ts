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

import { useDispatchOrderColumns } from '../components/DispatchOrderColumns';
import type { DispatchOrderStatusFilter } from '../components/DispatchOrderTableHeader';
import type { DispatchOrder } from '../types';

// ==============================|| DISPATCH ORDERS TABLE HOOK ||============================== //

interface UseDispatchOrdersTableProps {
  data: DispatchOrder[];
  statusFilter?: DispatchOrderStatusFilter;
  searchValue: string;
  onDelete?: (order: DispatchOrder) => void;
  onSelectionChange?: (selected: DispatchOrder[]) => void;
  initialPageSize?: number;
}

/**
 * Hook to manage all table-related logic for Dispatch Orders
 * Consolidates table setup, filtering, selection, and CSV export
 */
export function useDispatchOrdersTable({
  data,
  statusFilter = 'all',
  searchValue,
  onDelete,
  onSelectionChange,
  initialPageSize = 25
}: UseDispatchOrdersTableProps) {
  // Get columns
  const columns = useDispatchOrderColumns({ onDelete });

  // Table filters
  const { columnFilters, setColumnFilters } = useTableFilters();

  // Status filter function for dispatch order status
  const orderStatusFilterFn = useCallback(
    (item: DispatchOrder) => {
      if (statusFilter === 'all') return true;
      return item.status === statusFilter;
    },
    [statusFilter]
  );

  // Table data filtering with status filter
  const filteredData = useMemo(() => {
    let result = data;

    // Filter by order status
    if (statusFilter !== 'all') {
      result = result.filter(orderStatusFilterFn);
    }

    // Filter by search
    if (searchValue.trim()) {
      result = result.filter((item) => {
        const searchLower = searchValue.toLowerCase();
        return (
          item.orderCode.toLowerCase().includes(searchLower) ||
          item.vehicleLicensePlate.toLowerCase().includes(searchLower) ||
          item.driverName.toLowerCase().includes(searchLower) ||
          item.origin.toLowerCase().includes(searchLower) ||
          item.destination.toLowerCase().includes(searchLower)
        );
      });
    }

    return result;
  }, [data, statusFilter, searchValue, orderStatusFilterFn]);

  // Table columns with selection
  const { tableColumns } = useTableColumns<DispatchOrder>({
    columns,
    enableRowSelection: true
  });

  // Table selection state
  const { rowSelection, setRowSelection } = useTableSelection();

  // Create table instance
  const { table, sorting, setSorting, columnVisibility, setColumnVisibility } = useTable<DispatchOrder>({
    data: filteredData,
    columns: tableColumns,
    columnFilters,
    rowSelection,
    onRowSelectionChange: setRowSelection,
    initialPageSize,
    enableRowSelection: true
  });

  // Compute selected rows from table
  const selectedRows = useSelectedRows<DispatchOrder>(table, true);

  // Handle row selection change
  const handleRowSelectionChange = useCallback(
    (selected: DispatchOrder[]) => {
      onSelectionChange?.(selected);
    },
    [onSelectionChange]
  );

  // Notify parent of selection changes
  useSelectionChange(selectedRows, true, handleRowSelectionChange);

  // Table CSV export
  const { csvData, csvHeadersData } = useTableCSV<DispatchOrder>({
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
