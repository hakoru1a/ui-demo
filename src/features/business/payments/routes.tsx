import { lazy } from 'react';

// project imports
import Loadable from 'components/Loadable';
import DashboardLayout from 'layout/Dashboard';

// ==============================|| Payments ROUTING ||============================== //

const PaymentsListPage = Loadable(lazy(() => import('./pages/PaymentsListPage')));
const PaymentDetailPage = Loadable(lazy(() => import('./pages/PaymentDetailPage')));
const PaymentCreatePage = Loadable(lazy(() => import('./pages/PaymentCreatePage')));
const PaymentEditPage = Loadable(lazy(() => import('./pages/PaymentEditPage')));
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
      path: 'new',
      element: <PaymentCreatePage />
    },
    {
      path: ':id',
      element: <PaymentDetailPage />
    },
    {
      path: ':id/edit',
      element: <PaymentEditPage />
    },
    {
      path: ':id/approval',
      element: <PaymentApprovalPage />
    }
  ]
};

export default PaymentsRoutes;
