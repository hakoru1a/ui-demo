// ==============================|| FEATURE ROUTES ||============================== //
// Auto-generated file - Do not edit manually
// Run: python scripts/generate-feature-routes-import.py

// admin
import ComplaintsRoutes from 'features/admin/complaints/routes';
import DashboardsRoutes from 'features/admin/dashboards/routes';
import HrRoutes from 'features/admin/hr/routes';
import ReportsRoutes from 'features/admin/reports/routes';
import TimekeepingPayrollRoutes from 'features/admin/timekeeping-payroll/routes';
import TrainingSafetyRoutes from 'features/admin/training-safety/routes';
import WorkforceDispatchRoutes from 'features/admin/workforce-dispatch/routes';
// business
import AdvancesRoutes from 'features/business/advances/routes';
import ContractsRoutes from 'features/business/contracts/routes';
import PabRoutes from 'features/business/pab/routes';
import PaymentsRoutes from 'features/business/payments/routes';
// factory
import BatchesRoutes from 'features/factory/batches/routes';
import MaterialReceiptsRoutes from 'features/factory/material-receipts/routes';
import ProductionOrdersRoutes from 'features/factory/production-orders/routes';
import ProductionPlansRoutes from 'features/factory/production-plans/routes';
import QualityRoutes from 'features/factory/quality/routes';
import ShiftLogsRoutes from 'features/factory/shift-logs/routes';
import ShipmentsRoutes from 'features/factory/shipments/routes';
// forest
import ForestareasRoutes from 'features/forest/forest-areas/routes';
import HarvestOrdersRoutes from 'features/forest/harvesting/harvest-orders/routes';
import HarvestPlansRoutes from 'features/forest/harvesting/harvest-plans/routes';
import HarvestReportsRoutes from 'features/forest/harvesting/harvest-reports/routes';
import LegalCertificatesRoutes from 'features/forest/legal-certificates/routes';
import SuppliersRoutes from 'features/forest/suppliers/routes';
import YieldEstimationRoutes from 'features/forest/yield-estimation/routes';
// inventory
import InventoryIssuesRoutes from 'features/inventory/inventory-issues/routes';
import InventoryReceiptsRoutes from 'features/inventory/inventory-receipts/routes';
import SkuRoutes from 'features/inventory/sku/routes';
import StockRoutes from 'features/inventory/stock/routes';
import StocktakesRoutes from 'features/inventory/stocktakes/routes';
import TraceabilityRoutes from 'features/inventory/traceability/routes';
import TransfersRoutes from 'features/inventory/transfers/routes';
// logistics
import DispatchingRoutes from 'features/logistics/dispatching/routes';
import FleetRoutes from 'features/logistics/fleet/routes';
import PartnersRoutes from 'features/logistics/partners/routes';
import PriceEngineRoutes from 'features/logistics/price-engine/routes';
import TrackingRoutes from 'features/logistics/tracking/routes';
import WeighTicketsRoutes from 'features/logistics/weigh-tickets/routes';
import WeighbridgeRoutes from 'features/logistics/weighbridge/routes';
// sales
import CrmRoutes from 'features/sales/crm/routes';
import ExportDocumentsRoutes from 'features/sales/export-documents/routes';
import ExportOrdersRoutes from 'features/sales/export-orders/routes';
import LogisticsCostingRoutes from 'features/sales/logistics-costing/routes';
import VesselTrackingRoutes from 'features/sales/vessel-tracking/routes';

// Export all feature routes
export const featureRoutes = [
  // admin
  ComplaintsRoutes,
  DashboardsRoutes,
  HrRoutes,
  ReportsRoutes,
  TimekeepingPayrollRoutes,
  TrainingSafetyRoutes,
  WorkforceDispatchRoutes,
  // business
  AdvancesRoutes,
  ContractsRoutes,
  PabRoutes,
  PaymentsRoutes,
  // factory
  BatchesRoutes,
  MaterialReceiptsRoutes,
  ProductionOrdersRoutes,
  ProductionPlansRoutes,
  QualityRoutes,
  ShiftLogsRoutes,
  ShipmentsRoutes,
  // forest
  ForestareasRoutes,
  HarvestOrdersRoutes,
  HarvestPlansRoutes,
  HarvestReportsRoutes,
  LegalCertificatesRoutes,
  SuppliersRoutes,
  YieldEstimationRoutes,
  // inventory
  InventoryIssuesRoutes,
  InventoryReceiptsRoutes,
  SkuRoutes,
  StockRoutes,
  StocktakesRoutes,
  TraceabilityRoutes,
  TransfersRoutes,
  // logistics
  DispatchingRoutes,
  FleetRoutes,
  PartnersRoutes,
  PriceEngineRoutes,
  TrackingRoutes,
  WeighbridgeRoutes,
  WeighTicketsRoutes,
  // sales
  CrmRoutes,
  ExportDocumentsRoutes,
  ExportOrdersRoutes,
  LogisticsCostingRoutes,
  VesselTrackingRoutes
];
