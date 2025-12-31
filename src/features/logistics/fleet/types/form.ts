// ==============================|| FLEET FORM TYPES ||============================== //

import type { VehicleType, VehicleStatus, DriverStatus } from './enums';

export interface VehicleFormData {
  licensePlate: string; // Biển số xe - Required, Read-only khi đã gán lệnh
  vehicleType: VehicleType; // Loại xe - Required
  maxLoad: number; // Tải trọng tối đa (tấn) - Required, > 0
  driverName: string; // Tên tài xế - Required
  driverPhone: string; // Số điện thoại - Required, Validate format
  driverLicenseNumber: string; // Số GPLX - Required
  driverLicenseExpiry: Date | string; // Ngày hết hạn GPLX - Required, Cảnh báo hết hạn
  vehicleStatus: VehicleStatus; // Trạng thái - Required, Default: 'ready'
  driverStatus: DriverStatus; // Trạng thái tài xế - Required, Default: 'available'
  notes?: string; // Ghi chú
}
