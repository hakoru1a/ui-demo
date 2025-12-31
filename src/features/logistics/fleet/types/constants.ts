// ==============================|| FLEET CONSTANTS ||============================== //

import type { VehicleType, VehicleStatus, DriverStatus } from './enums';

export const VEHICLE_TYPE_OPTIONS: { value: VehicleType; label: string }[] = [
  { value: 'truck', label: 'Xe tải' },
  { value: 'container', label: 'Container' }
]; // Option cho dropdown Loại xe

export const VEHICLE_STATUS_OPTIONS: { value: VehicleStatus; label: string }[] = [
  { value: 'ready', label: 'Sẵn sàng' },
  { value: 'running', label: 'Đang chạy' },
  { value: 'maintenance', label: 'Bảo trì' }
]; // Option cho dropdown Trạng thái xe

export const DRIVER_STATUS_OPTIONS: { value: DriverStatus; label: string }[] = [
  { value: 'available', label: 'Rảnh' },
  { value: 'dispatched', label: 'Đang điều động' }
]; // Option cho dropdown Trạng thái tài xế

// Route path segments (for route config)
export const FLEET_PATHS = {
  ROOT: '/fleet',
  LIST: '',
  NEW: 'new',
  DETAIL: ':id',
  EDIT: ':id/edit'
} as const;

// Full URLs (for navigation)
export const FLEET_URLS = {
  LIST: FLEET_PATHS.ROOT,
  NEW: `${FLEET_PATHS.ROOT}/${FLEET_PATHS.NEW}`,
  DETAIL: (id: string) => `${FLEET_PATHS.ROOT}/${id}`,
  EDIT: (id: string) => `${FLEET_PATHS.ROOT}/${id}/edit`
} as const;
