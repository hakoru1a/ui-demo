// ==============================|| VESSEL TRACKING CONSTANTS ||============================== //

import type { VesselStatus } from './enums';

export const VESSEL_STATUS_OPTIONS: { value: VesselStatus; label: string }[] = [
  { value: 'running', label: 'Đang chạy' },
  { value: 'arrived', label: 'Đã đến' }
]; // Option cho dropdown Trạng thái tàu

// Common ports
export const PORT_OPTIONS: { value: string; label: string }[] = [
  { value: 'HCM', label: 'Cảng Sài Gòn (HCM)' },
  { value: 'HP', label: 'Cảng Hải Phòng (HP)' },
  { value: 'DN', label: 'Cảng Đà Nẵng (DN)' },
  { value: 'CT', label: 'Cảng Cần Thơ (CT)' },
  { value: 'VUT', label: 'Cảng Vũng Tàu (VUT)' },
  { value: 'SINGAPORE', label: 'Singapore' },
  { value: 'HONGKONG', label: 'Hong Kong' },
  { value: 'SHANGHAI', label: 'Shanghai' },
  { value: 'ROTTERDAM', label: 'Rotterdam' },
  { value: 'HAMBURG', label: 'Hamburg' },
  { value: 'ANTWERP', label: 'Antwerp' },
  { value: 'LOSANGELES', label: 'Los Angeles' },
  { value: 'NEWYORK', label: 'New York' },
  { value: 'LONG BEACH', label: 'Long Beach' }
]; // Option cho dropdown Cảng

// Route path segments (for route config)
export const VESSEL_TRACKING_PATHS = {
  ROOT: '/vessel-tracking',
  LIST: '',
  NEW: 'new',
  DETAIL: ':id',
  EDIT: ':id/edit'
} as const;

// Full URLs (for navigation)
export const VESSEL_TRACKING_URLS = {
  LIST: VESSEL_TRACKING_PATHS.ROOT,
  NEW: `${VESSEL_TRACKING_PATHS.ROOT}/${VESSEL_TRACKING_PATHS.NEW}`,
  DETAIL: (id: string) => `${VESSEL_TRACKING_PATHS.ROOT}/${id}`,
  EDIT: (id: string) => `${VESSEL_TRACKING_PATHS.ROOT}/${id}/edit`
} as const;
