import { lazy } from 'react';

// project imports
import Loadable from 'components/Loadable';
import DashboardLayout from 'layout/Dashboard';

// ==============================|| Reports ROUTING ||============================== //

const ReportsPage = Loadable(lazy(() => import('./pages/ReportsPage')));

const ReportsRoutes = {
  path: '/reports',
  element: <DashboardLayout />,
  children: [
    {
      path: '',
      element: <ReportsPage />
    }
  ]
};

export default ReportsRoutes;
