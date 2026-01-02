// ==============================|| PRODUCTION PLANS TABLE HOOK ||============================== //

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

import { useProductionPlanColumns } from '../components/ProductionPlanColumns';
import type { PlanStatusFilter } from '../components/ProductionPlanTableHeader';
import type { ProductionPlan } from '../types';

// ==============================|| PRODUCTION PLANS TABLE HOOK ||============================== //

interface UseProductionPlansTableProps {
  data: ProductionPlan[];
  statusFilter: PlanStatusFilter;
  searchValue: string;
  onDelete?: (plan: ProductionPlan) => void;
  onSelectionChange?: (selected: ProductionPlan[]) => void;
  initialPageSize?: number;
}

/**
 * Hook to manage all table-related logic for Production Plans
 * Consolidates table setup, filtering, selection, and CSV export
 */
export function useProductionPlansTable({
  data,
  statusFilter,
  searchValue,
  onDelete,
  onSelectionChange,
  initialPageSize = 25
}: UseProductionPlansTableProps) {
  // Memoize search filter function
  const searchFilterFn = useCallback((item: ProductionPlan, search: string) => {
    const searchLower = search.toLowerCase();
    return !!(item.code.toLowerCase().includes(searchLower) || item.productName.toLowerCase().includes(searchLower));
  }, []);

  // Status filter function
  const statusFilterFn = useCallback(
    (item: ProductionPlan) => {
      if (statusFilter === 'all') return true;
      return item.status === statusFilter;
    },
    [statusFilter]
  );

  // Get columns
  const columns = useProductionPlanColumns({ onDelete });

  // Table filters
  const { columnFilters, setColumnFilters } = useTableFilters();

  // Table data filtering with custom status filter
  const filteredData = useMemo(() => {
    let result = data;

    // Filter by status
    if (statusFilter !== 'all') {
      result = result.filter(statusFilterFn);
    }

    // Filter by search
    if (searchValue.trim()) {
      result = result.filter((item) => searchFilterFn(item, searchValue.trim()));
    }

    return result;
  }, [data, statusFilter, searchValue, statusFilterFn, searchFilterFn]);

  // Table columns with selection
  const { tableColumns } = useTableColumns<ProductionPlan>({
    columns,
    enableRowSelection: true
  });

  // Table selection state
  const { rowSelection, setRowSelection } = useTableSelection();

  // Create table instance
  const { table, sorting, setSorting, columnVisibility, setColumnVisibility } = useTable<ProductionPlan>({
    data: filteredData,
    columns: tableColumns,
    columnFilters,
    rowSelection,
    onRowSelectionChange: setRowSelection,
    initialPageSize,
    enableRowSelection: true
  });

  // Compute selected rows from table
  const selectedRows = useSelectedRows<ProductionPlan>(table, true);

  // Handle row selection change
  const handleRowSelectionChange = useCallback(
    (selected: ProductionPlan[]) => {
      onSelectionChange?.(selected);
    },
    [onSelectionChange]
  );

  // Notify parent of selection changes
  useSelectionChange(selectedRows, true, handleRowSelectionChange);

  // Table CSV export
  const { csvData, csvHeadersData } = useTableCSV<ProductionPlan>({
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
