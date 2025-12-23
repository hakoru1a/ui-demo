import { lazy } from 'react';

// project imports
import Loadable from 'components/Loadable';
import DashboardLayout from 'layout/Dashboard';

// ==============================|| Price Engine ROUTING ||============================== //

const PriceEngineListPage = Loadable(lazy(() => import('./pages/PriceEngineListPage')));
const PriceTableDetailPage = Loadable(lazy(() => import('./pages/PriceTableDetailPage')));
const PriceTableCreatePage = Loadable(lazy(() => import('./pages/PriceTableCreatePage')));

const PriceengineRoutes = {
  path: '/price-engine',
  element: <DashboardLayout />,
  children: [
    {
      path: '',
      element: <PriceEngineListPage />
    },
    {
      path: ':id',
      element: <PriceTableDetailPage />
    },
    {
      path: 'new',
      element: <PriceTableCreatePage />
    }
  ]
};

export default PriceengineRoutes;
