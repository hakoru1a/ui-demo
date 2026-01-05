// ==============================|| QUALITY INSPECTION FORM TYPES ||============================== //

import type { CustomFile } from 'types/dropzone';

import type { QCResult } from './enums';

export interface QualityInspectionFormData {
  code: string; // Mã phiếu QC (Auto-generate, Read-only)
  inspectionDate: Date | string; // Ngày kiểm định - Required, Default: Today
  productId: string; // Thành phẩm - Required
  batchId: string; // Lô sản xuất - Required, Truy vết
  moisture: number; // Độ ẩm (%) - Required, Giới hạn theo tiêu chuẩn
  impurity: number; // Tạp chất (%) - Required
  result: QCResult; // Kết quả QC - Required, Auto: Tự gợi ý theo ngưỡng
  inspectorId: string; // Người kiểm tra - Required
  attachment?: File | string | CustomFile[]; // File kiểm định - Optional, Biên bản / Ảnh
  notes?: string; // Ghi chú
}
