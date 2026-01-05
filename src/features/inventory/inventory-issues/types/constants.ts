// ==============================|| INVENTORY ISSUES CONSTANTS ||============================== //

import type { IssueType, IssueStatus, DestinationType } from './enums';

export const ISSUE_TYPE_OPTIONS: { value: IssueType; label: string }[] = [
  { value: 'warehouse', label: 'Xuất kho' },
  { value: 'port', label: 'Xuất cảng' }
]; // Option cho dropdown Loại xuất

export const ISSUE_STATUS_OPTIONS: { value: IssueStatus; label: string }[] = [
  { value: 'draft', label: 'Nháp' },
  { value: 'issued', label: 'Đã xuất' },
  { value: 'cancelled', label: 'Hủy' }
]; // Option cho dropdown Trạng thái phiếu

export const DESTINATION_TYPE_OPTIONS: { value: DestinationType; label: string }[] = [
  { value: 'warehouse', label: 'Kho nội bộ' },
  { value: 'port', label: 'Cảng' }
]; // Option cho dropdown Điểm nhận

// Mock data options (sẽ được thay thế bằng API calls)
export const WAREHOUSE_OPTIONS: { value: string; label: string }[] = [
  { value: 'wh-001', label: 'Kho A - Hà Nội' },
  { value: 'wh-002', label: 'Kho B - Hồ Chí Minh' },
  { value: 'wh-003', label: 'Kho C - Đà Nẵng' },
  { value: 'wh-004', label: 'Kho D - Cần Thơ' }
]; // Option cho dropdown Kho xuất

export const DESTINATION_WAREHOUSE_OPTIONS: { value: string; label: string }[] = [
  { value: 'dest-wh-001', label: 'Kho nội bộ 1' },
  { value: 'dest-wh-002', label: 'Kho nội bộ 2' },
  { value: 'dest-wh-003', label: 'Kho nội bộ 3' }
]; // Option cho dropdown Điểm nhận (Kho)

export const DESTINATION_PORT_OPTIONS: { value: string; label: string }[] = [
  { value: 'port-001', label: 'Cảng Hải Phòng' },
  { value: 'port-002', label: 'Cảng Sài Gòn' },
  { value: 'port-003', label: 'Cảng Đà Nẵng' }
]; // Option cho dropdown Điểm nhận (Cảng)

export const CUSTOMER_OPTIONS: { value: string; label: string }[] = [
  { value: 'cust-001', label: 'Công ty A' },
  { value: 'cust-002', label: 'Công ty B' },
  { value: 'cust-003', label: 'Công ty C' }
]; // Option cho dropdown Khách hàng / Đơn vị nhận

export const PRODUCT_OPTIONS: { value: string; label: string }[] = [
  { value: 'prod-001', label: 'Gỗ keo (kg)' },
  { value: 'prod-002', label: 'Gỗ bạch đàn (kg)' },
  { value: 'prod-003', label: 'Nguyên liệu A (kg)' },
  { value: 'prod-004', label: 'Nguyên liệu B (kg)' }
]; // Option cho dropdown Sản phẩm / Nguyên liệu

export const BATCH_OPTIONS: { value: string; label: string }[] = [
  { value: 'batch-001', label: 'Lô SX-2024-001' },
  { value: 'batch-002', label: 'Lô SX-2024-002' },
  { value: 'batch-003', label: 'Lô SX-2024-003' }
]; // Option cho dropdown Lô SX

// Route path segments (for route config)
export const INVENTORY_ISSUE_PATHS = {
  ROOT: '/inventory-issues',
  LIST: '',
  NEW: 'new',
  DETAIL: ':id',
  EDIT: ':id/edit'
} as const;

// Full URLs (for navigation)
export const INVENTORY_ISSUE_URLS = {
  LIST: INVENTORY_ISSUE_PATHS.ROOT,
  NEW: `${INVENTORY_ISSUE_PATHS.ROOT}/${INVENTORY_ISSUE_PATHS.NEW}`,
  DETAIL: (id: string) => `${INVENTORY_ISSUE_PATHS.ROOT}/${id}`,
  EDIT: (id: string) => `${INVENTORY_ISSUE_PATHS.ROOT}/${id}/edit`
} as const;
