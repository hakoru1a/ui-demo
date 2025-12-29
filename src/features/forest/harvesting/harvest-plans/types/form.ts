// ==============================|| HARVEST PLANS FORM TYPES ||============================== //

import type { HarvestPlanStatus } from './enums';

export interface HarvestPlanFormData {
  code: string; // Mã kế hoạch (Auto-generate, Read-only)
  name: string; // Tên kế hoạch - Required
  forestAreaId: string; // Khu vực rừng - Required, Phải thuộc danh mục FSC
  area: number; // Diện tích (ha) - Required, > 0
  startDate: Date | string; // Thời gian bắt đầu - Required
  endDate: Date | string; // Thời gian kết thúc - Required, ≥ ngày bắt đầu
  expectedYield: number; // Sản lượng dự kiến (m³) - Required
  fscStandard: boolean; // Chuẩn FSC - Required, Default: true
  description?: string; // Mô tả
  status: HarvestPlanStatus; // Trạng thái - Required, Default: 'draft'
}
