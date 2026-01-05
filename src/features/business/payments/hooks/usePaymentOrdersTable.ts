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

import { usePaymentOrderColumns } from '../components/PaymentOrderColumns';
import type { PaymentOrder } from '../types';

// ==============================|| PAYMENT ORDERS TABLE HOOK ||============================== //

interface UsePaymentOrdersTableProps {
  data: PaymentOrder[];
  statusFilter: StatusFilter;
  searchValue: string;
  onEdit?: (paymentOrder: PaymentOrder) => void;
  onDelete?: (paymentOrder: PaymentOrder) => void;
  onSelectionChange?: (selected: PaymentOrder[]) => void;
  initialPageSize?: number;
}

/**
 * Hook to manage all table-related logic for Payment Orders
 * Consolidates table setup, filtering, selection, and CSV export
 */
export function usePaymentOrdersTable({
  data,
  statusFilter,
  searchValue,
  onEdit,
  onDelete,
  onSelectionChange,
  initialPageSize = 25
}: UsePaymentOrdersTableProps) {
  // Memoize search filter function
  const searchFilterFn = useCallback((item: PaymentOrder, search: string) => {
    const searchLower = search.toLowerCase();
    return !!(
      item.code.toLowerCase().includes(searchLower) ||
      item.partnerName.toLowerCase().includes(searchLower) ||
      (item.contractCode && item.contractCode.toLowerCase().includes(searchLower))
    );
  }, []);

  // Get columns
  const columns = usePaymentOrderColumns({ onEdit, onDelete });

  // Table filters
  const { columnFilters, setColumnFilters } = useTableFilters();

  // Table data filtering
  const { filteredData } = useTableData<PaymentOrder>({
    data,
    statusFilter,
    searchValue,
    searchFilterFn
  });

  // Table columns with selection
  const { tableColumns } = useTableColumns<PaymentOrder>({
    columns,
    enableRowSelection: true
  });

  // Table selection state
  const { rowSelection, setRowSelection } = useTableSelection();

  // Create table instance
  const { table, sorting, setSorting, columnVisibility, setColumnVisibility } = useTable<PaymentOrder>({
    data: filteredData,
    columns: tableColumns,
    columnFilters,
    rowSelection,
    onRowSelectionChange: setRowSelection,
    initialPageSize,
    enableRowSelection: true
  });

  // Compute selected rows from table
  const selectedRows = useSelectedRows<PaymentOrder>(table, true);

  // Handle row selection change - only notify if callback is provided
  const handleRowSelectionChange = useCallback(
    (selected: PaymentOrder[]) => {
      onSelectionChange?.(selected);
    },
    [onSelectionChange]
  );

  // Notify parent of selection changes - only if callback is provided
  useSelectionChange(selectedRows, !!onSelectionChange, onSelectionChange ? handleRowSelectionChange : undefined);

  // Table CSV export
  const { csvData, csvHeadersData } = useTableCSV<PaymentOrder>({
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
