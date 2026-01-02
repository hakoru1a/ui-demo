// ==============================|| WEIGH TICKETS ENTITY ||============================== //

import type { EntityStatus } from 'types/status';

import type { WeighTicketType } from './enums';

export interface WeighTicket {
  id: string; // ID phiếu cân
  code: string; // Mã phiếu cân (Auto-generate, Read-only)
  vehiclePlate: string; // Biển số xe
  supplierId: string; // Nhà cung cấp ID
  supplierName?: string; // Tên nhà cung cấp
  type: WeighTicketType; // Loại phiếu: Inbound / Outbound
  weightIn?: number; // Trọng lượng vào (kg) - Inbound
  weightOut?: number; // Trọng lượng ra (kg) - Outbound
  weightDifference?: number; // Khối lượng chênh lệch (kg) - Auto: Out - In
  unitPrice?: number; // Đơn giá áp dụng - Auto: Theo bảng giá
  estimatedAmount?: number; // Thành tiền (ước tính) - Auto
  notes?: string; // Ghi chú
  status: EntityStatus; // Trạng thái: Hoạt động / Tạm ngưng
  weighedAt?: Date | string; // Thời gian cân
  createdAt?: Date | string; // Ngày tạo
  updatedAt?: Date | string; // Ngày cập nhật
}
