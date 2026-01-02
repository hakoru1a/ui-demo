// ==============================|| PRODUCTION CALENDAR CONSTANTS ||============================== //

import type { ShiftStatus } from './enums';

export const SHIFT_STATUS_OPTIONS: { value: ShiftStatus; label: string }[] = [
  { value: 'scheduled', label: 'Đã lên lịch' },
  { value: 'in-progress', label: 'Đang chạy' },
  { value: 'completed', label: 'Hoàn thành' },
  { value: 'cancelled', label: 'Hủy' }
]; // Option cho dropdown Trạng thái ca

// Route path segments (for route config)
export const PRODUCTION_CALENDAR_PATHS = {
  ROOT: '/production-calendar',
  LIST: '',
  NEW: 'new',
  DETAIL: ':id',
  EDIT: ':id/edit'
} as const;

// Full URLs (for navigation)
export const PRODUCTION_CALENDAR_URLS = {
  LIST: PRODUCTION_CALENDAR_PATHS.ROOT,
  NEW: `${PRODUCTION_CALENDAR_PATHS.ROOT}/${PRODUCTION_CALENDAR_PATHS.NEW}`,
  DETAIL: (id: string) => `${PRODUCTION_CALENDAR_PATHS.ROOT}/${id}`,
  EDIT: (id: string) => `${PRODUCTION_CALENDAR_PATHS.ROOT}/${id}/edit`
} as const;
