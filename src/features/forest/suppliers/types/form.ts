// ==============================|| SUPPLIERS FORM TYPES ||============================== //

import type { EntityStatus } from 'types/status';

import type { SupplierType, CertificateType, TransactionType, TransactionStatus } from './enums';

export interface SupplierFormData {
  code: string; // Mã nhà cung cấp (Auto-generate, Read-only)
  name: string; // Tên nhà cung cấp - Required
  type: SupplierType; // Loại nhà cung cấp - Required
  representative?: string; // Người đại diện - Required nếu type = 'business'
  phone: string; // Số điện thoại - Required, Validate format
  email?: string; // Email
  address?: string; // Địa chỉ
  region: string; // Khu vực cung cấp - Required
  status: EntityStatus; // Trạng thái - Required, Default: 'active'
  certificates: CertificateType[]; // Chứng chỉ: FSC / PEFC
  notes?: string; // Ghi chú
}

export interface SupplierTransactionHistoryFilters {
  supplierId?: string; // Nhà cung cấp - Required (default from supplier)
  startDate?: Date | string; // Thời gian giao dịch - Từ ngày
  endDate?: Date | string; // Thời gian giao dịch - Đến ngày
  type?: TransactionType; // Loại giao dịch
  status?: TransactionStatus; // Trạng thái
}
