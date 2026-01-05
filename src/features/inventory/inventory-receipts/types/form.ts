// ==============================|| INVENTORY RECEIPT FORM TYPES ||============================== //

import type { CustomFile } from 'types/dropzone';

import type { ReceiptStatus, ReceiptSource, ReceiptType } from './enums';

export interface InventoryReceiptFormData {
  code: string; // Mã phiếu nhập (Auto-generate, Read-only)
  receiptDate: Date | string; // Ngày nhập - Required, Default: Today
  receiptType: ReceiptType; // Loại nhập: Nguyên liệu / Thành phẩm - Required, Default: 'material'
  warehouseId: string; // ID kho nhập - Required
  productId: string; // ID hàng hóa - Required
  batchId?: string; // ID lô - Optional (Traceability)
  quantity: number; // Số lượng - Required, > 0
  unit: string; // Đơn vị - Required, Default: 'Kg'
  source?: ReceiptSource; // Nguồn nhập: SX / Mua ngoài - Optional
  referenceDoc?: CustomFile[]; // Chứng từ (File Upload) - Optional
  status: ReceiptStatus; // Trạng thái: Nháp / Đã nhập / Hủy - Required, Default: 'draft'
  notes?: string; // Ghi chú - Optional
}
