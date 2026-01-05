import { lazy } from 'react';

// project imports
import Loadable from 'components/Loadable';
import DashboardLayout from 'layout/Dashboard';

// ==============================|| Quality ROUTING ||============================== //

const QualityInspectionsListPage = Loadable(lazy(() => import('./pages/QualityInspectionsListPage')));
const QualityInspectionDetailPage = Loadable(lazy(() => import('./pages/QualityInspectionDetailPage')));
const QualityInspectionCreatePage = Loadable(lazy(() => import('./pages/QualityInspectionCreatePage')));
const QualityInspectionEditPage = Loadable(lazy(() => import('./pages/QualityInspectionEditPage')));
const QualityReportsPage = Loadable(lazy(() => import('./pages/QualityReportsPage')));

const QualityRoutes = {
  path: '/quality',
  element: <DashboardLayout />,
  children: [
    {
      path: '',
      element: <QualityInspectionsListPage />
    },
    {
      path: ':id',
      element: <QualityInspectionDetailPage />
    },
    {
      path: ':id/edit',
      element: <QualityInspectionEditPage />
    },
    {
      path: 'new',
      element: <QualityInspectionCreatePage />
    },
    {
      path: 'reports',
      element: <QualityReportsPage />
    }
  ]
};

export default QualityRoutes;
