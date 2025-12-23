import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getExpandedRowModel,
  type ColumnDef,
  type SortingState,
  type ColumnFiltersState,
  type VisibilityState,
  type RowSelectionState,
  type ExpandedState,
  type HeaderContext,
  type CellContext
} from '@tanstack/react-table';
import { useMemo, useState, useEffect, useCallback } from 'react';

import { IndeterminateCheckbox } from 'components/third-party/react-table';
import { StatusFilter } from 'types/status';

import type { ForestArea } from '../types';

// ==============================|| FOREST AREA TABLE HOOK ||============================== //

interface UseForestAreaTableProps {
  data: ForestArea[];
  columns: ColumnDef<ForestArea>[];
  enableRowSelection?: boolean;
  enableCSVExport?: boolean;
  csvHeaders?: Array<{ label: string; key: string }>;
  onRowSelectionChange?: (selectedRows: ForestArea[]) => void;
  initialPageSize?: number;
  statusFilter?: StatusFilter;
  searchValue?: string;
}

export default function useForestAreaTable({
  data,
  columns,
  enableRowSelection = false,
  enableCSVExport = true,
  csvHeaders,
  onRowSelectionChange,
  initialPageSize = 10,
  statusFilter = StatusFilter.ALL,
  searchValue = ''
}: UseForestAreaTableProps) {
  // State management
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [expanded, setExpanded] = useState<ExpandedState>({});

  // Filter data based on status and search
  const filteredData = useMemo(() => {
    let result = data;

    // Filter by status
    if (statusFilter !== StatusFilter.ALL) {
      result = result.filter((item) => item.status === statusFilter);
    }

    // Filter by search
    if (searchValue.trim()) {
      const searchLower = searchValue.toLowerCase().trim();
      result = result.filter(
        (item) =>
          item.code.toLowerCase().includes(searchLower) ||
          item.name.toLowerCase().includes(searchLower) ||
          (item.ownerName && item.ownerName.toLowerCase().includes(searchLower))
      );
    }

    return result;
  }, [data, statusFilter, searchValue]);

  // Memoize columns with selection column if enabled
  const tableColumns = useMemo(() => {
    if (enableRowSelection) {
      return [
        {
          id: 'select',
          header: ({ table }: HeaderContext<ForestArea, unknown>) => (
            <IndeterminateCheckbox
              {...{
                checked: table.getIsAllRowsSelected(),
                indeterminate: table.getIsSomeRowsSelected(),
                onChange: table.getToggleAllRowsSelectedHandler()
              }}
            />
          ),
          cell: ({ row }: CellContext<ForestArea, unknown>) => (
            <IndeterminateCheckbox
              {...{
                checked: row.getIsSelected(),
                disabled: !row.getCanSelect(),
                indeterminate: row.getIsSomeSelected(),
                onChange: row.getToggleSelectedHandler()
              }}
            />
          ),
          enableSorting: false,
          enableHiding: false
        },
        ...columns
      ] as ColumnDef<ForestArea>[];
    }
    return columns;
  }, [columns, enableRowSelection]);

  // Table instance
  const table = useReactTable({
    data: filteredData,
    columns: tableColumns,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      expanded
    },
    enableRowSelection: enableRowSelection,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onExpandedChange: setExpanded,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    initialState: {
      pagination: {
        pageSize: initialPageSize
      }
    }
  });

  // Handle row selection change callback
  const selectedRows = useMemo(() => {
    return table.getFilteredSelectedRowModel().rows.map((row) => row.original);
  }, [rowSelection, filteredData]);

  // Notify parent of selection changes
  useEffect(() => {
    onRowSelectionChange?.(selectedRows);
  }, [selectedRows, onRowSelectionChange]);

  // CSV data computation - memoized for performance
  // Dependencies: filteredData (already filtered), columnFilters, sorting affect the filtered rows
  const csvData = useMemo(() => {
    if (!enableCSVExport) return [];
    return table.getFilteredRowModel().rows.map((row) => row.original);
  }, [table, enableCSVExport, filteredData.length, columnFilters.length]);

  // CSV headers computation - memoized for performance
  const csvHeadersData = useMemo(() => {
    if (csvHeaders) return csvHeaders;
    return table
      .getVisibleLeafColumns()
      .filter((column) => column.id !== 'select' && 'accessorKey' in column.columnDef && column.columnDef.accessorKey)
      .map((column) => ({
        label: (column.columnDef.header as string) || column.id,
        key: column.id
      }));
  }, [table, csvHeaders, columnVisibility]);

  // Lazy CSV data getter functions (for on-demand computation if needed)
  const getCsvData = useCallback(() => csvData, [csvData]);
  const getCsvHeaders = useCallback(() => csvHeadersData, [csvHeadersData]);

  return {
    // Table instance
    table,
    // State
    sorting,
    setSorting,
    columnFilters,
    setColumnFilters,
    columnVisibility,
    setColumnVisibility,
    rowSelection,
    setRowSelection,
    // Computed values
    selectedRows,
    filteredData,
    csvData,
    csvHeadersData,
    getCsvData,
    getCsvHeaders
  };
}
