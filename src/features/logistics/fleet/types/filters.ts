// ==============================|| FLEET FILTERS ||============================== //

import type { VehicleType, VehicleStatus, DriverStatus } from './enums';

export interface FleetFilters {
  licensePlate?: string; // Biển số xe - Tìm chính xác / gần đúng
  driverName?: string; // Tên tài xế
  vehicleType?: VehicleType; // Loại xe
  vehicleStatus?: VehicleStatus; // Trạng thái xe
  driverStatus?: DriverStatus; // Trạng thái tài xế
  licenseValid?: boolean; // Hiệu lực GPLX - Còn hạn
}
