import { lazy } from 'react';

// project imports
import Loadable from 'components/Loadable';
import DashboardLayout from 'layout/Dashboard';

// ==============================|| Yield Estimation ROUTING ||============================== //

const YieldEstimationPage = Loadable(lazy(() => import('./pages/YieldEstimationPage')));

const YieldestimationRoutes = {
  path: '/yield-estimation',
  element: <DashboardLayout />,
  children: [
    {
      path: '',
      element: <YieldEstimationPage />
    }
  ]
};

export default YieldestimationRoutes;
