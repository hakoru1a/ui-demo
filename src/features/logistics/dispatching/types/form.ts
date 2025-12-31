// ==============================|| DISPATCH ORDER FORM TYPES ||============================== //

import type { DispatchOrderStatus } from './enums';

export interface DispatchOrderFormData {
  orderCode: string; // Mã lệnh - Auto-generate, Read-only
  vehicleId: string; // Xe - Required, Chỉ xe sẵn sàng
  driverName: string; // Tên tài xế - Required, Đồng bộ với xe
  origin: string; // Điểm xuất phát - Required
  destination: string; // Điểm đến - Required
  departureTime: Date | string; // Thời gian xuất phát - Required
  estimatedDuration?: number; // Thời gian dự kiến (giờ)
  status: DispatchOrderStatus; // Trạng thái - Required, Default: 'new'
  notes?: string; // Ghi chú
}
