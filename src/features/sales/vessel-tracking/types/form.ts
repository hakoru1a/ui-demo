// ==============================|| VESSEL TRACKING FORM TYPES ||============================== //

import type { VesselStatus } from './enums';

export interface VesselTrackingFormData {
  shipmentNo: string; // Mã chuyến (Auto, Read-only)
  exportOrderId: string; // ID đơn hàng XK - Required
  vesselName: string; // Tên tàu - Required
  voyageNo?: string; // Số chuyến
  portOfLoading: string; // Cảng đi - Required
  portOfDischarge: string; // Cảng đến - Required
  etd: Date | string; // Ngày rời cảng - Required
  eta: Date | string; // Ngày đến dự kiến - Required
  currentStatus: VesselStatus; // Trạng thái tàu (Auto)
  billOfLading?: string | File; // Vận đơn (File Upload)
  trackingMap?: string; // Lộ trình (Text - for map display, read-only)
  notes?: string; // Ghi chú
}
