import {
  BuildOutlined,
  InboxOutlined,
  UnorderedListOutlined,
  ToolOutlined,
  SettingOutlined,
  AppstoreOutlined,
  BookOutlined,
  ExportOutlined,
  SafetyOutlined,
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
          url: '/material-receipts',
          icon: UnorderedListOutlined
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
          url: '/production-plans',
          icon: SettingOutlined
        },
        {
          id: 'factory-production-order-list',
          title: 'menu.factory.production-order-list',
          type: 'item',
          url: '/production-orders',
          icon: UnorderedListOutlined
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
          url: '/batches',
          icon: UnorderedListOutlined
        },
        {
          id: 'factory-shift-operation-log',
          title: 'menu.factory.shift-operation-log',
          type: 'item',
          url: '/shift-logs',
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
          url: '/shipments',
          icon: UnorderedListOutlined
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
          id: 'factory-quality-inspection-slip-list',
          title: 'menu.factory.quality-inspection-slip-list',
          type: 'item',
          url: '/quality',
          icon: UnorderedListOutlined
        },
        {
          id: 'factory-quality-moisture-impurity-report',
          title: 'menu.factory.quality-moisture-impurity-report',
          type: 'item',
          url: '/quality/reports',
          icon: BarChartOutlined
        }
      ]
    }
  ]
};

export default factory;
