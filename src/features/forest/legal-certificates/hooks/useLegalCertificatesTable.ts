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

import { useLegalCertificateColumns } from '../components/LegalCertificateColumns';
import type { LegalCertificate } from '../types';

// ==============================|| LEGAL CERTIFICATES TABLE HOOK ||============================== //

interface UseLegalCertificatesTableProps {
  data: LegalCertificate[];
  searchValue: string;
  onDelete?: (certificate: LegalCertificate) => void;
  onSelectionChange?: (selected: LegalCertificate[]) => void;
  initialPageSize?: number;
}

/**
 * Hook to manage all table-related logic for Legal Certificates
 * Consolidates table setup, filtering, selection, and CSV export
 */
export function useLegalCertificatesTable({
  data,
  searchValue,
  onDelete,
  onSelectionChange,
  initialPageSize = 25
}: UseLegalCertificatesTableProps) {
  // Memoize search filter function
  const searchFilterFn = useCallback((item: LegalCertificate, search: string) => {
    const searchLower = search.toLowerCase();
    return !!(
      item.certificateNumber.toLowerCase().includes(searchLower) ||
      item.issuingOrganization.toLowerCase().includes(searchLower) ||
      item.certificateType.toLowerCase().includes(searchLower)
    );
  }, []);

  // Get columns
  const columns = useLegalCertificateColumns({ onDelete });

  // Table filters
  const { columnFilters, setColumnFilters } = useTableFilters();

  // Table data filtering (no status filter for certificates)
  const { filteredData } = useTableData<LegalCertificate>({
    data,
    statusFilter: undefined, // No status filter
    searchValue,
    searchFilterFn
  });

  // Table columns with selection
  const { tableColumns } = useTableColumns<LegalCertificate>({
    columns,
    enableRowSelection: true
  });

  // Table selection state
  const { rowSelection, setRowSelection } = useTableSelection();

  // Create table instance
  const { table, sorting, setSorting, columnVisibility, setColumnVisibility } = useTable<LegalCertificate>({
    data: filteredData,
    columns: tableColumns,
    columnFilters,
    rowSelection,
    onRowSelectionChange: setRowSelection,
    initialPageSize,
    enableRowSelection: true
  });

  // Compute selected rows from table
  const selectedRows = useSelectedRows<LegalCertificate>(table, true);

  // Handle row selection change
  const handleRowSelectionChange = useCallback(
    (selected: LegalCertificate[]) => {
      onSelectionChange?.(selected);
    },
    [onSelectionChange]
  );

  // Notify parent of selection changes
  useSelectionChange(selectedRows, true, handleRowSelectionChange);

  // Table CSV export
  const { csvData, csvHeadersData } = useTableCSV<LegalCertificate>({
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
