// ==============================|| TRAINING & SAFETY FORM TYPES ||============================== //

import type { TrainingType, TrainingStatus, Department } from './enums';

export interface TrainingFormData {
  name: string; // Tên khóa đào tạo - Required
  type: TrainingType; // Loại đào tạo - Required
  department: Department; // Bộ phận tham gia - Required
  startDate: Date | string; // Ngày bắt đầu - Required
  endDate: Date | string; // Ngày kết thúc - Required
  participantCount: number; // Số người tham gia - Required, Default: 0
  status: TrainingStatus; // Trạng thái - Required, Default: 'open'
}
