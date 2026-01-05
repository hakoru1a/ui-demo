// ==============================|| TRANSFER FORM TYPES ||============================== //

import type { ItemType, TransferStatus } from './enums';

/**
 * Transfer Item Form Data - Chi tiết SKU trong form
 */
export interface TransferItemFormData {
  id?: string; // ID chi tiết (for edit mode)
  skuId: string; // ID SKU - Required
  skuCode: string; // Mã SKU - Required, Read-only
  skuName: string; // Tên hàng hóa - Required, Read-only
  batchId?: string; // ID lô - Optional (Traceability, Required if traceability enabled)
  quantity: number; // Số lượng - Required, > 0
  unit: string; // Đơn vị - Required, Default: Kg
}

/**
 * Transfer Form Data - Dữ liệu form phiếu chuyển kho
 */
export interface TransferFormData {
  code: string; // Mã phiếu chuyển - Required, Auto-generate, Read-only
  transferDate: Date | string; // Ngày chuyển - Required, Default: Today
  sourceWarehouseId: string; // ID kho nguồn - Required
  destinationWarehouseId: string; // ID kho đích - Required
  itemType: ItemType; // Loại hàng: Nguyên liệu / Thành phẩm - Required, Default: 'material'
  items: TransferItemFormData[]; // Danh sách SKU - Required, Multiple SKU
  transportRef?: string; // Thông tin vận chuyển - Optional
  status: TransferStatus; // Trạng thái: Nháp / Đã chuyển / Hủy - Required, Default: 'draft'
  notes?: string; // Ghi chú - Optional
}
