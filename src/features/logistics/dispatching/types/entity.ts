// ==============================|| DISPATCH ORDER ENTITY ||============================== //

import type { DispatchOrderStatus } from './enums';

export interface DispatchOrder {
  id: string; // ID lệnh điều động
  orderCode: string; // Mã lệnh (Auto-generate, Read-only)
  vehicleId: string; // ID xe
  vehicleLicensePlate: string; // Biển số xe
  driverName: string; // Tên tài xế
  origin: string; // Điểm xuất phát
  destination: string; // Điểm đến
  departureTime: Date | string; // Thời gian xuất phát
  estimatedDuration?: number; // Thời gian dự kiến (giờ)
  status: DispatchOrderStatus; // Trạng thái: Mới / Đang chạy / Hoàn thành
  notes?: string; // Ghi chú
  createdAt?: Date | string; // Ngày tạo
  updatedAt?: Date | string; // Ngày cập nhật
}
