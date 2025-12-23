import { lazy } from 'react';

// project imports
import Loadable from 'components/Loadable';
import DashboardLayout from 'layout/Dashboard';

// ==============================|| Complaints ROUTING ||============================== //

const ComplaintsListPage = Loadable(lazy(() => import('./pages/ComplaintsListPage')));
const ComplaintDetailPage = Loadable(lazy(() => import('./pages/ComplaintDetailPage')));
const ComplaintCreatePage = Loadable(lazy(() => import('./pages/ComplaintCreatePage')));

const ComplaintsRoutes = {
  path: '/complaints',
  element: <DashboardLayout />,
  children: [
    {
      path: '',
      element: <ComplaintsListPage />
    },
    {
      path: ':id',
      element: <ComplaintDetailPage />
    },
    {
      path: 'new',
      element: <ComplaintCreatePage />
    }
  ]
};

export default ComplaintsRoutes;
