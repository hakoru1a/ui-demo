// ==============================|| TIMEKEEPING PAYROLL ENTITY ||============================== //

import type { WorkShiftType, TimekeepingStatus } from './enums';

/**
 * Work Shift - Ca làm việc
 * Represents a work shift assigned to an employee
 */
export interface WorkShift {
  id: string; // ID ca làm việc
  employeeId: string; // ID nhân viên
  employeeCode: string; // Mã nhân viên
  employeeName: string; // Tên nhân viên
  shiftType: WorkShiftType; // Loại ca
  workDate: Date | string; // Ngày làm việc
  startTime: Date | string; // Thời gian bắt đầu
  endTime: Date | string; // Thời gian kết thúc
  status: TimekeepingStatus; // Trạng thái
  notes?: string; // Ghi chú
  createdAt?: Date | string; // Ngày tạo
  updatedAt?: Date | string; // Ngày cập nhật
}

/**
 * Work Hour - Giờ công
 * Detailed work hours for a specific day
 */
export interface WorkHour {
  id: string; // ID giờ công
  employeeId: string; // ID nhân viên
  employeeCode: string; // Mã nhân viên
  employeeName: string; // Tên nhân viên
  workDate: Date | string; // Ngày làm việc
  regularHours: number; // Giờ công thường
  overtimeHours: number; // Giờ tăng ca
  totalHours: number; // Tổng giờ công
  status: TimekeepingStatus; // Trạng thái
  notes?: string; // Ghi chú
  createdAt?: Date | string; // Ngày tạo
  updatedAt?: Date | string; // Ngày cập nhật
}

/**
 * Calendar Event Data
 * Extended props for calendar events
 */
export interface CalendarEventData {
  type: 'shift' | 'hour';
  shift?: WorkShift;
  hour?: WorkHour;
}

/**
 * Payroll - Bảng lương
 * Represents a payroll record for an employee
 */
export interface Payroll {
  id: string; // ID bảng lương
  employeeId: string; // ID nhân viên
  employeeCode: string; // Mã nhân viên
  employeeName: string; // Tên nhân viên
  period: string; // Kỳ lương (e.g., "01/2024")
  regularHours: number; // Tổng giờ công thường
  overtimeHours: number; // Tổng giờ tăng ca
  totalHours: number; // Tổng giờ công
  baseSalary: number; // Lương cơ bản
  overtimePay: number; // Lương tăng ca
  totalSalary: number; // Tổng lương
  deductions: number; // Các khoản khấu trừ
  netSalary: number; // Lương thực nhận
  status: import('./enums').PayrollStatus; // Trạng thái
  notes?: string; // Ghi chú
  createdAt?: Date | string; // Ngày tạo
  updatedAt?: Date | string; // Ngày cập nhật
}
