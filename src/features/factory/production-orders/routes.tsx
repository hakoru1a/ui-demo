import { lazy } from 'react';

// project imports
import Loadable from 'components/Loadable';
import DashboardLayout from 'layout/Dashboard';

// ==============================|| Production Orders ROUTING ||============================== //

const ProductionOrdersListPage = Loadable(lazy(() => import('./pages/ProductionOrdersListPage')));
const ProductionOrderDetailPage = Loadable(lazy(() => import('./pages/ProductionOrderDetailPage')));
const ProductionOrderCreatePage = Loadable(lazy(() => import('./pages/ProductionOrderCreatePage')));
const ProductionOrderExecutionPage = Loadable(lazy(() => import('./pages/ProductionOrderExecutionPage')));

const ProductionordersRoutes = {
  path: '/production-orders',
  element: <DashboardLayout />,
  children: [
    {
      path: '',
      element: <ProductionOrdersListPage />
    },
    {
      path: ':id',
      element: <ProductionOrderDetailPage />
    },
    {
      path: 'new',
      element: <ProductionOrderCreatePage />
    },
    {
      path: ':id/execution',
      element: <ProductionOrderExecutionPage />
    }
  ]
};

export default ProductionordersRoutes;
