// ==============================|| SHIFT LOGS CONSTANTS ||============================== //

import type { ShiftLogStatus } from './enums';

export const SHIFT_LOG_STATUS_OPTIONS: { value: ShiftLogStatus; label: string }[] = [
  { value: 'running', label: 'Đang chạy' },
  { value: 'completed', label: 'Kết thúc' }
]; // Option cho dropdown Trạng thái ca

// Mock data for batches (should be replaced with API call)
export const BATCH_OPTIONS: { value: string; label: string }[] = [
  { value: 'batch-001', label: 'LO-001 - Sản phẩm A' },
  { value: 'batch-002', label: 'LO-002 - Sản phẩm B' },
  { value: 'batch-003', label: 'LO-003 - Nguyên liệu X' }
]; // Option cho dropdown Lô sản xuất

// Mock data for shifts (should be replaced with API call)
export const SHIFT_OPTIONS: { value: string; label: string }[] = [
  { value: 'shift-001', label: 'Ca 1 - 08:00-16:00' },
  { value: 'shift-002', label: 'Ca 2 - 16:00-00:00' },
  { value: 'shift-003', label: 'Ca 3 - 00:00-08:00' }
]; // Option cho dropdown Ca sản xuất

// Route path segments (for route config)
export const SHIFT_LOG_PATHS = {
  ROOT: '/shift-logs',
  LIST: '',
  NEW: 'new',
  DETAIL: ':id',
  EDIT: ':id/edit'
} as const;

// Full URLs (for navigation)
export const SHIFT_LOG_URLS = {
  LIST: SHIFT_LOG_PATHS.ROOT,
  NEW: `${SHIFT_LOG_PATHS.ROOT}/${SHIFT_LOG_PATHS.NEW}`,
  DETAIL: (id: string) => `${SHIFT_LOG_PATHS.ROOT}/${id}`,
  EDIT: (id: string) => `${SHIFT_LOG_PATHS.ROOT}/${id}/edit`
} as const;
