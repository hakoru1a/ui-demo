// Dashboard filter types
export interface DashboardFilter {
  startDate: Date | null;
  endDate: Date | null;
  factoryId?: string | null;
  productId?: string | null;
  forestAreaId?: string | null;
  warehouseId?: string | null;
  transactionType?: 'inbound' | 'outbound' | null;
  planId?: string | null;
  shiftId?: string | null;
  period?: 'day' | 'month' | 'quarter' | null;
  contractId?: string | null;
  certificateType?: 'FSC' | 'PEFC' | null;
  skuId?: string | null;
}

// SG-1-1: Factory KPI Dashboard
export interface FactoryKPIData {
  productionVolume: number;
  productionVolumeChange: number; // % change from previous period
  planAchievementRate: number; // %
  costPerTon: number;
  currentInventory: number; // Total SKU count
  qcPassRate: number; // %
}

export interface ProductionVolumeByTime {
  time: string;
  volume: number;
}

export interface CostByBusiness {
  category: string;
  production: number;
  logistics: number;
  other: number;
}

export interface InventoryByWarehouse {
  warehouse: string;
  quantity: number;
}

// SG-1-2: P&L Report
export interface PLReportData {
  revenue: number;
  costOfGoods: number;
  grossProfit: number;
  operatingExpenses: number;
  netProfit: number;
}

export interface RevenueVsCost {
  period: string;
  revenue: number;
  cost: number;
}

export interface ProfitMargin {
  period: string;
  margin: number; // %
}

// SG-1-3: Production Report
export interface ProductionReportItem {
  date: string;
  productionOrder: string;
  shift: string;
  plannedVolume: number;
  actualVolume: number;
  difference: number;
  achievementRate: number; // %
}

export interface ProductionPlanVsActual {
  date: string;
  planned: number;
  actual: number;
}

export interface ProductionByShift {
  shift: string;
  volume: number;
}

// SG-1-4: Inventory/Stocktake Report
export interface InventoryReportItem {
  sku: string;
  systemStock: number;
  actualStock: number;
  difference: number;
  stockValue: number;
}

// SG-1-5: Receipt/Issue Report
export interface ReceiptIssueReportItem {
  date: string;
  documentCode: string;
  type: 'inbound' | 'outbound';
  sku: string;
  quantity: number;
  partner: string; // Supplier or Customer
}

export interface InboundVsOutbound {
  date: string;
  inbound: number;
  outbound: number;
}

export interface InventoryTurnover {
  date: string;
  turnover: number;
}

// SG-1-6: Yield/Forest Area Report
export interface ForestAreaYield {
  forestArea: string;
  area: number; // ha
  yield: number; // m³ or tons
  fscRate: number; // %
}
