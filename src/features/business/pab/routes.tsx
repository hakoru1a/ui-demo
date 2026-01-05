import { lazy } from 'react';

// project imports
import Loadable from 'components/Loadable';
import DashboardLayout from 'layout/Dashboard';

// ==============================|| PAB ROUTING ||============================== //

const PabListPage = Loadable(lazy(() => import('./pages/PabListPage')));
const PabDetailPage = Loadable(lazy(() => import('./pages/PabDetailPage')));
const PabCreatePage = Loadable(lazy(() => import('./pages/PabCreatePage')));
const PabEditPage = Loadable(lazy(() => import('./pages/PabEditPage')));
const PabApprovalPage = Loadable(lazy(() => import('./pages/PabApprovalPage')));
const PabTransactionPage = Loadable(lazy(() => import('./pages/PabTransactionPage')));
const PabReportsPage = Loadable(lazy(() => import('./pages/PabReportsPage')));

const PabRoutes = {
  path: '/pab',
  element: <DashboardLayout />,
  children: [
    {
      path: '',
      element: <PabListPage />
    },
    {
      path: ':id',
      element: <PabDetailPage />
    },
    {
      path: 'new',
      element: <PabCreatePage />
    },
    {
      path: ':id/edit',
      element: <PabEditPage />
    },
    {
      path: ':id/approval',
      element: <PabApprovalPage />
    },
    {
      path: ':id/transaction',
      element: <PabTransactionPage />
    },
    {
      path: 'reports',
      element: <PabReportsPage />
    }
  ]
};

export default PabRoutes;
