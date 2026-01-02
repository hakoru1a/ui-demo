// ==============================|| PRICE ENGINE ENTITY ||============================== //

import type { EntityStatus } from 'types/status';

import type { MaterialType } from './enums';

export interface PriceTable {
  id: string; // ID bảng giá
  code: string; // Mã bảng giá (Auto-generate, Read-only)
  name: string; // Tên bảng giá
  materialType: MaterialType; // Loại nguyên liệu: Gỗ keo, gỗ tràm...
  basePrice: number; // Đơn giá cơ bản (VNĐ/kg)
  adjustmentFormula?: string; // Công thức điều chỉnh - Mô tả logic
  effectiveFrom: Date | string; // Hiệu lực từ ngày
  status: EntityStatus; // Trạng thái: Hoạt động / Tạm ngưng
  createdAt?: Date | string; // Ngày tạo
  updatedAt?: Date | string; // Ngày cập nhật
}
