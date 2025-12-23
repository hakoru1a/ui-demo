import { lazy } from 'react';

// project imports
import Loadable from 'components/Loadable';
import DashboardLayout from 'layout/Dashboard';

// ==============================|| Timekeeping Payroll ROUTING ||============================== //

const TimekeepingListPage = Loadable(lazy(() => import('./pages/TimekeepingListPage')));
const TimekeepingDetailPage = Loadable(lazy(() => import('./pages/TimekeepingDetailPage')));
const PayrollListPage = Loadable(lazy(() => import('./pages/PayrollListPage')));
const PayrollDetailPage = Loadable(lazy(() => import('./pages/PayrollDetailPage')));

const TimekeepingpayrollRoutes = {
  path: '/timekeeping-payroll',
  element: <DashboardLayout />,
  children: [
    {
      path: 'timekeeping',
      element: <TimekeepingListPage />
    },
    {
      path: 'timekeeping/:id',
      element: <TimekeepingDetailPage />
    },
    {
      path: 'payroll',
      element: <PayrollListPage />
    },
    {
      path: 'payroll/:id',
      element: <PayrollDetailPage />
    }
  ]
};

export default TimekeepingpayrollRoutes;
