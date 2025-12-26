import { useMemo } from 'react';

import { StatusFilter } from 'types/status';
import type { EntityStatus } from 'types/status';

// ==============================|| TABLE DATA FILTERING HOOK (GENERIC) ||============================== //

interface UseTableDataProps<T> {
  data: T[];
  statusFilter?: StatusFilter;
  searchValue?: string;
  /**
   * Custom filter function for status
   * If not provided, will use default status filtering (requires item to have 'status' property)
   */
  statusFilterFn?: (item: T, statusFilter: StatusFilter) => boolean;
  /**
   * Custom search function
   * If not provided, search will be skipped
   */
  searchFilterFn?: (item: T, searchValue: string) => boolean;
}

/**
 * Generic hook to filter table data based on status and search
 * Can be reused for any table type with customizable filter logic
 *
 * @example
 * ```tsx
 * // With default status filtering (requires 'status' property)
 * const { filteredData } = useTableData<MyType>({
 *   data,
 *   statusFilter: StatusFilter.ACTIVE,
 *   searchValue: 'search term'
 * });
 *
 * // With custom filter functions
 * const { filteredData } = useTableData<MyType>({
 *   data,
 *   statusFilter: StatusFilter.ACTIVE,
 *   statusFilterFn: (item, filter) => item.customStatus === filter,
 *   searchFilterFn: (item, search) => item.name.includes(search)
 * });
 * ```
 */
export function useTableData<T>({
  data,
  statusFilter = StatusFilter.ALL,
  searchValue = '',
  statusFilterFn,
  searchFilterFn
}: UseTableDataProps<T>) {
  const filteredData = useMemo(() => {
    let result = data;

    // Filter by status
    if (statusFilter !== StatusFilter.ALL) {
      if (statusFilterFn) {
        result = result.filter((item) => statusFilterFn(item, statusFilter));
      } else {
        // Default: assume item has 'status' property of type EntityStatus
        result = result.filter((item) => {
          const itemWithStatus = item as T & { status?: EntityStatus };
          return itemWithStatus.status === statusFilter;
        });
      }
    }

    // Filter by search
    if (searchValue.trim() && searchFilterFn) {
      result = result.filter((item) => searchFilterFn(item, searchValue.trim()));
    }

    return result;
  }, [data, statusFilter, searchValue, statusFilterFn, searchFilterFn]);

  return {
    filteredData
  };
}
