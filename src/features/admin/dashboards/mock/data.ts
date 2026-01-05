import type {
  FactoryKPIData,
  ProductionVolumeByTime,
  CostByBusiness,
  InventoryByWarehouse,
  PLReportData,
  RevenueVsCost,
  ProfitMargin,
  ProductionReportItem,
  ProductionPlanVsActual,
  ProductionByShift,
  InventoryReportItem,
  ReceiptIssueReportItem,
  InboundVsOutbound,
  InventoryTurnover,
  ForestAreaYield
} from '../types';

// SG-1-1: Factory KPI Mock Data
export const mockFactoryKPIData: FactoryKPIData = {
  productionVolume: 12500,
  productionVolumeChange: 8.5,
  planAchievementRate: 92.5,
  costPerTon: 1250000,
  currentInventory: 245,
  qcPassRate: 96.8
};

export const mockProductionVolumeByTime: ProductionVolumeByTime[] = [
  { time: 'T1', volume: 1200 },
  { time: 'T2', volume: 1350 },
  { time: 'T3', volume: 1280 },
  { time: 'T4', volume: 1420 },
  { time: 'T5', volume: 1380 },
  { time: 'T6', volume: 1500 },
  { time: 'T7', volume: 1450 },
  { time: 'T8', volume: 1600 }
];

export const mockCostByBusiness: CostByBusiness[] = [
  { category: 'T1', production: 1200000000, logistics: 800000000, other: 200000000 },
  { category: 'T2', production: 1350000000, logistics: 850000000, other: 250000000 },
  { category: 'T3', production: 1280000000, logistics: 820000000, other: 220000000 },
  { category: 'T4', production: 1420000000, logistics: 900000000, other: 280000000 },
  { category: 'T5', production: 1380000000, logistics: 880000000, other: 260000000 },
  { category: 'T6', production: 1500000000, logistics: 950000000, other: 300000000 }
];

export const mockInventoryByWarehouse: InventoryByWarehouse[] = [
  { warehouse: 'Kho A', quantity: 8500 },
  { warehouse: 'Kho B', quantity: 6200 },
  { warehouse: 'Kho C', quantity: 4800 },
  { warehouse: 'Kho D', quantity: 3500 }
];

// SG-1-2: P&L Report Mock Data
export const mockPLReportData: PLReportData = {
  revenue: 50000000000,
  costOfGoods: 30000000000,
  grossProfit: 20000000000,
  operatingExpenses: 8000000000,
  netProfit: 12000000000
};

export const mockRevenueVsCost: RevenueVsCost[] = [
  { period: 'T1', revenue: 4500000000, cost: 2800000000 },
  { period: 'T2', revenue: 4800000000, cost: 2900000000 },
  { period: 'T3', revenue: 5200000000, cost: 3100000000 },
  { period: 'T4', revenue: 5500000000, cost: 3300000000 },
  { period: 'T5', revenue: 5800000000, cost: 3500000000 },
  { period: 'T6', revenue: 6200000000, cost: 3700000000 }
];

export const mockProfitMargin: ProfitMargin[] = [
  { period: 'T1', margin: 37.8 },
  { period: 'T2', margin: 39.6 },
  { period: 'T3', margin: 40.4 },
  { period: 'T4', margin: 40.0 },
  { period: 'T5', margin: 39.7 },
  { period: 'T6', margin: 40.3 }
];

// SG-1-3: Production Report Mock Data
export const mockProductionReportItems: ProductionReportItem[] = [
  {
    date: '2024-01-15',
    productionOrder: 'PO-2024-001',
    shift: 'Ca 1',
    plannedVolume: 500,
    actualVolume: 485,
    difference: -15,
    achievementRate: 97.0
  },
  {
    date: '2024-01-15',
    productionOrder: 'PO-2024-002',
    shift: 'Ca 2',
    plannedVolume: 500,
    actualVolume: 510,
    difference: 10,
    achievementRate: 102.0
  },
  {
    date: '2024-01-16',
    productionOrder: 'PO-2024-003',
    shift: 'Ca 1',
    plannedVolume: 520,
    actualVolume: 505,
    difference: -15,
    achievementRate: 97.1
  },
  {
    date: '2024-01-16',
    productionOrder: 'PO-2024-004',
    shift: 'Ca 2',
    plannedVolume: 520,
    actualVolume: 525,
    difference: 5,
    achievementRate: 101.0
  },
  {
    date: '2024-01-17',
    productionOrder: 'PO-2024-005',
    shift: 'Ca 1',
    plannedVolume: 510,
    actualVolume: 495,
    difference: -15,
    achievementRate: 97.1
  }
];

