// ==============================|| EXPORT DOCUMENTS FORM TYPES ||============================== //

import type { DocumentType, DocumentStatus } from './enums';

export interface ExportDocumentFormData {
  documentNo: string; // Mã chứng từ (Auto-generate, Read-only)
  documentType: DocumentType; // Loại chứng từ - Required, Default: 'invoice'
  exportOrderId: string; // ID đơn hàng XK - Required
  customerId: string; // ID khách hàng (Auto, Read-only)
  customerName?: string; // Tên khách hàng (for display)
  invoiceDate: Date | string; // Ngày hóa đơn - Required, Default: Today
  currency: string; // Tiền tệ - Required, Default: 'USD'
  totalAmount: number; // Tổng giá trị (Auto từ đơn hàng) - Required
  packageCount?: number; // Số kiện (Conditional: bắt buộc với Packing List)
  grossWeight?: number; // Trọng lượng gross (Conditional)
  netWeight?: number; // Trọng lượng net (Conditional)
  hsCode?: string; // HS Code
  attachment?: string | File; // File chứng từ (PDF/Scan)
  status: DocumentStatus; // Trạng thái - Required, Default: 'draft'
}
