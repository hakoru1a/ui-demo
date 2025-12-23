import { lazy } from 'react';

// project imports
import Loadable from 'components/Loadable';
import DashboardLayout from 'layout/Dashboard';

// ==============================|| Traceability ROUTING ||============================== //

const TraceabilityPage = Loadable(lazy(() => import('./pages/TraceabilityPage')));

const TraceabilityRoutes = {
  path: '/traceability',
  element: <DashboardLayout />,
  children: [
    {
      path: '',
      element: <TraceabilityPage />
    }
  ]
};

export default TraceabilityRoutes;
