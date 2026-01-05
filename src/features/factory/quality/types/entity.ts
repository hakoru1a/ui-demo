// ==============================|| QUALITY INSPECTION ENTITY ||============================== //

import type { QCResult } from './enums';

export interface QualityInspection {
  id: string; // ID phiếu kiểm định
  code: string; // Mã phiếu QC (Auto-generate, Read-only)
  inspectionDate: Date | string; // Ngày kiểm định
  productId: string; // Thành phẩm ID
  productName: string; // Tên thành phẩm
  batchId: string; // Lô sản xuất ID
  batchCode: string; // Mã lô sản xuất
  moisture: number; // Độ ẩm (%) - Giới hạn theo tiêu chuẩn
  impurity: number; // Tạp chất (%)
  result: QCResult; // Kết quả QC: Đạt / Không đạt
  inspectorId: string; // Người kiểm tra ID
  inspectorName: string; // Tên người kiểm tra
  attachment?: string; // File kiểm định (URL) - Biên bản / Ảnh
  notes?: string; // Ghi chú
  createdAt?: Date | string; // Ngày tạo
  updatedAt?: Date | string; // Ngày cập nhật
}
