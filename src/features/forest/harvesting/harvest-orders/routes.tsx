import { lazy } from 'react';

// project imports
import Loadable from 'components/Loadable';
import DashboardLayout from 'layout/Dashboard';

// ==============================|| Harvest Orders ROUTING ||============================== //

const HarvestOrdersListPage = Loadable(lazy(() => import('./pages/HarvestOrdersListPage')));
const HarvestOrderDetailPage = Loadable(lazy(() => import('./pages/HarvestOrderDetailPage')));
const HarvestOrderCreatePage = Loadable(lazy(() => import('./pages/HarvestOrderCreatePage')));
const HarvestOrderExecutionPage = Loadable(lazy(() => import('./pages/HarvestOrderExecutionPage')));

const HarvestordersRoutes = {
  path: '/harvest-orders',
  element: <DashboardLayout />,
  children: [
    {
      path: '',
      element: <HarvestOrdersListPage />
    },
    {
      path: ':id',
      element: <HarvestOrderDetailPage />
    },
    {
      path: 'new',
      element: <HarvestOrderCreatePage />
    },
    {
      path: ':id/execution',
      element: <HarvestOrderExecutionPage />
    }
  ]
};

export default HarvestordersRoutes;
