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

import { useExportDocumentColumns } from '../components/ExportDocumentColumns';
import type { ExportDocument } from '../types';
import type { ExportDocumentStatusFilter } from '../types/filters';

// ==============================|| EXPORT DOCUMENTS TABLE HOOK ||============================== //

interface UseExportDocumentsTableProps {
  data: ExportDocument[];
  statusFilter: ExportDocumentStatusFilter;
  searchValue: string;
  onEdit?: (document: ExportDocument) => void;
  onDelete?: (document: ExportDocument) => void;
  onSelectionChange?: (selected: ExportDocument[]) => void;
  initialPageSize?: number;
}

/**
 * Hook to manage all table-related logic for Export Documents
 * Consolidates table setup, filtering, selection, and CSV export
 */
export function useExportDocumentsTable({
  data,
  statusFilter,
  searchValue,
  onEdit,
  onDelete,
  onSelectionChange,
  initialPageSize = 25
}: UseExportDocumentsTableProps) {
  // Memoize search filter function
  const searchFilterFn = useCallback((item: ExportDocument, search: string) => {
    const searchLower = search.toLowerCase();
    return !!(
      item.documentNo.toLowerCase().includes(searchLower) ||
      (item.customerName && item.customerName.toLowerCase().includes(searchLower)) ||
      (item.exportOrderNo && item.exportOrderNo.toLowerCase().includes(searchLower))
    );
  }, []);

  // Status filter function for document status
  const documentStatusFilterFn = useCallback(
    (item: ExportDocument) => {
      if (statusFilter === 'all') return true;
      return item.status === statusFilter;
    },
    [statusFilter]
  );

  // Get columns
  const columns = useExportDocumentColumns({ onEdit, onDelete });

  // Table filters
  const { columnFilters, setColumnFilters } = useTableFilters();

  // Table data filtering with custom status filter
  const filteredData = useMemo(() => {
    let result = data;

    // Filter by document status
    if (statusFilter !== 'all') {
      result = result.filter(documentStatusFilterFn);
    }

    // Filter by search
    if (searchValue.trim()) {
      result = result.filter((item) => searchFilterFn(item, searchValue.trim()));
    }

    return result;
  }, [data, statusFilter, searchValue, documentStatusFilterFn, searchFilterFn]);

  // Table columns with selection
  const { tableColumns } = useTableColumns<ExportDocument>({
    columns,
    enableRowSelection: true
  });

  // Table selection state
  const { rowSelection, setRowSelection } = useTableSelection();

  // Create table instance
  const { table, sorting, setSorting, columnVisibility, setColumnVisibility } = useTable<ExportDocument>({
    data: filteredData,
    columns: tableColumns,
    columnFilters,
    rowSelection,
    onRowSelectionChange: setRowSelection,
    initialPageSize,
    enableRowSelection: true
  });

  // Compute selected rows from table
  const selectedRows = useSelectedRows<ExportDocument>(table, true);

  // Handle row selection change
  const handleRowSelectionChange = useCallback(
    (selected: ExportDocument[]) => {
      onSelectionChange?.(selected);
    },
    [onSelectionChange]
  );

  // Notify parent of selection changes
  useSelectionChange(selectedRows, true, handleRowSelectionChange);

  // Table CSV export
  const { csvData, csvHeadersData } = useTableCSV<ExportDocument>({
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
