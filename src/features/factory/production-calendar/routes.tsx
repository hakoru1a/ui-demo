import { lazy } from 'react';

// project imports
import Loadable from 'components/Loadable';
import DashboardLayout from 'layout/Dashboard';

// ==============================|| PRODUCTION CALENDAR ROUTING ||============================== //

const ProductionCalendarPage = Loadable(lazy(() => import('./pages/ProductionCalendarPage')));
const ProductionShiftDetailPage = Loadable(lazy(() => import('./pages/ProductionShiftDetailPage')));
const ProductionShiftCreatePage = Loadable(lazy(() => import('./pages/ProductionShiftCreatePage')));
const ProductionShiftEditPage = Loadable(lazy(() => import('./pages/ProductionShiftEditPage')));

const ProductionCalendarRoutes = {
  path: '/production-calendar',
  element: <DashboardLayout />,
  children: [
    {
      path: '',
      element: <ProductionCalendarPage />
    },
    {
      path: ':id',
      element: <ProductionShiftDetailPage />
    },
    {
      path: 'new',
      element: <ProductionShiftCreatePage />
    },
    {
      path: ':id/edit',
      element: <ProductionShiftEditPage />
    }
  ]
};

export default ProductionCalendarRoutes;
