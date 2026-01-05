// ==============================|| SKU ENTITY ||============================== //

import type { ItemType, StockStatus } from './enums';

export interface Sku {
  id: string; // ID SKU
  code: string; // Mã SKU - Required, Read-only
  name: string; // Tên hàng hóa - Required, Read-only
  itemType: ItemType; // Loại hàng: Nguyên liệu / Thành phẩm - Required
  warehouseId: string; // ID kho - Required
  warehouseName: string; // Tên kho (for display)
  systemQuantity: number; // Số lượng hệ thống - Required, Read-only, Auto
  reservedQuantity: number; // Số lượng giữ chỗ - Read-only, Auto
  availableQuantity: number; // Số lượng khả dụng - Required, Read-only, Auto
  unit: string; // Đơn vị: Kg / Tấn - Required
  stockStatus: StockStatus; // Trạng thái tồn: Còn hàng / Hết hàng - Required, Auto
  lastInventoryDate?: Date | string; // Ngày kiểm kê gần nhất - Optional
  notes?: string; // Ghi chú - Optional
  createdAt?: Date | string; // Ngày tạo
  updatedAt?: Date | string; // Ngày cập nhật
}
