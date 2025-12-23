import { lazy } from 'react';

// project imports
import Loadable from 'components/Loadable';
import DashboardLayout from 'layout/Dashboard';

// ==============================|| Harvest Plans ROUTING ||============================== //

const HarvestPlansListPage = Loadable(lazy(() => import('./pages/HarvestPlansListPage')));
const HarvestPlanDetailPage = Loadable(lazy(() => import('./pages/HarvestPlanDetailPage')));
const HarvestPlanCreatePage = Loadable(lazy(() => import('./pages/HarvestPlanCreatePage')));
const HarvestPlanEditPage = Loadable(lazy(() => import('./pages/HarvestPlanEditPage')));

const HarvestplansRoutes = {
  path: '/harvest-plans',
  element: <DashboardLayout />,
  children: [
    {
      path: '',
      element: <HarvestPlansListPage />
    },
    {
      path: ':id',
      element: <HarvestPlanDetailPage />
    },
    {
      path: 'new',
      element: <HarvestPlanCreatePage />
    },
    {
      path: ':id/edit',
      element: <HarvestPlanEditPage />
    }
  ]
};

export default HarvestplansRoutes;
