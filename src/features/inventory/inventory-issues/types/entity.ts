// ==============================|| INVENTORY ISSUE ENTITY ||============================== //

import type { IssueStatus, IssueType } from './enums';

export interface InventoryIssue {
  id: string; // ID phiếu xuất kho
  code: string; // Mã phiếu xuất (Auto-generate, Read-only)
  issueDate: Date | string; // Ngày xuất - Required
  issueType: IssueType; // Loại xuất: Nguyên liệu / Thành phẩm - Required
  warehouseId: string; // ID kho xuất - Required
  warehouseName: string; // Tên kho xuất (for display)
  productId: string; // ID hàng hóa - Required
  productName: string; // Tên hàng hóa (for display)
  batchId?: string; // ID lô - Optional (Traceability)
  batchCode?: string; // Mã lô (for display)
  quantity: number; // Số lượng - Required, > 0
  unit: string; // Đơn vị - Required, Default: Kg
  totalWeight: number; // Tổng khối lượng (calculated)
  destination?: string; // Điểm nhận: SX / Bán - Optional
  referenceDocUrl?: string; // URL chứng từ - Optional
  status: IssueStatus; // Trạng thái: Nháp / Đã xuất / Hủy - Required
  notes?: string; // Ghi chú - Optional
  createdAt?: Date | string; // Ngày lập
  updatedAt?: Date | string; // Ngày cập nhật
}
