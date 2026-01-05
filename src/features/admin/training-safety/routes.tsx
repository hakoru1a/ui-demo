import { lazy } from 'react';

// project imports
import Loadable from 'components/Loadable';
import DashboardLayout from 'layout/Dashboard';

import { TRAINING_PATHS } from './types/constants';

// ==============================|| TRAINING & SAFETY ROUTING ||============================== //

// Lazy load pages
const TrainingListPage = Loadable(lazy(() => import('./pages/TrainingListPage')));
const TrainingDetailPage = Loadable(lazy(() => import('./pages/TrainingDetailPage')));
const TrainingCreatePage = Loadable(lazy(() => import('./pages/TrainingCreatePage')));
const TrainingEditPage = Loadable(lazy(() => import('./pages/TrainingEditPage')));
const TrainingSchedulePage = Loadable(lazy(() => import('./pages/TrainingSchedulePage')));

const TrainingSafetyRoutes = {
  path: TRAINING_PATHS.ROOT,
  element: <DashboardLayout />,
  children: [
    {
      path: TRAINING_PATHS.LIST,
      element: <TrainingListPage />
    },
    {
      path: TRAINING_PATHS.NEW,
      element: <TrainingCreatePage />
    },
    {
      path: TRAINING_PATHS.DETAIL,
      element: <TrainingDetailPage />
    },
    {
      path: TRAINING_PATHS.EDIT,
      element: <TrainingEditPage />
    },
    {
      path: 'schedule',
      element: <TrainingSchedulePage />
    }
  ]
};

export default TrainingSafetyRoutes;
