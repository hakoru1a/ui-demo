// ==============================|| PRODUCTION CALENDAR ENTITY ||============================== //

import type { ShiftStatus } from './enums';
import type { Batch } from '../../batches/types';

/**
 * Production Shift - Ca sản xuất
 * Represents a production shift scheduled on a production line
 */
export interface ProductionShift {
  id: string; // ID ca sản xuất
  batchId: string; // Lô sản xuất ID
  batchCode: string; // Mã lô
  productionLineId: string; // Dây chuyền ID
  productionLineName: string; // Tên dây chuyền
  startTime: Date | string; // Thời gian bắt đầu
  endTime: Date | string; // Thời gian kết thúc
  status: ShiftStatus; // Trạng thái ca
  notes?: string; // Ghi chú
  createdAt?: Date | string; // Ngày tạo
  updatedAt?: Date | string; // Ngày cập nhật
}

/**
 * Shift Production - Sản lượng ca
 * Production output data for a specific shift
 */
export interface ShiftProduction {
  id: string; // ID sản lượng ca
  shiftId: string; // Ca sản xuất ID
  quantity: number; // Sản lượng thực tế
  unit: string; // Đơn vị (kg, tấn, etc.)
  recordedAt: Date | string; // Thời gian ghi nhận
  notes?: string; // Ghi chú
}

/**
 * Calendar Event Data
 * Combined data for calendar display
 */
export interface CalendarEventData {
  // For Month view - Batch data
  batch?: Batch;
  // For Week/Day view - Shift data
  shift?: ProductionShift;
  // For Day view - Production data
  production?: ShiftProduction;
}
