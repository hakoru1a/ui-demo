// ==============================|| PRICE ENGINE CONSTANTS ||============================== //

import type { EntityStatus } from 'types/status';

import type { MaterialType } from './enums';

export const MATERIAL_TYPE_OPTIONS: { value: MaterialType; label: string }[] = [
  { value: 'keo', label: 'Gỗ keo' },
  { value: 'tram', label: 'Gỗ tràm' },
  { value: 'other', label: 'Khác' }
]; // Option cho dropdown Loại nguyên liệu

export const STATUS_OPTIONS: { value: EntityStatus; label: string }[] = [
  { value: 'active', label: 'Hoạt động' },
  { value: 'inactive', label: 'Tạm ngưng' }
]; // Option cho dropdown Trạng thái

// Route path segments (for route config)
export const PRICE_TABLE_PATHS = {
  ROOT: '/price-engine',
  LIST: '',
  NEW: 'new',
  DETAIL: ':id',
  EDIT: ':id/edit'
} as const;

// Full URLs (for navigation)
export const PRICE_TABLE_URLS = {
  LIST: PRICE_TABLE_PATHS.ROOT,
  NEW: `${PRICE_TABLE_PATHS.ROOT}/${PRICE_TABLE_PATHS.NEW}`,
  DETAIL: (id: string) => `${PRICE_TABLE_PATHS.ROOT}/${id}`,
  EDIT: (id: string) => `${PRICE_TABLE_PATHS.ROOT}/${id}/edit`
} as const;
