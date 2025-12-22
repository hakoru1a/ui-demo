import {
  EnvironmentOutlined,
  GlobalOutlined,
  FileProtectOutlined,
  ScissorOutlined,
  UnorderedListOutlined,
  FileTextOutlined,
  BarChartOutlined,
  TeamOutlined,
  ShopOutlined,
  HistoryOutlined,
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
          url: '/forest/planting-area/list',
          icon: UnorderedListOutlined
        },
        {
          id: 'forest-planting-area-detail',
          title: 'menu.forest.planting-area-detail',
          type: 'item',
          url: '/forest/planting-area/detail',
          icon: FileTextOutlined
        },
        {
          id: 'forest-map-view',
          title: 'menu.forest.map-view',
          type: 'item',
          url: '/forest/map-view',
          icon: GlobalOutlined
        },
        {
          id: 'forest-legal-certificates',
          title: 'menu.forest.legal-certificates',
          type: 'item',
          url: '/forest/legal-certificates',
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
          url: '/forest/harvest/plan-list',
          icon: UnorderedListOutlined
        },
        {
          id: 'forest-harvest-plan-detail',
          title: 'menu.forest.harvest-plan-detail',
          type: 'item',
          url: '/forest/harvest/plan-detail',
          icon: FileTextOutlined
        },
        {
          id: 'forest-harvest-order-list',
          title: 'menu.forest.harvest-order-list',
          type: 'item',
          url: '/forest/harvest/order-list',
          icon: UnorderedListOutlined
        },
        {
          id: 'forest-harvest-order-detail',
          title: 'menu.forest.harvest-order-detail',
          type: 'item',
          url: '/forest/harvest/order-detail',
          icon: FileTextOutlined
        },
        {
          id: 'forest-harvest-production-report',
          title: 'menu.forest.harvest-production-report',
          type: 'item',
          url: '/forest/harvest/production-report',
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
          url: '/forest/suppliers/list',
          icon: UnorderedListOutlined
        },
        {
          id: 'forest-supplier-detail',
          title: 'menu.forest.supplier-detail',
          type: 'item',
          url: '/forest/suppliers/detail',
          icon: ShopOutlined
        },
        {
          id: 'forest-supplier-transaction-history',
          title: 'menu.forest.supplier-transaction-history',
          type: 'item',
          url: '/forest/suppliers/transaction-history',
          icon: HistoryOutlined
        },
        {
          id: 'forest-supplier-production-estimate',
          title: 'menu.forest.supplier-production-estimate',
          type: 'item',
          url: '/forest/suppliers/production-estimate',
          icon: CalculatorOutlined
        }
      ]
    }
  ]
};

export default forest;
