import {
  CalendarOutlined,
  DashboardOutlined,
  EnvironmentOutlined,
  SendOutlined,
  SettingOutlined,
  TeamOutlined,
  UnorderedListOutlined
} from '@ant-design/icons';

import { NavItemType } from 'types/menu';

const transport: NavItemType = {
  id: 'transport',
  title: 'menu.transport.management',
  type: 'group',
  children: [
    {
      id: 'transport-dispatch',
      title: 'menu.transport.dispatch',
      type: 'collapse',
      icon: SendOutlined,
      children: [
        {
          id: 'transport-vehicle-driver-list',
          title: 'menu.transport.vehicle-driver-list',
          type: 'item',
          url: '/fleet',
          icon: UnorderedListOutlined
        },
        {
          id: 'transport-dispatch-order-list',
          title: 'menu.transport.dispatch-order-list',
          type: 'item',
          url: '/dispatching',
          icon: UnorderedListOutlined
        },
        {
          id: 'transport-dispatch-schedule',
          title: 'menu.transport.dispatch-schedule',
          type: 'item',
          url: '/dispatching/schedule',
          icon: CalendarOutlined
        },
        {
          id: 'transport-tracking',
          title: 'menu.transport.tracking',
          type: 'item',
          url: '/tracking',
          icon: EnvironmentOutlined
        }
      ]
    },
    {
      id: 'transport-weighing-station',
      title: 'menu.transport.weighing-station',
      type: 'collapse',
      icon: DashboardOutlined,
      children: [
        {
          id: 'transport-weighing-screen',
          title: 'menu.transport.weighing-screen',
          type: 'item',
          url: '/weighbridge',
          icon: DashboardOutlined
        },
        {
          id: 'transport-weighing-slip-list',
          title: 'menu.transport.weighing-slip-list',
          type: 'item',
          url: '/weigh-tickets',
          icon: UnorderedListOutlined
        },
        {
          id: 'transport-customer-supplier-list',
          title: 'menu.transport.customer-supplier-list',
          type: 'item',
          url: '/partners',
          icon: TeamOutlined
        },
        {
          id: 'transport-price-setting',
          title: 'menu.transport.price-setting',
          type: 'item',
          url: '/price-engine',
          icon: SettingOutlined
        }
      ]
    }
  ]
};

export default transport;
