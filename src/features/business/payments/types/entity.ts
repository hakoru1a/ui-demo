// ==============================|| PAYMENT ORDER ENTITY ||============================== //

import type { PaymentOrderType, PaymentOrderStatus, PaymentMethod, PartnerType } from './enums';

export interface PaymentOrder {
  id: string; // ID phiếu chi
  code: string; // Mã PO (Auto-generate, Read-only)
  type: PaymentOrderType; // Loại phiếu: Thanh toán / Chi
  partnerType: PartnerType; // Đối tác: Khách hàng / NCC
  partnerId: string; // ID đối tác
  partnerName: string; // Tên đối tác (for display)
  contractId?: string; // ID hợp đồng liên quan
  contractCode?: string; // Mã hợp đồng (for display)
  paymentAmount: number; // Số tiền (> 0)
  currency: string; // Tiền tệ (Default: VND)
  paymentMethod: PaymentMethod; // Phương thức: Tiền mặt / Chuyển khoản
  paymentDate: Date | string; // Ngày thanh toán
  description?: string; // Nội dung chi
  attachment?: string; // URL file chứng từ (Hóa đơn / UNC)
  status: PaymentOrderStatus; // Trạng thái: Nháp / Chờ duyệt / Đã thanh toán
  createdAt?: Date | string; // Ngày lập
  updatedAt?: Date | string; // Ngày cập nhật
}
