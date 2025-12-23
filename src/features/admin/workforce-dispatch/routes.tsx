import { lazy } from 'react';

// project imports
import Loadable from 'components/Loadable';
import DashboardLayout from 'layout/Dashboard';

// ==============================|| Workforce Dispatch ROUTING ||============================== //

const WorkforceDispatchListPage = Loadable(lazy(() => import('./pages/WorkforceDispatchListPage')));
const WorkforceDispatchDetailPage = Loadable(lazy(() => import('./pages/WorkforceDispatchDetailPage')));
const WorkforceDispatchSchedulePage = Loadable(lazy(() => import('./pages/WorkforceDispatchSchedulePage')));

const WorkforcedispatchRoutes = {
  path: '/workforce-dispatch',
  element: <DashboardLayout />,
  children: [
    {
      path: '',
      element: <WorkforceDispatchListPage />
    },
    {
      path: ':id',
      element: <WorkforceDispatchDetailPage />
    },
    {
      path: 'schedule',
      element: <WorkforceDispatchSchedulePage />
    }
  ]
};

export default WorkforcedispatchRoutes;
