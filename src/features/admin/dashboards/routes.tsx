import { lazy } from 'react';

// project imports
import Loadable from 'components/Loadable';
import DashboardLayout from 'layout/Dashboard';

// ==============================|| Dashboards ROUTING ||============================== //

const FactoryKPIPage = Loadable(lazy(() => import('./components/factory-kpi/FactoryKPIPage')));

const DashboardsRoutes = {
  path: '/dashboards',
  element: <DashboardLayout />,
  children: [
    {
      path: '',
      element: <FactoryKPIPage />
    }
  ]
};

export default DashboardsRoutes;
