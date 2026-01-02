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

import { usePriceTableColumns } from '../components/PriceTableColumns';
import type { PriceTable } from '../types';

// ==============================|| PRICE TABLES TABLE HOOK ||============================== //

interface UsePriceTablesTableProps {
  data: PriceTable[];
  statusFilter: StatusFilter;
  searchValue: string;
  onDelete?: (priceTable: PriceTable) => void;
  onSelectionChange?: (selected: PriceTable[]) => void;
  initialPageSize?: number;
}

/**
 * Hook to manage all table-related logic for Price Tables
 * Consolidates table setup, filtering, selection, and CSV export
 */
export function usePriceTablesTable({
  data,
  statusFilter,
  searchValue,
  onDelete,
  onSelectionChange,
  initialPageSize = 25
}: UsePriceTablesTableProps) {
  // Memoize search filter function
  const searchFilterFn = useCallback((item: PriceTable, search: string) => {
    const searchLower = search.toLowerCase();
    return !!(
      item.code.toLowerCase().includes(searchLower) ||
      item.name.toLowerCase().includes(searchLower) ||
      (item.materialType && item.materialType.toLowerCase().includes(searchLower))
    );
  }, []);

  // Get columns
  const columns = usePriceTableColumns({ onDelete });

  // Table filters
  const { columnFilters, setColumnFilters } = useTableFilters();

  // Table data filtering
  const { filteredData } = useTableData<PriceTable>({
    data,
    statusFilter,
    searchValue,
    searchFilterFn
  });

  // Table columns with selection
  const { tableColumns } = useTableColumns<PriceTable>({
    columns,
    enableRowSelection: true
  });

  // Table selection state
  const { rowSelection, setRowSelection } = useTableSelection();

  // Create table instance
  const { table, sorting, setSorting, columnVisibility, setColumnVisibility } = useTable<PriceTable>({
    data: filteredData,
    columns: tableColumns,
    columnFilters,
    rowSelection,
    onRowSelectionChange: setRowSelection,
    initialPageSize,
    enableRowSelection: true
  });

  // Compute selected rows from table
  const selectedRows = useSelectedRows<PriceTable>(table, true);

  // Handle row selection change
  const handleRowSelectionChange = useCallback(
    (selected: PriceTable[]) => {
      onSelectionChange?.(selected);
    },
    [onSelectionChange]
  );

  // Notify parent of selection changes
  useSelectionChange(selectedRows, true, handleRowSelectionChange);

  // Table CSV export
  const { csvData, csvHeadersData } = useTableCSV<PriceTable>({
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
