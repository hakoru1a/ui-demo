import { lazy } from 'react';

// project imports
import Loadable from 'components/Loadable';
import DashboardLayout from 'layout/Dashboard';

// ==============================|| Harvest Reports ROUTING ||============================== //

const HarvestReportsPage = Loadable(lazy(() => import('./pages/HarvestReportsPage')));

const HarvestreportsRoutes = {
  path: '/harvest-reports',
  element: <DashboardLayout />,
  children: [
    {
      path: '',
      element: <HarvestReportsPage />
    }
  ]
};

export default HarvestreportsRoutes;
