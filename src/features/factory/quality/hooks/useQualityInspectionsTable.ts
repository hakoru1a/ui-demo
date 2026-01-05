// ==============================|| QUALITY INSPECTIONS TABLE HOOK ||============================== //

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

import { useQualityInspectionColumns } from '../components/QualityInspectionColumns';
import type { QCResultFilter } from '../components/QualityInspectionTableHeader';
import type { QualityInspection } from '../types';

// ==============================|| QUALITY INSPECTIONS TABLE HOOK ||============================== //

interface UseQualityInspectionsTableProps {
  data: QualityInspection[];
  resultFilter: QCResultFilter;
  searchValue: string;
  onDelete?: (inspection: QualityInspection) => void;
  onSelectionChange?: (selected: QualityInspection[]) => void;
  initialPageSize?: number;
}

/**
 * Hook to manage all table-related logic for Quality Inspections
 * Consolidates table setup, filtering, selection, and CSV export
 */
export function useQualityInspectionsTable({
  data,
  resultFilter,
  searchValue,
  onDelete,
  onSelectionChange,
  initialPageSize = 25
}: UseQualityInspectionsTableProps) {
  // Memoize search filter function
  const searchFilterFn = useCallback((item: QualityInspection, search: string) => {
    const searchLower = search.toLowerCase();
    return !!(
      item.code.toLowerCase().includes(searchLower) ||
      item.productName.toLowerCase().includes(searchLower) ||
      item.batchCode.toLowerCase().includes(searchLower)
    );
  }, []);

  // Result filter function
  const resultFilterFn = useCallback(
    (item: QualityInspection) => {
      if (resultFilter === 'all') return true;
      return item.result === resultFilter;
    },
    [resultFilter]
  );

  // Get columns
  const columns = useQualityInspectionColumns({ onDelete });

  // Table filters
  const { columnFilters, setColumnFilters } = useTableFilters();

  // Table data filtering with custom result filter
  const filteredData = useMemo(() => {
    let result = data;

    // Filter by result
    if (resultFilter !== 'all') {
      result = result.filter(resultFilterFn);
    }

    // Filter by search
    if (searchValue.trim()) {
      result = result.filter((item) => searchFilterFn(item, searchValue.trim()));
    }

    return result;
  }, [data, resultFilter, searchValue, resultFilterFn, searchFilterFn]);

  // Table columns with selection
  const { tableColumns } = useTableColumns<QualityInspection>({
    columns,
    enableRowSelection: true
  });

  // Table selection state
  const { rowSelection, setRowSelection } = useTableSelection();

  // Create table instance
  const { table, sorting, setSorting, columnVisibility, setColumnVisibility } = useTable<QualityInspection>({
    data: filteredData,
    columns: tableColumns,
    columnFilters,
    rowSelection,
    onRowSelectionChange: setRowSelection,
    initialPageSize,
    enableRowSelection: true
  });

  // Compute selected rows from table
  const selectedRows = useSelectedRows<QualityInspection>(table, true);

  // Handle row selection change
  const handleRowSelectionChange = useCallback(
    (selected: QualityInspection[]) => {
      onSelectionChange?.(selected);
    },
    [onSelectionChange]
  );

  // Notify parent of selection changes
  useSelectionChange(selectedRows, true, handleRowSelectionChange);

  // Table CSV export
  const { csvData, csvHeadersData } = useTableCSV<QualityInspection>({
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
