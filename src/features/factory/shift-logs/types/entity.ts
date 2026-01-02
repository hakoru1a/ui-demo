// ==============================|| SHIFT LOGS ENTITY ||============================== //

import type { ShiftLogStatus } from './enums';

/**
 * Shift Log - Nhật ký vận hành ca sản xuất
 * Represents a production shift operation log
 */
export interface ShiftLog {
  id: string; // ID nhật ký ca
  code: string; // Mã ca (Auto-generate, Read-only)
  batchId: string; // Lô sản xuất ID
  batchCode: string; // Mã lô sản xuất
  shiftId?: string; // Ca sản xuất ID (optional, có thể link với ProductionShift)
  shiftTime: string; // Thời gian ca (e.g., "08:00 - 16:00")
  workDate: Date | string; // Ngày làm việc
  outputQuantity: number; // Sản lượng ca
  hasIncident: boolean; // Sự cố: Có / Không
  status: ShiftLogStatus; // Trạng thái ca: Đang chạy / Kết thúc
  notes?: string; // Ghi chú
  createdAt?: Date | string; // Ngày tạo
  updatedAt?: Date | string; // Ngày cập nhật
}
