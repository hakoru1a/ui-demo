import { lazy } from 'react';

// project imports
import Loadable from 'components/Loadable';
import DashboardLayout from 'layout/Dashboard';

// ==============================|| FLEET ROUTING ||============================== //

const FleetListPage = Loadable(lazy(() => import('./pages/FleetListPage')));
const VehicleDetailPage = Loadable(lazy(() => import('./pages/VehicleDetailPage')));
const VehicleCreatePage = Loadable(lazy(() => import('./pages/VehicleCreatePage')));
const VehicleEditPage = Loadable(lazy(() => import('./pages/VehicleEditPage')));

const FleetRoutes = {
  path: '/fleet',
  element: <DashboardLayout />,
  children: [
    {
      path: '',
      element: <FleetListPage />
    },
    {
      path: 'new',
      element: <VehicleCreatePage />
    },
    {
      path: ':id',
      element: <VehicleDetailPage />
    },
    {
      path: ':id/edit',
      element: <VehicleEditPage />
    }
  ]
};

export default FleetRoutes;
