import { lazy } from 'react';

// project imports
import Loadable from 'components/Loadable';
import DashboardLayout from 'layout/Dashboard';

// ==============================|| Batches ROUTING ||============================== //

const BatchesListPage = Loadable(lazy(() => import('./pages/BatchesListPage')));
const BatchDetailPage = Loadable(lazy(() => import('./pages/BatchDetailPage')));

const BatchesRoutes = {
  path: '/batches',
  element: <DashboardLayout />,
  children: [
    {
      path: '',
      element: <BatchesListPage />
    },
    {
      path: ':id',
      element: <BatchDetailPage />
    }
  ]
};

export default BatchesRoutes;
