// ==============================|| BATCH ENTITY ||============================== //

import type { BatchStatus } from './enums';

export interface Batch {
  id: string; // ID lô sản xuất
  code: string; // Mã lô (Auto-generate, Read-only)
  productionOrderId: string; // Lệnh SX ID
  productionOrderCode: string; // Mã lệnh SX
  productId: string; // Sản phẩm / Nguyên liệu ID
  productName: string; // Tên sản phẩm / Nguyên liệu
  plannedQuantity: number; // Sản lượng kế hoạch - > 0
  actualQuantity: number; // Sản lượng thực tế - Cập nhật dần
  startDate: Date | string; // Ngày bắt đầu
  endDate?: Date | string; // Ngày kết thúc
  status: BatchStatus; // Trạng thái: Đang SX / Hoàn thành / Hủy
  notes?: string; // Ghi chú
  createdAt?: Date | string; // Ngày tạo
  updatedAt?: Date | string; // Ngày cập nhật
}
