import {
  EnvironmentOutlined,
  GlobalOutlined,
  FileProtectOutlined,
  ScissorOutlined,
  UnorderedListOutlined,
  BarChartOutlined,
  TeamOutlined,
  CalculatorOutlined
} from '@ant-design/icons';

import { NavItemType } from 'types/menu';

const forest: NavItemType = {
  id: 'forest',
  title: 'menu.forest.management',
  type: 'group',
  icon: EnvironmentOutlined,
  children: [
    {
      id: 'forest-planting-area',
      title: 'menu.forest.planting-area',
      type: 'collapse',
      icon: FileProtectOutlined,
      children: [
        {
          id: 'forest-planting-area-list',
          title: 'menu.forest.planting-area-list',
          type: 'item',
          url: '/forest-areas',
          icon: UnorderedListOutlined
        },
        {
          id: 'forest-map-view',
          title: 'menu.forest.map-view',
          type: 'item',
          url: '/forest-areas/map',
          icon: GlobalOutlined
        },
        {
          id: 'forest-legal-certificates',
          title: 'menu.forest.legal-certificates',
          type: 'item',
          url: '/legal-certificates',
          icon: FileProtectOutlined
        }
      ]
    },
    {
      id: 'forest-harvesting',
      title: 'menu.forest.harvesting',
      type: 'collapse',
      icon: ScissorOutlined,
      children: [
        {
          id: 'forest-harvest-plan-list',
          title: 'menu.forest.harvest-plan-list',
          type: 'item',
          url: '/harvest-plans',
          icon: UnorderedListOutlined
        },
        {
          id: 'forest-harvest-order-list',
          title: 'menu.forest.harvest-order-list',
          type: 'item',
          url: '/harvest-orders',
          icon: UnorderedListOutlined
        },
        {
          id: 'forest-harvest-production-report',
          title: 'menu.forest.harvest-production-report',
          type: 'item',
          url: '/harvest-reports',
          icon: BarChartOutlined
        }
      ]
    },
    {
      id: 'forest-suppliers',
      title: 'menu.forest.suppliers',
      type: 'collapse',
      icon: TeamOutlined,
      children: [
        {
          id: 'forest-supplier-list',
          title: 'menu.forest.supplier-list',
          type: 'item',
          url: '/suppliers',
          icon: UnorderedListOutlined
        },
        {
          id: 'forest-supplier-production-estimate',
          title: 'menu.forest.supplier-production-estimate',
          type: 'item',
          url: '/yield-estimation',
          icon: CalculatorOutlined
        }
      ]
    }
  ]
};

export default forest;
