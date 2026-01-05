import { lazy } from 'react';

// project imports
import Loadable from 'components/Loadable';
import DashboardLayout from 'layout/Dashboard';

// ==============================|| Advances ROUTING ||============================== //

const AdvancesListPage = Loadable(lazy(() => import('./pages/AdvancesListPage')));
const AdvanceDetailPage = Loadable(lazy(() => import('./pages/AdvanceDetailPage')));
const AdvanceCreatePage = Loadable(lazy(() => import('./pages/AdvanceCreatePage')));
const AdvanceEditPage = Loadable(lazy(() => import('./pages/AdvanceEditPage')));
const AdvanceApprovalPage = Loadable(lazy(() => import('./pages/AdvanceApprovalPage')));
const AdvanceReconciliationPage = Loadable(lazy(() => import('./pages/AdvanceReconciliationPage')));

const AdvancesRoutes = {
  path: '/advances',
  element: <DashboardLayout />,
  children: [
    {
      path: '',
      element: <AdvancesListPage />
    },
    {
      path: ':id',
      element: <AdvanceDetailPage />
    },
    {
      path: 'new',
      element: <AdvanceCreatePage />
    },
    {
      path: ':id/edit',
      element: <AdvanceEditPage />
    },
    {
      path: ':id/approval',
      element: <AdvanceApprovalPage />
    },
    {
      path: ':id/reconciliation',
      element: <AdvanceReconciliationPage />
    }
  ]
};

export default AdvancesRoutes;
