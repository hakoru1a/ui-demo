import { lazy } from 'react';

// project imports
import Loadable from 'components/Loadable';
import DashboardLayout from 'layout/Dashboard';

// ==============================|| Stock ROUTING ||============================== //

const StockPage = Loadable(lazy(() => import('./pages/StockPage')));

const StockRoutes = {
  path: '/stock',
  element: <DashboardLayout />,
  children: [
    {
      path: '',
      element: <StockPage />
    }
  ]
};

export default StockRoutes;
