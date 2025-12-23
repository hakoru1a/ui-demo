import { lazy } from 'react';

// project imports
import Loadable from 'components/Loadable';
import DashboardLayout from 'layout/Dashboard';

// ==============================|| Shift Logs ROUTING ||============================== //

const ShiftLogsListPage = Loadable(lazy(() => import('./pages/ShiftLogsListPage')));
const ShiftLogDetailPage = Loadable(lazy(() => import('./pages/ShiftLogDetailPage')));
const ShiftLogCreatePage = Loadable(lazy(() => import('./pages/ShiftLogCreatePage')));

const ShiftlogsRoutes = {
  path: '/shift-logs',
  element: <DashboardLayout />,
  children: [
    {
      path: '',
      element: <ShiftLogsListPage />
    },
    {
      path: ':id',
      element: <ShiftLogDetailPage />
    },
    {
      path: 'new',
      element: <ShiftLogCreatePage />
    }
  ]
};

export default ShiftlogsRoutes;
