import { lazy } from 'react';

// project imports
import Loadable from 'components/Loadable';
import DashboardLayout from 'layout/Dashboard';

// ==============================|| WORKFORCE DISPATCH ROUTING ||============================== //

const WorkforceDispatchOrderListPage = Loadable(lazy(() => import('./pages/WorkforceDispatchOrderListPage')));
const WorkforceDispatchOrderDetailPage = Loadable(lazy(() => import('./pages/WorkforceDispatchOrderDetailPage')));
const WorkforceDispatchOrderCreatePage = Loadable(lazy(() => import('./pages/WorkforceDispatchOrderCreatePage')));
const WorkforceDispatchOrderEditPage = Loadable(lazy(() => import('./pages/WorkforceDispatchOrderEditPage')));

const WorkforcedispatchRoutes = {
  path: '/workforce-dispatch',
  element: <DashboardLayout />,
  children: [
    {
      path: '',
      element: <WorkforceDispatchOrderListPage />
    },
    {
      path: 'new',
      element: <WorkforceDispatchOrderCreatePage />
    },
    {
      path: ':id',
      element: <WorkforceDispatchOrderDetailPage />
    },
    {
      path: ':id/edit',
      element: <WorkforceDispatchOrderEditPage />
    }
  ]
};

export default WorkforcedispatchRoutes;
