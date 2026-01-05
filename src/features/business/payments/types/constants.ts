// ==============================|| PAYMENT ORDERS CONSTANTS ||============================== //

import type { PaymentOrderType, PaymentOrderStatus, PaymentMethod, PartnerType } from './enums';

export const PAYMENT_ORDER_TYPE_OPTIONS: { value: PaymentOrderType; label: string }[] = [
  { value: 'payment', label: 'Thanh toán' },
  { value: 'expense', label: 'Chi' }
]; // Option cho dropdown Loại phiếu

export const PARTNER_TYPE_OPTIONS: { value: PartnerType; label: string }[] = [
  { value: 'customer', label: 'Khách hàng' },
  { value: 'supplier', label: 'NCC' }
]; // Option cho dropdown Đối tác

export const PAYMENT_METHOD_OPTIONS: { value: PaymentMethod; label: string }[] = [
  { value: 'cash', label: 'Tiền mặt' },
  { value: 'transfer', label: 'Chuyển khoản' }
]; // Option cho dropdown Phương thức

export const STATUS_OPTIONS: { value: PaymentOrderStatus; label: string }[] = [
  { value: 'draft', label: 'Nháp' },
  { value: 'pending', label: 'Chờ duyệt' },
  { value: 'paid', label: 'Đã thanh toán' }
]; // Option cho dropdown Trạng thái

export const CURRENCY_OPTIONS: { value: string; label: string }[] = [
  { value: 'VND', label: 'VND' },
  { value: 'USD', label: 'USD' },
  { value: 'EUR', label: 'EUR' }
]; // Option cho dropdown Tiền tệ

// Route path segments (for route config)
export const PAYMENT_ORDER_PATHS = {
  ROOT: '/payments',
  LIST: '',
  NEW: 'new',
  DETAIL: ':id',
  EDIT: ':id/edit',
  APPROVAL: ':id/approval'
} as const;

// Full URLs (for navigation)
export const PAYMENT_ORDER_URLS = {
  LIST: PAYMENT_ORDER_PATHS.ROOT,
  NEW: `${PAYMENT_ORDER_PATHS.ROOT}/${PAYMENT_ORDER_PATHS.NEW}`,
  DETAIL: (id: string) => `${PAYMENT_ORDER_PATHS.ROOT}/${id}`,
  EDIT: (id: string) => `${PAYMENT_ORDER_PATHS.ROOT}/${id}/edit`,
  APPROVAL: (id: string) => `${PAYMENT_ORDER_PATHS.ROOT}/${id}/approval`
} as const;
