// ==============================|| MATERIAL RECEIPTS FORM TYPES ||============================== //

import type { ReceiptStatus, MaterialType } from './enums';

export interface MaterialReceiptFormData {
  code: string; // Mã phiếu nhập (Auto-generate, Read-only)
  receiptDate: Date | string; // Ngày nhập kho - Required, Default: Today
  supplierId: string; // Nhà cung cấp - Required
  warehouseId: string; // Kho nhập - Required
  materialType: MaterialType; // Loại nguyên liệu - Required
  quantity: number; // Khối lượng (kg) - Required, > 0
  unitPrice?: number; // Đơn giá ước tính - Optional, Auto (tham chiếu bảng giá)
  totalValue?: number; // Tổng giá trị ước tính (Auto) - Optional, Auto (Quantity × Price)
  referenceDoc?: string | File; // Chứng từ - Optional (PDF / Image)
  status: ReceiptStatus; // Trạng thái - Required, Default: 'draft'
  notes?: string; // Ghi chú - Optional
}
