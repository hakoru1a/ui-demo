// ==============================|| EXPORT DOCUMENTS ENTITY ||============================== //

import type { DocumentType, DocumentStatus } from './enums';

export interface ExportDocument {
  id: string; // ID chứng từ
  documentNo: string; // Mã chứng từ (Auto-generate, Read-only)
  documentType: DocumentType; // Loại chứng từ: Invoice / Packing List
  exportOrderId: string; // ID đơn hàng XK
  exportOrderNo?: string; // Mã đơn hàng XK (for display)
  customerId: string; // ID khách hàng
  customerName?: string; // Tên khách hàng (for display)
  invoiceDate: Date | string; // Ngày hóa đơn
  currency: string; // Tiền tệ
  totalAmount: number; // Tổng giá trị (lấy từ đơn hàng)
  packageCount?: number; // Số kiện (bắt buộc với Packing List)
  grossWeight?: number; // Trọng lượng gross
  netWeight?: number; // Trọng lượng net
  hsCode?: string; // HS Code
  attachment?: string; // File chứng từ (URL)
  status: DocumentStatus; // Trạng thái: Nháp / Phát hành
  createdAt?: Date | string; // Ngày tạo
  updatedAt?: Date | string; // Ngày cập nhật
}
