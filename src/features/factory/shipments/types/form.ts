// ==============================|| SHIPMENT FORM TYPES ||============================== //

import type { ShipmentType, ShipmentStatus, DestinationType } from './enums';

export interface ShipmentFormData {
  code: string; // Mã phiếu xuất (Auto-generate, Read-only)
  issueDate: Date | string; // Ngày xuất - Required, Default: Today
  issueType: ShipmentType; // Loại xuất: Xuất kho / Xuất cảng - Required, Default: 'warehouse'
  warehouseId: string; // Kho xuất - Required
  destinationId?: string; // Điểm nhận ID - Required
  destinationType?: DestinationType; // Loại điểm nhận: Kho nội bộ / Cảng - Required
  customerId?: string; // Khách hàng / Đơn vị nhận ID
  productId: string; // Sản phẩm / Nguyên liệu - Required
  batchId?: string; // Lô sản xuất ID (Truy vết)
  quantity: number; // Khối lượng (kg) - Required, > 0
  transportRef?: string; // Thông tin vận chuyển (Xe / Container)
  referenceDoc?: string | File; // Chứng từ (Phiếu giao / Bill) - File Upload
  status: ShipmentStatus; // Trạng thái - Required, Default: 'draft'
  notes?: string; // Ghi chú
}
