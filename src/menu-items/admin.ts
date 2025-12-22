import {
  SettingOutlined,
  BarChartOutlined,
  DashboardOutlined,
  LineChartOutlined,
  PieChartOutlined,
  UserOutlined,
  TeamOutlined,
  FileTextOutlined,
  SendOutlined,
  BookOutlined,
  SafetyCertificateOutlined,
  CustomerServiceOutlined,
  CalendarOutlined
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
          url: '/admin/reports/dashboard-kpi',
          icon: DashboardOutlined
        },
        {
          id: 'admin-pl-report',
          title: 'menu.admin.pl-report',
          type: 'item',
          url: '/admin/reports/pl-report',
          icon: LineChartOutlined
        },
        {
          id: 'admin-production-report',
          title: 'menu.admin.production-report',
          type: 'item',
          url: '/admin/reports/production-report',
          icon: BarChartOutlined
        },
        {
          id: 'admin-inventory-count-report',
          title: 'menu.admin.inventory-count-report',
          type: 'item',
          url: '/admin/reports/inventory-count-report',
          icon: PieChartOutlined
        },
        {
          id: 'admin-inbound-outbound-report',
          title: 'menu.admin.inbound-outbound-report',
          type: 'item',
          url: '/admin/reports/inbound-outbound-report',
          icon: BarChartOutlined
        },
        {
          id: 'admin-production-area-report',
          title: 'menu.admin.production-area-report',
          type: 'item',
          url: '/admin/reports/production-area-report',
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
          url: '/admin/hr/profile-contract-list',
          icon: TeamOutlined
        },
        {
          id: 'admin-hr-timesheet-payroll',
          title: 'menu.admin.hr-timesheet-payroll',
          type: 'item',
          url: '/admin/hr/timesheet-payroll',
          icon: FileTextOutlined
        },
        {
          id: 'admin-hr-dispatch-order',
          title: 'menu.admin.hr-dispatch-order',
          type: 'item',
          url: '/admin/hr/dispatch-order',
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
          url: '/admin/training/safety',
          icon: SafetyCertificateOutlined
        },
        {
          id: 'admin-complaints-handling',
          title: 'menu.admin.complaints-handling',
          type: 'item',
          url: '/admin/complaints/handling',
          icon: CustomerServiceOutlined
        },
        {
          id: 'admin-training-schedule',
          title: 'menu.admin.training-schedule',
          type: 'item',
          url: '/admin/training/schedule',
          icon: CalendarOutlined
        }
      ]
    }
  ]
};

export default admin;
