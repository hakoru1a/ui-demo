// ==============================|| DISPATCH ORDERS CONSTANTS ||============================== //

import type { DispatchOrderStatus } from './enums';

export const DISPATCH_ORDER_STATUS_OPTIONS: { value: DispatchOrderStatus; label: string }[] = [
  { value: 'new', label: 'Mới' },
  { value: 'running', label: 'Đang chạy' },
  { value: 'completed', label: 'Hoàn thành' }
]; // Option cho dropdown Trạng thái lệnh

// Route path segments (for route config)
export const DISPATCH_ORDER_PATHS = {
  ROOT: '/dispatching',
  LIST: '',
  SCHEDULE: 'schedule',
  NEW: 'new',
  DETAIL: ':id',
  EDIT: ':id/edit'
} as const;

// Full URLs (for navigation)
export const DISPATCH_ORDER_URLS = {
  LIST: DISPATCH_ORDER_PATHS.ROOT,
  SCHEDULE: `${DISPATCH_ORDER_PATHS.ROOT}/${DISPATCH_ORDER_PATHS.SCHEDULE}`,
  NEW: `${DISPATCH_ORDER_PATHS.ROOT}/${DISPATCH_ORDER_PATHS.NEW}`,
  DETAIL: (id: string) => `${DISPATCH_ORDER_PATHS.ROOT}/${id}`,
  EDIT: (id: string) => `${DISPATCH_ORDER_PATHS.ROOT}/${id}/edit`
} as const;
