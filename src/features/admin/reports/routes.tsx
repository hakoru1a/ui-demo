import { lazy } from 'react';

// project imports
import Loadable from 'components/Loadable';
import DashboardLayout from 'layout/Dashboard';

// ==============================|| Reports ROUTING ||============================== //

const ReportsPage = Loadable(lazy(() => import('./pages/ReportsPage')));
const PLReportPage = Loadable(lazy(() => import('../dashboards/components/pl-report/PLReportPage')));
const ProductionReportPage = Loadable(lazy(() => import('../dashboards/components/production-report/ProductionReportPage')));
const InventoryReportPage = Loadable(lazy(() => import('../dashboards/components/inventory-report/InventoryReportPage')));
const ReceiptIssueReportPage = Loadable(lazy(() => import('../dashboards/components/receipt-issue-report/ReceiptIssueReportPage')));
const ForestYieldReportPage = Loadable(lazy(() => import('../dashboards/components/forest-yield-report/ForestYieldReportPage')));

const ReportsRoutes = {
  path: '/reports',
  element: <DashboardLayout />,
  children: [
    {
      path: '',
      element: <ReportsPage />
    },
    {
      path: 'pl-report',
      element: <PLReportPage />
    },
    {
      path: 'production-report',
      element: <ProductionReportPage />
    },
    {
      path: 'inventory-report',
      element: <InventoryReportPage />
    },
    {
      path: 'receipt-issue-report',
      element: <ReceiptIssueReportPage />
    },
    {
      path: 'forest-yield-report',
      element: <ForestYieldReportPage />
    }
  ]
};

export default ReportsRoutes;
