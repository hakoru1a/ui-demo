// ==============================|| WORKFORCE DISPATCH FORM TYPES ||============================== //

import type { DispatchOrderStatus, PersonnelRole } from './enums';

/**
 * Personnel detail form data
 */
export interface DispatchPersonnelFormData {
  personnelId: string; // ID nhân sự - Required
  role: PersonnelRole; // Vai trò: Công nhân / Tổ trưởng - Required
  note?: string; // Ghi chú - Optional
}

/**
 * Workforce Dispatch Order form data
 */
export interface WorkforceDispatchOrderFormData {
  code: string; // Mã lệnh điều phối (Auto-generate, Read-only)
  applicationDate: Date | string; // Ngày áp dụng - Required, Default: Today
  factoryId: string; // ID nhà máy - Required
  productionShiftId: string; // ID ca sản xuất - Required
  departmentId: string; // ID bộ phận - Required
  personnel: DispatchPersonnelFormData[]; // Danh sách nhân sự - Required
  status: DispatchOrderStatus; // Trạng thái - Required, Default: 'draft'
}
