// ==============================|| HARVEST PLANS CONSTANTS ||============================== //

import type { HarvestPlanStatus } from './enums';

// Status values constants
export const HARVEST_PLAN_STATUS = {
  DRAFT: 'draft',
  ACTIVE: 'active',
  COMPLETED: 'completed'
} as const;

// Status Filter enum for tabs
export enum HarvestPlanStatusFilter {
  ALL = 'all',
  DRAFT = 'draft',
  ACTIVE = 'active',
  COMPLETED = 'completed'
}

export const HARVEST_PLAN_STATUS_OPTIONS: { value: HarvestPlanStatus; label: string }[] = [
  { value: HARVEST_PLAN_STATUS.DRAFT, label: 'Bản nháp' },
  { value: HARVEST_PLAN_STATUS.ACTIVE, label: 'Đang thực hiện' },
  { value: HARVEST_PLAN_STATUS.COMPLETED, label: 'Hoàn thành' }
]; // Option cho dropdown Trạng thái kế hoạch

// Mock data cho khu vực rừng có FSC
export const FOREST_AREA_OPTIONS: { value: string; label: string; hasFSC: boolean }[] = [
  { value: 'fa-001', label: 'Khu vực rừng Đắk Lắk - FSC', hasFSC: true },
  { value: 'fa-002', label: 'Khu vực rừng Gia Lai - FSC', hasFSC: true },
  { value: 'fa-003', label: 'Khu vực rừng Kon Tum - FSC', hasFSC: true },
  { value: 'fa-004', label: 'Khu vực rừng Lâm Đồng - FSC', hasFSC: true },
  { value: 'fa-005', label: 'Khu vực rừng Đắk Nông - FSC', hasFSC: true }
]; // Option cho dropdown Khu vực rừng (chỉ hiển thị các khu vực có FSC)

// Route path segments (for route config)
export const HARVEST_PLAN_PATHS = {
  ROOT: '/harvest-plans',
  LIST: '',
  NEW: 'new',
  DETAIL: ':id',
  EDIT: ':id/edit'
} as const;

// Full URLs (for navigation)
export const HARVEST_PLAN_URLS = {
  LIST: HARVEST_PLAN_PATHS.ROOT,
  NEW: `${HARVEST_PLAN_PATHS.ROOT}/${HARVEST_PLAN_PATHS.NEW}`,
  DETAIL: (id: string) => `${HARVEST_PLAN_PATHS.ROOT}/${id}`,
  EDIT: (id: string) => `${HARVEST_PLAN_PATHS.ROOT}/${id}/edit`
} as const;
