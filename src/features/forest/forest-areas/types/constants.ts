// ==============================|| FOREST AREAS CONSTANTS ||============================== //

import type { EntityStatus } from 'types/status';

import type { OwnershipType, CertificateType, TreeType } from './enums';

export const OWNERSHIP_TYPE_OPTIONS: { value: OwnershipType; label: string }[] = [
  { value: 'company', label: 'Công ty' },
  { value: 'partner', label: 'Đối tác' }
]; // Option cho dropdown Loại sở hữu

export const CERTIFICATE_OPTIONS: { value: CertificateType; label: string }[] = [
  { value: 'FSC', label: 'FSC' },
  { value: 'PEFC', label: 'PEFC' }
]; // Option cho checkbox Chứng chỉ

export const TREE_TYPE_OPTIONS: { value: TreeType; label: string }[] = [
  { value: 'keo', label: 'Keo' },
  { value: 'bach-dan', label: 'Bạch đàn' },
  { value: 'thong', label: 'Thông' },
  { value: 'other', label: 'Khác' }
]; // Option cho dropdown Loại cây trồng

export const STATUS_OPTIONS: { value: EntityStatus; label: string }[] = [
  { value: 'active', label: 'Hoạt động' },
  { value: 'inactive', label: 'Tạm ngưng' }
]; // Option cho dropdown Trạng thái

export const PROVINCE_OPTIONS: { value: string; label: string }[] = [
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
]; // Option cho dropdown Tỉnh/Khu vực

export const PARTNER_OPTIONS: { value: string; label: string }[] = [
  { value: 'partner-001', label: 'Công ty Đối tác A' },
  { value: 'partner-002', label: 'Công ty Đối tác B' },
  { value: 'partner-003', label: 'Hộ gia đình Nguyễn Văn C' },
  { value: 'partner-004', label: 'HTX Lâm nghiệp D' },
  { value: 'partner-005', label: 'Công ty Lâm sản E' }
]; // Option cho dropdown Đối tác (mock data)

export const CURRENT_YEAR = new Date().getFullYear(); // Current year for year picker max value
export const MIN_PLANTING_YEAR = 1950; // Minimum planting year (reasonable range)

// Route path segments (for route config)
export const FOREST_AREA_PATHS = {
  ROOT: '/forest-areas',
  LIST: '',
  NEW: 'new',
  MAP: 'map',
  DETAIL: ':id',
  EDIT: ':id/edit'
} as const;

// Full URLs (for navigation)
export const FOREST_AREA_URLS = {
  LIST: FOREST_AREA_PATHS.ROOT,
  NEW: `${FOREST_AREA_PATHS.ROOT}/${FOREST_AREA_PATHS.NEW}`,
  MAP: `${FOREST_AREA_PATHS.ROOT}/${FOREST_AREA_PATHS.MAP}`,
  DETAIL: (id: string) => `${FOREST_AREA_PATHS.ROOT}/${id}`,
  EDIT: (id: string) => `${FOREST_AREA_PATHS.ROOT}/${id}/edit`
} as const;
