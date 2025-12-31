// ==============================|| EXPORT ORDERS ENTITY ||============================== //

import type { ExportOrderStatus, Incoterms } from './enums';

export interface ExportOrder {
  id: string; // ID đơn hàng
  orderNo: string; // Mã đơn hàng
  orderDate: Date | string; // Ngày đơn hàng
  customerId: string; // ID khách hàng
  customerName?: string; // Tên khách hàng (for display)
  country: string; // Quốc gia
  totalValue: number; // Tổng giá trị (theo ngoại tệ)
  currency: string; // Tiền tệ
  incoterms: Incoterms; // Incoterms: FOB / CIF / EXW...
  status: ExportOrderStatus; // Trạng thái: Nháp / Đã xác nhận / Đang giao / Hoàn tất
  createdAt?: Date | string; // Ngày tạo
  updatedAt?: Date | string; // Ngày cập nhật
}
