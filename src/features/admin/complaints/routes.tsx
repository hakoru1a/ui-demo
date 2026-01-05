import { lazy } from 'react';

// project imports
import Loadable from 'components/Loadable';
import DashboardLayout from 'layout/Dashboard';

import { COMPLAINT_PATHS } from './types/constants';

// ==============================|| COMPLAINTS ROUTING ||============================== //

// Lazy load pages
const ComplaintsListPage = Loadable(lazy(() => import('./pages/ComplaintsListPage')));
const ComplaintDetailPage = Loadable(lazy(() => import('./pages/ComplaintDetailPage')));
const ComplaintCreatePage = Loadable(lazy(() => import('./pages/ComplaintCreatePage')));
const ComplaintEditPage = Loadable(lazy(() => import('./pages/ComplaintEditPage')));

const ComplaintsRoutes = {
  path: COMPLAINT_PATHS.ROOT,
  element: <DashboardLayout />,
  children: [
    {
      path: COMPLAINT_PATHS.LIST,
      element: <ComplaintsListPage />
    },
    {
      path: COMPLAINT_PATHS.NEW,
      element: <ComplaintCreatePage />
    },
    {
      path: COMPLAINT_PATHS.DETAIL,
      element: <ComplaintDetailPage />
    },
    {
      path: COMPLAINT_PATHS.EDIT,
      element: <ComplaintEditPage />
    }
  ]
};

export default ComplaintsRoutes;
