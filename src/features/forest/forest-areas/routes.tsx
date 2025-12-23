import { lazy } from 'react';

// project imports
import Loadable from 'components/Loadable';
import DashboardLayout from 'layout/Dashboard';

// ==============================|| Forest Areas ROUTING ||============================== //

const ForestAreasListPage = Loadable(lazy(() => import('./pages/ForestAreasListPage')));
const ForestAreaDetailPage = Loadable(lazy(() => import('./pages/ForestAreaDetailPage')));
const ForestAreaCreatePage = Loadable(lazy(() => import('./pages/ForestAreaCreatePage')));
const ForestAreaEditPage = Loadable(lazy(() => import('./pages/ForestAreaEditPage')));
const ForestAreasMapPage = Loadable(lazy(() => import('./pages/ForestAreasMapPage')));

const ForestareasRoutes = {
  path: '/forest-areas',
  element: <DashboardLayout />,
  children: [
    {
      path: '',
      element: <ForestAreasListPage />
    },
    {
      path: ':id',
      element: <ForestAreaDetailPage />
    },
    {
      path: 'new',
      element: <ForestAreaCreatePage />
    },
    {
      path: ':id/edit',
      element: <ForestAreaEditPage />
    },
    {
      path: 'map',
      element: <ForestAreasMapPage />
    }
  ]
};

export default ForestareasRoutes;
