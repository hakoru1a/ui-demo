// ==============================|| TRANSFER ENTITY ||============================== //

import type { ItemType, TransferStatus } from './enums';

/**
 * Transfer Item - Chi tiết SKU trong phiếu chuyển kho
 */
export interface TransferItem {
  id: string; // ID chi tiết
  skuId: string; // ID SKU - Required
  skuCode: string; // Mã SKU - Required
  skuName: string; // Tên hàng hóa - Required
  batchId?: string; // ID lô - Optional (Traceability)
  batchCode?: string; // Mã lô (for display)
  quantity: number; // Số lượng - Required, > 0
  unit: string; // Đơn vị - Required, Default: Kg
  weight: number; // Khối lượng (calculated: quantity * unit conversion)
}

/**
 * Transfer Entity - Phiếu chuyển kho
 */
export interface Transfer {
  id: string; // ID phiếu chuyển kho
  code: string; // Mã phiếu chuyển (Auto-generate, Read-only)
  transferDate: Date | string; // Ngày chuyển - Required
  sourceWarehouseId: string; // ID kho nguồn - Required
  sourceWarehouseName: string; // Tên kho nguồn (for display)
  destinationWarehouseId: string; // ID kho đích - Required
  destinationWarehouseName: string; // Tên kho đích (for display)
  itemType: ItemType; // Loại hàng: Nguyên liệu / Thành phẩm - Required
  items: TransferItem[]; // Danh sách SKU - Required, Multiple SKU
  skuCount: number; // Số SKU (calculated from items.length)
  totalWeight: number; // Tổng khối lượng (calculated from items)
  transportRef?: string; // Thông tin vận chuyển - Optional
  status: TransferStatus; // Trạng thái: Nháp / Đã chuyển / Hủy - Required
  notes?: string; // Ghi chú - Optional
  createdAt?: Date | string; // Ngày lập
  updatedAt?: Date | string; // Ngày cập nhật
}
