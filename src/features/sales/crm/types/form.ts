// ==============================|| CUSTOMER CRM FORM TYPES ||============================== //

import type { CustomerStatus, PaymentTerms } from './enums';

export interface CustomerFormData {
  code: string; // Mã KH (Auto-generate, Read-only)
  companyName: string; // Tên công ty - Required
  country: string; // Quốc gia - Required
  address: string; // Địa chỉ - Required
  taxCode?: string; // Mã thuế
  contactPerson: string; // Người liên hệ - Required
  email: string; // Email - Required, Validate format
  phone?: string; // Số điện thoại
  currency: string; // Tiền tệ giao dịch - Required, Default: USD
  paymentTerms?: PaymentTerms; // Điều khoản thanh toán
  creditLimit?: number; // Hạn mức tín dụng
  status: CustomerStatus; // Trạng thái - Required, Default: 'active'
  notes?: string; // Ghi chú
}
