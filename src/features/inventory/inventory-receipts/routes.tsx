import { lazy } from 'react';

// project imports
import Loadable from 'components/Loadable';
import DashboardLayout from 'layout/Dashboard';

// ==============================|| Inventory Receipts ROUTING ||============================== //

const InventoryReceiptsListPage = Loadable(lazy(() => import('./pages/InventoryReceiptsListPage')));
const InventoryReceiptDetailPage = Loadable(lazy(() => import('./pages/InventoryReceiptDetailPage')));
const InventoryReceiptCreatePage = Loadable(lazy(() => import('./pages/InventoryReceiptCreatePage')));
const InventoryReceiptEditPage = Loadable(lazy(() => import('./pages/InventoryReceiptEditPage')));

const InventoryreceiptsRoutes = {
  path: '/inventory-receipts',
  element: <DashboardLayout />,
  children: [
    {
      path: '',
      element: <InventoryReceiptsListPage />
    },
    {
      path: 'new',
      element: <InventoryReceiptCreatePage />
    },
    {
      path: ':id',
      element: <InventoryReceiptDetailPage />
    },
    {
      path: ':id/edit',
      element: <InventoryReceiptEditPage />
    }
  ]
};

export default InventoryreceiptsRoutes;
