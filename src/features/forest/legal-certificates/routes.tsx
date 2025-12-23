import { lazy } from 'react';

// project imports
import Loadable from 'components/Loadable';
import DashboardLayout from 'layout/Dashboard';

// ==============================|| Legal Certificates ROUTING ||============================== //

const LegalCertificatesListPage = Loadable(lazy(() => import('./pages/LegalCertificatesListPage')));
const LegalCertificateDetailPage = Loadable(lazy(() => import('./pages/LegalCertificateDetailPage')));
const LegalCertificateCreatePage = Loadable(lazy(() => import('./pages/LegalCertificateCreatePage')));
const LegalCertificateEditPage = Loadable(lazy(() => import('./pages/LegalCertificateEditPage')));

const LegalcertificatesRoutes = {
  path: '/legal-certificates',
  element: <DashboardLayout />,
  children: [
    {
      path: '',
      element: <LegalCertificatesListPage />
    },
    {
      path: ':id',
      element: <LegalCertificateDetailPage />
    },
    {
      path: 'new',
      element: <LegalCertificateCreatePage />
    },
    {
      path: ':id/edit',
      element: <LegalCertificateEditPage />
    }
  ]
};

export default LegalcertificatesRoutes;
