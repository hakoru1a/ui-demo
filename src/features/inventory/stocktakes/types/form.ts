// ==============================|| STOCKTAKE FORM TYPES ||============================== //

import type { StocktakeStatus } from './enums';

/**
 * Stocktake Item Form Data - Chi tiết SKU trong form
 */
export interface StocktakeItemFormData {
  id?: string; // ID chi tiết (for edit mode)
  skuId: string; // ID SKU - Required
  skuCode: string; // Mã SKU - Required, Read-only
  skuName: string; // Tên hàng hóa - Required, Read-only
  systemQty: number; // Số lượng hệ thống - Required, Read-only, Auto
  actualQty: number; // Số lượng thực tế - Required, Manual input
  difference: number; // Chênh lệch - Required, Auto
  reason?: string; // Lý do chênh lệch - Conditional (Required if difference ≠ 0)
}

/**
 * Stocktake Form Data - Dữ liệu form phiếu kiểm kê
 */
export interface StocktakeFormData {
  code: string; // Mã phiếu kiểm kê - Required, Auto-generate, Read-only
  inventoryDate: Date | string; // Ngày kiểm kê - Required, Default Today
  warehouseId: string; // ID kho - Required
  items: StocktakeItemFormData[]; // Danh sách SKU - Required, Multiple SKU
  status: StocktakeStatus; // Trạng thái: Nháp / Hoàn tất - Required, Default Nháp
  notes?: string; // Ghi chú - Optional
}
