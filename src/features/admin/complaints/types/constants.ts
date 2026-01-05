// ==============================|| COMPLAINTS CONSTANTS ||============================== //

import type { ComplaintType, ComplaintStatus } from './enums';

export const COMPLAINT_TYPE_OPTIONS: { value: ComplaintType; label: string }[] = [
  { value: 'labor', label: 'Lao động' },
  { value: 'production', label: 'Sản xuất' },
  { value: 'safety', label: 'An toàn' }
]; // Option cho dropdown Loại khiếu nại

export const COMPLAINT_STATUS_OPTIONS: { value: ComplaintStatus; label: string }[] = [
  { value: 'new', label: 'Mới' },
  { value: 'processing', label: 'Đang xử lý' },
  { value: 'resolved', label: 'Đã giải quyết' }
]; // Option cho dropdown Trạng thái

// Mock employee options for related employee dropdown
export const EMPLOYEE_OPTIONS: { value: string; label: string }[] = [
  { value: '1', label: 'Nguyễn Văn A' },
  { value: '2', label: 'Trần Thị B' },
  { value: '3', label: 'Lê Văn C' },
  { value: '4', label: 'Phạm Thị D' }
]; // TODO: Replace with actual employee data from API

// Route path segments (for route config)
export const COMPLAINT_PATHS = {
  ROOT: '/complaints',
  LIST: '',
  NEW: 'new',
  DETAIL: ':id',
  EDIT: ':id/edit'
} as const;

// Full URLs (for navigation)
export const COMPLAINT_URLS = {
  LIST: COMPLAINT_PATHS.ROOT,
  NEW: `${COMPLAINT_PATHS.ROOT}/${COMPLAINT_PATHS.NEW}`,
  DETAIL: (id: string) => `${COMPLAINT_PATHS.ROOT}/${id}`,
  EDIT: (id: string) => `${COMPLAINT_PATHS.ROOT}/${id}/edit`
} as const;
