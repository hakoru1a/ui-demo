import { lazy } from 'react';

// project imports
import Loadable from 'components/Loadable';
import DashboardLayout from 'layout/Dashboard';

import { WEIGH_TICKET_PATHS } from './types/constants';

// ==============================|| Weigh Tickets ROUTING ||============================== //

// Lazy load pages
const WeighTicketsListPage = Loadable(lazy(() => import('./pages/WeighTicketsListPage')));
const WeighTicketDetailPage = Loadable(lazy(() => import('./pages/WeighTicketDetailPage')));
const WeighTicketCreatePage = Loadable(lazy(() => import('./pages/WeighTicketCreatePage')));
const WeighTicketEditPage = Loadable(lazy(() => import('./pages/WeighTicketEditPage')));

const WeighticketsRoutes = {
  path: WEIGH_TICKET_PATHS.ROOT,
  element: <DashboardLayout />,
  children: [
    {
      path: WEIGH_TICKET_PATHS.LIST,
      element: <WeighTicketsListPage />
    },
    {
      path: WEIGH_TICKET_PATHS.NEW,
      element: <WeighTicketCreatePage />
    },
    {
      path: WEIGH_TICKET_PATHS.DETAIL,
      element: <WeighTicketDetailPage />
    },
    {
      path: WEIGH_TICKET_PATHS.EDIT,
      element: <WeighTicketEditPage />
    }
  ]
};

export default WeighticketsRoutes;
