import { lazy } from 'react';

// project imports
import Loadable from 'components/Loadable';
import DashboardLayout from 'layout/Dashboard';

// ==============================|| Logistics Costing ROUTING ||============================== //

const LogisticsCostingListPage = Loadable(lazy(() => import('./pages/LogisticsCostingListPage')));
const LogisticsCostDetailPage = Loadable(lazy(() => import('./pages/LogisticsCostDetailPage')));
const LogisticsCostCreatePage = Loadable(lazy(() => import('./pages/LogisticsCostCreatePage')));

const LogisticscostingRoutes = {
  path: '/logistics-costing',
  element: <DashboardLayout />,
  children: [
    {
      path: '',
      element: <LogisticsCostingListPage />
    },
    {
      path: ':id',
      element: <LogisticsCostDetailPage />
    },
    {
      path: 'new',
      element: <LogisticsCostCreatePage />
    }
  ]
};

export default LogisticscostingRoutes;
