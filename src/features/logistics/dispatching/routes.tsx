import { lazy } from 'react';

// project imports
import Loadable from 'components/Loadable';
import DashboardLayout from 'layout/Dashboard';

// ==============================|| DISPATCHING ROUTING ||============================== //

const DispatchOrdersListPage = Loadable(lazy(() => import('./pages/DispatchOrdersListPage')));
const DispatchingSchedulePage = Loadable(lazy(() => import('./pages/DispatchingSchedulePage')));
const DispatchOrderDetailPage = Loadable(lazy(() => import('./pages/DispatchOrderDetailPage')));
const DispatchOrderCreatePage = Loadable(lazy(() => import('./pages/DispatchOrderCreatePage')));
const DispatchOrderEditPage = Loadable(lazy(() => import('./pages/DispatchOrderEditPage')));

const DispatchingRoutes = {
  path: '/dispatching',
  element: <DashboardLayout />,
  children: [
    {
      path: '',
      element: <DispatchOrdersListPage />
    },
    {
      path: 'schedule',
      element: <DispatchingSchedulePage />
    },
    {
      path: 'new',
      element: <DispatchOrderCreatePage />
    },
    {
      path: ':id',
      element: <DispatchOrderDetailPage />
    },
    {
      path: ':id/edit',
      element: <DispatchOrderEditPage />
    }
  ]
};

export default DispatchingRoutes;
