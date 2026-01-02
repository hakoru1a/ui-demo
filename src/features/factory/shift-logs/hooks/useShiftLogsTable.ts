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

import { useShiftLogColumns } from '../components/ShiftLogColumns';
import type { ShiftLog } from '../types/index';

// ==============================|| SHIFT LOGS TABLE HOOK ||============================== //

interface UseShiftLogsTableProps {
  data: ShiftLog[];
  statusFilter: StatusFilter | 'running' | 'completed';
  searchValue: string;
  onDelete?: (shiftLog: ShiftLog) => void;
  onSelectionChange?: (selected: ShiftLog[]) => void;
  initialPageSize?: number;
}

/**
 * Hook to manage all table-related logic for Shift Logs
 * Consolidates table setup, filtering, selection, and CSV export
 */
export function useShiftLogsTable({
  data,
  statusFilter,
  searchValue,
  onDelete,
  onSelectionChange,
  initialPageSize = 25
}: UseShiftLogsTableProps) {
  // Memoize search filter function
  const searchFilterFn = useCallback((item: ShiftLog, search: string) => {
    const searchLower = search.toLowerCase();
    return !!(
      item.code.toLowerCase().includes(searchLower) ||
      item.batchCode.toLowerCase().includes(searchLower) ||
      item.shiftTime.toLowerCase().includes(searchLower)
    );
  }, []);

  // Get columns
  const columns = useShiftLogColumns({ onDelete });

  // Table filters
  const { columnFilters, setColumnFilters } = useTableFilters();

  // Custom status filter function for shift logs
  const statusFilterFn = useCallback((item: ShiftLog, filter: StatusFilter | 'running' | 'completed') => {
    if (filter === StatusFilter.ALL) {
      return true;
    }
    return item.status === filter;
  }, []);

  // Table data filtering
  const { filteredData } = useTableData<ShiftLog>({
    data,
    statusFilter: statusFilter as StatusFilter,
    searchValue,
    statusFilterFn: statusFilterFn as (item: ShiftLog, filter: StatusFilter) => boolean,
    searchFilterFn
  });

  // Table columns with selection
  const { tableColumns } = useTableColumns<ShiftLog>({
    columns,
    enableRowSelection: true
  });

  // Table selection state
  const { rowSelection, setRowSelection } = useTableSelection();

  // Create table instance
  const { table, sorting, setSorting, columnVisibility, setColumnVisibility } = useTable<ShiftLog>({
    data: filteredData,
    columns: tableColumns,
    columnFilters,
    rowSelection,
    onRowSelectionChange: setRowSelection,
    initialPageSize,
    enableRowSelection: true
  });

  // Compute selected rows from table
  const selectedRows = useSelectedRows<ShiftLog>(table, true);

  // Handle row selection change
  const handleRowSelectionChange = useCallback(
    (selected: ShiftLog[]) => {
      onSelectionChange?.(selected);
    },
    [onSelectionChange]
  );

  // Notify parent of selection changes
  useSelectionChange(selectedRows, true, handleRowSelectionChange);

  // Table CSV export
  const { csvData, csvHeadersData } = useTableCSV<ShiftLog>({
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
