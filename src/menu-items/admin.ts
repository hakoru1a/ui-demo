import {
  SettingOutlined,
  BarChartOutlined,
  DashboardOutlined,
  UserOutlined,
  TeamOutlined,
  FileTextOutlined,
  SendOutlined,
  BookOutlined,
  SafetyCertificateOutlined,
  CustomerServiceOutlined
} from '@ant-design/icons';

import { NavItemType } from 'types/menu';

const admin: NavItemType = {
  id: 'admin',
  title: 'menu.admin.management',
  type: 'group',
  icon: SettingOutlined,
  children: [
    {
      id: 'admin-reports',
      title: 'menu.admin.reports',
      type: 'collapse',
      icon: BarChartOutlined,
      children: [
        {
          id: 'admin-dashboard-kpi',
          title: 'menu.admin.dashboard-kpi',
          type: 'item',
          url: '/dashboards',
          icon: DashboardOutlined
        },
        {
          id: 'admin-reports',
          title: 'menu.admin.reports',
          type: 'item',
          url: '/reports',
          icon: BarChartOutlined
        }
      ]
    },
    {
      id: 'admin-hr',
      title: 'menu.admin.hr',
      type: 'collapse',
      icon: UserOutlined,
      children: [
        {
          id: 'admin-hr-profile-contract-list',
          title: 'menu.admin.hr-profile-contract-list',
          type: 'item',
          url: '/hr/employees',
          icon: TeamOutlined
        },
        {
          id: 'admin-hr-timesheet-payroll',
          title: 'menu.admin.hr-timesheet-payroll',
          type: 'item',
          url: '/timekeeping',
          icon: FileTextOutlined
        },
        {
          id: 'admin-hr-dispatch-order',
          title: 'menu.admin.hr-dispatch-order',
          type: 'item',
          url: '/workforce-dispatch',
          icon: SendOutlined
        }
      ]
    },
    {
      id: 'admin-complaints-training',
      title: 'menu.admin.complaints-training',
      type: 'collapse',
      icon: BookOutlined,
      children: [
        {
          id: 'admin-training-safety',
          title: 'menu.admin.training-safety',
          type: 'item',
          url: '/training',
          icon: SafetyCertificateOutlined
        },
        {
          id: 'admin-complaints-handling',
          title: 'menu.admin.complaints-handling',
          type: 'item',
          url: '/complaints',
          icon: CustomerServiceOutlined
        }
      ]
    }
  ]
};

export default admin;
