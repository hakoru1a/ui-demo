// ==============================|| SKU FORM TYPES ||============================== //

import type { ItemType } from './enums';

export interface SkuFormData {
  code: string; // Mã SKU - Required, Read-only
  name: string; // Tên hàng hóa - Required, Read-only
  itemType: ItemType; // Loại hàng: Nguyên liệu / Thành phẩm - Required
  warehouseId: string; // ID kho - Required
  systemQuantity: number; // Số lượng hệ thống - Required, Read-only, Auto
  reservedQuantity: number; // Số lượng giữ chỗ - Read-only, Auto
  availableQuantity: number; // Số lượng khả dụng - Required, Read-only, Auto
  lastInventoryDate?: Date | string; // Ngày kiểm kê gần nhất - Optional
  notes?: string; // Ghi chú - Optional
}
