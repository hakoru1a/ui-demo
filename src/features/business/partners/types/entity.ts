// ==============================|| PARTNERS ENTITY ||============================== //

import type { PartnerType, PartnerStatus } from './enums';

export interface Partner {
  id: string; // ID khách hàng/nhà cung cấp
  code: string; // Mã khách hàng (Auto-generate, Read-only)
  name: string; // Tên khách hàng
  type: PartnerType; // Loại đối tượng: Cá nhân / Doanh nghiệp
  representative?: string; // Người đại diện (Bắt buộc nếu là Doanh nghiệp)
  phone: string; // Số điện thoại
  address?: string; // Địa chỉ
  status: PartnerStatus; // Trạng thái: Hoạt động / Ngưng
  notes?: string; // Ghi chú
  createdAt?: Date | string; // Ngày tạo
  updatedAt?: Date | string; // Ngày cập nhật
}
