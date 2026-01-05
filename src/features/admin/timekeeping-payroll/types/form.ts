// ==============================|| TIMEKEEPING PAYROLL FORM TYPES ||============================== //

import type { WorkShiftType, TimekeepingStatus } from './enums';

export interface WorkShiftFormData {
  employeeId: string; // ID nhân viên - Required
  employeeCode: string; // Mã nhân viên (auto-filled)
  employeeName: string; // Tên nhân viên - Required
  shiftType: WorkShiftType; // Loại ca - Required
  workDate: Date | string; // Ngày làm việc - Required
  startTime: Date | string; // Thời gian bắt đầu - Required
  endTime: Date | string; // Thời gian kết thúc - Required, > startTime
  status: TimekeepingStatus; // Trạng thái - Required, Default: 'pending'
  notes?: string; // Ghi chú
}
