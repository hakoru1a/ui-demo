// ==============================|| PRODUCTION PLANS CONSTANTS ||============================== //

import type { PlanType, PlanStatus } from './enums';

export const PLAN_TYPE_OPTIONS: { value: PlanType; label: string }[] = [
  { value: 'plan', label: 'Kế hoạch' },
  { value: 'order', label: 'Lệnh' }
]; // Option cho dropdown Loại

export const PLAN_STATUS_OPTIONS: { value: PlanStatus; label: string }[] = [
  { value: 'draft', label: 'Nháp' },
  { value: 'in-progress', label: 'Đang SX' },
  { value: 'completed', label: 'Hoàn thành' }
]; // Option cho dropdown Trạng thái

// Mock data for products (should be replaced with API call)
export const PRODUCT_OPTIONS: { value: string; label: string }[] = [
  { value: 'product-001', label: 'Sản phẩm A' },
  { value: 'product-002', label: 'Sản phẩm B' },
  { value: 'product-003', label: 'Sản phẩm C' },
  { value: 'product-004', label: 'Sản phẩm D' },
  { value: 'product-005', label: 'Sản phẩm E' }
]; // Option cho dropdown Sản phẩm

// Mock data for production lines (should be replaced with API call)
export const PRODUCTION_LINE_OPTIONS: { value: string; label: string }[] = [
  { value: 'line-001', label: 'Dây chuyền 1' },
  { value: 'line-002', label: 'Dây chuyền 2' },
  { value: 'line-003', label: 'Dây chuyền 3' }
]; // Option cho dropdown Dây chuyền

// Route path segments (for route config)
export const PRODUCTION_PLAN_PATHS = {
  ROOT: '/production-plans',
  LIST: '',
  NEW: 'new',
  DETAIL: ':id',
  EDIT: ':id/edit'
} as const;

// Full URLs (for navigation)
export const PRODUCTION_PLAN_URLS = {
  LIST: PRODUCTION_PLAN_PATHS.ROOT,
  NEW: `${PRODUCTION_PLAN_PATHS.ROOT}/${PRODUCTION_PLAN_PATHS.NEW}`,
  DETAIL: (id: string) => `${PRODUCTION_PLAN_PATHS.ROOT}/${id}`,
  EDIT: (id: string) => `${PRODUCTION_PLAN_PATHS.ROOT}/${id}/edit`
} as const;
