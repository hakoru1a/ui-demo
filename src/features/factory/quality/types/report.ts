// ==============================|| QUALITY INSPECTION REPORT TYPES ||============================== //

/**
 * Report filter interface
 */
export interface QualityReportFilter {
  startDate: Date | null;
  endDate: Date | null;
  productIds: string[];
  batchIds: string[];
}

/**
 * Moisture trend over time data
 */
export interface MoistureTrendData {
  date: string; // Ngày kiểm tra
  moisture: number; // % Độ ẩm
}

/**
 * Impurity ratio by batch data
 */
export interface ImpurityByBatchData {
  batchCode: string; // Lô sản xuất
  impurity: number; // % Tạp chất
}

/**
 * QC result distribution data
 */
export interface QCResultDistributionData {
  result: 'passed' | 'failed'; // Nhóm chất lượng
  count: number; // Số phiếu
  label: string;
  color: string;
}
