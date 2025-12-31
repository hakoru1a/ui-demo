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

import { useVehicleColumns } from '../components/VehicleColumns';
import type { VehicleStatusFilter } from '../components/VehicleTableHeader';
import type { Vehicle } from '../types';

// ==============================|| FLEET TABLE HOOK ||============================== //

interface UseFleetTableProps {
  data: Vehicle[];
  statusFilter?: VehicleStatusFilter;
  searchValue: string;
  onDisable?: (vehicle: Vehicle) => void;
  onDelete?: (vehicle: Vehicle) => void;
  onSelectionChange?: (selected: Vehicle[]) => void;
  initialPageSize?: number;
}

/**
 * Hook to manage all table-related logic for Fleet
 * Consolidates table setup, filtering, selection, and CSV export
 */
export function useFleetTable({
  data,
  statusFilter = 'all',
  searchValue,
  onDisable,
  onDelete,
  onSelectionChange,
  initialPageSize = 25
}: UseFleetTableProps) {
  // Get columns
  const columns = useVehicleColumns({ onDisable, onDelete });

  // Table filters
  const { columnFilters, setColumnFilters } = useTableFilters();

  // Status filter function for vehicle status
  const vehicleStatusFilterFn = useCallback(
    (item: Vehicle) => {
      if (statusFilter === 'all') return true;
      return item.vehicleStatus === statusFilter;
    },
    [statusFilter]
  );

  // Table data filtering with status filter
  // We filter manually since VehicleStatusFilter is different from StatusFilter
  const filteredData = useMemo(() => {
    let result = data;

    // Filter by vehicle status
    if (statusFilter !== 'all') {
      result = result.filter(vehicleStatusFilterFn);
    }

    // Filter by search
    if (searchValue.trim()) {
      result = result.filter((item) => {
        const searchLower = searchValue.toLowerCase();
        return (
          item.licensePlate.toLowerCase().includes(searchLower) ||
          item.driverName.toLowerCase().includes(searchLower) ||
          item.driverPhone.toLowerCase().includes(searchLower)
        );
      });
    }

    return result;
  }, [data, statusFilter, searchValue, vehicleStatusFilterFn]);

  // Table columns with selection
  const { tableColumns } = useTableColumns<Vehicle>({
    columns,
    enableRowSelection: true
  });

  // Table selection state
  const { rowSelection, setRowSelection } = useTableSelection();

  // Create table instance
  const { table, sorting, setSorting, columnVisibility, setColumnVisibility } = useTable<Vehicle>({
    data: filteredData,
    columns: tableColumns,
    columnFilters,
    rowSelection,
    onRowSelectionChange: setRowSelection,
    initialPageSize,
    enableRowSelection: true
  });

  // Compute selected rows from table
  const selectedRows = useSelectedRows<Vehicle>(table, true);

  // Handle row selection change
  const handleRowSelectionChange = useCallback(
    (selected: Vehicle[]) => {
      onSelectionChange?.(selected);
    },
    [onSelectionChange]
  );

  // Notify parent of selection changes
  useSelectionChange(selectedRows, true, handleRowSelectionChange);

  // Table CSV export
  const { csvData, csvHeadersData } = useTableCSV<Vehicle>({
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
