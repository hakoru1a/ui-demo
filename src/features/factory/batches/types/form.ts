// ==============================|| BATCH FORM TYPES ||============================== //

import type { BatchStatus } from './enums';

export interface BatchFormData {
  code: string; // Mã lô (Auto-generate, Read-only)
  productionOrderId: string; // Lệnh SX - Required
  productId: string; // Sản phẩm / Nguyên liệu - Required
  plannedQuantity: number; // Sản lượng kế hoạch - Required, > 0
  actualQuantity?: number; // Sản lượng thực tế - Optional, Cập nhật dần
  startDate: Date | string; // Ngày bắt đầu - Required
  endDate?: Date | string; // Ngày kết thúc - Optional
  status: BatchStatus; // Trạng thái - Required, Default: 'in-progress'
  notes?: string; // Ghi chú
}
