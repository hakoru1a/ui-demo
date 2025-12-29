// ==============================|| HARVEST PLANS ENTITY ||============================== //

import type { HarvestPlanStatus } from './enums';

export interface ForestArea {
  id: string;
  code: string;
  name: string;
  hasFSC: boolean; // Có chứng chỉ FSC
}

export interface HarvestPlan {
  id: string; // ID kế hoạch khai thác
  code: string; // Mã kế hoạch (Auto-generate, Read-only)
  name: string; // Tên kế hoạch
  forestAreaId: string; // ID khu vực rừng - Phải thuộc danh mục FSC
  forestArea?: ForestArea; // Thông tin khu vực rừng
  area: number; // Diện tích (ha) - > 0
  startDate: Date | string; // Thời gian bắt đầu
  endDate: Date | string; // Thời gian kết thúc - ≥ ngày bắt đầu
  expectedYield: number; // Sản lượng dự kiến (m³) - Dùng cho báo cáo
  fscStandard: boolean; // Chuẩn FSC - Default: true, Không cho tắt nếu đã duyệt
  description?: string; // Mô tả
  status: HarvestPlanStatus; // Trạng thái: Draft / Active / Completed - Default: Draft
  approvedAt?: Date | string; // Ngày phê duyệt
  cancelledAt?: Date | string; // Ngày hủy
  cancellationReason?: string; // Lý do hủy
  createdAt?: Date | string; // Ngày tạo
  updatedAt?: Date | string; // Ngày cập nhật
}
