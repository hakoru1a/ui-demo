// ==============================|| SUPPLIERS FORM TYPES ||============================== //

import type { SupplierType, CertificateType, TransactionType, TransactionStatus, SupplierStatus } from './enums';

export interface SupplierFormData {
  code: string; // Mã nhà cung cấp (Auto-generate, Read-only)
  name: string; // Tên nhà cung cấp - Required
  type: SupplierType; // Loại nhà cung cấp - Required
  representative?: string; // Người đại diện - Required nếu type = 'business'
  phone: string; // Số điện thoại - Required, Validate format
  email?: string; // Email
  address?: string; // Địa chỉ
  region: string; // Khu vực cung cấp - Required
  status: SupplierStatus; // Trạng thái - Required, Default: 'pending'
  certificates: CertificateType[]; // Chứng chỉ: FSC / PEFC
  idCardNumber?: string; // Số CCCD/Passport - Required
  idCardIssueDate?: Date | string; // Ngày cấp - Required
  idCardIssuePlace?: string; // Nơi cấp - Required
  idCardImage?: string | File; // Hình CCCD - Required
  landCertificateImage?: string | File; // Hình ảnh sổ đỏ
  notes?: string; // Ghi chú
}

export interface SupplierTransactionHistoryFilters {
  supplierId?: string; // Nhà cung cấp - Required (default from supplier)
  startDate?: Date | string; // Thời gian giao dịch - Từ ngày
  endDate?: Date | string; // Thời gian giao dịch - Đến ngày
  type?: TransactionType; // Loại giao dịch
  status?: TransactionStatus; // Trạng thái
}
