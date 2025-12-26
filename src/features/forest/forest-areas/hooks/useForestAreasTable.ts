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

import { useForestAreaColumns } from '../components/ForestAreaColumns';
import type { ForestArea } from '../types';

// ==============================|| FOREST AREAS TABLE HOOK ||============================== //

interface UseForestAreasTableProps {
  data: ForestArea[];
  statusFilter: StatusFilter;
  searchValue: string;
  onDisable?: (forestArea: ForestArea) => void;
  onSelectionChange?: (selected: ForestArea[]) => void;
  initialPageSize?: number;
}

/**
 * Hook to manage all table-related logic for Forest Areas
 * Consolidates table setup, filtering, selection, and CSV export
 */
export function useForestAreasTable({
  data,
  statusFilter,
  searchValue,
  onDisable,
  onSelectionChange,
  initialPageSize = 25
}: UseForestAreasTableProps) {
  // Memoize search filter function
  const searchFilterFn = useCallback((item: ForestArea, search: string) => {
    const searchLower = search.toLowerCase();
    return !!(
      item.code.toLowerCase().includes(searchLower) ||
      item.name.toLowerCase().includes(searchLower) ||
      (item.ownerName && item.ownerName.toLowerCase().includes(searchLower))
    );
  }, []);

  // Get columns
  const columns = useForestAreaColumns({ onDisable });

  // Table filters
  const { columnFilters, setColumnFilters } = useTableFilters();

  // Table data filtering
  const { filteredData } = useTableData<ForestArea>({
    data,
    statusFilter,
    searchValue,
    searchFilterFn
  });

  // Table columns with selection
  const { tableColumns } = useTableColumns<ForestArea>({
    columns,
    enableRowSelection: true
  });

  // Table selection state
  const { rowSelection, setRowSelection } = useTableSelection();

  // Create table instance
  const { table, sorting, setSorting, columnVisibility, setColumnVisibility } = useTable<ForestArea>({
    data: filteredData,
    columns: tableColumns,
    columnFilters,
    rowSelection,
    onRowSelectionChange: setRowSelection,
    initialPageSize,
    enableRowSelection: true
  });

  // Compute selected rows from table
  const selectedRows = useSelectedRows<ForestArea>(table, true);

  // Handle row selection change
  const handleRowSelectionChange = useCallback(
    (selected: ForestArea[]) => {
      onSelectionChange?.(selected);
    },
    [onSelectionChange]
  );

  // Notify parent of selection changes
  useSelectionChange(selectedRows, true, handleRowSelectionChange);

  // Table CSV export
  const { csvData, csvHeadersData } = useTableCSV<ForestArea>({
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
