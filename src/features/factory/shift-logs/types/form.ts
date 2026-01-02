// ==============================|| SHIFT LOGS FORM TYPES ||============================== //

import type { ShiftLogStatus } from './enums';

export interface ShiftLogFormData {
  batchId: string; // Lô sản xuất - Required
  shiftId?: string; // Ca sản xuất (optional)
  workDate: Date | string; // Ngày làm việc - Required
  shiftTime: string; // Thời gian ca - Required (e.g., "08:00 - 16:00")
  outputQuantity: number; // Sản lượng ca - Required, >= 0
  hasIncident: boolean; // Sự cố - Default: false
  status: ShiftLogStatus; // Trạng thái - Required, Default: 'running'
  notes?: string; // Ghi chú
}
