import {
  CalendarOutlined,
  DashboardOutlined,
  EnvironmentOutlined,
  FileTextOutlined,
  SendOutlined,
  SettingOutlined,
  TeamOutlined,
  UnorderedListOutlined,
  UserOutlined
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
          url: '/transport/vehicle-driver/list',
          icon: UnorderedListOutlined
        },
        {
          id: 'transport-vehicle-driver-detail',
          title: 'menu.transport.vehicle-driver-detail',
          type: 'item',
          url: '/transport/vehicle-driver/detail',
          icon: UserOutlined
        },
        {
          id: 'transport-dispatch-order-list',
          title: 'menu.transport.dispatch-order-list',
          type: 'item',
          url: '/transport/dispatch/order-list',
          icon: UnorderedListOutlined
        },
        {
          id: 'transport-dispatch-detail',
          title: 'menu.transport.dispatch-detail',
          type: 'item',
          url: '/transport/dispatch/detail',
          icon: FileTextOutlined
        },
        {
          id: 'transport-dispatch-schedule',
          title: 'menu.transport.dispatch-schedule',
          type: 'item',
          url: '/transport/dispatch/schedule',
          icon: CalendarOutlined
        },
        {
          id: 'transport-tracking',
          title: 'menu.transport.tracking',
          type: 'item',
          url: '/transport/tracking',
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
          url: '/transport/weighing/screen',
          icon: DashboardOutlined
        },
        {
          id: 'transport-weighing-slip-list',
          title: 'menu.transport.weighing-slip-list',
          type: 'item',
          url: '/transport/weighing/slip-list',
          icon: UnorderedListOutlined
        },
        {
          id: 'transport-weighing-slip-detail',
          title: 'menu.transport.weighing-slip-detail',
          type: 'item',
          url: '/transport/weighing/slip-detail',
          icon: FileTextOutlined
        },
        {
          id: 'transport-customer-supplier-list',
          title: 'menu.transport.customer-supplier-list',
          type: 'item',
          url: '/transport/customer-supplier/list',
          icon: TeamOutlined
        },
        {
          id: 'transport-customer-detail',
          title: 'menu.transport.customer-detail',
          type: 'item',
          url: '/transport/customer/detail',
          icon: UserOutlined
        },
        {
          id: 'transport-price-setting',
          title: 'menu.transport.price-setting',
          type: 'item',
          url: '/transport/price-setting',
          icon: SettingOutlined
        }
      ]
    }
  ]
};

export default transport;
