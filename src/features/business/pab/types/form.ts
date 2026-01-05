// ==============================|| PAB FORM TYPES ||============================== //

import type { PabStatus, PabUnit, ApprovalLayer, ApprovalDecision, TransactionStatus } from './enums';

// Form data cho PAB (SD-1-1)
export interface PabFormData {
  code: string; // Mã PAB (Auto-generate, Read-only)
  customerId: string; // Khách hàng - Required
  productId: string; // Sản phẩm/Nguyên liệu - Required
  quantity: number; // Số lượng - Required, > 0
  unit: PabUnit; // Đơn vị - Required, Default: 'ton'
  expectedDeliveryDate: Date | string; // Ngày giao dự kiến - Required
  estimatedCost: number; // Chi phí ước tính - Required, Default: 0
  estimatedTime: number; // Thời gian thực hiện (ngày) - Required
  margin?: number; // Biên lợi nhuận (%) - Optional
  notes?: string; // Ghi chú - Optional
  status: PabStatus; // Trạng thái - Required, Default: 'draft'
}

// Form data cho phê duyệt (SD-1-2)
export interface PabApprovalFormData {
  pabCode: string; // Mã PAB - Read-only
  approvalLayer: ApprovalLayer; // Cấp duyệt - Required, Auto
  approverId: string; // Người duyệt - Required, Current User
  decision: ApprovalDecision; // Quyết định - Required
  comment?: string; // Ý kiến - Optional, Required if rejected
  approvalDate: Date | string; // Ngày duyệt - Required, Today
}

// Form data cho cập nhật trạng thái giao dịch (SD-1-3)
export interface PabTransactionFormData {
  pabCode: string; // Mã PAB - Read-only
  contractRef?: string; // Hợp đồng - Optional
  transactionStatus: TransactionStatus; // Trạng thái giao dịch - Required
  relatedOrderIds?: string[]; // Đơn liên quan - Optional
  notes?: string; // Ghi chú - Optional
}
