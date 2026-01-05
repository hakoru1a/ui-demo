// ==============================|| HR FORM TYPES ||============================== //

import type { Department, ContractType, EmployeeStatus } from './enums';

export interface EmployeeFormData {
  code: string; // Mã nhân sự (Auto-generate, Read-only)
  fullName: string; // Họ & Tên - Required
  department: Department; // Bộ phận - Required
  position: string; // Chức danh - Required
  contractType: ContractType; // Loại hợp đồng - Required
  effectiveDate: Date | string; // Ngày hiệu lực - Required
  expiryDate: Date | string; // Ngày hết hạn - Required
  status: EmployeeStatus; // Trạng thái - Required, Default: 'active'
}
