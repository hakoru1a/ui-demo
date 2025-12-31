import { lazy } from 'react';

// project imports
import Loadable from 'components/Loadable';
import DashboardLayout from 'layout/Dashboard';

// ==============================|| Export Orders ROUTING ||============================== //

const ExportOrdersListPage = Loadable(lazy(() => import('./pages/ExportOrdersListPage')));
const ExportOrderDetailPage = Loadable(lazy(() => import('./pages/ExportOrderDetailPage')));
const ExportOrderCreatePage = Loadable(lazy(() => import('./pages/ExportOrderCreatePage')));
const ExportOrderEditPage = Loadable(lazy(() => import('./pages/ExportOrderEditPage')));
const ExportOrderFulfillmentPage = Loadable(lazy(() => import('./pages/ExportOrderFulfillmentPage')));

const ExportordersRoutes = {
  path: '/export-orders',
  element: <DashboardLayout />,
  children: [
    {
      path: '',
      element: <ExportOrdersListPage />
    },
    {
      path: 'new',
      element: <ExportOrderCreatePage />
    },
    {
      path: ':id',
      element: <ExportOrderDetailPage />
    },
    {
      path: ':id/edit',
      element: <ExportOrderEditPage />
    },
    {
      path: ':id/fulfillment',
      element: <ExportOrderFulfillmentPage />
    }
  ]
};

export default ExportordersRoutes;
