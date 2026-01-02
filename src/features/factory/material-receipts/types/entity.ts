// ==============================|| MATERIAL RECEIPTS ENTITY ||============================== //

import type { ReceiptStatus, MaterialType } from './enums';

export interface MaterialReceipt {
  id: string; // ID phiếu nhập
  code: string; // Mã phiếu nhập (Auto-generate, Read-only)
  receiptDate: Date | string; // Ngày nhập kho
  supplierId: string; // ID nhà cung cấp
  supplierName?: string; // Tên nhà cung cấp
  warehouseId: string; // ID kho nhập
  warehouseName?: string; // Tên kho nhập
  materialType: MaterialType; // Loại nguyên liệu: Gỗ keo, gỗ tràm...
  quantity: number; // Khối lượng (kg) - > 0
  unitPrice?: number; // Đơn giá ước tính (Auto - tham chiếu bảng giá)
  totalValue?: number; // Tổng giá trị ước tính (Auto - Quantity × Price)
  referenceDoc?: string; // URL chứng từ (PDF / Image)
  status: ReceiptStatus; // Trạng thái: Nháp / Đã nhập / Hủy
  notes?: string; // Ghi chú
  createdAt?: Date | string; // Ngày tạo
  updatedAt?: Date | string; // Ngày cập nhật
}
