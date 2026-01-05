// ==============================|| COMPLAINTS FORM TYPES ||============================== //

import type { ComplaintType, ComplaintStatus } from './enums';

export interface ComplaintFormData {
  code: string; // Mã khiếu nại - Required
  sender: string; // Người gửi - Required
  relatedEmployeeId?: string; // Nhân sự liên quan - Optional
  type: ComplaintType; // Loại khiếu nại - Required
  receivedDate: Date | string; // Ngày tiếp nhận - Required
  status: ComplaintStatus; // Trạng thái - Required, Default: 'new'
  description?: string; // Mô tả chi tiết - Optional
  resolution?: string; // Giải pháp/xử lý - Optional
}
