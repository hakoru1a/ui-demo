import { lazy } from 'react';

// project imports
import Loadable from 'components/Loadable';
import DashboardLayout from 'layout/Dashboard';

// ==============================|| Material Receipts ROUTING ||============================== //

const MaterialReceiptsListPage = Loadable(lazy(() => import('./pages/MaterialReceiptsListPage')));
const MaterialReceiptDetailPage = Loadable(lazy(() => import('./pages/MaterialReceiptDetailPage')));
const MaterialReceiptCreatePage = Loadable(lazy(() => import('./pages/MaterialReceiptCreatePage')));

const MaterialreceiptsRoutes = {
  path: '/material-receipts',
  element: <DashboardLayout />,
  children: [
    {
      path: '',
      element: <MaterialReceiptsListPage />
    },
    {
      path: ':id',
      element: <MaterialReceiptDetailPage />
    },
    {
      path: 'new',
      element: <MaterialReceiptCreatePage />
    }
  ]
};

export default MaterialreceiptsRoutes;
