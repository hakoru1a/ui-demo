import { lazy } from 'react';

// project imports
import Loadable from 'components/Loadable';
import DashboardLayout from 'layout/Dashboard';

// ==============================|| Export Documents ROUTING ||============================== //

const ExportDocumentsListPage = Loadable(lazy(() => import('./pages/ExportDocumentsListPage')));
const ExportDocumentDetailPage = Loadable(lazy(() => import('./pages/ExportDocumentDetailPage')));
const ExportDocumentCreatePage = Loadable(lazy(() => import('./pages/ExportDocumentCreatePage')));

const ExportdocumentsRoutes = {
  path: '/export-documents',
  element: <DashboardLayout />,
  children: [
    {
      path: '',
      element: <ExportDocumentsListPage />
    },
    {
      path: ':id',
      element: <ExportDocumentDetailPage />
    },
    {
      path: 'new',
      element: <ExportDocumentCreatePage />
    }
  ]
};

export default ExportdocumentsRoutes;
