// ==============================|| TRACKING CONSTANTS ||============================== //

import type { TrackingStatusType } from './enums';

export const TRACKING_STATUS_OPTIONS: { value: TrackingStatusType; label: string }[] = [
  { value: 'idle', label: 'Chờ' },
  { value: 'moving', label: 'Đang di chuyển' },
  { value: 'stopped', label: 'Dừng lại' },
  { value: 'arrived', label: 'Đã đến' }
];

// Route path segments (for route config)
export const TRACKING_PATHS = {
  ROOT: '/tracking',
  TRACKING: ''
} as const;

// Full URLs (for navigation)
export const TRACKING_URLS = {
  TRACKING: TRACKING_PATHS.ROOT,
  TRACKING_WITH_ORDER: (orderId: string) => `${TRACKING_PATHS.ROOT}?orderId=${orderId}`
} as const;

// Default map center (Hà Nội)
export const DEFAULT_MAP_CENTER = {
  lat: 21.0285,
  lng: 105.8542
} as const;

// Default zoom level
export const DEFAULT_ZOOM = 13;
