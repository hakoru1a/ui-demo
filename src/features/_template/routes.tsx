import { lazy } from 'react';

// project imports
import Loadable from 'components/Loadable';
import DashboardLayout from 'layout/Dashboard';

// ==============================|| FEATURE_NAME ROUTING ||============================== //

// TODO: Replace 'FeatureName' with your actual feature name
// TODO: Replace 'feature-name' with your actual route path (kebab-case)
// TODO: Update the import path to match your feature structure

const FeatureNamePage = Loadable(lazy(() => import('./pages/FeatureNamePage')));

const FeatureNameRoutes = {
  path: '/feature-name',
  element: <DashboardLayout />,
  children: [
    {
      path: '',
      element: <FeatureNamePage />
    }
    // TODO: Add more routes as needed
    // {
    //   path: ':id',
    //   element: <FeatureNameDetailPage />
    // }
  ]
};

export default FeatureNameRoutes;
