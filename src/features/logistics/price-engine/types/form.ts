// ==============================|| PRICE ENGINE FORM TYPES ||============================== //

import type { EntityStatus } from 'types/status';

import type { MaterialType } from './enums';

export interface PriceTableFormData {
  code: string; // Mã bảng giá (Auto-generate, Read-only)
  name: string; // Tên bảng giá - Required
  materialType: MaterialType; // Loại nguyên liệu - Required
  basePrice: number; // Đơn giá cơ bản (VNĐ/kg) - Required
  adjustmentFormula?: string; // Công thức điều chỉnh - Optional, Mô tả logic
  effectiveFrom: Date | string; // Hiệu lực từ ngày - Required
  status: EntityStatus; // Trạng thái - Required, Default: 'active'
}
