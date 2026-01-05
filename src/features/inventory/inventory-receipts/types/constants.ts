// ==============================|| INVENTORY RECEIPTS CONSTANTS ||============================== //

import type { ReceiptStatus, ReceiptSource, ReceiptType } from './enums';

export const RECEIPT_TYPE_OPTIONS: { value: ReceiptType; label: string }[] = [
  { value: 'material', label: 'Nguyên liệu' },
  { value: 'finished', label: 'Thành phẩm' }
]; // Option cho dropdown Loại nhập

export const STATUS_OPTIONS: { value: ReceiptStatus; label: string }[] = [
  { value: 'draft', label: 'Nháp' },
  { value: 'received', label: 'Đã nhập' },
  { value: 'cancelled', label: 'Hủy' }
]; // Option cho dropdown Trạng thái

export const SOURCE_OPTIONS: { value: ReceiptSource; label: string }[] = [
  { value: 'production', label: 'Sản xuất' },
  { value: 'purchase', label: 'Mua ngoài' }
]; // Option cho dropdown Nguồn nhập

// Mock data for warehouse dropdown (TODO: Replace with API call)
export const WAREHOUSE_OPTIONS: { value: string; label: string }[] = [
  { value: '1', label: 'Kho Nguyên liệu A' },
  { value: '2', label: 'Kho Thành phẩm B' },
  { value: '3', label: 'Kho Trung chuyển C' },
  { value: '4', label: 'Kho Xuất khẩu D' }
]; // Option cho dropdown Kho nhập

// Mock data for product/material dropdown (TODO: Replace with API call)
export const PRODUCT_OPTIONS: { value: string; label: string }[] = [
  { value: '1', label: 'Gỗ keo' },
  { value: '2', label: 'Gỗ cao su' },
  { value: '3', label: 'Ván ép' },
  { value: '4', label: 'Gỗ dăm' }
]; // Option cho dropdown Hàng hóa

// Mock data for batch/lot dropdown (TODO: Replace with API call)
export const BATCH_OPTIONS: { value: string; label: string }[] = [
  { value: '1', label: 'Lô 001' },
  { value: '2', label: 'Lô 002' },
  { value: '3', label: 'Lô 003' }
]; // Option cho dropdown Lô

// Mock data for unit dropdown (TODO: Replace with API call)
export const UNIT_OPTIONS: { value: string; label: string }[] = [
  { value: 'Kg', label: 'Kilogram (Kg)' },
  { value: 'Tấn', label: 'Tấn' },
  { value: 'm3', label: 'Mét khối (m³)' },
  { value: 'Thùng', label: 'Thùng' }
]; // Option cho dropdown Đơn vị

// Route path segments (for route config)
export const INVENTORY_RECEIPT_PATHS = {
  ROOT: '/inventory-receipts',
  LIST: '',
  NEW: 'new',
  DETAIL: ':id',
  EDIT: ':id/edit'
} as const;

// Full URLs (for navigation)
export const INVENTORY_RECEIPT_URLS = {
  LIST: INVENTORY_RECEIPT_PATHS.ROOT,
  NEW: `${INVENTORY_RECEIPT_PATHS.ROOT}/${INVENTORY_RECEIPT_PATHS.NEW}`,
  DETAIL: (id: string) => `${INVENTORY_RECEIPT_PATHS.ROOT}/${id}`,
  EDIT: (id: string) => `${INVENTORY_RECEIPT_PATHS.ROOT}/${id}/edit`
} as const;
