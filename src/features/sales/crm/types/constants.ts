// ==============================|| CUSTOMER CRM CONSTANTS ||============================== //

import type { CustomerStatus, PaymentTerms } from './enums';

export const CUSTOMER_STATUS_OPTIONS: { value: CustomerStatus; label: string }[] = [
  { value: 'active', label: 'Hoạt động' },
  { value: 'inactive', label: 'Tạm ngưng' }
]; // Option cho dropdown Trạng thái

export const PAYMENT_TERMS_OPTIONS: { value: PaymentTerms; label: string }[] = [
  { value: 'TT', label: 'T/T (Telegraphic Transfer)' },
  { value: 'LC', label: 'L/C (Letter of Credit)' },
  { value: 'DP', label: 'DP (Documents against Payment)' },
  { value: 'CAD', label: 'CAD (Cash against Documents)' },
  { value: 'OA', label: 'OA (Open Account)' }
]; // Option cho dropdown Điều khoản thanh toán

export const CURRENCY_OPTIONS: { value: string; label: string }[] = [
  { value: 'USD', label: 'USD' },
  { value: 'EUR', label: 'EUR' },
  { value: 'GBP', label: 'GBP' },
  { value: 'JPY', label: 'JPY' },
  { value: 'CNY', label: 'CNY' },
  { value: 'VND', label: 'VND' }
]; // Option cho dropdown Tiền tệ

// Common countries for customers
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
export const CUSTOMER_PATHS = {
  ROOT: '/crm/customers',
  LIST: '',
  NEW: 'new',
  DETAIL: ':id',
  EDIT: ':id/edit'
} as const;

// Full URLs (for navigation)
export const CUSTOMER_URLS = {
  LIST: CUSTOMER_PATHS.ROOT,
  NEW: `${CUSTOMER_PATHS.ROOT}/${CUSTOMER_PATHS.NEW}`,
  DETAIL: (id: string) => `${CUSTOMER_PATHS.ROOT}/${id}`,
  EDIT: (id: string) => `${CUSTOMER_PATHS.ROOT}/${id}/edit`
} as const;