export const mockProductionPlanVsActual: ProductionPlanVsActual[] = [
  { date: '2024-01-15', planned: 1000, actual: 995 },
  { date: '2024-01-16', planned: 1040, actual: 1030 },
  { date: '2024-01-17', planned: 1020, actual: 1005 },
  { date: '2024-01-18', planned: 1050, actual: 1045 },
  { date: '2024-01-19', planned: 1030, actual: 1020 }
];

export const mockProductionByShift: ProductionByShift[] = [
  { shift: 'Ca 1', volume: 2450 },
  { shift: 'Ca 2', volume: 2520 },
  { shift: 'Ca 3', volume: 2380 }
];

// SG-1-4: Inventory/Stocktake Report Mock Data
export const mockInventoryReportItems: InventoryReportItem[] = [
  {
    sku: 'SKU-001',
    systemStock: 1250,
    actualStock: 1245,
    difference: -5,
    stockValue: 15562500
  },
  {
    sku: 'SKU-002',
    systemStock: 850,
    actualStock: 855,
    difference: 5,
    stockValue: 10687500
  },
  {
    sku: 'SKU-003',
    systemStock: 620,
    actualStock: 615,
    difference: -5,
    stockValue: 7687500
  },
  {
    sku: 'SKU-004',
    systemStock: 420,
    actualStock: 425,
    difference: 5,
    stockValue: 5312500
  },
  {
    sku: 'SKU-005',
    systemStock: 380,
    actualStock: 375,
    difference: -5,
    stockValue: 4687500
  }
];

// SG-1-5: Receipt/Issue Report Mock Data
export const mockReceiptIssueReportItems: ReceiptIssueReportItem[] = [
  {
    date: '2024-01-15',
    documentCode: 'NH-2024-001',
    type: 'inbound',
    sku: 'SKU-001',
    quantity: 500,
    partner: 'NCC A'
  },
  {
    date: '2024-01-15',
    documentCode: 'XH-2024-001',
    type: 'outbound',
    sku: 'SKU-002',
    quantity: 300,
    partner: 'Khách hàng B'
  },
  {
    date: '2024-01-16',
    documentCode: 'NH-2024-002',
    type: 'inbound',
    sku: 'SKU-003',
    quantity: 400,
    partner: 'NCC C'
  },
  {
    date: '2024-01-16',
    documentCode: 'XH-2024-002',
    type: 'outbound',
    sku: 'SKU-001',
    quantity: 250,
    partner: 'Khách hàng D'
  }
];

export const mockInboundVsOutbound: InboundVsOutbound[] = [
  { date: '2024-01-15', inbound: 500, outbound: 300 },
  { date: '2024-01-16', inbound: 400, outbound: 250 },
  { date: '2024-01-17', inbound: 600, outbound: 350 },
  { date: '2024-01-18', inbound: 450, outbound: 280 },
  { date: '2024-01-19', inbound: 550, outbound: 320 }
];

export const mockInventoryTurnover: InventoryTurnover[] = [
  { date: '2024-01-15', turnover: 800 },
  { date: '2024-01-16', turnover: 650 },
  { date: '2024-01-17', turnover: 950 },
  { date: '2024-01-18', turnover: 730 },
  { date: '2024-01-19', turnover: 870 }
];

// SG-1-6: Yield/Forest Area Report Mock Data
export const mockForestAreaYield: ForestAreaYield[] = [
  {
    forestArea: 'Vùng A',
    area: 250,
    yield: 12500,
    fscRate: 95.5
  },
  {
    forestArea: 'Vùng B',
    area: 180,
    yield: 9000,
    fscRate: 92.0
  },
  {
    forestArea: 'Vùng C',
    area: 320,
    yield: 16000,
    fscRate: 98.5
  },
  {
    forestArea: 'Vùng D',
    area: 200,
    yield: 10000,
    fscRate: 88.0
  },
  {
    forestArea: 'Vùng E',
    area: 150,
    yield: 7500,
    fscRate: 90.5
  }
];
