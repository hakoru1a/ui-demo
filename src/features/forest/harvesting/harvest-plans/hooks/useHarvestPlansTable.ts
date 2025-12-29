import { useCallback, useMemo } from 'react';

import {
  useSelectedRows,
  useSelectionChange,
  useTable,
  useTableColumns,
  useTableCSV,
  useTableFilters,
  useTableSelection
} from 'hooks/table';

import { useHarvestPlanColumns } from '../components/HarvestPlanColumns';
import type { HarvestPlan } from '../types';
import { HarvestPlanStatusFilter } from '../types/constants';

// ==============================|| HARVEST PLANS TABLE HOOK ||============================== //

interface UseHarvestPlansTableProps {
  data: HarvestPlan[];
  statusFilter: HarvestPlanStatusFilter;
  searchValue: string;
  onDelete?: (harvestPlan: HarvestPlan) => void;
  onSelectionChange?: (selected: HarvestPlan[]) => void;
  initialPageSize?: number;
}

/**
 * Hook to manage all table-related logic for Harvest Plans
 * Consolidates table setup, filtering, selection, and CSV export
 */
export function useHarvestPlansTable({
  data,
  statusFilter,
  searchValue,
  onDelete,
  onSelectionChange,
  initialPageSize = 25
}: UseHarvestPlansTableProps) {
  // Memoize search filter function
  const searchFilterFn = useCallback((item: HarvestPlan, search: string) => {
    const searchLower = search.toLowerCase();
    return !!(
      item.code.toLowerCase().includes(searchLower) ||
      item.name.toLowerCase().includes(searchLower) ||
      (item.forestArea?.name && item.forestArea.name.toLowerCase().includes(searchLower))
    );
  }, []);

  // Get columns
  const columns = useHarvestPlanColumns({ onDelete });

  // Table filters
  const { columnFilters, setColumnFilters } = useTableFilters();

  // Table data filtering - manually filter since useTableData expects StatusFilter
  const filteredData = useMemo(() => {
    let result = data;

    // Filter by status
    if (statusFilter !== HarvestPlanStatusFilter.ALL) {
      result = result.filter((item) => item.status === statusFilter);
    }

    // Filter by search
    if (searchValue.trim()) {
      result = result.filter((item) => searchFilterFn(item, searchValue.trim()));
    }

    return result;
  }, [data, statusFilter, searchValue, searchFilterFn]);

  // Table columns with selection
  const { tableColumns } = useTableColumns<HarvestPlan>({
    columns,
    enableRowSelection: true
  });

  // Table selection state
  const { rowSelection, setRowSelection } = useTableSelection();

  // Create table instance
  const { table, sorting, setSorting, columnVisibility, setColumnVisibility } = useTable<HarvestPlan>({
    data: filteredData,
    columns: tableColumns,
    columnFilters,
    rowSelection,
    onRowSelectionChange: setRowSelection,
    initialPageSize,
    enableRowSelection: true
  });

  // Compute selected rows from table
  const selectedRows = useSelectedRows<HarvestPlan>(table, true);

  // Handle row selection change
  const handleRowSelectionChange = useCallback(
    (selected: HarvestPlan[]) => {
      onSelectionChange?.(selected);
    },
    [onSelectionChange]
  );

  // Notify parent of selection changes
  useSelectionChange(selectedRows, true, handleRowSelectionChange);

  // Table CSV export
  const { csvData, csvHeadersData } = useTableCSV<HarvestPlan>({
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
