import { lazy } from 'react';

// project imports
import Loadable from 'components/Loadable';
import DashboardLayout from 'layout/Dashboard';

// ==============================|| Stocktakes ROUTING ||============================== //

const StocktakesListPage = Loadable(lazy(() => import('./pages/StocktakesListPage')));
const StocktakeDetailPage = Loadable(lazy(() => import('./pages/StocktakeDetailPage')));
const StocktakeCreatePage = Loadable(lazy(() => import('./pages/StocktakeCreatePage')));
const StocktakeExecutionPage = Loadable(lazy(() => import('./pages/StocktakeExecutionPage')));

const StocktakesRoutes = {
  path: '/stocktakes',
  element: <DashboardLayout />,
  children: [
    {
      path: '',
      element: <StocktakesListPage />
    },
    {
      path: ':id',
      element: <StocktakeDetailPage />
    },
    {
      path: 'new',
      element: <StocktakeCreatePage />
    },
    {
      path: ':id/execution',
      element: <StocktakeExecutionPage />
    }
  ]
};

export default StocktakesRoutes;
