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

import { useWeighTicketColumns } from '../components/WeighTicketColumns';
import type { WeighTicket } from '../types';

// ==============================|| WEIGH TICKETS TABLE HOOK ||============================== //

interface UseWeighTicketsTableProps {
  data: WeighTicket[];
  statusFilter: StatusFilter;
  searchValue: string;
  onDelete?: (weighTicket: WeighTicket) => void;
  onSelectionChange?: (selected: WeighTicket[]) => void;
  initialPageSize?: number;
}

/**
 * Hook to manage all table-related logic for Weigh Tickets
 * Consolidates table setup, filtering, selection, and CSV export
 */
export function useWeighTicketsTable({
  data,
  statusFilter,
  searchValue,
  onDelete,
  onSelectionChange,
  initialPageSize = 25
}: UseWeighTicketsTableProps) {
  // Memoize search filter function
  const searchFilterFn = useCallback((item: WeighTicket, search: string) => {
    const searchLower = search.toLowerCase();
    return !!(
      item.code.toLowerCase().includes(searchLower) ||
      item.vehiclePlate.toLowerCase().includes(searchLower) ||
      (item.supplierName && item.supplierName.toLowerCase().includes(searchLower))
    );
  }, []);

  // Get columns
  const columns = useWeighTicketColumns({ onDelete });

  // Table filters
  const { columnFilters, setColumnFilters } = useTableFilters();

  // Table data filtering
  const { filteredData } = useTableData<WeighTicket>({
    data,
    statusFilter,
    searchValue,
    searchFilterFn
  });

  // Table columns with selection
  const { tableColumns } = useTableColumns<WeighTicket>({
    columns,
    enableRowSelection: true
  });

  // Table selection state
  const { rowSelection, setRowSelection } = useTableSelection();

  // Create table instance
  const { table, sorting, setSorting, columnVisibility, setColumnVisibility } = useTable<WeighTicket>({
    data: filteredData,
    columns: tableColumns,
    columnFilters,
    rowSelection,
    onRowSelectionChange: setRowSelection,
    initialPageSize,
    enableRowSelection: true
  });

  // Compute selected rows from table
  const selectedRows = useSelectedRows<WeighTicket>(table, true);

  // Handle row selection change
  const handleRowSelectionChange = useCallback(
    (selected: WeighTicket[]) => {
      onSelectionChange?.(selected);
    },
    [onSelectionChange]
  );

  // Notify parent of selection changes
  useSelectionChange(selectedRows, true, handleRowSelectionChange);

  // Table CSV export
  const { csvData, csvHeadersData } = useTableCSV<WeighTicket>({
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
