import { lazy } from 'react';

// project imports
import Loadable from 'components/Loadable';
import DashboardLayout from 'layout/Dashboard';

// ==============================|| Fleet ROUTING ||============================== //

const FleetListPage = Loadable(lazy(() => import('./pages/FleetListPage')));
const VehicleDetailPage = Loadable(lazy(() => import('./pages/VehicleDetailPage')));
const VehicleCreatePage = Loadable(lazy(() => import('./pages/VehicleCreatePage')));
const VehicleEditPage = Loadable(lazy(() => import('./pages/VehicleEditPage')));
const DriverDetailPage = Loadable(lazy(() => import('./pages/DriverDetailPage')));
const DriverCreatePage = Loadable(lazy(() => import('./pages/DriverCreatePage')));
const DriverEditPage = Loadable(lazy(() => import('./pages/DriverEditPage')));

const FleetRoutes = {
  path: '/fleet',
  element: <DashboardLayout />,
  children: [
    {
      path: '',
      element: <FleetListPage />
    },
    {
      path: 'vehicles/:id',
      element: <VehicleDetailPage />
    },
    {
      path: 'vehicles/new',
      element: <VehicleCreatePage />
    },
    {
      path: 'vehicles/:id/edit',
      element: <VehicleEditPage />
    },
    {
      path: 'drivers/:id',
      element: <DriverDetailPage />
    },
    {
      path: 'drivers/new',
      element: <DriverCreatePage />
    },
    {
      path: 'drivers/:id/edit',
      element: <DriverEditPage />
    }
  ]
};

export default FleetRoutes;
