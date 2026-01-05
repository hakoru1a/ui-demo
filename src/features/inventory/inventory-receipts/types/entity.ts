// ==============================|| INVENTORY RECEIPT ENTITY ||============================== //

import type { ReceiptStatus, ReceiptSource, ReceiptType } from './enums';

export interface InventoryReceipt {
  id: string; // ID phiếu nhập kho
  code: string; // Mã phiếu nhập (Auto-generate, Read-only)
  receiptDate: Date | string; // Ngày nhập - Required
  receiptType: ReceiptType; // Loại nhập: Nguyên liệu / Thành phẩm - Required
  warehouseId: string; // ID kho nhập - Required
  warehouseName: string; // Tên kho nhập (for display)
  productId: string; // ID hàng hóa - Required
  productName: string; // Tên hàng hóa (for display)
  batchId?: string; // ID lô - Optional (Traceability)
  batchCode?: string; // Mã lô (for display)
  quantity: number; // Số lượng - Required, > 0
  unit: string; // Đơn vị - Required, Default: Kg
  totalWeight: number; // Tổng khối lượng (calculated)
  source?: ReceiptSource; // Nguồn nhập: SX / Mua ngoài - Optional
  referenceDocUrl?: string; // URL chứng từ - Optional
  status: ReceiptStatus; // Trạng thái: Nháp / Đã nhập / Hủy - Required
  notes?: string; // Ghi chú - Optional
  createdAt?: Date | string; // Ngày lập
  updatedAt?: Date | string; // Ngày cập nhật
}
