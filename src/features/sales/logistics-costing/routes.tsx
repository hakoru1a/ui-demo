import { lazy } from 'react';

// project imports
import Loadable from 'components/Loadable';
import DashboardLayout from 'layout/Dashboard';

// ==============================|| Logistics Costing ROUTING ||============================== //

const LogisticsCostingListPage = Loadable(lazy(() => import('./pages/LogisticsCostingListPage')));
const LogisticsCostDetailPage = Loadable(lazy(() => import('./pages/LogisticsCostDetailPage')));
const LogisticsCostCreatePage = Loadable(lazy(() => import('./pages/LogisticsCostCreatePage')));
const LogisticsCostEditPage = Loadable(lazy(() => import('./pages/LogisticsCostEditPage')));

const LogisticscostingRoutes = {
  path: '/logistics-costing',
  element: <DashboardLayout />,
  children: [
    {
      path: '',
      element: <LogisticsCostingListPage />
    },
    {
      path: 'new',
      element: <LogisticsCostCreatePage />
    },
    {
      path: ':id',
      element: <LogisticsCostDetailPage />
    },
    {
      path: ':id/edit',
      element: <LogisticsCostEditPage />
    }
  ]
};

export default LogisticscostingRoutes;
