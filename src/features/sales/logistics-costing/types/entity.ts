// ==============================|| LOGISTICS COSTING ENTITY ||============================== //

import type { CostType, ServiceCategory, AllocationMethod, LogisticsCostStatus, Currency } from './enums';

export interface LogisticsCost {
  id: string; // ID chi phí
  costCode: string; // Mã chi phí (Auto-generate, Read-only)
  costType: CostType; // Loại chi phí: Logistics / Dịch vụ
  serviceCategory?: ServiceCategory; // Nhóm dịch vụ: Vận chuyển / Bốc xếp / Hải quan
  partnerId: string; // ID đối tác (NCC dịch vụ)
  partnerName?: string; // Tên đối tác (for display)
  relatedShipmentId?: string; // ID lô liên quan
  relatedShipmentCode?: string; // Mã lô liên quan (for display)
  relatedOrderId?: string; // ID đơn liên quan
  relatedOrderCode?: string; // Mã đơn liên quan (for display)
  costDate: Date | string; // Ngày phát sinh
  amount: number; // Số tiền (> 0)
  currency: Currency; // Tiền tệ
  allocationMethod?: AllocationMethod; // Phân bổ: Theo lô / Theo đơn
  attachment?: string | File; // Chứng từ (Hóa đơn / Biên nhận)
  status: LogisticsCostStatus; // Trạng thái: Nháp / Đã ghi nhận
  notes?: string; // Ghi chú
  createdAt?: Date | string; // Ngày tạo
  updatedAt?: Date | string; // Ngày cập nhật
}
