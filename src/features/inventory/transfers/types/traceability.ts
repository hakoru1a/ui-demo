// ==============================|| TRANSFER TRACEABILITY TYPES ||============================== //

export type CertificationType = 'FSC' | 'PEFC' | 'none';
export type TraceStatus = 'full' | 'missing'; // Đầy đủ / Thiếu

/**
 * Warehouse History Entry - Một mục trong lịch sử kho
 */
export interface WarehouseHistoryEntry {
  date: Date | string; // Ngày
  warehouseName: string; // Tên kho
  action: string; // Hành động (Nhập kho, Xuất kho, Chuyển kho, v.v.)
  quantity: number; // Số lượng
  unit: string; // Đơn vị
}

/**
 * Transfer Traceability - Thông tin truy xuất nguồn gốc của phiếu chuyển kho
 */
export interface TransferTraceability {
  id: string; // ID truy xuất
  transferId: string; // ID phiếu chuyển kho
  transferCode: string; // Mã phiếu chuyển kho
  skuId: string; // ID SKU
  skuCode: string; // Mã SKU - Read-only
  skuName: string; // Tên hàng hóa - Read-only
  batchId: string; // ID lô - Required
  batchCode: string; // Mã lô - Read-only
  originAreaId?: string; // ID vùng trồng - Optional
  originAreaName?: string; // Tên vùng trồng - Optional (FSC / PEFC)
  harvestPlanId?: string; // ID kế hoạch khai thác - Optional
  harvestPlanCode?: string; // Mã kế hoạch khai thác - Optional
  supplierId?: string; // ID nhà cung cấp - Optional
  supplierName?: string; // Tên nhà cung cấp - Optional
  productionBatchId?: string; // ID lô sản xuất - Optional
  productionBatchCode?: string; // Mã lô sản xuất - Optional
  warehouseHistory: WarehouseHistoryEntry[]; // Lịch sử kho - Auto-generated, Timeline
  certification: CertificationType; // Chứng chỉ: FSC / PEFC / none
  traceStatus: TraceStatus; // Trạng thái truy xuất: Đầy đủ / Thiếu - Auto
  createdAt?: Date | string; // Ngày tạo
  updatedAt?: Date | string; // Ngày cập nhật
}
