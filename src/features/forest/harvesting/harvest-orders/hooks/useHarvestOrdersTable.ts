import { useCallback, useMemo } from 'react';

import {
  useSelectedRows,
  useSelectionChange,
  useTable,
  useTableColumns,
  useTableCSV,
  useTableFilters,
  useTableSelection
} from 'hooks/table';

import { useHarvestOrderColumns } from '../components/HarvestOrderColumns';
import type { HarvestOrder } from '../types/index';

// ==============================|| HARVEST ORDERS TABLE HOOK ||============================== //

interface UseHarvestOrdersTableProps {
  data: HarvestOrder[];
  searchValue: string;
  statusFilter?: string;
  onDelete?: (order: HarvestOrder) => void;
  onSelectionChange?: (selected: HarvestOrder[]) => void;
  initialPageSize?: number;
}

/**
 * Hook to manage all table-related logic for Harvest Orders
 * Consolidates table setup, filtering, selection, and CSV export
 */
export function useHarvestOrdersTable({
  data,
  searchValue,
  statusFilter = 'all',
  onDelete,
  onSelectionChange,
  initialPageSize = 25
}: UseHarvestOrdersTableProps) {
  // Memoize search filter function
  const searchFilterFn = useCallback((item: HarvestOrder, search: string) => {
    const searchLower = search.toLowerCase();
    return !!(
      item.code.toLowerCase().includes(searchLower) ||
      item.planName.toLowerCase().includes(searchLower) ||
      item.forestAreaName.toLowerCase().includes(searchLower)
    );
  }, []);

  // Get columns
  const columns = useHarvestOrderColumns({ onDelete });

  // Table filters
  const { columnFilters, setColumnFilters } = useTableFilters();

  // Table data filtering
  const filteredData = useMemo(() => {
    let result = data;

    // Filter by status
    if (statusFilter !== 'all') {
      result = result.filter((item) => item.status === statusFilter);
    }

    // Filter by search
    if (searchValue.trim()) {
      result = result.filter((item) => searchFilterFn(item, searchValue.trim()));
    }

    return result;
  }, [data, searchValue, statusFilter, searchFilterFn]);

  // Table columns with selection
  const { tableColumns } = useTableColumns<HarvestOrder>({
    columns,
    enableRowSelection: true
  });

  // Table selection state
  const { rowSelection, setRowSelection } = useTableSelection();

  // Create table instance
  const { table, sorting, setSorting, columnVisibility, setColumnVisibility } = useTable<HarvestOrder>({
    data: filteredData,
    columns: tableColumns,
    columnFilters,
    rowSelection,
    onRowSelectionChange: setRowSelection,
    initialPageSize,
    enableRowSelection: true
  });

  // Compute selected rows from table
  const selectedRows = useSelectedRows<HarvestOrder>(table, true);

  // Handle row selection change
  const handleRowSelectionChange = useCallback(
    (selected: HarvestOrder[]) => {
      onSelectionChange?.(selected);
    },
    [onSelectionChange]
  );

  // Notify parent of selection changes
  useSelectionChange(selectedRows, true, handleRowSelectionChange);

  // Table CSV export
  const { csvData, csvHeadersData } = useTableCSV<HarvestOrder>({
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
