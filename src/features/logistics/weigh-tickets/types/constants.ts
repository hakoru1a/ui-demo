// ==============================|| WEIGH TICKETS CONSTANTS ||============================== //

import type { EntityStatus } from 'types/status';

import type { WeighTicketType } from './enums';

export const WEIGH_TICKET_TYPE_OPTIONS: { value: WeighTicketType; label: string }[] = [
  { value: 'inbound', label: 'Inbound' },
  { value: 'outbound', label: 'Outbound' }
]; // Option cho dropdown Loại phiếu

export const STATUS_OPTIONS: { value: EntityStatus; label: string }[] = [
  { value: 'active', label: 'Hoạt động' },
  { value: 'inactive', label: 'Tạm ngưng' }
]; // Option cho dropdown Trạng thái

// Mock data for suppliers (Nhà cung cấp)
export const SUPPLIER_OPTIONS: { value: string; label: string }[] = [
  { value: 'supplier-001', label: 'Công ty Cung cấp A' },
  { value: 'supplier-002', label: 'Công ty Cung cấp B' },
  { value: 'supplier-003', label: 'Công ty Cung cấp C' },
  { value: 'supplier-004', label: 'Công ty Cung cấp D' },
  { value: 'supplier-005', label: 'Công ty Cung cấp E' }
]; // Option cho dropdown Nhà cung cấp (mock data)

// Route path segments (for route config)
export const WEIGH_TICKET_PATHS = {
  ROOT: '/weigh-tickets',
  LIST: '',
  NEW: 'new',
  DETAIL: ':id',
  EDIT: ':id/edit'
} as const;

// Full URLs (for navigation)
export const WEIGH_TICKET_URLS = {
  LIST: WEIGH_TICKET_PATHS.ROOT,
  NEW: `${WEIGH_TICKET_PATHS.ROOT}/${WEIGH_TICKET_PATHS.NEW}`,
  DETAIL: (id: string) => `${WEIGH_TICKET_PATHS.ROOT}/${id}`,
  EDIT: (id: string) => `${WEIGH_TICKET_PATHS.ROOT}/${id}/edit`
} as const;
