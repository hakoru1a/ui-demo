// ==============================|| HR CONSTANTS ||============================== //

import type { Department, ContractType, EmployeeStatus } from './enums';

export const DEPARTMENT_OPTIONS: { value: Department; label: string }[] = [
  { value: 'production', label: 'Sản xuất' },
  { value: 'warehouse', label: 'Kho' },
  { value: 'qc', label: 'QC' }
]; // Option cho dropdown Bộ phận

export const CONTRACT_TYPE_OPTIONS: { value: ContractType; label: string }[] = [
  { value: 'probation', label: 'Thử việc' },
  { value: 'temporary', label: 'Thời vụ' },
  { value: 'permanent', label: 'Dài hạn' }
]; // Option cho dropdown Loại hợp đồng

export const STATUS_OPTIONS: { value: EmployeeStatus; label: string }[] = [
  { value: 'active', label: 'Đang làm' },
  { value: 'inactive', label: 'Nghỉ việc' }
]; // Option cho dropdown Trạng thái

// Route path segments (for route config)
export const EMPLOYEE_PATHS = {
  ROOT: '/hr/employees',
  LIST: '',
  NEW: 'new',
  DETAIL: ':id',
  EDIT: ':id/edit'
} as const;

// Full URLs (for navigation)
export const EMPLOYEE_URLS = {
  LIST: EMPLOYEE_PATHS.ROOT,
  NEW: `${EMPLOYEE_PATHS.ROOT}/${EMPLOYEE_PATHS.NEW}`,
  DETAIL: (id: string) => `${EMPLOYEE_PATHS.ROOT}/${id}`,
  EDIT: (id: string) => `${EMPLOYEE_PATHS.ROOT}/${id}/edit`
} as const;

// Contract expiry warning threshold (days)
export const CONTRACT_EXPIRY_WARNING_DAYS = 30; // Highlight contracts expiring within 30 days
