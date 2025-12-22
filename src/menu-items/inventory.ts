import {
  DatabaseOutlined,
  ImportOutlined,
  UnorderedListOutlined,
  FileTextOutlined,
  CheckSquareOutlined,
  AppstoreOutlined,
  CalendarOutlined,
  SwapOutlined,
  GlobalOutlined
} from '@ant-design/icons';

import { NavItemType } from 'types/menu';

const inventory: NavItemType = {
  id: 'inventory',
  title: 'menu.inventory.management',
  type: 'group',
  icon: DatabaseOutlined,
  children: [
    {
      id: 'inventory-inbound-outbound',
      title: 'menu.inventory.inbound-outbound',
      type: 'collapse',
      icon: ImportOutlined,
      children: [
        {
          id: 'inventory-inbound-slip-list',
          title: 'menu.inventory.inbound-slip-list',
          type: 'item',
          url: '/inventory/inbound/slip-list',
          icon: UnorderedListOutlined
        },
        {
          id: 'inventory-inbound-slip-detail',
          title: 'menu.inventory.inbound-slip-detail',
          type: 'item',
          url: '/inventory/inbound/slip-detail',
          icon: FileTextOutlined
        },
        {
          id: 'inventory-outbound-slip-list',
          title: 'menu.inventory.outbound-slip-list',
          type: 'item',
          url: '/inventory/outbound/slip-list',
          icon: UnorderedListOutlined
        },
        {
          id: 'inventory-outbound-slip-detail',
          title: 'menu.inventory.outbound-slip-detail',
          type: 'item',
          url: '/inventory/outbound/slip-detail',
          icon: FileTextOutlined
        }
      ]
    },
    {
      id: 'inventory-stock-count',
      title: 'menu.inventory.stock-count',
      type: 'collapse',
      icon: CheckSquareOutlined,
      children: [
        {
          id: 'inventory-sku-list',
          title: 'menu.inventory.sku-list',
          type: 'item',
          url: '/inventory/stock/sku-list',
          icon: UnorderedListOutlined
        },
        {
          id: 'inventory-sku-detail',
          title: 'menu.inventory.sku-detail',
          type: 'item',
          url: '/inventory/stock/sku-detail',
          icon: AppstoreOutlined
        },
        {
          id: 'inventory-count-schedule',
          title: 'menu.inventory.count-schedule',
          type: 'item',
          url: '/inventory/stock/count-schedule',
          icon: CalendarOutlined
        },
        {
          id: 'inventory-count-slip-list',
          title: 'menu.inventory.count-slip-list',
          type: 'item',
          url: '/inventory/stock/count-slip-list',
          icon: UnorderedListOutlined
        },
        {
          id: 'inventory-count-slip-detail',
          title: 'menu.inventory.count-slip-detail',
          type: 'item',
          url: '/inventory/stock/count-slip-detail',
          icon: FileTextOutlined
        }
      ]
    },
    {
      id: 'inventory-transfer-traceability',
      title: 'menu.inventory.transfer-traceability',
      type: 'collapse',
      icon: SwapOutlined,
      children: [
        {
          id: 'inventory-transfer-slip-list',
          title: 'menu.inventory.transfer-slip-list',
          type: 'item',
          url: '/inventory/transfer/slip-list',
          icon: UnorderedListOutlined
        },
        {
          id: 'inventory-transfer-slip-detail',
          title: 'menu.inventory.transfer-slip-detail',
          type: 'item',
          url: '/inventory/transfer/slip-detail',
          icon: FileTextOutlined
        },
        {
          id: 'inventory-traceability',
          title: 'menu.inventory.traceability',
          type: 'item',
          url: '/inventory/traceability',
          icon: GlobalOutlined
        }
      ]
    }
  ]
};

export default inventory;
