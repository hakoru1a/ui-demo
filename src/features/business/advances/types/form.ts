// ==============================|| ADVANCE FORM TYPES ||============================== //

import type { AdvanceStatus, ApprovalDecision } from './enums';

export interface AdvanceFormData {
  code: string; // Mã tạm ứng (Auto-generate, Read-only)
  requesterId: string; // ID người đề nghị - Required
  requestedDate: Date | string; // Ngày đề nghị - Required
  requestedAmount: number; // Số tiền - Required, > 0
  purpose: string; // Mục đích - Required
  status: AdvanceStatus; // Trạng thái - Required, Default: 'pending'
}

export interface AdvanceApprovalFormData {
  code: string; // Mã tạm ứng - Read-only
  requesterName: string; // Người đề nghị - Read-only
  requestedAmount: number; // Số tiền - Read-only
  purpose: string; // Mục đích - Read-only
  approvalDecision: ApprovalDecision; // Quyết định - Required
  comment?: string; // Ý kiến - Conditional (Required if reject)
  approvalDate: Date | string; // Ngày duyệt - Required, Default: Today
  status: AdvanceStatus; // Trạng thái - Auto
}
