import {
  BuildOutlined,
  InboxOutlined,
  UnorderedListOutlined,
  FileTextOutlined,
  ToolOutlined,
  SettingOutlined,
  AppstoreOutlined,
  CalendarOutlined,
  BookOutlined,
  ExportOutlined,
  SafetyOutlined,
  CheckCircleOutlined,
  BarChartOutlined
} from '@ant-design/icons';

import { NavItemType } from 'types/menu';

const factory: NavItemType = {
  id: 'factory',
  title: 'menu.factory.management',
  type: 'group',
  icon: BuildOutlined,
  children: [
    {
      id: 'factory-raw-material-inbound',
      title: 'menu.factory.raw-material-inbound',
      type: 'collapse',
      icon: InboxOutlined,
      children: [
        {
          id: 'factory-raw-material-slip-list',
          title: 'menu.factory.raw-material-slip-list',
          type: 'item',
          url: '/factory/raw-material/slip-list',
          icon: UnorderedListOutlined
        },
        {
          id: 'factory-raw-material-slip-detail',
          title: 'menu.factory.raw-material-slip-detail',
          type: 'item',
          url: '/factory/raw-material/slip-detail',
          icon: FileTextOutlined
        }
      ]
    },
    {
      id: 'factory-production-plan',
      title: 'menu.factory.production-plan',
      type: 'collapse',
      icon: ToolOutlined,
      children: [
        {
          id: 'factory-production-plan-setup',
          title: 'menu.factory.production-plan-setup',
          type: 'item',
          url: '/factory/production/plan-setup',
          icon: SettingOutlined
        },
        {
          id: 'factory-production-order-list',
          title: 'menu.factory.production-order-list',
          type: 'item',
          url: '/factory/production/order-list',
          icon: UnorderedListOutlined
        },
        {
          id: 'factory-production-order-detail',
          title: 'menu.factory.production-order-detail',
          type: 'item',
          url: '/factory/production/order-detail',
          icon: FileTextOutlined
        }
      ]
    },
    {
      id: 'factory-batch-shift',
      title: 'menu.factory.batch-shift',
      type: 'collapse',
      icon: AppstoreOutlined,
      children: [
        {
          id: 'factory-batch-list',
          title: 'menu.factory.batch-list',
          type: 'item',
          url: '/factory/batch/list',
          icon: UnorderedListOutlined
        },
        {
          id: 'factory-batch-detail',
          title: 'menu.factory.batch-detail',
          type: 'item',
          url: '/factory/batch/detail',
          icon: FileTextOutlined
        },
        {
          id: 'factory-production-schedule-log',
          title: 'menu.factory.production-schedule-log',
          type: 'item',
          url: '/factory/batch/schedule-log',
          icon: CalendarOutlined
        },
        {
          id: 'factory-shift-operation-log',
          title: 'menu.factory.shift-operation-log',
          type: 'item',
          url: '/factory/batch/shift-log',
          icon: BookOutlined
        }
      ]
    },
    {
      id: 'factory-outbound',
      title: 'menu.factory.outbound',
      type: 'collapse',
      icon: ExportOutlined,
      children: [
        {
          id: 'factory-outbound-slip-list',
          title: 'menu.factory.outbound-slip-list',
          type: 'item',
          url: '/factory/outbound/slip-list',
          icon: UnorderedListOutlined
        },
        {
          id: 'factory-outbound-slip-detail',
          title: 'menu.factory.outbound-slip-detail',
          type: 'item',
          url: '/factory/outbound/slip-detail',
          icon: FileTextOutlined
        }
      ]
    },
    {
      id: 'factory-quality',
      title: 'menu.factory.quality',
      type: 'collapse',
      icon: SafetyOutlined,
      children: [
        {
          id: 'factory-quality-moisture-impurity-report',
          title: 'menu.factory.quality-moisture-impurity-report',
          type: 'item',
          url: '/factory/quality/moisture-impurity-report',
          icon: BarChartOutlined
        },
        {
          id: 'factory-quality-inspection-slip-list',
          title: 'menu.factory.quality-inspection-slip-list',
          type: 'item',
          url: '/factory/quality/inspection-slip-list',
          icon: UnorderedListOutlined
        },
        {
          id: 'factory-quality-inspection-detail',
          title: 'menu.factory.quality-inspection-detail',
          type: 'item',
          url: '/factory/quality/inspection-detail',
          icon: CheckCircleOutlined
        }
      ]
    }
  ]
};

export default factory;
