import { lazy } from 'react';

// project imports
import Loadable from 'components/Loadable';
import DashboardLayout from 'layout/Dashboard';

// ==============================|| Traceability ROUTING ||============================== //

const TransferTraceabilityPage = Loadable(lazy(() => import('../transfers/pages/TransferTraceabilityPage')));

const TraceabilityRoutes = {
  path: '/traceability',
  element: <DashboardLayout />,
  children: [
    {
      path: '',
      element: <TransferTraceabilityPage />
    }
  ]
};

export default TraceabilityRoutes;
