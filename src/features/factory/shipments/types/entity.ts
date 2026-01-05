// ==============================|| SHIPMENT ENTITY ||============================== //

import type { ShipmentType, ShipmentStatus, DestinationType } from './enums';

export interface Shipment {
  id: string; // ID phiếu xuất
  code: string; // Mã phiếu xuất (Auto-generate, Read-only)
  issueDate: Date | string; // Ngày xuất
  issueType: ShipmentType; // Loại xuất: Xuất kho / Xuất cảng
  warehouseId: string; // Kho xuất ID
  warehouseName: string; // Tên kho xuất
  destinationId?: string; // Điểm nhận ID
  destinationName?: string; // Tên điểm nhận
  destinationType?: DestinationType; // Loại điểm nhận: Kho nội bộ / Cảng
  customerId?: string; // Khách hàng / Đơn vị nhận ID
  customerName?: string; // Tên khách hàng / Đơn vị nhận
  productId: string; // Sản phẩm / Nguyên liệu ID
  productName: string; // Tên sản phẩm / Nguyên liệu
  batchId?: string; // Lô sản xuất ID (Truy vết)
  batchCode?: string; // Mã lô sản xuất
  quantity: number; // Khối lượng (kg) - > 0
  transportRef?: string; // Thông tin vận chuyển (Xe / Container)
  referenceDoc?: string; // Chứng từ (Phiếu giao / Bill) - URL hoặc file path
  status: ShipmentStatus; // Trạng thái: Nháp / Đã xuất / Hủy
  notes?: string; // Ghi chú
  createdAt?: Date | string; // Ngày tạo
  updatedAt?: Date | string; // Ngày cập nhật
  createdBy?: string; // Người tạo
  updatedBy?: string; // Người cập nhật
}
