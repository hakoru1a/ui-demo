// ==============================|| SKU CONSTANTS ||============================== //

import type { ItemType, StockStatus } from './enums';

export const ITEM_TYPE_OPTIONS: { value: ItemType; label: string }[] = [
  { value: 'material', label: 'Nguyên liệu' },
  { value: 'finished', label: 'Thành phẩm' }
]; // Option cho dropdown Loại hàng

export const STOCK_STATUS_OPTIONS: { value: StockStatus; label: string }[] = [
  { value: 'in_stock', label: 'Còn hàng' },
  { value: 'out_of_stock', label: 'Hết hàng' }
]; // Option cho dropdown Trạng thái tồn

// Mock data for warehouse dropdown (TODO: Replace with API call)
export const WAREHOUSE_OPTIONS: { value: string; label: string }[] = [
  { value: '1', label: 'Kho Nguyên liệu A' },
  { value: '2', label: 'Kho Thành phẩm B' },
  { value: '3', label: 'Kho Trung chuyển C' },
  { value: '4', label: 'Kho Xuất khẩu D' }
]; // Option cho dropdown Kho

// Mock data for unit dropdown (TODO: Replace with API call)
export const UNIT_OPTIONS: { value: string; label: string }[] = [
  { value: 'Kg', label: 'Kilogram (Kg)' },
  { value: 'Tấn', label: 'Tấn' },
  { value: 'm3', label: 'Mét khối (m³)' },
  { value: 'Thùng', label: 'Thùng' }
]; // Option cho dropdown Đơn vị

// Route path segments (for route config)
export const SKU_PATHS = {
  ROOT: '/sku',
  LIST: '',
  NEW: 'new',
  DETAIL: ':id',
  EDIT: ':id/edit'
} as const;

// Full URLs (for navigation)
export const SKU_URLS = {
  LIST: SKU_PATHS.ROOT,
  NEW: `${SKU_PATHS.ROOT}/${SKU_PATHS.NEW}`,
  DETAIL: (id: string) => `${SKU_PATHS.ROOT}/${id}`,
  EDIT: (id: string) => `${SKU_PATHS.ROOT}/${id}/edit`
} as const;

// Helper function to get label from options
export const getLabelFromOptions = <T extends string>(value: T, options: { value: T; label: string }[]): string => {
  const option = options.find((opt) => opt.value === value);
  return option?.label || value;
};
