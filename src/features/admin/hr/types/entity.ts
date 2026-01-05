// ==============================|| HR ENTITY ||============================== //

import type { Department, ContractType, EmployeeStatus } from './enums';

export interface Employee {
  id: string; // ID nhân sự
  code: string; // Mã nhân sự (Auto-generate, Read-only)
  fullName: string; // Họ & Tên
  department: Department; // Bộ phận: Sản xuất / Kho / QC
  position: string; // Chức danh
  contractType: ContractType; // Loại hợp đồng: Thử việc / Thời vụ / Dài hạn
  effectiveDate: Date | string; // Ngày hiệu lực
  expiryDate: Date | string; // Ngày hết hạn
  status: EmployeeStatus; // Trạng thái: Đang làm / Nghỉ việc
  createdAt?: Date | string; // Ngày tạo
  updatedAt?: Date | string; // Ngày cập nhật
}
