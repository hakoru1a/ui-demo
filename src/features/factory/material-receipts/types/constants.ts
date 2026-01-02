// ==============================|| MATERIAL RECEIPTS CONSTANTS ||============================== //

import type { MaterialType, ReceiptStatus } from './enums';

export const MATERIAL_TYPE_OPTIONS: { value: MaterialType; label: string }[] = [
  { value: 'keo', label: 'Gỗ keo' },
  { value: 'tram', label: 'Gỗ tràm' },
  { value: 'bach-dan', label: 'Gỗ bạch đàn' },
  { value: 'thong', label: 'Gỗ thông' },
  { value: 'other', label: 'Khác' }
]; // Option cho dropdown Loại nguyên liệu

export const RECEIPT_STATUS_OPTIONS: { value: ReceiptStatus; label: string }[] = [
  { value: 'draft', label: 'Nháp' },
  { value: 'received', label: 'Đã nhập' },
  { value: 'cancelled', label: 'Hủy' }
]; // Option cho dropdown Trạng thái phiếu

// Mock data for dropdowns
export const SUPPLIER_OPTIONS: { value: string; label: string }[] = [
  { value: 'supplier-001', label: 'Nhà cung cấp A' },
  { value: 'supplier-002', label: 'Nhà cung cấp B' },
  { value: 'supplier-003', label: 'Nhà cung cấp C' },
  { value: 'supplier-004', label: 'Nhà cung cấp D' },
  { value: 'supplier-005', label: 'Nhà cung cấp E' }
]; // Option cho dropdown Nhà cung cấp (mock data)

export const WAREHOUSE_OPTIONS: { value: string; label: string }[] = [
  { value: 'warehouse-001', label: 'Kho A' },
  { value: 'warehouse-002', label: 'Kho B' },
  { value: 'warehouse-003', label: 'Kho C' },
  { value: 'warehouse-004', label: 'Kho D' }
]; // Option cho dropdown Kho nhập (mock data)

// Route path segments (for route config)
export const MATERIAL_RECEIPT_PATHS = {
  ROOT: '/material-receipts',
  LIST: '',
  NEW: 'new',
  DETAIL: ':id',
  EDIT: ':id/edit'
} as const;

// Full URLs (for navigation)
export const MATERIAL_RECEIPT_URLS = {
  LIST: MATERIAL_RECEIPT_PATHS.ROOT,
  NEW: `${MATERIAL_RECEIPT_PATHS.ROOT}/${MATERIAL_RECEIPT_PATHS.NEW}`,
  DETAIL: (id: string) => `${MATERIAL_RECEIPT_PATHS.ROOT}/${id}`,
  EDIT: (id: string) => `${MATERIAL_RECEIPT_PATHS.ROOT}/${id}/edit`
} as const;
