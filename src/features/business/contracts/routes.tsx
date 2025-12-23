import { lazy } from 'react';

// project imports
import Loadable from 'components/Loadable';
import DashboardLayout from 'layout/Dashboard';

// ==============================|| Contracts ROUTING ||============================== //

const ContractsListPage = Loadable(lazy(() => import('./pages/ContractsListPage')));
const ContractDetailPage = Loadable(lazy(() => import('./pages/ContractDetailPage')));
const ContractCreatePage = Loadable(lazy(() => import('./pages/ContractCreatePage')));
const ContractEditPage = Loadable(lazy(() => import('./pages/ContractEditPage')));

const ContractsRoutes = {
  path: '/contracts',
  element: <DashboardLayout />,
  children: [
    {
      path: '',
      element: <ContractsListPage />
    },
    {
      path: ':id',
      element: <ContractDetailPage />
    },
    {
      path: 'new',
      element: <ContractCreatePage />
    },
    {
      path: ':id/edit',
      element: <ContractEditPage />
    }
  ]
};

export default ContractsRoutes;
