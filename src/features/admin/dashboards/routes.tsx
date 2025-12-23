import { lazy } from 'react';

// project imports
import Loadable from 'components/Loadable';
import DashboardLayout from 'layout/Dashboard';

// ==============================|| Dashboards ROUTING ||============================== //

const DashboardsPage = Loadable(lazy(() => import('./pages/DashboardsPage')));

const DashboardsRoutes = {
  path: '/dashboards',
  element: <DashboardLayout />,
  children: [
    {
      path: '',
      element: <DashboardsPage />
    }
  ]
};

export default DashboardsRoutes;
