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

import { useShipmentColumns } from '../components/ShipmentColumns';
import type { Shipment } from '../types';

// ==============================|| SHIPMENTS TABLE HOOK ||============================== //

interface UseShipmentsTableProps {
  data: Shipment[];
  statusFilter?: string;
  searchValue: string;
  onDelete?: (shipment: Shipment) => void;
  onSelectionChange?: (selected: Shipment[]) => void;
  initialPageSize?: number;
}

/**
 * Hook to manage all table-related logic for Shipments
 * Consolidates table setup, filtering, selection, and CSV export
 */
export function useShipmentsTable({
  data,
  statusFilter,
  searchValue,
  onDelete,
  onSelectionChange,
  initialPageSize = 25
}: UseShipmentsTableProps) {
  // Memoize search filter function
  const searchFilterFn = useCallback((item: Shipment, search: string) => {
    const searchLower = search.toLowerCase();
    return !!(
      item.code.toLowerCase().includes(searchLower) ||
      item.warehouseName.toLowerCase().includes(searchLower) ||
      (item.destinationName && item.destinationName.toLowerCase().includes(searchLower)) ||
      (item.customerName && item.customerName.toLowerCase().includes(searchLower)) ||
      (item.productName && item.productName.toLowerCase().includes(searchLower))
    );
  }, []);

  // Get columns
  const columns = useShipmentColumns({ onDelete });

  // Table filters
  const { columnFilters, setColumnFilters } = useTableFilters();

  // Table data filtering
  const { filteredData } = useTableData<Shipment>({
    data,
    statusFilter: statusFilter as StatusFilter | undefined,
    searchValue,
    searchFilterFn
  });

  // Table columns with selection
  const { tableColumns } = useTableColumns<Shipment>({
    columns,
    enableRowSelection: true
  });

  // Table selection state
  const { rowSelection, setRowSelection } = useTableSelection();

  // Create table instance
  const { table, sorting, setSorting, columnVisibility, setColumnVisibility } = useTable<Shipment>({
    data: filteredData,
    columns: tableColumns,
    columnFilters,
    rowSelection,
    onRowSelectionChange: setRowSelection,
    initialPageSize,
    enableRowSelection: true
  });

  // Compute selected rows from table
  const selectedRows = useSelectedRows<Shipment>(table, true);

  // Handle row selection change
  const handleRowSelectionChange = useCallback(
    (selected: Shipment[]) => {
      onSelectionChange?.(selected);
    },
    [onSelectionChange]
  );

  // Notify parent of selection changes
  useSelectionChange(selectedRows, true, handleRowSelectionChange);

  // Table CSV export
  const { csvData, csvHeadersData } = useTableCSV<Shipment>({
    table
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
