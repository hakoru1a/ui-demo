// ==============================|| WORKFORCE DISPATCH CONSTANTS ||============================== //

import type { DispatchOrderStatus, PersonnelRole } from './enums';

export const STATUS_OPTIONS: { value: DispatchOrderStatus; label: string }[] = [
  { value: 'draft', label: 'Nháp' },
  { value: 'approved', label: 'Đã duyệt' },
  { value: 'applied', label: 'Đã áp dụng' }
]; // Option cho dropdown Trạng thái

export const ROLE_OPTIONS: { value: PersonnelRole; label: string }[] = [
  { value: 'worker', label: 'Công nhân' },
  { value: 'supervisor', label: 'Tổ trưởng' }
]; // Option cho dropdown Vai trò

// Mock data for factories (should be replaced with API call)
export const FACTORY_OPTIONS: { value: string; label: string }[] = [
  { value: 'factory-001', label: 'Nhà máy A - Hà Nội' },
  { value: 'factory-002', label: 'Nhà máy B - Hồ Chí Minh' },
  { value: 'factory-003', label: 'Nhà máy C - Đà Nẵng' }
]; // Option cho dropdown Nhà máy

// Mock data for production shifts (should be replaced with API call)
export const PRODUCTION_SHIFT_OPTIONS: { value: string; label: string }[] = [
  { value: 'shift-001', label: 'Ca 1 - 08:00-16:00' },
  { value: 'shift-002', label: 'Ca 2 - 16:00-00:00' },
  { value: 'shift-003', label: 'Ca 3 - 00:00-08:00' }
]; // Option cho dropdown Ca sản xuất

// Mock data for departments (should be replaced with API call)
export const DEPARTMENT_OPTIONS: { value: string; label: string }[] = [
  { value: 'dept-001', label: 'Sản xuất' },
  { value: 'dept-002', label: 'Kho' },
  { value: 'dept-003', label: 'QC' }
]; // Option cho dropdown Bộ phận

// Route path segments (for route config)
export const WORKFORCE_DISPATCH_PATHS = {
  ROOT: '/workforce-dispatch',
  LIST: '',
  NEW: 'new',
  DETAIL: ':id',
  EDIT: ':id/edit'
} as const;

// Full URLs (for navigation)
export const WORKFORCE_DISPATCH_URLS = {
  LIST: WORKFORCE_DISPATCH_PATHS.ROOT,
  NEW: `${WORKFORCE_DISPATCH_PATHS.ROOT}/${WORKFORCE_DISPATCH_PATHS.NEW}`,
  DETAIL: (id: string) => `${WORKFORCE_DISPATCH_PATHS.ROOT}/${id}`,
  EDIT: (id: string) => `${WORKFORCE_DISPATCH_PATHS.ROOT}/${id}/edit`
} as const;
