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

import { useStocktakeColumns } from '../components/StocktakeColumns';
import type { Stocktake } from '../types';

// ==============================|| STOCKTAKE TABLE HOOK ||============================== //

interface UseStocktakesTableProps {
  data: Stocktake[];
  statusFilter: StatusFilter | string;
  searchValue: string;
  onEdit?: (stocktake: Stocktake) => void;
  onDelete?: (stocktake: Stocktake) => void;
  onView?: (stocktake: Stocktake) => void;
  onSelectionChange?: (selected: Stocktake[]) => void;
  initialPageSize?: number;
}

/**
 * Hook to manage all table-related logic for Stocktakes
 * Consolidates table setup, filtering, selection, and CSV export
 */
export function useStocktakesTable({
  data,
  statusFilter,
  searchValue,
  onEdit,
  onDelete,
  onView,
  onSelectionChange,
  initialPageSize = 25
}: UseStocktakesTableProps) {
  // Memoize search filter function
  const searchFilterFn = useCallback((item: Stocktake, search: string) => {
    const searchLower = search.toLowerCase();
    return !!(item.code.toLowerCase().includes(searchLower) || item.warehouseName.toLowerCase().includes(searchLower));
  }, []);

  // Get columns
  const columns = useStocktakeColumns({ onEdit, onDelete, onView });

  // Table filters
  const { columnFilters, setColumnFilters } = useTableFilters();

  // Table data filtering
  const { filteredData } = useTableData<Stocktake>({
    data,
    statusFilter,
    searchValue,
    searchFilterFn
  });

  // Table columns with selection
  const { tableColumns } = useTableColumns<Stocktake>({
    columns,
    enableRowSelection: true
  });

  // Table selection state
  const { rowSelection, setRowSelection } = useTableSelection();

  // Create table instance
  const { table, sorting, setSorting, columnVisibility, setColumnVisibility } = useTable<Stocktake>({
    data: filteredData,
    columns: tableColumns,
    columnFilters,
    rowSelection,
    onRowSelectionChange: setRowSelection,
    initialPageSize,
    enableRowSelection: true
  });

  // Compute selected rows from table
  const selectedRows = useSelectedRows<Stocktake>(table, true);

  // Handle row selection change - only notify if callback is provided
  const handleRowSelectionChange = useCallback(
    (selected: Stocktake[]) => {
      onSelectionChange?.(selected);
    },
    [onSelectionChange]
  );

  // Notify parent of selection changes - only if callback is provided
  useSelectionChange(selectedRows, !!onSelectionChange, onSelectionChange ? handleRowSelectionChange : undefined);

  // Table CSV export
  const { csvData, csvHeadersData } = useTableCSV<Stocktake>({
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
