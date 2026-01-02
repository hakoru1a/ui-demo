// ==============================|| PRODUCTION CALENDAR FORM TYPES ||============================== //

import type { ShiftStatus } from './enums';

export interface ProductionShiftFormData {
  batchId: string; // Lô sản xuất - Required
  productionLineId: string; // Dây chuyền - Required
  startTime: Date | string; // Thời gian bắt đầu - Required
  endTime: Date | string; // Thời gian kết thúc - Required, > startTime
  status: ShiftStatus; // Trạng thái - Required, Default: 'scheduled'
  notes?: string; // Ghi chú
}
