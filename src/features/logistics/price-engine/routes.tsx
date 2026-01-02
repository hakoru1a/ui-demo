import { lazy } from 'react';

// project imports
import Loadable from 'components/Loadable';
import DashboardLayout from 'layout/Dashboard';

import { PRICE_TABLE_PATHS } from './types/constants';

// ==============================|| Price Engine ROUTING ||============================== //

// Lazy load pages
const PriceEngineListPage = Loadable(lazy(() => import('./pages/PriceEngineListPage')));
const PriceTableDetailPage = Loadable(lazy(() => import('./pages/PriceTableDetailPage')));
const PriceTableCreatePage = Loadable(lazy(() => import('./pages/PriceTableCreatePage')));
const PriceTableEditPage = Loadable(lazy(() => import('./pages/PriceTableEditPage')));

const PriceengineRoutes = {
  path: PRICE_TABLE_PATHS.ROOT,
  element: <DashboardLayout />,
  children: [
    {
      path: PRICE_TABLE_PATHS.LIST,
      element: <PriceEngineListPage />
    },
    {
      path: PRICE_TABLE_PATHS.NEW,
      element: <PriceTableCreatePage />
    },
    {
      path: PRICE_TABLE_PATHS.DETAIL,
      element: <PriceTableDetailPage />
    },
    {
      path: PRICE_TABLE_PATHS.EDIT,
      element: <PriceTableEditPage />
    }
  ]
};

export default PriceengineRoutes;
