import { lazy } from 'react';

// project imports
import Loadable from 'components/Loadable';
import DashboardLayout from 'layout/Dashboard';

// ==============================|| Transfers ROUTING ||============================== //

const TransfersListPage = Loadable(lazy(() => import('./pages/TransfersListPage')));
const TransferDetailPage = Loadable(lazy(() => import('./pages/TransferDetailPage')));
const TransferCreatePage = Loadable(lazy(() => import('./pages/TransferCreatePage')));
const TransferEditPage = Loadable(lazy(() => import('./pages/TransferEditPage')));
const TransferTraceabilityPage = Loadable(lazy(() => import('./pages/TransferTraceabilityPage')));

const TransfersRoutes = {
  path: '/transfers',
  element: <DashboardLayout />,
  children: [
    {
      path: '',
      element: <TransfersListPage />
    },
    {
      path: 'new',
      element: <TransferCreatePage />
    },
    {
      path: ':id',
      element: <TransferDetailPage />
    },
    {
      path: ':id/edit',
      element: <TransferEditPage />
    },
    {
      path: ':id/traceability',
      element: <TransferTraceabilityPage />
    }
  ]
};

export default TransfersRoutes;
