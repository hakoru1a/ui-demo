import { lazy } from 'react';

// project imports
import Loadable from 'components/Loadable';
import DashboardLayout from 'layout/Dashboard';

// ==============================|| Dispatching ROUTING ||============================== //

const DispatchingListPage = Loadable(lazy(() => import('./pages/DispatchingListPage')));
const DispatchOrderDetailPage = Loadable(lazy(() => import('./pages/DispatchOrderDetailPage')));
const DispatchOrderCreatePage = Loadable(lazy(() => import('./pages/DispatchOrderCreatePage')));
const DispatchingSchedulePage = Loadable(lazy(() => import('./pages/DispatchingSchedulePage')));

const DispatchingRoutes = {
  path: '/dispatching',
  element: <DashboardLayout />,
  children: [
    {
      path: '',
      element: <DispatchingListPage />
    },
    {
      path: ':id',
      element: <DispatchOrderDetailPage />
    },
    {
      path: 'new',
      element: <DispatchOrderCreatePage />
    },
    {
      path: 'schedule',
      element: <DispatchingSchedulePage />
    }
  ]
};

export default DispatchingRoutes;
