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

import { useEmployeeColumns } from '../components/EmployeeColumns';
import type { Employee } from '../types';

// ==============================|| EMPLOYEES TABLE HOOK ||============================== //

interface UseEmployeesTableProps {
  data: Employee[];
  statusFilter: StatusFilter;
  searchValue: string;
  onEdit?: (employee: Employee) => void;
  onDelete?: (employee: Employee) => void;
  onSelectionChange?: (selected: Employee[]) => void;
  initialPageSize?: number;
}

/**
 * Hook to manage all table-related logic for Employees
 * Consolidates table setup, filtering, selection, and CSV export
 */
export function useEmployeesTable({
  data,
  statusFilter,
  searchValue,
  onEdit,
  onDelete,
  onSelectionChange,
  initialPageSize = 25
}: UseEmployeesTableProps) {
  // Memoize search filter function
  const searchFilterFn = useCallback((item: Employee, search: string) => {
    const searchLower = search.toLowerCase();
    return !!(item.code.toLowerCase().includes(searchLower) || item.fullName.toLowerCase().includes(searchLower));
  }, []);

  // Get columns
  const columns = useEmployeeColumns({ onEdit, onDelete });

  // Table filters
  const { columnFilters, setColumnFilters } = useTableFilters();

  // Table data filtering
  const { filteredData } = useTableData<Employee>({
    data,
    statusFilter,
    searchValue,
    searchFilterFn
  });

  // Table columns with selection
  const { tableColumns } = useTableColumns<Employee>({
    columns,
    enableRowSelection: true
  });

  // Table selection state
  const { rowSelection, setRowSelection } = useTableSelection();

  // Create table instance
  const { table, sorting, setSorting, columnVisibility, setColumnVisibility } = useTable<Employee>({
    data: filteredData,
    columns: tableColumns,
    columnFilters,
    rowSelection,
    onRowSelectionChange: setRowSelection,
    initialPageSize
  });

  // Selected rows
  const selectedRows = useSelectedRows<Employee>(table, true);

  // Selection change handler
  useSelectionChange(selectedRows, !!onSelectionChange, onSelectionChange ? handleRowSelectionChange : undefined);

  function handleRowSelectionChange(selected: Employee[]) {
    onSelectionChange?.(selected);
  }

  // CSV export
  const { csvData, csvHeadersData } = useTableCSV<Employee>({
    table
  });

  return {
    table,
    data: filteredData,
    selectedRows,
    columnFilters,
    setColumnFilters,
    sorting,
    setSorting,
    columnVisibility,
    setColumnVisibility,
    csvData,
    csvHeadersData
  };
}
