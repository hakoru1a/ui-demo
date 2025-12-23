import { lazy } from 'react';

// project imports
import Loadable from 'components/Loadable';
import DashboardLayout from 'layout/Dashboard';

// ==============================|| Weigh Tickets ROUTING ||============================== //

const WeighTicketsListPage = Loadable(lazy(() => import('./pages/WeighTicketsListPage')));
const WeighTicketDetailPage = Loadable(lazy(() => import('./pages/WeighTicketDetailPage')));
const WeighTicketCreatePage = Loadable(lazy(() => import('./pages/WeighTicketCreatePage')));

const WeighticketsRoutes = {
  path: '/weigh-tickets',
  element: <DashboardLayout />,
  children: [
    {
      path: '',
      element: <WeighTicketsListPage />
    },
    {
      path: ':id',
      element: <WeighTicketDetailPage />
    },
    {
      path: 'new',
      element: <WeighTicketCreatePage />
    }
  ]
};

export default WeighticketsRoutes;
