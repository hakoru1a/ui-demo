import { lazy } from 'react';

// project imports
import Loadable from 'components/Loadable';
import DashboardLayout from 'layout/Dashboard';

// ==============================|| STOCKTAKES ROUTING ||============================== //

const StocktakesListPage = Loadable(lazy(() => import('./pages/StocktakesListPage')));
const StocktakeSchedulePage = Loadable(lazy(() => import('./pages/StocktakeSchedulePage')));
const StocktakeDetailPage = Loadable(lazy(() => import('./pages/StocktakeDetailPage')));
const StocktakeCreatePage = Loadable(lazy(() => import('./pages/StocktakeCreatePage')));
const StocktakeEditPage = Loadable(lazy(() => import('./pages/StocktakeEditPage')));

const StocktakesRoutes = {
  path: '/stocktakes',
  element: <DashboardLayout />,
  children: [
    {
      path: '',
      element: <StocktakesListPage />
    },
    {
      path: 'schedule',
      element: <StocktakeSchedulePage />
    },
    {
      path: 'new',
      element: <StocktakeCreatePage />
    },
    {
      path: ':id',
      element: <StocktakeDetailPage />
    },
    {
      path: ':id/edit',
      element: <StocktakeEditPage />
    }
  ]
};

export default StocktakesRoutes;
