import { lazy } from 'react';

// project imports
import Loadable from 'components/Loadable';
import DashboardLayout from 'layout/Dashboard';

// ==============================|| Inventory Issues ROUTING ||============================== //

const InventoryIssuesListPage = Loadable(lazy(() => import('./pages/InventoryIssuesListPage')));
const InventoryIssueDetailPage = Loadable(lazy(() => import('./pages/InventoryIssueDetailPage')));
const InventoryIssueCreatePage = Loadable(lazy(() => import('./pages/InventoryIssueCreatePage')));
const InventoryIssueEditPage = Loadable(lazy(() => import('./pages/InventoryIssueEditPage')));

const InventoryissuesRoutes = {
  path: '/inventory-issues',
  element: <DashboardLayout />,
  children: [
    {
      path: '',
      element: <InventoryIssuesListPage />
    },
    {
      path: 'new',
      element: <InventoryIssueCreatePage />
    },
    {
      path: ':id',
      element: <InventoryIssueDetailPage />
    },
    {
      path: ':id/edit',
      element: <InventoryIssueEditPage />
    }
  ]
};

export default InventoryissuesRoutes;
