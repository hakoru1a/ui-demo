// ==============================|| GLOBAL STATUS TYPES ||============================== //

/**
 * Global status types used across multiple features
 * This is a standard status system for the entire application
 */

// Entity Status Type - used for active/inactive status
export type EntityStatus = 'active' | 'inactive';

// Status Filter Enum - used for filtering by status
export enum StatusFilter {
  ALL = 'all',
  ACTIVE = 'active',
  INACTIVE = 'inactive'
}

// Status Options for dropdowns/selects
export const STATUS_OPTIONS: { value: EntityStatus; label: string }[] = [
  { value: 'active', label: 'Hoạt động' },
  { value: 'inactive', label: 'Tạm ngưng' }
];

// Default status value
export const DEFAULT_STATUS: EntityStatus = 'active';
