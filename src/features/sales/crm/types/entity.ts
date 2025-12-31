// ==============================|| CUSTOMER CRM ENTITY ||============================== //

import type { CustomerStatus, PaymentTerms } from './enums';

export interface Customer {
  id: string; // ID khách hàng
  code: string; // Mã KH (Auto-generate, Read-only)
  companyName: string; // Tên công ty
  country: string; // Quốc gia
  address: string; // Địa chỉ
  taxCode?: string; // Mã thuế (Theo quốc gia)
  contactPerson: string; // Người liên hệ
  email: string; // Email (Validate format)
  phone?: string; // Số điện thoại
  currency: string; // Tiền tệ giao dịch (Default: USD)
  paymentTerms?: PaymentTerms; // Điều khoản thanh toán: T/T, L/C...
  creditLimit?: number; // Hạn mức tín dụng
  status: CustomerStatus; // Trạng thái: Active / Inactive (Default: Active)
  notes?: string; // Ghi chú
  createdAt?: Date | string; // Ngày tạo
  updatedAt?: Date | string; // Ngày cập nhật
}
