import { lazy } from 'react';

// project imports
import Loadable from 'components/Loadable';
import DashboardLayout from 'layout/Dashboard';

// ==============================|| Payments ROUTING ||============================== //

const PaymentsListPage = Loadable(lazy(() => import('./pages/PaymentsListPage')));
const PaymentDetailPage = Loadable(lazy(() => import('./pages/PaymentDetailPage')));
const PaymentCreatePage = Loadable(lazy(() => import('./pages/PaymentCreatePage')));
const PaymentApprovalPage = Loadable(lazy(() => import('./pages/PaymentApprovalPage')));

const PaymentsRoutes = {
  path: '/payments',
  element: <DashboardLayout />,
  children: [
    {
      path: '',
      element: <PaymentsListPage />
    },
    {
      path: ':id',
      element: <PaymentDetailPage />
    },
    {
      path: 'new',
      element: <PaymentCreatePage />
    },
    {
      path: ':id/approval',
      element: <PaymentApprovalPage />
    }
  ]
};

export default PaymentsRoutes;
