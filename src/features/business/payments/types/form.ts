// ==============================|| PAYMENT ORDER FORM TYPES ||============================== //

import type { PaymentOrderType, PaymentOrderStatus, PaymentMethod, PartnerType } from './enums';

export interface PaymentOrderFormData {
  code: string; // Mã PO (Auto-generate, Read-only)
  type: PaymentOrderType; // Loại phiếu - Required, Default: 'payment'
  partnerType: PartnerType; // Đối tác - Required
  partnerId: string; // ID đối tác - Required
  contractId?: string; // ID hợp đồng liên quan
  paymentAmount: number; // Số tiền - Required, > 0
  currency: string; // Tiền tệ - Required, Default: 'VND'
  paymentMethod: PaymentMethod; // Phương thức - Required
  paymentDate: Date | string; // Ngày thanh toán - Required, Default: Today
  description?: string; // Nội dung chi
  attachment?: string | File; // File chứng từ (Hóa đơn / UNC)
  status: PaymentOrderStatus; // Trạng thái - Required, Default: 'draft'
}
