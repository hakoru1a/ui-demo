// ==============================|| TRACKING ENTITY ||============================== //

export interface TrackingPosition {
  latitude: number; // Vĩ độ
  longitude: number; // Kinh độ
  timestamp: Date | string; // Thời gian cập nhật
}

export interface TrackingRoute {
  id: string; // ID lộ trình
  orderId: string; // ID lệnh điều động
  orderCode: string; // Mã lệnh
  waypoints: TrackingPosition[]; // Các điểm trên lộ trình
  estimatedArrival?: Date | string; // Thời gian dự kiến đến
}

export interface TrackingStatus {
  id: string; // ID tracking
  orderId: string; // ID lệnh điều động
  orderCode: string; // Mã lệnh
  currentPosition: TrackingPosition; // Vị trí hiện tại
  status: 'idle' | 'moving' | 'stopped' | 'arrived'; // Trạng thái vận chuyển
  currentSpeed: number; // Tốc độ hiện tại (km/h)
  route?: TrackingRoute; // Lộ trình dự kiến
  lastUpdated: Date | string; // Lần cập nhật cuối
}
