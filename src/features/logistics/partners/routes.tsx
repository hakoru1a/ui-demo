import { lazy } from 'react';

// project imports
import Loadable from 'components/Loadable';
import DashboardLayout from 'layout/Dashboard';

// ==============================|| Partners ROUTING ||============================== //

const PartnersListPage = Loadable(lazy(() => import('./pages/PartnersListPage')));
const PartnerDetailPage = Loadable(lazy(() => import('./pages/PartnerDetailPage')));
const PartnerCreatePage = Loadable(lazy(() => import('./pages/PartnerCreatePage')));
const PartnerEditPage = Loadable(lazy(() => import('./pages/PartnerEditPage')));

const PartnersRoutes = {
  path: '/partners',
  element: <DashboardLayout />,
  children: [
    {
      path: '',
      element: <PartnersListPage />
    },
    {
      path: ':id',
      element: <PartnerDetailPage />
    },
    {
      path: 'new',
      element: <PartnerCreatePage />
    },
    {
      path: ':id/edit',
      element: <PartnerEditPage />
    }
  ]
};

export default PartnersRoutes;
