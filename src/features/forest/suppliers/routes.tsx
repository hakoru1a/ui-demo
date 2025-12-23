import { lazy } from 'react';

// project imports
import Loadable from 'components/Loadable';
import DashboardLayout from 'layout/Dashboard';

// ==============================|| Suppliers ROUTING ||============================== //

const SuppliersListPage = Loadable(lazy(() => import('./pages/SuppliersListPage')));
const SupplierDetailPage = Loadable(lazy(() => import('./pages/SupplierDetailPage')));
const SupplierCreatePage = Loadable(lazy(() => import('./pages/SupplierCreatePage')));
const SupplierEditPage = Loadable(lazy(() => import('./pages/SupplierEditPage')));

const SuppliersRoutes = {
  path: '/suppliers',
  element: <DashboardLayout />,
  children: [
    {
      path: '',
      element: <SuppliersListPage />
    },
    {
      path: ':id',
      element: <SupplierDetailPage />
    },
    {
      path: 'new',
      element: <SupplierCreatePage />
    },
    {
      path: ':id/edit',
      element: <SupplierEditPage />
    }
  ]
};

export default SuppliersRoutes;
