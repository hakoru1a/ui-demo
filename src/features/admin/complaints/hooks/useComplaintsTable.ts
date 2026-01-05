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

import { useComplaintColumns } from '../components/ComplaintColumns';
import type { Complaint } from '../types/index';

// ==============================|| COMPLAINTS TABLE HOOK ||============================== //

interface UseComplaintsTableProps {
  data: Complaint[];
  statusFilter?: string;
  searchValue: string;
  onEdit?: (complaint: Complaint) => void;
  onDelete?: (complaint: Complaint) => void;
  onSelectionChange?: (selected: Complaint[]) => void;
  initialPageSize?: number;
}

export function useComplaintsTable({
  data,
  statusFilter,
  searchValue,
  onEdit,
  onDelete,
  onSelectionChange,
  initialPageSize = 25
}: UseComplaintsTableProps) {
  const searchFilterFn = useCallback((item: Complaint, search: string) => {
    const searchLower = search.toLowerCase();
    return !!(item.code.toLowerCase().includes(searchLower) || item.sender.toLowerCase().includes(searchLower));
  }, []);

  const columns = useComplaintColumns({ onEdit, onDelete });
  const { columnFilters, setColumnFilters } = useTableFilters();

  // Note: statusFilter is handled in the parent component (ComplaintsListPage)
  // We only handle search filtering here
  const { filteredData } = useTableData<Complaint>({
    data,
    searchValue,
    searchFilterFn
  });

  const { tableColumns } = useTableColumns<Complaint>({
    columns,
    enableRowSelection: true
  });

  const { rowSelection, setRowSelection } = useTableSelection();

  const { table, sorting, setSorting, columnVisibility, setColumnVisibility } = useTable<Complaint>({
    data: filteredData,
    columns: tableColumns,
    columnFilters,
    rowSelection,
    onRowSelectionChange: setRowSelection,
    initialPageSize,
    enableRowSelection: true
  });

  const selectedRows = useSelectedRows<Complaint>(table, true);

  const handleRowSelectionChange = useCallback(
    (selected: Complaint[]) => {
      onSelectionChange?.(selected);
    },
    [onSelectionChange]
  );

  useSelectionChange(selectedRows, !!onSelectionChange, handleRowSelectionChange);

  const { csvData, csvHeadersData } = useTableCSV<Complaint>({
    table,
    enabled: true
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
