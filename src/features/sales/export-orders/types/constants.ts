// ==============================|| EXPORT ORDERS CONSTANTS ||============================== //

import type { ExportOrderStatus, Incoterms } from './enums';

export const EXPORT_ORDER_STATUS_OPTIONS: { value: ExportOrderStatus; label: string }[] = [
  { value: 'draft', label: 'Nháp' },
  { value: 'confirmed', label: 'Đã xác nhận' },
  { value: 'delivering', label: 'Đang giao' },
  { value: 'completed', label: 'Hoàn tất' }
]; // Option cho dropdown Trạng thái

export const INCOTERMS_OPTIONS: { value: Incoterms; label: string }[] = [
  { value: 'FOB', label: 'FOB' },
  { value: 'CIF', label: 'CIF' },
  { value: 'EXW', label: 'EXW' },
  { value: 'CFR', label: 'CFR' },
  { value: 'CPT', label: 'CPT' },
  { value: 'CIP', label: 'CIP' },
  { value: 'DAP', label: 'DAP' },
  { value: 'DPU', label: 'DPU' },
  { value: 'DDP', label: 'DDP' }
]; // Option cho dropdown Incoterms

export const CURRENCY_OPTIONS: { value: string; label: string }[] = [
  { value: 'USD', label: 'USD' },
  { value: 'EUR', label: 'EUR' },
  { value: 'GBP', label: 'GBP' },
  { value: 'JPY', label: 'JPY' },
  { value: 'CNY', label: 'CNY' },
  { value: 'VND', label: 'VND' }
]; // Option cho dropdown Tiền tệ

// Common countries for export
export const COUNTRY_OPTIONS: { value: string; label: string }[] = [
  { value: 'US', label: 'Hoa Kỳ' },
  { value: 'GB', label: 'Anh' },
  { value: 'DE', label: 'Đức' },
  { value: 'FR', label: 'Pháp' },
  { value: 'IT', label: 'Ý' },
  { value: 'ES', label: 'Tây Ban Nha' },
  { value: 'NL', label: 'Hà Lan' },
  { value: 'BE', label: 'Bỉ' },
  { value: 'JP', label: 'Nhật Bản' },
  { value: 'CN', label: 'Trung Quốc' },
  { value: 'KR', label: 'Hàn Quốc' },
  { value: 'AU', label: 'Úc' },
  { value: 'CA', label: 'Canada' },
  { value: 'SG', label: 'Singapore' },
  { value: 'MY', label: 'Malaysia' },
  { value: 'TH', label: 'Thái Lan' },
  { value: 'ID', label: 'Indonesia' },
  { value: 'PH', label: 'Philippines' },
  { value: 'VN', label: 'Việt Nam' }
]; // Option cho dropdown Quốc gia

// Route path segments (for route config)
export const EXPORT_ORDER_PATHS = {
  ROOT: '/export-orders',
  LIST: '',
  NEW: 'new',
  DETAIL: ':id',
  EDIT: ':id/edit'
} as const;

// Full URLs (for navigation)
export const EXPORT_ORDER_URLS = {
  LIST: EXPORT_ORDER_PATHS.ROOT,
  NEW: `${EXPORT_ORDER_PATHS.ROOT}/${EXPORT_ORDER_PATHS.NEW}`,
  DETAIL: (id: string) => `${EXPORT_ORDER_PATHS.ROOT}/${id}`,
  EDIT: (id: string) => `${EXPORT_ORDER_PATHS.ROOT}/${id}/edit`
} as const;
