// ==============================|| TRAINING & SAFETY ENTITY ||============================== //

import type { TrainingType, TrainingStatus, Department } from './enums';

export interface Training {
  id: string; // ID khóa đào tạo
  name: string; // Tên khóa đào tạo
  type: TrainingType; // Loại đào tạo: Kỹ năng / An toàn
  department: Department; // Bộ phận tham gia
  startDate: Date | string; // Ngày bắt đầu
  endDate: Date | string; // Ngày kết thúc
  participantCount: number; // Số người tham gia
  status: TrainingStatus; // Trạng thái: Đang mở / Đã hoàn thành / Hủy
  createdAt?: Date | string; // Ngày tạo
  updatedAt?: Date | string; // Ngày cập nhật
}
