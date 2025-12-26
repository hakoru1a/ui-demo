// ==============================|| LEGAL CERTIFICATES FORM TYPES ||============================== //

import type { CertificateType } from './enums';

export interface LegalCertificateFormData {
  certificateType: CertificateType; // Loại chứng chỉ - Required
  certificateNumber: string; // Số chứng chỉ - Required
  issuingOrganization: string; // Tổ chức cấp - Required
  issueDate: Date | string; // Ngày cấp - Required
  expiryDate: Date | string; // Ngày hết hạn - Required
  certificateFile?: File | string; // File chứng chỉ - Required (File object khi upload, string URL khi edit)
  legalNotes?: string; // Ghi chú pháp lý
}

export interface CertificateRenewalFormData {
  newExpiryDate: Date | string; // Ngày hết hạn mới - Required
  certificateFile?: File | string; // File chứng chỉ mới (nếu có)
  notes?: string; // Ghi chú
}
