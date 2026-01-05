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

import { useWorkforceDispatchOrderColumns } from '../components/WorkforceDispatchOrderColumns';
import type { StatusFilter as CustomStatusFilter } from '../components/WorkforceDispatchOrderTableHeader';
import type { WorkforceDispatchOrder } from '../types';

// ==============================|| WORKFORCE DISPATCH ORDERS TABLE HOOK ||============================== //

interface UseWorkforceDispatchOrdersTableProps {
  data: WorkforceDispatchOrder[];
  statusFilter: CustomStatusFilter;
  searchValue: string;
  onEdit?: (order: WorkforceDispatchOrder) => void;
  onDelete?: (order: WorkforceDispatchOrder) => void;
  onSelectionChange?: (selected: WorkforceDispatchOrder[]) => void;
  initialPageSize?: number;
}

/**
 * Hook to manage all table-related logic for Workforce Dispatch Orders
 * Consolidates table setup, filtering, selection, and CSV export
 */
export function useWorkforceDispatchOrdersTable({
  data,
  statusFilter,
  searchValue,
  onEdit,
  onDelete,
  onSelectionChange,
  initialPageSize = 25
}: UseWorkforceDispatchOrdersTableProps) {
  // Memoize search filter function
  const searchFilterFn = useCallback((item: WorkforceDispatchOrder, search: string) => {
    const searchLower = search.toLowerCase();
    return !!(
      item.code.toLowerCase().includes(searchLower) ||
      item.factoryName.toLowerCase().includes(searchLower) ||
      item.departmentName.toLowerCase().includes(searchLower) ||
      item.productionShiftName.toLowerCase().includes(searchLower)
    );
  }, []);

  // Memoize status filter function
  const statusFilterFn = useCallback(
    (item: WorkforceDispatchOrder) => {
      if (statusFilter === 'all') return true;
      return item.status === statusFilter;
    },
    [statusFilter]
  );

  // Get columns
  const columns = useWorkforceDispatchOrderColumns({ onEdit, onDelete });

  // Table filters
  const { columnFilters, setColumnFilters } = useTableFilters();

  // Filter data manually (since we use custom StatusFilter)
  const filteredData = useMemo(() => {
    let result = data;

    // Filter by status
    result = result.filter(statusFilterFn);

    // Filter by search
    if (searchValue.trim()) {
      result = result.filter((item) => searchFilterFn(item, searchValue.trim()));
    }

    return result;
  }, [data, statusFilterFn, searchValue, searchFilterFn]);

  // Table columns with selection
  const { tableColumns } = useTableColumns<WorkforceDispatchOrder>({
    columns,
    enableRowSelection: true
  });

  // Table selection state
  const { rowSelection, setRowSelection } = useTableSelection();

  // Create table instance
  const { table, sorting, setSorting, columnVisibility, setColumnVisibility } = useTable<WorkforceDispatchOrder>({
    data: filteredData,
    columns: tableColumns,
    columnFilters,
    setColumnFilters,
    rowSelection,
    setRowSelection,
    initialPageSize
  });

  // Selected rows
  const selectedRows = useSelectedRows<WorkforceDispatchOrder>(table, rowSelection);

  // Selection change handler
  useSelectionChange(selectedRows, !!onSelectionChange, onSelectionChange ? handleRowSelectionChange : undefined);

  function handleRowSelectionChange(selected: WorkforceDispatchOrder[]) {
    onSelectionChange?.(selected);
  }

  // CSV export
  const { csvData, csvHeadersData } = useTableCSV<WorkforceDispatchOrder>({
    table,
    columns,
    filename: 'workforce-dispatch-orders'
  });

  return {
    table,
    data: filteredData,
    selectedRows,
    columnFilters,
    setColumnFilters,
    sorting,
    setSorting,
    columnVisibility,
    setColumnVisibility,
    csvData,
    csvHeadersData
  };
}
