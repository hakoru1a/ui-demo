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

import { usePartnerColumns } from '../components/PartnerColumns';
import type { Partner } from '../types';

// ==============================|| PARTNERS TABLE HOOK ||============================== //

interface UsePartnersTableProps {
  data: Partner[];
  statusFilter: StatusFilter;
  searchValue: string;
  onEdit?: (partner: Partner) => void;
  onDelete?: (partner: Partner) => void;
  onSelectionChange?: (selected: Partner[]) => void;
  initialPageSize?: number;
}

/**
 * Hook to manage all table-related logic for Partners
 * Consolidates table setup, filtering, selection, and CSV export
 */
export function usePartnersTable({
  data,
  statusFilter,
  searchValue,
  onEdit,
  onDelete,
  onSelectionChange,
  initialPageSize = 25
}: UsePartnersTableProps) {
  // Memoize search filter function
  const searchFilterFn = useCallback((item: Partner, search: string) => {
    const searchLower = search.toLowerCase();
    return !!(
      item.code.toLowerCase().includes(searchLower) ||
      item.name.toLowerCase().includes(searchLower) ||
      (item.phone && item.phone.toLowerCase().includes(searchLower))
    );
  }, []);

  // Get columns
  const columns = usePartnerColumns({ onEdit, onDelete });

  // Table filters
  const { columnFilters, setColumnFilters } = useTableFilters();

  // Table data filtering
  const { filteredData } = useTableData<Partner>({
    data,
    statusFilter,
    searchValue,
    searchFilterFn
  });

  // Table columns with selection
  const { tableColumns } = useTableColumns<Partner>({
    columns,
    enableRowSelection: true
  });

  // Table selection state
  const { rowSelection, setRowSelection } = useTableSelection();

  // Create table instance
  const { table, sorting, setSorting, columnVisibility, setColumnVisibility } = useTable<Partner>({
    data: filteredData,
    columns: tableColumns,
    columnFilters,
    rowSelection,
    onRowSelectionChange: setRowSelection,
    initialPageSize,
    enableRowSelection: true
  });

  // Compute selected rows from table
  const selectedRows = useSelectedRows<Partner>(table, true);

  // Handle row selection change
  const handleRowSelectionChange = useCallback(
    (selected: Partner[]) => {
      onSelectionChange?.(selected);
    },
    [onSelectionChange]
  );

  // Notify parent of selection changes
  useSelectionChange(selectedRows, true, handleRowSelectionChange);

  // Table CSV export
  const { csvData, csvHeadersData } = useTableCSV<Partner>({
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
