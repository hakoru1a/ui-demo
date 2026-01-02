// ==============================|| PARTNERS CONSTANTS ||============================== //

import type { PartnerType, PartnerStatus } from './enums';

export const PARTNER_TYPE_OPTIONS: { value: PartnerType; label: string }[] = [
  { value: 'individual', label: 'Cá nhân' },
  { value: 'business', label: 'Doanh nghiệp' }
]; // Option cho dropdown Loại đối tượng

export const STATUS_OPTIONS: { value: PartnerStatus; label: string }[] = [
  { value: 'active', label: 'Hoạt động' },
  { value: 'inactive', label: 'Ngưng' }
]; // Option cho dropdown Trạng thái

// Route path segments (for route config)
export const PARTNER_PATHS = {
  ROOT: '/partners',
  LIST: '',
  NEW: 'new',
  DETAIL: ':id',
  EDIT: ':id/edit'
} as const;

// Full URLs (for navigation)
export const PARTNER_URLS = {
  LIST: PARTNER_PATHS.ROOT,
  NEW: `${PARTNER_PATHS.ROOT}/${PARTNER_PATHS.NEW}`,
  DETAIL: (id: string) => `${PARTNER_PATHS.ROOT}/${id}`,
  EDIT: (id: string) => `${PARTNER_PATHS.ROOT}/${id}/edit`
} as const;
