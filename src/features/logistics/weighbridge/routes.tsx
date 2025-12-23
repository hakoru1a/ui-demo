import { lazy } from 'react';

// project imports
import Loadable from 'components/Loadable';
import DashboardLayout from 'layout/Dashboard';

// ==============================|| Weighbridge ROUTING ||============================== //

const WeighbridgeMonitorPage = Loadable(lazy(() => import('./pages/WeighbridgeMonitorPage')));
const WeighbridgeStatusPage = Loadable(lazy(() => import('./pages/WeighbridgeStatusPage')));

const WeighbridgeRoutes = {
  path: '/weighbridge',
  element: <DashboardLayout />,
  children: [
    {
      path: '',
      element: <WeighbridgeMonitorPage />
    },
    {
      path: 'status',
      element: <WeighbridgeStatusPage />
    }
  ]
};

export default WeighbridgeRoutes;
