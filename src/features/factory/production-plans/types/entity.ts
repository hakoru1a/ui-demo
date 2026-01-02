// ==============================|| PRODUCTION PLAN ENTITY ||============================== //

import type { PlanType, PlanStatus } from './enums';

export interface ProductionPlan {
  id: string; // ID kế hoạch/lệnh
  code: string; // Mã kế hoạch/lệnh (Auto-generate, Read-only)
  type: PlanType; // Loại: Kế hoạch / Lệnh
  productId: string; // Sản phẩm ID
  productName: string; // Tên sản phẩm
  plannedQuantity: number; // Sản lượng dự kiến - > 0
  startDate: Date | string; // Ngày bắt đầu
  endDate: Date | string; // Ngày kết thúc - ≥ ngày bắt đầu
  estimatedCost: number; // Chi phí ước tính (Auto - Tổng hợp)
  productionLineId?: string; // Dây chuyền ID
  productionLineName?: string; // Tên dây chuyền
  status: PlanStatus; // Trạng thái: Nháp / Đang SX / Hoàn thành
  notes?: string; // Ghi chú
  createdAt?: Date | string; // Ngày tạo
  updatedAt?: Date | string; // Ngày cập nhật
}
