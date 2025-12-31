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

import { useCustomerColumns } from '../components/CustomerColumns';
import type { Customer } from '../types';

// ==============================|| CUSTOMERS TABLE HOOK ||============================== //

interface UseCustomersTableProps {
  data: Customer[];
  statusFilter: StatusFilter;
  searchValue: string;
  onEdit?: (customer: Customer) => void;
  onDelete?: (customer: Customer) => void;
  onSelectionChange?: (selected: Customer[]) => void;
  initialPageSize?: number;
}

/**
 * Hook to manage all table-related logic for Customers
 * Consolidates table setup, filtering, selection, and CSV export
 */
export function useCustomersTable({
  data,
  statusFilter,
  searchValue,
  onEdit,
  onDelete,
  onSelectionChange,
  initialPageSize = 25
}: UseCustomersTableProps) {
  // Memoize search filter function
  const searchFilterFn = useCallback((item: Customer, search: string) => {
    const searchLower = search.toLowerCase();
    return !!(
      item.code.toLowerCase().includes(searchLower) ||
      item.companyName.toLowerCase().includes(searchLower) ||
      (item.contactPerson && item.contactPerson.toLowerCase().includes(searchLower)) ||
      (item.email && item.email.toLowerCase().includes(searchLower))
    );
  }, []);

  // Get columns
  const columns = useCustomerColumns({ onEdit, onDelete });

  // Table filters
  const { columnFilters, setColumnFilters } = useTableFilters();

  // Table data filtering
  const { filteredData } = useTableData<Customer>({
    data,
    statusFilter,
    searchValue,
    searchFilterFn
  });

  // Table columns with selection
  const { tableColumns } = useTableColumns<Customer>({
    columns,
    enableRowSelection: true
  });

  // Table selection state
  const { rowSelection, setRowSelection } = useTableSelection();

  // Create table instance
  const { table, sorting, setSorting, columnVisibility, setColumnVisibility } = useTable<Customer>({
    data: filteredData,
    columns: tableColumns,
    columnFilters,
    rowSelection,
    onRowSelectionChange: setRowSelection,
    initialPageSize,
    enableRowSelection: true
  });

  // Compute selected rows from table
  const selectedRows = useSelectedRows<Customer>(table, true);

  // Handle row selection change
  const handleRowSelectionChange = useCallback(
    (selected: Customer[]) => {
      onSelectionChange?.(selected);
    },
    [onSelectionChange]
  );

  // Notify parent of selection changes
  useSelectionChange(selectedRows, true, handleRowSelectionChange);

  // Table CSV export
  const { csvData, csvHeadersData } = useTableCSV<Customer>({
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
