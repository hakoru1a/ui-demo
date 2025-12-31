// ==============================|| LOGISTICS COSTING FORM TYPES ||============================== //

import type { CostType, ServiceCategory, AllocationMethod, LogisticsCostStatus, Currency } from './enums';

export interface LogisticsCostFormData {
  costCode: string; // Mã chi phí (Auto-generate, Read-only)
  costType: CostType; // Loại chi phí - Required, Default: 'logistics'
  serviceCategory?: ServiceCategory; // Nhóm dịch vụ
  partnerId: string; // ID đối tác - Required
  relatedShipmentId?: string; // ID lô liên quan
  relatedOrderId?: string; // ID đơn liên quan
  costDate: Date | string; // Ngày phát sinh - Required, Default: Today
  amount: number; // Số tiền - Required, > 0
  currency: Currency; // Tiền tệ - Required, Default: 'VND'
  allocationMethod?: AllocationMethod; // Phân bổ
  attachment?: string | File; // Chứng từ
  status: LogisticsCostStatus; // Trạng thái - Required, Default: 'draft'
  notes?: string; // Ghi chú
}
