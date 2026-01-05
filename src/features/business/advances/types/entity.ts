// ==============================|| ADVANCE ENTITY ||============================== //

import type { AdvanceStatus } from './enums';

export interface Advance {
  id: string; // ID phiếu tạm ứng
  code: string; // Mã tạm ứng (Auto-generate, Read-only)
  requesterId: string; // ID người đề nghị
  requesterName: string; // Tên người đề nghị (for display)
  requestedDate: Date | string; // Ngày đề nghị
  requestedAmount: number; // Số tiền (> 0)
  purpose: string; // Mục đích
  status: AdvanceStatus; // Trạng thái: Chờ duyệt / Đã duyệt / Từ chối
  approvalDecision?: 'approve' | 'reject'; // Quyết định phê duyệt
  comment?: string; // Ý kiến phê duyệt
  approvalDate?: Date | string; // Ngày duyệt
  createdAt?: Date | string; // Ngày lập
  updatedAt?: Date | string; // Ngày cập nhật
}
