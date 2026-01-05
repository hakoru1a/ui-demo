// ==============================|| QUALITY INSPECTION CONSTANTS ||============================== //

import type { QCResult } from './enums';

export const QC_RESULT_OPTIONS: { value: QCResult; label: string }[] = [
  { value: 'passed', label: 'Đạt' },
  { value: 'failed', label: 'Không đạt' }
]; // Option cho dropdown Kết quả QC

// Mock data for products (should be replaced with API call)
export const PRODUCT_OPTIONS: { value: string; label: string }[] = [
  { value: 'product-001', label: 'Thành phẩm A' },
  { value: 'product-002', label: 'Thành phẩm B' },
  { value: 'product-003', label: 'Thành phẩm C' },
  { value: 'product-004', label: 'Thành phẩm D' },
  { value: 'product-005', label: 'Thành phẩm E' }
]; // Option cho dropdown Thành phẩm

// Mock data for batches (should be replaced with API call)
export const BATCH_OPTIONS: { value: string; label: string }[] = [
  { value: 'batch-001', label: 'Lô SX-001' },
  { value: 'batch-002', label: 'Lô SX-002' },
  { value: 'batch-003', label: 'Lô SX-003' },
  { value: 'batch-004', label: 'Lô SX-004' },
  { value: 'batch-005', label: 'Lô SX-005' }
]; // Option cho dropdown Lô sản xuất

// Mock data for inspectors (should be replaced with API call)
export const INSPECTOR_OPTIONS: { value: string; label: string }[] = [
  { value: 'inspector-001', label: 'Nguyễn Văn A' },
  { value: 'inspector-002', label: 'Trần Thị B' },
  { value: 'inspector-003', label: 'Lê Văn C' },
  { value: 'inspector-004', label: 'Phạm Thị D' },
  { value: 'inspector-005', label: 'Hoàng Văn E' }
]; // Option cho dropdown Người kiểm tra

// Route path segments (for route config)
export const QUALITY_PATHS = {
  ROOT: '/quality',
  LIST: '',
  NEW: 'new',
  DETAIL: ':id',
  EDIT: ':id/edit'
} as const;

// Full URLs (for navigation)
export const QUALITY_URLS = {
  LIST: QUALITY_PATHS.ROOT,
  NEW: `${QUALITY_PATHS.ROOT}/${QUALITY_PATHS.NEW}`,
  DETAIL: (id: string) => `${QUALITY_PATHS.ROOT}/${id}`,
  EDIT: (id: string) => `${QUALITY_PATHS.ROOT}/${id}/edit`
} as const;
