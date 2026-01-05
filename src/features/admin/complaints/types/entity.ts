// ==============================|| COMPLAINTS ENTITY ||============================== //

import type { ComplaintType, ComplaintStatus } from './enums';

export interface Complaint {
  id: string; // ID khiếu nại
  code: string; // Mã khiếu nại
  sender: string; // Người gửi
  relatedEmployeeId?: string; // Nhân sự liên quan (optional)
  relatedEmployeeName?: string; // Tên nhân sự liên quan
  type: ComplaintType; // Loại khiếu nại: Lao động / Sản xuất / An toàn
  receivedDate: Date | string; // Ngày tiếp nhận
  status: ComplaintStatus; // Trạng thái: Mới / Đang xử lý / Đã giải quyết
  description?: string; // Mô tả chi tiết
  resolution?: string; // Giải pháp/xử lý
  createdAt?: Date | string; // Ngày tạo
  updatedAt?: Date | string; // Ngày cập nhật
}
