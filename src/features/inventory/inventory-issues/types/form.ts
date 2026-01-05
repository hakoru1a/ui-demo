// ==============================|| INVENTORY ISSUE FORM TYPES ||============================== //

import type { CustomFile } from 'types/dropzone';

import type { IssueStatus, IssueType } from './enums';

export interface InventoryIssueFormData {
  code: string; // Mã phiếu xuất (Auto-generate, Read-only)
  issueDate: Date | string; // Ngày xuất - Required, Default: Today
  issueType: IssueType; // Loại xuất: Nguyên liệu / Thành phẩm - Required, Default: 'material'
  warehouseId: string; // ID kho xuất - Required
  productId: string; // ID hàng hóa - Required
  batchId?: string; // ID lô - Optional (Traceability)
  quantity: number; // Số lượng - Required, > 0
  unit: string; // Đơn vị - Required, Default: 'Kg'
  destination?: string; // Điểm nhận: SX / Bán - Optional
  referenceDoc?: CustomFile[]; // Chứng từ (File Upload) - Optional
  status: IssueStatus; // Trạng thái: Nháp / Đã xuất / Hủy - Required, Default: 'draft'
  notes?: string; // Ghi chú - Optional
}
