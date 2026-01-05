// ==============================|| PAB CONSTANTS ||============================== //

import type { PabStatus, PabUnit, ApprovalLayer, ApprovalDecision, TransactionStatus } from './enums';

// Options cho dropdown Trạng thái PAB
export const PAB_STATUS_OPTIONS: { value: PabStatus; label: string }[] = [
  { value: 'draft', label: 'Nháp' },
  { value: 'pending-approval', label: 'Chờ duyệt' },
  { value: 'approved', label: 'Đã duyệt' },
  { value: 'rejected', label: 'Từ chối' },
  { value: 'cancelled', label: 'Hủy' }
];

// Options cho dropdown Đơn vị
export const PAB_UNIT_OPTIONS: { value: PabUnit; label: string }[] = [
  { value: 'ton', label: 'Tấn' },
  { value: 'kg', label: 'Kilogram' },
  { value: 'm3', label: 'Mét khối' },
  { value: 'piece', label: 'Cái' }
];

// Options cho dropdown Cấp duyệt
export const APPROVAL_LAYER_OPTIONS: { value: ApprovalLayer; label: string }[] = [
  { value: 'business', label: 'Kinh doanh' },
  { value: 'finance', label: 'Tài chính' },
  { value: 'management', label: 'BLĐ' }
];

// Options cho dropdown Quyết định duyệt
export const APPROVAL_DECISION_OPTIONS: { value: ApprovalDecision; label: string }[] = [
  { value: 'approved', label: 'Duyệt' },
  { value: 'rejected', label: 'Từ chối' }
];

// Options cho dropdown Trạng thái giao dịch
export const TRANSACTION_STATUS_OPTIONS: { value: TransactionStatus; label: string }[] = [
  { value: 'negotiating', label: 'Đàm phán' },
  { value: 'confirmed', label: 'Đã chốt' },
  { value: 'cancelled', label: 'Hủy' }
];

// Mock data cho dropdown Khách hàng
export const CUSTOMER_OPTIONS: { value: string; label: string }[] = [
  { value: 'customer-001', label: 'Công ty A' },
  { value: 'customer-002', label: 'Công ty B' },
  { value: 'customer-003', label: 'Công ty C' },
  { value: 'customer-004', label: 'Công ty D' },
  { value: 'customer-005', label: 'Công ty E' }
];

// Mock data cho dropdown Sản phẩm/Nguyên liệu
export const PRODUCT_OPTIONS: { value: string; label: string }[] = [
  { value: 'product-001', label: 'Gỗ keo' },
  { value: 'product-002', label: 'Gỗ bạch đàn' },
  { value: 'product-003', label: 'Gỗ thông' },
  { value: 'product-004', label: 'Ván ép' },
  { value: 'product-005', label: 'Bột giấy' }
];

// Route path segments
export const PAB_PATHS = {
  ROOT: '/pab',
  LIST: '',
  NEW: 'new',
  DETAIL: ':id',
  EDIT: ':id/edit',
  APPROVAL: ':id/approval',
  TRANSACTION: ':id/transaction',
  REPORTS: 'reports'
} as const;

// Full URLs (for navigation)
export const PAB_URLS = {
  LIST: PAB_PATHS.ROOT,
  NEW: `${PAB_PATHS.ROOT}/${PAB_PATHS.NEW}`,
  DETAIL: (id: string) => `${PAB_PATHS.ROOT}/${id}`,
  EDIT: (id: string) => `${PAB_PATHS.ROOT}/${id}/edit`,
  APPROVAL: (id: string) => `${PAB_PATHS.ROOT}/${id}/approval`,
  TRANSACTION: (id: string) => `${PAB_PATHS.ROOT}/${id}/transaction`,
  REPORTS: `${PAB_PATHS.ROOT}/${PAB_PATHS.REPORTS}`
} as const;
