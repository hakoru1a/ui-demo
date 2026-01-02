// ==============================|| PARTNERS FORM TYPES ||============================== //

import type { PartnerType, PartnerStatus } from './enums';

export interface PartnerFormData {
  code: string; // Mã khách hàng (Auto-generate, Read-only)
  name: string; // Tên khách hàng - Required
  type: PartnerType; // Loại đối tượng - Required
  representative?: string; // Người đại diện - Required nếu type = 'business'
  phone: string; // Số điện thoại - Required, Validate format
  address?: string; // Địa chỉ
  status: PartnerStatus; // Trạng thái - Required, Default: 'active'
  notes?: string; // Ghi chú
}
