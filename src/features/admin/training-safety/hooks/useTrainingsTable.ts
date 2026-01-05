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

import { useTrainingColumns } from '../components/TrainingColumns';
import type { Training } from '../types';

// ==============================|| TRAININGS TABLE HOOK ||============================== //

interface UseTrainingsTableProps {
  data: Training[];
  statusFilter: StatusFilter;
  searchValue: string;
  onEdit?: (training: Training) => void;
  onDelete?: (training: Training) => void;
  onSelectionChange?: (selected: Training[]) => void;
  initialPageSize?: number;
}

/**
 * Hook to manage all table-related logic for Trainings
 * Consolidates table setup, filtering, selection, and CSV export
 */
export function useTrainingsTable({
  data,
  statusFilter,
  searchValue,
  onEdit,
  onDelete,
  onSelectionChange,
  initialPageSize = 25
}: UseTrainingsTableProps) {
  // Memoize search filter function
  const searchFilterFn = useCallback((item: Training, search: string) => {
    const searchLower = search.toLowerCase();
    return !!item.name.toLowerCase().includes(searchLower);
  }, []);

  // Get columns
  const columns = useTrainingColumns({ onEdit, onDelete });

  // Table filters
  const { columnFilters, setColumnFilters } = useTableFilters();

  // Table data filtering
  const { filteredData } = useTableData<Training>({
    data,
    statusFilter,
    searchValue,
    searchFilterFn
  });

  // Table columns with selection
  const { tableColumns } = useTableColumns<Training>({
    columns,
    enableRowSelection: true
  });

  // Table selection state
  const { rowSelection, setRowSelection } = useTableSelection();

  // Create table instance
  const { table, sorting, setSorting, columnVisibility, setColumnVisibility } = useTable<Training>({
    data: filteredData,
    columns: tableColumns,
    columnFilters,
    setColumnFilters,
    rowSelection,
    setRowSelection,
    initialPageSize
  });

  // Selected rows
  const selectedRows = useSelectedRows<Training>(table, rowSelection);

  // Selection change handler
  useSelectionChange(selectedRows, !!onSelectionChange, onSelectionChange ? handleRowSelectionChange : undefined);

  function handleRowSelectionChange(selected: Training[]) {
    onSelectionChange?.(selected);
  }

  // CSV export
  const { csvData, csvHeadersData } = useTableCSV<Training>({
    table,
    columns,
    filename: 'trainings'
  });

  return {
    table,
    columnFilters,
    setColumnFilters,
    filteredData,
    csvData,
    csvHeadersData,
    selectedRows,
    sorting,
    setSorting,
    columnVisibility,
    setColumnVisibility
  };
}
