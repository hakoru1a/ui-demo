// ==============================|| TRAINING & SAFETY CONSTANTS ||============================== //

import type { TrainingType, TrainingStatus, Department } from './enums';

export const TRAINING_TYPE_OPTIONS: { value: TrainingType; label: string }[] = [
  { value: 'skill', label: 'Kỹ năng' },
  { value: 'safety', label: 'An toàn' }
]; // Option cho dropdown Loại đào tạo

export const TRAINING_STATUS_OPTIONS: { value: TrainingStatus; label: string }[] = [
  { value: 'open', label: 'Đang mở' },
  { value: 'completed', label: 'Đã hoàn thành' },
  { value: 'cancelled', label: 'Hủy' }
]; // Option cho dropdown Trạng thái

export const DEPARTMENT_OPTIONS: { value: Department; label: string }[] = [
  { value: 'production', label: 'Sản xuất' },
  { value: 'warehouse', label: 'Kho' },
  { value: 'qc', label: 'QC' },
  { value: 'hr', label: 'Nhân sự' },
  { value: 'admin', label: 'Hành chính' }
]; // Option cho dropdown Bộ phận

// Route path segments (for route config)
export const TRAINING_PATHS = {
  ROOT: '/training',
  LIST: '',
  NEW: 'new',
  DETAIL: ':id',
  EDIT: ':id/edit'
} as const;

// Full URLs (for navigation)
export const TRAINING_URLS = {
  LIST: TRAINING_PATHS.ROOT,
  NEW: `${TRAINING_PATHS.ROOT}/${TRAINING_PATHS.NEW}`,
  DETAIL: (id: string) => `${TRAINING_PATHS.ROOT}/${id}`,
  EDIT: (id: string) => `${TRAINING_PATHS.ROOT}/${id}/edit`
} as const;
