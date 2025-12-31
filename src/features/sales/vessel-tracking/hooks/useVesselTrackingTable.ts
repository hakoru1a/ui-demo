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

import { useVesselTrackingColumns } from '../components/VesselTrackingColumns';
import type { VesselTracking } from '../types';
import type { VesselTrackingStatusFilter } from '../types/filters';

// ==============================|| VESSEL TRACKING TABLE HOOK ||============================== //

interface UseVesselTrackingTableProps {
  data: VesselTracking[];
  statusFilter: VesselTrackingStatusFilter;
  searchValue: string;
  onEdit?: (tracking: VesselTracking) => void;
  onDelete?: (tracking: VesselTracking) => void;
  onSelectionChange?: (selected: VesselTracking[]) => void;
  initialPageSize?: number;
}

/**
 * Hook to manage all table-related logic for Vessel Tracking
 * Consolidates table setup, filtering, selection, and CSV export
 */
export function useVesselTrackingTable({
  data,
  statusFilter,
  searchValue,
  onEdit,
  onDelete,
  onSelectionChange,
  initialPageSize = 25
}: UseVesselTrackingTableProps) {
  // Memoize search filter function
  const searchFilterFn = useCallback((item: VesselTracking, search: string) => {
    const searchLower = search.toLowerCase();
    return !!(
      item.shipmentNo.toLowerCase().includes(searchLower) ||
      (item.exportOrderNo && item.exportOrderNo.toLowerCase().includes(searchLower)) ||
      item.vesselName.toLowerCase().includes(searchLower) ||
      (item.voyageNo && item.voyageNo.toLowerCase().includes(searchLower))
    );
  }, []);

  // Status filter function for vessel status
  const vesselStatusFilterFn = useCallback(
    (item: VesselTracking) => {
      if (statusFilter === 'all') return true;
      return item.currentStatus === statusFilter;
    },
    [statusFilter]
  );

  // Get columns
  const columns = useVesselTrackingColumns({ onEdit, onDelete });

  // Table filters
  const { columnFilters, setColumnFilters } = useTableFilters();

  // Table data filtering with custom status filter
  const filteredData = useMemo(() => {
    let result = data;

    // Filter by vessel status
    if (statusFilter !== 'all') {
      result = result.filter(vesselStatusFilterFn);
    }

    // Filter by search
    if (searchValue.trim()) {
      result = result.filter((item) => searchFilterFn(item, searchValue.trim()));
    }

    return result;
  }, [data, statusFilter, searchValue, vesselStatusFilterFn, searchFilterFn]);

  // Table columns with selection
  const { tableColumns } = useTableColumns<VesselTracking>({
    columns,
    enableRowSelection: true
  });

  // Table selection state
  const { rowSelection, setRowSelection } = useTableSelection();

  // Create table instance
  const { table, sorting, setSorting, columnVisibility, setColumnVisibility } = useTable<VesselTracking>({
    data: filteredData,
    columns: tableColumns,
    columnFilters,
    rowSelection,
    onRowSelectionChange: setRowSelection,
    initialPageSize,
    enableRowSelection: true
  });

  // Compute selected rows from table
  const selectedRows = useSelectedRows<VesselTracking>(table, true);

  // Handle row selection change
  const handleRowSelectionChange = useCallback(
    (selected: VesselTracking[]) => {
      onSelectionChange?.(selected);
    },
    [onSelectionChange]
  );

  // Notify parent of selection changes
  useSelectionChange(selectedRows, true, handleRowSelectionChange);

  // Table CSV export
  const { csvData, csvHeadersData } = useTableCSV<VesselTracking>({
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
