import { lazy } from 'react';

// project imports
import Loadable from 'components/Loadable';
import DashboardLayout from 'layout/Dashboard';

// ==============================|| SKU ROUTING ||============================== //

const SkuListPage = Loadable(lazy(() => import('./pages/SkuListPage')));
const SkuDetailPage = Loadable(lazy(() => import('./pages/SkuDetailPage')));
const SkuCreatePage = Loadable(lazy(() => import('./pages/SkuCreatePage')));
const SkuEditPage = Loadable(lazy(() => import('./pages/SkuEditPage')));

const SkuRoutes = {
  path: '/sku',
  element: <DashboardLayout />,
  children: [
    {
      path: '',
      element: <SkuListPage />
    },
    {
      path: ':id',
      element: <SkuDetailPage />
    },
    {
      path: 'new',
      element: <SkuCreatePage />
    },
    {
      path: ':id/edit',
      element: <SkuEditPage />
    }
  ]
};

export default SkuRoutes;
