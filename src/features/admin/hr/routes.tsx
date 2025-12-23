import { lazy } from 'react';

// project imports
import Loadable from 'components/Loadable';
import DashboardLayout from 'layout/Dashboard';

// ==============================|| HR ROUTING ||============================== //

const EmployeesListPage = Loadable(lazy(() => import('./pages/EmployeesListPage')));
const EmployeeDetailPage = Loadable(lazy(() => import('./pages/EmployeeDetailPage')));
const EmployeeCreatePage = Loadable(lazy(() => import('./pages/EmployeeCreatePage')));
const EmployeeEditPage = Loadable(lazy(() => import('./pages/EmployeeEditPage')));

const HrRoutes = {
  path: '/hr',
  element: <DashboardLayout />,
  children: [
    {
      path: 'employees',
      element: <EmployeesListPage />
    },
    {
      path: 'employees/:id',
      element: <EmployeeDetailPage />
    },
    {
      path: 'employees/new',
      element: <EmployeeCreatePage />
    },
    {
      path: 'employees/:id/edit',
      element: <EmployeeEditPage />
    }
  ]
};

export default HrRoutes;
