// ==============================|| EXPORT ORDERS FORM TYPES ||============================== //

import type { ExportOrderStatus, Incoterms } from './enums';

export interface ExportOrderFormData {
  orderNo: string; // Mã đơn hàng (Auto-generate, Read-only)
  orderDate: Date | string; // Ngày đơn hàng - Required
  customerId: string; // ID khách hàng - Required
  country: string; // Quốc gia - Required
  totalValue: number; // Tổng giá trị - Required
  currency: string; // Tiền tệ - Required
  incoterms: Incoterms; // Incoterms - Required
  status: ExportOrderStatus; // Trạng thái - Required, Default: 'draft'
}
