// ==============================|| SUPPLIERS ENTITY ||============================== //

import type { SupplierType, CertificateType, TransactionType, TransactionStatus, SupplierStatus } from './enums';

export interface Supplier {
  id: string; // ID nhà cung cấp
  code: string; // Mã nhà cung cấp (Auto-generate, Read-only)
  name: string; // Tên nhà cung cấp
  type: SupplierType; // Loại nhà cung cấp: Cá nhân / Doanh nghiệp
  representative?: string; // Người đại diện (Bắt buộc nếu là Doanh nghiệp)
  phone: string; // Số điện thoại
  email?: string; // Email
  address?: string; // Địa chỉ
  region: string; // Khu vực cung cấp (Tỉnh / Vùng)
  status: SupplierStatus; // Trạng thái: Chờ duyệt / Hoạt động / Tạm ngưng / Từ chối
  certificates: CertificateType[]; // Chứng chỉ: FSC / PEFC
  idCardNumber?: string; // Số CCCD/Passport
  idCardIssueDate?: Date | string; // Ngày cấp
  idCardIssuePlace?: string; // Nơi cấp
  idCardImage?: string | File; // Hình CCCD
  landCertificateImage?: string | File; // Hình ảnh sổ đỏ
  notes?: string; // Ghi chú
  createdAt?: Date | string; // Ngày tạo
  updatedAt?: Date | string; // Ngày cập nhật
}

export interface SupplierTransaction {
  id: string; // ID giao dịch
  code: string; // Mã giao dịch
  supplierId: string; // ID nhà cung cấp
  supplierName?: string; // Tên nhà cung cấp (for display)
  transactionDate: Date | string; // Ngày giao dịch
  type: TransactionType; // Loại giao dịch: Nhập gỗ / Điều chỉnh
  quantity: number; // Sản lượng (m³)
  estimatedUnitPrice?: number; // Đơn giá ước tính
  estimatedTotal?: number; // Tổng ước tính
  status: TransactionStatus; // Trạng thái: Hoàn thành / Hủy
  createdAt?: Date | string; // Ngày tạo
  updatedAt?: Date | string; // Ngày cập nhật
}
