// ==============================|| TIMEKEEPING PAYROLL CONSTANTS ||============================== //

import type { WorkShiftType, TimekeepingStatus } from './enums';

export const WORK_SHIFT_TYPE_OPTIONS: { value: WorkShiftType; label: string; color: string }[] = [
  { value: 'morning', label: 'Ca sáng', color: '#1976d2' }, // Blue
  { value: 'afternoon', label: 'Ca chiều', color: '#ed6c02' }, // Orange
  { value: 'night', label: 'Ca đêm', color: '#2e7d32' }, // Green
  { value: 'overtime', label: 'Tăng ca', color: '#9c27b0' } // Purple
];

export const TIMEKEEPING_STATUS_OPTIONS: { value: TimekeepingStatus; label: string }[] = [
  { value: 'pending', label: 'Chờ xác nhận' },
  { value: 'confirmed', label: 'Đã xác nhận' },
  { value: 'locked', label: 'Đã khóa' }
];

export const TIMEKEEPING_PATHS = {
  LIST: '/timekeeping-payroll/timekeeping',
  DETAIL: (id: string) => `/timekeeping-payroll/timekeeping/${id}`,
  NEW: '/timekeeping-payroll/timekeeping/new'
} as const;

export const TIMEKEEPING_URLS = {
  LIST: '/timekeeping-payroll/timekeeping',
  DETAIL: (id: string) => `/timekeeping-payroll/timekeeping/${id}`,
  NEW: '/timekeeping-payroll/timekeeping/new'
} as const;
