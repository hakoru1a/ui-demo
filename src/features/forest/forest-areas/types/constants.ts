// ==============================|| FOREST AREAS CONSTANTS ||============================== //

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
