import { lazy } from 'react';

// project imports
import Loadable from 'components/Loadable';
import DashboardLayout from 'layout/Dashboard';

// ==============================|| Vessel Tracking ROUTING ||============================== //

const VesselTrackingPage = Loadable(lazy(() => import('./pages/VesselTrackingPage')));

const VesseltrackingRoutes = {
  path: '/vessel-tracking',
  element: <DashboardLayout />,
  children: [
    {
      path: '',
      element: <VesselTrackingPage />
    }
  ]
};

export default VesseltrackingRoutes;
