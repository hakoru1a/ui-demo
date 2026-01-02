import { lazy } from 'react';

// project imports
import Loadable from 'components/Loadable';
import DashboardLayout from 'layout/Dashboard';

import { MATERIAL_RECEIPT_PATHS } from './types/constants';

// ==============================|| MATERIAL RECEIPTS ROUTING ||============================== //

const MaterialReceiptsListPage = Loadable(lazy(() => import('./pages/MaterialReceiptsListPage')));
const MaterialReceiptDetailPage = Loadable(lazy(() => import('./pages/MaterialReceiptDetailPage')));
const MaterialReceiptCreatePage = Loadable(lazy(() => import('./pages/MaterialReceiptCreatePage')));
const MaterialReceiptEditPage = Loadable(lazy(() => import('./pages/MaterialReceiptEditPage')));

const MaterialReceiptsRoutes = {
  path: MATERIAL_RECEIPT_PATHS.ROOT,
  element: <DashboardLayout />,
  children: [
    {
      path: MATERIAL_RECEIPT_PATHS.LIST,
      element: <MaterialReceiptsListPage />
    },
    {
      path: MATERIAL_RECEIPT_PATHS.NEW,
      element: <MaterialReceiptCreatePage />
    },
    {
      path: MATERIAL_RECEIPT_PATHS.DETAIL,
      element: <MaterialReceiptDetailPage />
    },
    {
      path: MATERIAL_RECEIPT_PATHS.EDIT,
      element: <MaterialReceiptEditPage />
    }
  ]
};

export default MaterialReceiptsRoutes;
