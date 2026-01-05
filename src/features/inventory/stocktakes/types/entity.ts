// ==============================|| STOCKTAKE ENTITY ||============================== //

import type { StocktakeStatus } from './enums';

/**
 * Stocktake Item - Chi tiết SKU trong phiếu kiểm kê
 */
export interface StocktakeItem {
  id: string; // ID chi tiết
  skuId: string; // ID SKU - Required
  skuCode: string; // Mã SKU - Required, Read-only
  skuName: string; // Tên hàng hóa - Required, Read-only
  systemQty: number; // Số lượng hệ thống - Required, Read-only, Auto
  actualQty: number; // Số lượng thực tế - Required, Manual input
  difference: number; // Chênh lệch - Required, Auto (actualQty - systemQty)
  reason?: string; // Lý do chênh lệch - Conditional (Required if difference ≠ 0)
}

/**
 * Stocktake Entity - Phiếu kiểm kê kho định kỳ
 */
export interface Stocktake {
  id: string; // ID phiếu kiểm kê
  code: string; // Mã phiếu kiểm kê - Required, Auto-generate, Read-only
  inventoryDate: Date | string; // Ngày kiểm kê - Required, Default Today
  warehouseId: string; // ID kho - Required
  warehouseName: string; // Tên kho (for display)
  skuCount: number; // Số SKU - Required, Auto
  totalDifference: number; // Tổng chênh lệch - Required, Auto (sum of all items' difference)
  status: StocktakeStatus; // Trạng thái: Nháp / Hoàn tất - Required, Default Nháp
  items: StocktakeItem[]; // Danh sách SKU - Required
  notes?: string; // Ghi chú - Optional
  createdAt?: Date | string; // Ngày tạo
  updatedAt?: Date | string; // Ngày cập nhật
  createdBy?: string; // Người tạo
  updatedBy?: string; // Người cập nhật
}
