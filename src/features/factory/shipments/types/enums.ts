// ==============================|| SHIPMENTS ENUMS ||============================== //

export type ShipmentType = 'warehouse' | 'port'; // Loại xuất: Xuất kho / Xuất cảng
export type ShipmentStatus = 'draft' | 'issued' | 'cancelled'; // Trạng thái: Nháp / Đã xuất / Hủy
export type DestinationType = 'warehouse' | 'port'; // Điểm nhận: Kho nội bộ / Cảng
