import { lazy } from 'react';

// project imports
import Loadable from 'components/Loadable';
import DashboardLayout from 'layout/Dashboard';

// ==============================|| Training Safety ROUTING ||============================== //

const TrainingListPage = Loadable(lazy(() => import('./pages/TrainingListPage')));
const TrainingDetailPage = Loadable(lazy(() => import('./pages/TrainingDetailPage')));
const TrainingCreatePage = Loadable(lazy(() => import('./pages/TrainingCreatePage')));
const SafetyIncidentsPage = Loadable(lazy(() => import('./pages/SafetyIncidentsPage')));

const TrainingsafetyRoutes = {
  path: '/training-safety',
  element: <DashboardLayout />,
  children: [
    {
      path: 'training',
      element: <TrainingListPage />
    },
    {
      path: 'training/:id',
      element: <TrainingDetailPage />
    },
    {
      path: 'training/new',
      element: <TrainingCreatePage />
    },
    {
      path: 'safety/incidents',
      element: <SafetyIncidentsPage />
    }
  ]
};

export default TrainingsafetyRoutes;
