// ==============================|| BATCHES CONSTANTS ||============================== //

import type { BatchStatus } from './enums';

export const BATCH_STATUS_OPTIONS: { value: BatchStatus; label: string }[] = [
  { value: 'in-progress', label: 'Đang SX' },
  { value: 'completed', label: 'Hoàn thành' },
  { value: 'cancelled', label: 'Hủy' }
]; // Option cho dropdown Trạng thái lô

// Mock data for production orders (should be replaced with API call)
export const PRODUCTION_ORDER_OPTIONS: { value: string; label: string }[] = [
  { value: 'order-001', label: 'Lệnh SX-001' },
  { value: 'order-002', label: 'Lệnh SX-002' },
  { value: 'order-003', label: 'Lệnh SX-003' },
  { value: 'order-004', label: 'Lệnh SX-004' },
  { value: 'order-005', label: 'Lệnh SX-005' }
]; // Option cho dropdown Kế hoạch / Lệnh SX

// Mock data for products/materials (should be replaced with API call)
export const PRODUCT_MATERIAL_OPTIONS: { value: string; label: string }[] = [
  { value: 'product-001', label: 'Sản phẩm A' },
  { value: 'product-002', label: 'Sản phẩm B' },
  { value: 'material-001', label: 'Nguyên liệu X' },
  { value: 'material-002', label: 'Nguyên liệu Y' },
  { value: 'product-003', label: 'Sản phẩm C' }
]; // Option cho dropdown Sản phẩm / Nguyên liệu

// Route path segments (for route config)
export const BATCH_PATHS = {
  ROOT: '/batches',
  LIST: '',
  NEW: 'new',
  DETAIL: ':id',
  EDIT: ':id/edit'
} as const;

// Full URLs (for navigation)
export const BATCH_URLS = {
  LIST: BATCH_PATHS.ROOT,
  NEW: `${BATCH_PATHS.ROOT}/${BATCH_PATHS.NEW}`,
  DETAIL: (id: string) => `${BATCH_PATHS.ROOT}/${id}`,
  EDIT: (id: string) => `${BATCH_PATHS.ROOT}/${id}/edit`
} as const;
