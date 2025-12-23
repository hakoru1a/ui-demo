import { lazy } from 'react';

// project imports
import Loadable from 'components/Loadable';
import DashboardLayout from 'layout/Dashboard';

// ==============================|| Production Plans ROUTING ||============================== //

const ProductionPlansListPage = Loadable(lazy(() => import('./pages/ProductionPlansListPage')));
const ProductionPlanDetailPage = Loadable(lazy(() => import('./pages/ProductionPlanDetailPage')));
const ProductionPlanCreatePage = Loadable(lazy(() => import('./pages/ProductionPlanCreatePage')));
const ProductionPlanEditPage = Loadable(lazy(() => import('./pages/ProductionPlanEditPage')));

const ProductionplansRoutes = {
  path: '/production-plans',
  element: <DashboardLayout />,
  children: [
    {
      path: '',
      element: <ProductionPlansListPage />
    },
    {
      path: ':id',
      element: <ProductionPlanDetailPage />
    },
    {
      path: 'new',
      element: <ProductionPlanCreatePage />
    },
    {
      path: ':id/edit',
      element: <ProductionPlanEditPage />
    }
  ]
};

export default ProductionplansRoutes;
