// ==============================|| SUPPLIERS CONSTANTS ||============================== //

import type { EntityStatus } from 'types/status';

import type { SupplierType, CertificateType, TransactionType, TransactionStatus } from './enums';

export const SUPPLIER_TYPE_OPTIONS: { value: SupplierType; label: string }[] = [
  { value: 'individual', label: 'Cá nhân' },
  { value: 'business', label: 'Doanh nghiệp' }
]; // Option cho dropdown Loại nhà cung cấp

export const CERTIFICATE_OPTIONS: { value: CertificateType; label: string }[] = [
  { value: 'FSC', label: 'FSC' },
  { value: 'PEFC', label: 'PEFC' }
]; // Option cho checkbox Chứng chỉ

export const STATUS_OPTIONS: { value: EntityStatus; label: string }[] = [
  { value: 'active', label: 'Hoạt động' },
  { value: 'inactive', label: 'Ngưng hợp tác' }
]; // Option cho dropdown Trạng thái

export const REGION_OPTIONS: { value: string; label: string }[] = [
  { value: 'Đắk Lắk', label: 'Đắk Lắk' },
  { value: 'Gia Lai', label: 'Gia Lai' },
  { value: 'Kon Tum', label: 'Kon Tum' },
  { value: 'Lâm Đồng', label: 'Lâm Đồng' },
  { value: 'Đắk Nông', label: 'Đắk Nông' },
  { value: 'Bình Phước', label: 'Bình Phước' },
  { value: 'Bình Dương', label: 'Bình Dương' },
  { value: 'Đồng Nai', label: 'Đồng Nai' },
  { value: 'Bà Rịa - Vũng Tàu', label: 'Bà Rịa - Vũng Tàu' },
  { value: 'Tây Ninh', label: 'Tây Ninh' },
  { value: 'Quảng Nam', label: 'Quảng Nam' },
  { value: 'Quảng Ngãi', label: 'Quảng Ngãi' },
  { value: 'Bình Định', label: 'Bình Định' },
  { value: 'Phú Yên', label: 'Phú Yên' },
  { value: 'Khánh Hòa', label: 'Khánh Hòa' }
]; // Option cho dropdown Khu vực cung cấp

export const TRANSACTION_TYPE_OPTIONS: { value: TransactionType; label: string }[] = [
  { value: 'import', label: 'Nhập gỗ' },
  { value: 'adjustment', label: 'Điều chỉnh' }
]; // Option cho dropdown Loại giao dịch

export const TRANSACTION_STATUS_OPTIONS: { value: TransactionStatus; label: string }[] = [
  { value: 'completed', label: 'Hoàn thành' },
  { value: 'cancelled', label: 'Hủy' }
]; // Option cho dropdown Trạng thái giao dịch

// Route path segments (for route config)
export const SUPPLIER_PATHS = {
  ROOT: '/suppliers',
  LIST: '',
  NEW: 'new',
  DETAIL: ':id',
  EDIT: ':id/edit',
  TRANSACTION_HISTORY: ':id/transactions'
} as const;

// Full URLs (for navigation)
export const SUPPLIER_URLS = {
  LIST: SUPPLIER_PATHS.ROOT,
  NEW: `${SUPPLIER_PATHS.ROOT}/${SUPPLIER_PATHS.NEW}`,
  DETAIL: (id: string) => `${SUPPLIER_PATHS.ROOT}/${id}`,
  EDIT: (id: string) => `${SUPPLIER_PATHS.ROOT}/${id}/edit`,
  TRANSACTION_HISTORY: (id: string) => `${SUPPLIER_PATHS.ROOT}/${id}/transactions`
} as const;
