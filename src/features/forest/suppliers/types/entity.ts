// ==============================|| SUPPLIERS ENTITY ||============================== //

import type { EntityStatus } from 'types/status';

import type { SupplierType, CertificateType, TransactionType, TransactionStatus } from './enums';

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
  status: EntityStatus; // Trạng thái: Hoạt động / Ngưng hợp tác
  certificates: CertificateType[]; // Chứng chỉ: FSC / PEFC
  averageMonthlyYield?: number; // Sản lượng TB/tháng (m³)
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
