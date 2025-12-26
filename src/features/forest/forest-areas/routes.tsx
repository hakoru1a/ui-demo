import { lazy } from 'react';

// project imports
import Loadable from 'components/Loadable';
import DashboardLayout from 'layout/Dashboard';

import { FOREST_AREA_PATHS } from './types/constants';

// ==============================|| Forest Areas ROUTING ||============================== //

// Lazy load pages
const ForestAreasListPage = Loadable(lazy(() => import('./pages/ForestAreasListPage')));
const ForestAreaDetailPage = Loadable(lazy(() => import('./pages/ForestAreaDetailPage')));
const ForestAreaCreatePage = Loadable(lazy(() => import('./pages/ForestAreaCreatePage')));
const ForestAreaEditPage = Loadable(lazy(() => import('./pages/ForestAreaEditPage')));
const ForestAreasMapPage = Loadable(lazy(() => import('./pages/ForestAreasMapPage')));

const ForestAreasRoutes = {
  path: FOREST_AREA_PATHS.ROOT,
  element: <DashboardLayout />,
  children: [
    {
      path: FOREST_AREA_PATHS.LIST,
      element: <ForestAreasListPage />
    },
    {
      path: FOREST_AREA_PATHS.NEW,
      element: <ForestAreaCreatePage />
    },
    {
      path: FOREST_AREA_PATHS.MAP,
      element: <ForestAreasMapPage />
    },
    {
      path: FOREST_AREA_PATHS.DETAIL,
      element: <ForestAreaDetailPage />
    },
    {
      path: FOREST_AREA_PATHS.EDIT,
      element: <ForestAreaEditPage />
    }
  ]
};

export default ForestAreasRoutes;
