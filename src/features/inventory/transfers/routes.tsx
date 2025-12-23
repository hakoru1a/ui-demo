import { lazy } from 'react';

// project imports
import Loadable from 'components/Loadable';
import DashboardLayout from 'layout/Dashboard';

// ==============================|| Transfers ROUTING ||============================== //

const TransfersListPage = Loadable(lazy(() => import('./pages/TransfersListPage')));
const TransferDetailPage = Loadable(lazy(() => import('./pages/TransferDetailPage')));
const TransferCreatePage = Loadable(lazy(() => import('./pages/TransferCreatePage')));

const TransfersRoutes = {
  path: '/transfers',
  element: <DashboardLayout />,
  children: [
    {
      path: '',
      element: <TransfersListPage />
    },
    {
      path: ':id',
      element: <TransferDetailPage />
    },
    {
      path: 'new',
      element: <TransferCreatePage />
    }
  ]
};

export default TransfersRoutes;
