// ==============================|| FOREST AREAS CONSTANTS ||============================== //

import type { OwnershipType, ForestAreaStatus, CertificateType, TreeType } from './enums';

export const OWNERSHIP_TYPE_OPTIONS: { value: OwnershipType; label: string }[] = [
  { value: 'company', label: 'Công ty' },
  { value: 'partner', label: 'Đối tác' }
]; // Option cho dropdown Loại sở hữu

export const STATUS_OPTIONS: { value: ForestAreaStatus; label: string }[] = [
  { value: 'active', label: 'Hoạt động' },
  { value: 'inactive', label: 'Tạm ngưng' }
]; // Option cho dropdown Trạng thái

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

export const DEFAULT_STATUS: ForestAreaStatus = 'active'; // Default status value
export const CURRENT_YEAR = new Date().getFullYear(); // Current year for year picker max value
export const MIN_PLANTING_YEAR = 1950; // Minimum planting year (reasonable range)
