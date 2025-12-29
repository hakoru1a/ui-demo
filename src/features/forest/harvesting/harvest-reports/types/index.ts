export interface YieldOverTimeData {
  time: string; // Date string or label
  totalYield: number; // m3
  planYield: number; // m3, for comparison
}

export interface YieldByAreaData {
  areaName: string;
  totalYield: number; // m3
}

export interface CompletionRateData {
  status: 'completed' | 'ongoing' | 'pending';
  value: number; // percentage or count
  label: string;
  color: string;
}

export interface ReportFilter {
  startDate: Date | null;
  endDate: Date | null;
  forestAreaIds: string[];
}
