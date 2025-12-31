import { lazy } from 'react';

// project imports
import Loadable from 'components/Loadable';
import DashboardLayout from 'layout/Dashboard';

// ==============================|| Export Documents ROUTING ||============================== //

const ExportDocumentsListPage = Loadable(lazy(() => import('./pages/ExportDocumentsListPage')));
const ExportDocumentDetailPage = Loadable(lazy(() => import('./pages/ExportDocumentDetailPage')));
const ExportDocumentCreatePage = Loadable(lazy(() => import('./pages/ExportDocumentCreatePage')));
const ExportDocumentEditPage = Loadable(lazy(() => import('./pages/ExportDocumentEditPage')));

const ExportDocumentsRoutes = {
  path: '/export-documents',
  element: <DashboardLayout />,
  children: [
    {
      path: '',
      element: <ExportDocumentsListPage />
    },
    {
      path: 'new',
      element: <ExportDocumentCreatePage />
    },
    {
      path: ':id',
      element: <ExportDocumentDetailPage />
    },
    {
      path: ':id/edit',
      element: <ExportDocumentEditPage />
    }
  ]
};

export default ExportDocumentsRoutes;
