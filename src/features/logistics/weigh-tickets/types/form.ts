// ==============================|| WEIGH TICKETS FORM TYPES ||============================== //

import type { WeighTicketType } from './enums';

export interface WeighTicketFormData {
  code: string; // Mã phiếu cân (Auto-generate, Read-only)
  vehiclePlate: string; // Biển số xe - Required
  supplierId: string; // Nhà cung cấp - Required
  type: WeighTicketType; // Loại phiếu: Inbound / Outbound - Required
  weightIn?: number; // Trọng lượng vào (kg) - Conditional: Inbound
  weightOut?: number; // Trọng lượng ra (kg) - Conditional: Outbound
  weightDifference?: number; // Khối lượng chênh lệch (kg) - Auto: Out - In
  unitPrice?: number; // Đơn giá áp dụng - Auto: Theo bảng giá
  estimatedAmount?: number; // Thành tiền (ước tính) - Auto
  notes?: string; // Ghi chú
}
