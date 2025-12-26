import type { ColumnDef, HeaderContext, CellContext } from '@tanstack/react-table';
import { useMemo } from 'react';

import { IndeterminateCheckbox } from 'components/third-party/react-table';

// ==============================|| TABLE COLUMNS HOOK (GENERIC) ||============================== //

interface UseTableColumnsProps<T> {
  columns: ColumnDef<T>[];
  enableRowSelection?: boolean;
}

/**
 * Generic hook to add selection column to table columns if enabled
 * Can be reused for any table type
 *
 * @example
 * ```tsx
 * const { tableColumns } = useTableColumns<MyType>({
 *   columns,
 *   enableRowSelection: true
 * });
 * ```
 */
export function useTableColumns<T>({ columns, enableRowSelection = false }: UseTableColumnsProps<T>) {
  const tableColumns = useMemo(() => {
    if (enableRowSelection) {
      return [
        {
          id: 'select',
          header: ({ table }: HeaderContext<T, unknown>) => (
            <IndeterminateCheckbox
              {...{
                checked: table.getIsAllRowsSelected(),
                indeterminate: table.getIsSomeRowsSelected(),
                onChange: table.getToggleAllRowsSelectedHandler()
              }}
            />
          ),
          cell: ({ row }: CellContext<T, unknown>) => (
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
      ] as ColumnDef<T>[];
    }
    return columns;
  }, [columns, enableRowSelection]);

  return {
    tableColumns
  };
}
