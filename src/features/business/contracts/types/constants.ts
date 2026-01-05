// ==============================|| CONTRACTS CONSTANTS ||============================== //

import type { ContractType, ContractStatus, PricingMethod, PartnerType } from './enums';

export const CONTRACT_TYPE_OPTIONS: { value: ContractType; label: string }[] = [
  { value: 'buy', label: 'Mua' },
  { value: 'sell', label: 'Bán' }
]; // Option cho dropdown Loại hợp đồng

export const PARTNER_TYPE_OPTIONS: { value: PartnerType; label: string }[] = [
  { value: 'supplier', label: 'Nhà cung cấp' },
  { value: 'customer', label: 'Khách hàng' }
]; // Option cho dropdown Đối tác

export const PRICING_METHOD_OPTIONS: { value: PricingMethod; label: string }[] = [
  { value: 'fixed', label: 'Cố định' },
  { value: 'formula', label: 'Theo công thức' }
]; // Option cho dropdown Phương thức giá

export const STATUS_OPTIONS: { value: ContractStatus; label: string }[] = [
  { value: 'draft', label: 'Nháp' },
  { value: 'active', label: 'Hiệu lực' },
  { value: 'expired', label: 'Hết hạn' },
  { value: 'cancelled', label: 'Hủy' }
]; // Option cho dropdown Trạng thái

export const CURRENCY_OPTIONS: { value: string; label: string }[] = [
  { value: 'VND', label: 'VND' },
  { value: 'USD', label: 'USD' },
  { value: 'EUR', label: 'EUR' }
]; // Option cho dropdown Tiền tệ

// Route path segments (for route config)
export const CONTRACT_PATHS = {
  ROOT: '/contracts',
  LIST: '',
  NEW: 'new',
  DETAIL: ':id',
  EDIT: ':id/edit'
} as const;

// Full URLs (for navigation)
export const CONTRACT_URLS = {
  LIST: CONTRACT_PATHS.ROOT,
  NEW: `${CONTRACT_PATHS.ROOT}/${CONTRACT_PATHS.NEW}`,
  DETAIL: (id: string) => `${CONTRACT_PATHS.ROOT}/${id}`,
  EDIT: (id: string) => `${CONTRACT_PATHS.ROOT}/${id}/edit`
} as const;
