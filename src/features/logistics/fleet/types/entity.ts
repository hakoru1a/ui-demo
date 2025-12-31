// ==============================|| FLEET ENTITY ||============================== //

import type { VehicleType, VehicleStatus, DriverStatus } from './enums';

export interface Vehicle {
  id: string; // ID xe
  licensePlate: string; // Biển số xe
  vehicleType: VehicleType; // Loại xe: Xe tải / Container
  maxLoad: number; // Tải trọng tối đa (tấn) - > 0
  driverName: string; // Tên tài xế
  driverPhone: string; // Số điện thoại tài xế
  driverLicenseNumber: string; // Số GPLX
  driverLicenseExpiry: Date | string; // Ngày hết hạn GPLX
  vehicleStatus: VehicleStatus; // Trạng thái xe: Sẵn sàng / Đang chạy / Bảo trì
  driverStatus: DriverStatus; // Trạng thái tài xế: Rảnh / Đang điều động
  notes?: string; // Ghi chú
  createdAt?: Date | string; // Ngày tạo
  updatedAt?: Date | string; // Ngày cập nhật
}
