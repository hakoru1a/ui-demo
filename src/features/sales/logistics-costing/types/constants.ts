// ==============================|| LOGISTICS COSTING CONSTANTS ||============================== //

import type { CostType, ServiceCategory, AllocationMethod, LogisticsCostStatus, Currency } from './enums';

export const COST_TYPE_OPTIONS: { value: CostType; label: string }[] = [
  { value: 'logistics', label: 'Logistics' },
  { value: 'service', label: 'Dịch vụ' }
]; // Option cho dropdown Loại chi phí

export const SERVICE_CATEGORY_OPTIONS: { value: ServiceCategory; label: string }[] = [
  { value: 'transport', label: 'Vận chuyển' },
  { value: 'loading', label: 'Bốc xếp' },
  { value: 'customs', label: 'Hải quan' }
]; // Option cho dropdown Nhóm dịch vụ

export const ALLOCATION_METHOD_OPTIONS: { value: AllocationMethod; label: string }[] = [
  { value: 'by-shipment', label: 'Theo lô' },
  { value: 'by-order', label: 'Theo đơn' }
]; // Option cho dropdown Phân bổ

export const STATUS_OPTIONS: { value: LogisticsCostStatus; label: string }[] = [
  { value: 'draft', label: 'Nháp' },
  { value: 'recorded', label: 'Đã ghi nhận' }
]; // Option cho dropdown Trạng thái

export const CURRENCY_OPTIONS: { value: Currency; label: string }[] = [
  { value: 'VND', label: 'VND' },
  { value: 'USD', label: 'USD' },
  { value: 'EUR', label: 'EUR' }
]; // Option cho dropdown Tiền tệ

// Mock data for partners (NCC dịch vụ)
export const PARTNER_OPTIONS: { value: string; label: string }[] = [
  { value: 'partner-001', label: 'Công ty Vận tải A' },
  { value: 'partner-002', label: 'Công ty Logistics B' },
  { value: 'partner-003', label: 'Công ty Dịch vụ Hải quan C' },
  { value: 'partner-004', label: 'Công ty Bốc xếp D' },
  { value: 'partner-005', label: 'Công ty Vận chuyển E' }
]; // Option cho dropdown Đối tác

// Mock data for shipments (Lô)
export const SHIPMENT_OPTIONS: { value: string; label: string }[] = [
  { value: 'shipment-001', label: 'Lô #SH001' },
  { value: 'shipment-002', label: 'Lô #SH002' },
  { value: 'shipment-003', label: 'Lô #SH003' }
]; // Option cho dropdown Lô liên quan

// Mock data for orders (Đơn)
export const ORDER_OPTIONS: { value: string; label: string }[] = [
  { value: 'order-001', label: 'Đơn #ORD001' },
  { value: 'order-002', label: 'Đơn #ORD002' },
  { value: 'order-003', label: 'Đơn #ORD003' }
]; // Option cho dropdown Đơn liên quan

// Route path segments (for route config)
export const LOGISTICS_COSTING_PATHS = {
  ROOT: '/logistics-costing',
  LIST: '',
  NEW: 'new',
  DETAIL: ':id',
  EDIT: ':id/edit'
} as const;

// Full URLs (for navigation)
export const LOGISTICS_COSTING_URLS = {
  LIST: LOGISTICS_COSTING_PATHS.ROOT,
  NEW: `${LOGISTICS_COSTING_PATHS.ROOT}/${LOGISTICS_COSTING_PATHS.NEW}`,
  DETAIL: (id: string) => `${LOGISTICS_COSTING_PATHS.ROOT}/${id}`,
  EDIT: (id: string) => `${LOGISTICS_COSTING_PATHS.ROOT}/${id}/edit`
} as const;
