// ==============================|| STOCKTAKE CONSTANTS ||============================== //

import type { StocktakeStatus } from './enums';

export const STOCKTAKE_STATUS_OPTIONS: { value: StocktakeStatus; label: string }[] = [
  { value: 'draft', label: 'Nháp' },
  { value: 'completed', label: 'Hoàn tất' }
]; // Option cho dropdown Trạng thái

// Mock data for warehouse dropdown (TODO: Replace with API call)
export const WAREHOUSE_OPTIONS: { value: string; label: string }[] = [
  { value: '1', label: 'Kho Nguyên liệu A' },
  { value: '2', label: 'Kho Thành phẩm B' },
  { value: '3', label: 'Kho Trung chuyển C' },
  { value: '4', label: 'Kho Xuất khẩu D' }
]; // Option cho dropdown Kho

// Route path segments (for route config)
export const STOCKTAKE_PATHS = {
  ROOT: '/stocktakes',
  LIST: '',
  SCHEDULE: 'schedule',
  NEW: 'new',
  DETAIL: ':id',
  EDIT: ':id/edit'
} as const;

// Full URLs (for navigation)
export const STOCKTAKE_URLS = {
  LIST: STOCKTAKE_PATHS.ROOT,
  SCHEDULE: `${STOCKTAKE_PATHS.ROOT}/${STOCKTAKE_PATHS.SCHEDULE}`,
  NEW: `${STOCKTAKE_PATHS.ROOT}/${STOCKTAKE_PATHS.NEW}`,
  DETAIL: (id: string) => `${STOCKTAKE_PATHS.ROOT}/${id}`,
  EDIT: (id: string) => `${STOCKTAKE_PATHS.ROOT}/${id}/edit`
} as const;

// Helper function to get label from options
export const getLabelFromOptions = <T extends string>(value: T, options: { value: T; label: string }[]): string => {
  const option = options.find((opt) => opt.value === value);
  return option?.label || value;
};
