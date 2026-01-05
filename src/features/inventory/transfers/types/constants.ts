// ==============================|| TRANSFERS CONSTANTS ||============================== //

import type { ItemType, TransferStatus } from './enums';
import type { CertificationType, TraceStatus } from './traceability';

export const ITEM_TYPE_OPTIONS: { value: ItemType; label: string }[] = [
  { value: 'material', label: 'Nguyên liệu' },
  { value: 'finished', label: 'Thành phẩm' }
]; // Option cho dropdown Loại hàng

export const STATUS_OPTIONS: { value: TransferStatus; label: string }[] = [
  { value: 'draft', label: 'Nháp' },
  { value: 'transferred', label: 'Đã chuyển' },
  { value: 'cancelled', label: 'Hủy' }
]; // Option cho dropdown Trạng thái

// Certification options
export const CERTIFICATION_OPTIONS: { value: CertificationType; label: string }[] = [
  { value: 'FSC', label: 'FSC' },
  { value: 'PEFC', label: 'PEFC' },
  { value: 'none', label: 'Không có' }
];

// Trace status options
export const TRACE_STATUS_OPTIONS: { value: TraceStatus; label: string }[] = [
  { value: 'full', label: 'Đầy đủ' },
  { value: 'missing', label: 'Thiếu' }
];

// Mock data for warehouse dropdown (TODO: Replace with API call)
export const WAREHOUSE_OPTIONS: { value: string; label: string }[] = [
  { value: '1', label: 'Kho Nguyên liệu A' },
  { value: '2', label: 'Kho Thành phẩm B' },
  { value: '3', label: 'Kho Trung chuyển C' },
  { value: '4', label: 'Kho Xuất khẩu D' }
]; // Option cho dropdown Kho

// Mock data for SKU dropdown (TODO: Replace with API call)
export const SKU_OPTIONS: { value: string; label: string; itemType: ItemType }[] = [
  { value: '1', label: 'Gỗ keo', itemType: 'material' },
  { value: '2', label: 'Gỗ cao su', itemType: 'material' },
  { value: '3', label: 'Ván ép', itemType: 'finished' },
  { value: '4', label: 'Gỗ dăm', itemType: 'finished' }
]; // Option cho dropdown SKU

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
export const TRANSFER_PATHS = {
  ROOT: '/transfers',
  LIST: '',
  NEW: 'new',
  DETAIL: ':id',
  EDIT: ':id/edit',
  TRACEABILITY: ':id/traceability'
} as const;

// Full URLs (for navigation)
export const TRANSFER_URLS = {
  LIST: TRANSFER_PATHS.ROOT,
  NEW: `${TRANSFER_PATHS.ROOT}/${TRANSFER_PATHS.NEW}`,
  DETAIL: (id: string) => `${TRANSFER_PATHS.ROOT}/${id}`,
  EDIT: (id: string) => `${TRANSFER_PATHS.ROOT}/${id}/edit`,
  TRACEABILITY: (id: string) => `${TRANSFER_PATHS.ROOT}/${id}/traceability`,
  TRACEABILITY_SEARCH: '/traceability'
} as const;

/**
 * Helper function to get label from options array
 */
export function getLabelFromOptions<T extends string>(value: T | undefined, options: { value: T; label: string }[]): string {
  if (!value) return '-';
  const option = options.find((opt) => opt.value === value);
  return option?.label || value;
}
