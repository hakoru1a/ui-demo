// ==============================|| YIELD ESTIMATION REPORT TYPES ||============================== //

export interface YieldOverTimeData {
  time: string; // Month label (e.g., "01/2024")
  totalYield: number; // Total m³
}

export interface YieldBySupplierData {
  supplierName: string;
  totalYield: number; // Total m³
}

export interface SupplyShareData {
  supplierName: string;
  percentage: number; // Percentage of total supply
  value: number; // Total m³
  color: string;
}

export interface YieldReportFilter {
  startDate: Date | null;
  endDate: Date | null;
  supplierIds: string[]; // Multiple suppliers can be selected
}
