// ==============================|| DISPATCH ORDER FILTERS ||============================== //

import type { DispatchOrderStatus } from './enums';

export interface DispatchOrderFilters {
  orderCode?: string; // Mã lệnh
  vehicleId?: string; // Xe / Tài xế
  transportDateRange?: { start: Date | string; end: Date | string }; // Thời gian vận chuyển
  status?: DispatchOrderStatus; // Trạng thái lệnh
}
