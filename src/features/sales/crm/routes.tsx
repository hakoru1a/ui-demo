import { lazy } from 'react';

// project imports
import Loadable from 'components/Loadable';
import DashboardLayout from 'layout/Dashboard';

// ==============================|| CRM ROUTING ||============================== //

const CustomersListPage = Loadable(lazy(() => import('./pages/CustomersListPage')));
const CustomerDetailPage = Loadable(lazy(() => import('./pages/CustomerDetailPage')));
const CustomerCreatePage = Loadable(lazy(() => import('./pages/CustomerCreatePage')));
const CustomerEditPage = Loadable(lazy(() => import('./pages/CustomerEditPage')));

const CrmRoutes = {
  path: '/crm',
  element: <DashboardLayout />,
  children: [
    {
      path: 'customers',
      element: <CustomersListPage />
    },
    {
      path: 'customers/:id',
      element: <CustomerDetailPage />
    },
    {
      path: 'customers/new',
      element: <CustomerCreatePage />
    },
    {
      path: 'customers/:id/edit',
      element: <CustomerEditPage />
    }
  ]
};

export default CrmRoutes;
