// ==============================|| WORKFORCE DISPATCH ENTITY ||============================== //

import type { DispatchOrderStatus, PersonnelRole } from './enums';

/**
 * Personnel detail in dispatch order
 */
export interface DispatchPersonnel {
  id: string; // ID chi tiết
  personnelId: string; // ID nhân sự
  personnelCode: string; // Mã nhân sự
  personnelName: string; // Tên nhân sự
  role: PersonnelRole; // Vai trò: Công nhân / Tổ trưởng
  note?: string; // Ghi chú
}

/**
 * Workforce Dispatch Order entity
 */
export interface WorkforceDispatchOrder {
  id: string; // ID lệnh điều phối
  code: string; // Mã lệnh điều phối (Auto-generate, Read-only)
  applicationDate: Date | string; // Ngày áp dụng
  factoryId: string; // ID nhà máy
  factoryName: string; // Tên nhà máy
  productionShiftId: string; // ID ca sản xuất
  productionShiftName: string; // Tên ca sản xuất
  departmentId: string; // ID bộ phận
  departmentName: string; // Tên bộ phận
  personnel: DispatchPersonnel[]; // Danh sách nhân sự
  status: DispatchOrderStatus; // Trạng thái: Draft / Approved / Applied
  createdAt?: Date | string; // Ngày tạo
  updatedAt?: Date | string; // Ngày cập nhật
  createdBy?: string; // Người tạo
  updatedBy?: string; // Người cập nhật
}
