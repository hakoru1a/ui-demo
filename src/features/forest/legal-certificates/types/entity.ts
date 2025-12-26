// ==============================|| LEGAL CERTIFICATES ENTITY ||============================== //

import type { CertificateStatus, CertificateType, RenewalStatus } from './enums';

export interface LegalCertificate {
  id: string; // ID chứng chỉ
  certificateType: CertificateType; // Loại chứng chỉ: FSC / PEFC
  certificateNumber: string; // Số chứng chỉ
  issuingOrganization: string; // Tổ chức cấp
  issueDate: Date | string; // Ngày cấp
  expiryDate: Date | string; // Ngày hết hạn
  certificateFile?: string; // URL file chứng chỉ (PDF / Image)
  certificateFileName?: string; // Tên file
  status: CertificateStatus; // Trạng thái hiệu lực (Auto - dựa trên ngày)
  legalNotes?: string; // Ghi chú pháp lý
  createdAt?: Date | string; // Ngày tạo
  updatedAt?: Date | string; // Ngày cập nhật
  createdBy?: string; // Người tạo
  updatedBy?: string; // Người cập nhật
}

export interface CertificateRenewal {
  id: string; // ID yêu cầu gia hạn
  certificateId: string; // ID chứng chỉ
  status: RenewalStatus; // Trạng thái: Yêu cầu / Đang duyệt / Duyệt thành công
  requestedDate: Date | string; // Ngày yêu cầu
  requestedBy?: string; // Người yêu cầu
  reviewDate?: Date | string; // Ngày duyệt
  reviewedBy?: string; // Người duyệt
  approvedDate?: Date | string; // Ngày phê duyệt
  approvedBy?: string; // Người phê duyệt
  newExpiryDate?: Date | string; // Ngày hết hạn mới (sau khi gia hạn)
  notes?: string; // Ghi chú
  certificateFile?: string; // File chứng chỉ mới (nếu có)
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

export interface CertificateApprovalHistory {
  id: string; // ID lịch sử
  certificateId: string; // ID chứng chỉ
  action: 'created' | 'renewed' | 'updated' | 'approved'; // Hành động
  actionDate: Date | string; // Ngày thực hiện
  performedBy?: string; // Người thực hiện
  notes?: string; // Ghi chú
  renewalId?: string; // ID yêu cầu gia hạn (nếu là gia hạn)
  previousExpiryDate?: Date | string; // Ngày hết hạn trước đó
  newExpiryDate?: Date | string; // Ngày hết hạn mới
}
