// ==============================|| VESSEL TRACKING ENTITY ||============================== //

import type { VesselStatus } from './enums';

export interface VesselTracking {
  id: string; // ID chuyến
  shipmentNo: string; // Mã chuyến (Auto, Read-only)
  exportOrderId: string; // ID đơn hàng XK
  exportOrderNo?: string; // Mã đơn hàng XK (for display)
  vesselName: string; // Tên tàu
  voyageNo?: string; // Số chuyến
  portOfLoading: string; // Cảng đi
  portOfDischarge: string; // Cảng đến
  etd: Date | string; // Ngày rời cảng
  eta: Date | string; // Ngày đến dự kiến
  currentStatus: VesselStatus; // Trạng thái tàu (Auto: Đang chạy / Đã đến)
  billOfLading?: string; // Vận đơn (File URL)
  trackingMap?: string; // Lộ trình (Text - for map display)
  notes?: string; // Ghi chú
  createdAt?: Date | string; // Ngày tạo
  updatedAt?: Date | string; // Ngày cập nhật
}
