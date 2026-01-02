// ==============================|| PRODUCTION PLAN FORM TYPES ||============================== //

import type { PlanType, PlanStatus } from './enums';

export interface ProductionPlanFormData {
  code: string; // Mã kế hoạch/lệnh (Auto-generate, Read-only)
  type: PlanType; // Loại: Kế hoạch / Lệnh - Required, Default: 'plan'
  productId: string; // Sản phẩm ID - Required
  plannedQuantity: number; // Sản lượng dự kiến - Required, > 0
  startDate: Date | string; // Ngày bắt đầu - Required
  endDate: Date | string; // Ngày kết thúc - Required, ≥ ngày bắt đầu
  estimatedCost?: number; // Chi phí ước tính (Auto - Tổng hợp)
  productionLineId?: string; // Dây chuyền ID
  status: PlanStatus; // Trạng thái - Required, Default: 'draft'
  notes?: string; // Ghi chú
}
