import { lazy } from 'react';

// project imports
import Loadable from 'components/Loadable';
import DashboardLayout from 'layout/Dashboard';

// ==============================|| Shipments ROUTING ||============================== //

const ShipmentsListPage = Loadable(lazy(() => import('./pages/ShipmentsListPage')));
const ShipmentDetailPage = Loadable(lazy(() => import('./pages/ShipmentDetailPage')));
const ShipmentCreatePage = Loadable(lazy(() => import('./pages/ShipmentCreatePage')));

const ShipmentsRoutes = {
  path: '/shipments',
  element: <DashboardLayout />,
  children: [
    {
      path: '',
      element: <ShipmentsListPage />
    },
    {
      path: ':id',
      element: <ShipmentDetailPage />
    },
    {
      path: 'new',
      element: <ShipmentCreatePage />
    }
  ]
};

export default ShipmentsRoutes;
