import { lazy } from 'react';

// project imports
import Loadable from 'components/Loadable';
import DashboardLayout from 'layout/Dashboard';

// ==============================|| Tracking ROUTING ||============================== //

const TrackingPage = Loadable(lazy(() => import('./pages/TrackingPage')));

const TrackingRoutes = {
  path: '/tracking',
  element: <DashboardLayout />,
  children: [
    {
      path: '',
      element: <TrackingPage />
    }
  ]
};

export default TrackingRoutes;
