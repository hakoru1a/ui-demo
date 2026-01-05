// ==============================|| PAB REPORT TYPES ||============================== //

import type { PabStatus } from './enums';

// Filter for reports
export interface PabReportFilter {
  startDate: Date | null;
  endDate: Date | null;
}

// Data for "Số lượng PAB theo trạng thái" (Bar chart)
export interface PabStatusCountData {
  status: PabStatus;
  label: string;
  count: number;
  color: string;
}

// Data for "Giá trị PAB theo thời gian" (Line chart)
export interface PabValueByTimeData {
  month: string; // Format: "YYYY-MM" or "MM/YYYY"
  totalValue: number;
}

// Data for "Tỷ lệ duyệt / từ chối" (Pie chart)
export interface PabApprovalRatioData {
  result: 'approved' | 'rejected';
  label: string;
  count: number;
  percentage: number;
  color: string;
}
