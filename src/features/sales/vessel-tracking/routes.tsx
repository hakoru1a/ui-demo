import { lazy } from 'react';

// project imports
import Loadable from 'components/Loadable';
import DashboardLayout from 'layout/Dashboard';

// ==============================|| Vessel Tracking ROUTING ||============================== //

const VesselTrackingListPage = Loadable(lazy(() => import('./pages/VesselTrackingListPage')));
const VesselTrackingDetailPage = Loadable(lazy(() => import('./pages/VesselTrackingDetailPage')));
const VesselTrackingCreatePage = Loadable(lazy(() => import('./pages/VesselTrackingCreatePage')));
const VesselTrackingEditPage = Loadable(lazy(() => import('./pages/VesselTrackingEditPage')));

const VesselTrackingRoutes = {
  path: '/vessel-tracking',
  element: <DashboardLayout />,
  children: [
    {
      path: '',
      element: <VesselTrackingListPage />
    },
    {
      path: 'new',
      element: <VesselTrackingCreatePage />
    },
    {
      path: ':id',
      element: <VesselTrackingDetailPage />
    },
    {
      path: ':id/edit',
      element: <VesselTrackingEditPage />
    }
  ]
};

export default VesselTrackingRoutes;
