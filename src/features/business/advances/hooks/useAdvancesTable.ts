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

import { useAdvanceColumns } from '../components/AdvanceColumns';
import type { Advance } from '../types';

// ==============================|| ADVANCES TABLE HOOK ||============================== //

interface UseAdvancesTableProps {
  data: Advance[];
  statusFilter: StatusFilter;
  searchValue: string;
  onEdit?: (advance: Advance) => void;
  onDelete?: (advance: Advance) => void;
  onSelectionChange?: (selected: Advance[]) => void;
  initialPageSize?: number;
}

/**
 * Hook to manage all table-related logic for Advances
 * Consolidates table setup, filtering, selection, and CSV export
 */
export function useAdvancesTable({
  data,
  statusFilter,
  searchValue,
  onEdit,
  onDelete,
  onSelectionChange,
  initialPageSize = 25
}: UseAdvancesTableProps) {
  // Memoize search filter function
  const searchFilterFn = useCallback((item: Advance, search: string) => {
    const searchLower = search.toLowerCase();
    return !!(
      item.code.toLowerCase().includes(searchLower) ||
      item.requesterName.toLowerCase().includes(searchLower) ||
      item.purpose.toLowerCase().includes(searchLower)
    );
  }, []);

  // Get columns
  const columns = useAdvanceColumns({ onEdit, onDelete });

  // Table filters
  const { columnFilters, setColumnFilters } = useTableFilters();

  // Table data filtering
  const { filteredData } = useTableData<Advance>({
    data,
    statusFilter,
    searchValue,
    searchFilterFn
  });

  // Table columns with selection
  const { tableColumns } = useTableColumns<Advance>({
    columns,
    enableRowSelection: true
  });

  // Table selection state
  const { rowSelection, setRowSelection } = useTableSelection();

  // Create table instance
  const { table, sorting, setSorting, columnVisibility, setColumnVisibility } = useTable<Advance>({
    data: filteredData,
    columns: tableColumns,
    columnFilters,
    rowSelection,
    onRowSelectionChange: setRowSelection,
    initialPageSize,
    enableRowSelection: true
  });

  // Compute selected rows from table
  const selectedRows = useSelectedRows<Advance>(table, true);

  // Handle row selection change - only notify if callback is provided
  const handleRowSelectionChange = useCallback(
    (selected: Advance[]) => {
      onSelectionChange?.(selected);
    },
    [onSelectionChange]
  );

  // Notify parent of selection changes - only if callback is provided
  useSelectionChange(selectedRows, !!onSelectionChange, onSelectionChange ? handleRowSelectionChange : undefined);

  // Table CSV export
  const { csvData, csvHeadersData } = useTableCSV<Advance>({
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
