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

import { useLogisticsCostColumns } from '../components/LogisticsCostColumns';
import type { LogisticsCost } from '../types';
import type { LogisticsCostStatusFilter } from '../types/filters';

// ==============================|| LOGISTICS COSTING TABLE HOOK ||============================== //

interface UseLogisticsCostingTableProps {
  data: LogisticsCost[];
  statusFilter: LogisticsCostStatusFilter;
  searchValue: string;
  onEdit?: (cost: LogisticsCost) => void;
  onDelete?: (cost: LogisticsCost) => void;
  onSelectionChange?: (selected: LogisticsCost[]) => void;
  initialPageSize?: number;
}

/**
 * Hook to manage all table-related logic for Logistics Costs
 * Consolidates table setup, filtering, selection, and CSV export
 */
export function useLogisticsCostingTable({
  data,
  statusFilter,
  searchValue,
  onEdit,
  onDelete,
  onSelectionChange,
  initialPageSize = 25
}: UseLogisticsCostingTableProps) {
  // Memoize search filter function
  const searchFilterFn = useCallback((item: LogisticsCost, search: string) => {
    const searchLower = search.toLowerCase();
    return !!(
      item.costCode.toLowerCase().includes(searchLower) ||
      (item.partnerName && item.partnerName.toLowerCase().includes(searchLower)) ||
      (item.relatedShipmentCode && item.relatedShipmentCode.toLowerCase().includes(searchLower)) ||
      (item.relatedOrderCode && item.relatedOrderCode.toLowerCase().includes(searchLower))
    );
  }, []);

  // Status filter function for logistics cost status
  const costStatusFilterFn = useCallback(
    (item: LogisticsCost) => {
      if (statusFilter === 'all') return true;
      return item.status === statusFilter;
    },
    [statusFilter]
  );

  // Get columns
  const columns = useLogisticsCostColumns({ onEdit, onDelete });

  // Table filters
  const { columnFilters, setColumnFilters } = useTableFilters();

  // Table data filtering with custom status filter
  const filteredData = useMemo(() => {
    let result = data;

    // Filter by cost status
    if (statusFilter !== 'all') {
      result = result.filter(costStatusFilterFn);
    }

    // Filter by search
    if (searchValue.trim()) {
      result = result.filter((item) => searchFilterFn(item, searchValue.trim()));
    }

    return result;
  }, [data, statusFilter, searchValue, costStatusFilterFn, searchFilterFn]);

  // Table columns with selection
  const { tableColumns } = useTableColumns<LogisticsCost>({
    columns,
    enableRowSelection: true
  });

  // Table selection state
  const { rowSelection, setRowSelection } = useTableSelection();

  // Create table instance
  const { table, sorting, setSorting, columnVisibility, setColumnVisibility } = useTable<LogisticsCost>({
    data: filteredData,
    columns: tableColumns,
    columnFilters,
    rowSelection,
    onRowSelectionChange: setRowSelection,
    initialPageSize,
    enableRowSelection: true
  });

  // Compute selected rows from table
  const selectedRows = useSelectedRows<LogisticsCost>(table, true);

  // Handle row selection change
  const handleRowSelectionChange = useCallback(
    (selected: LogisticsCost[]) => {
      onSelectionChange?.(selected);
    },
    [onSelectionChange]
  );

  // Notify parent of selection changes
  useSelectionChange(selectedRows, true, handleRowSelectionChange);

  // Table CSV export
  const { csvData, csvHeadersData } = useTableCSV<LogisticsCost>({
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
