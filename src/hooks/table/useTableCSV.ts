import type { Table } from '@tanstack/react-table';
import { useMemo, useCallback } from 'react';

// ==============================|| TABLE CSV EXPORT HOOK (GENERIC) ||============================== //

interface UseTableCSVProps<T> {
  table: Table<T>;
  enabled?: boolean;
  csvHeaders?: Array<{ label: string; key: string }>;
}

/**
 * Generic hook to compute CSV export data
 * Can be reused for any table type
 *
 * @example
 * ```tsx
 * const { csvData, csvHeadersData } = useTableCSV<MyType>({
 *   table,
 *   enabled: true
 * });
 * ```
 */
export function useTableCSV<T>({ table, enabled = true, csvHeaders }: UseTableCSVProps<T>) {
  // CSV data computation
  const csvData = useMemo(() => {
    if (!enabled) return [];
    return table.getFilteredRowModel().rows.map((row) => row.original);
  }, [table, enabled]);

  // CSV headers computation
  const csvHeadersData = useMemo(() => {
    if (csvHeaders) return csvHeaders;
    return table
      .getVisibleLeafColumns()
      .filter((column) => column.id !== 'select' && 'accessorKey' in column.columnDef && column.columnDef.accessorKey)
      .map((column) => ({
        label: (column.columnDef.header as string) || column.id,
        key: column.id
      }));
  }, [table, csvHeaders]);

  // Lazy getters (for on-demand computation if needed)
  const getCsvData = useCallback(() => csvData, [csvData]);
  const getCsvHeaders = useCallback(() => csvHeadersData, [csvHeadersData]);

  return {
    csvData,
    csvHeadersData,
    getCsvData,
    getCsvHeaders
  };
}
