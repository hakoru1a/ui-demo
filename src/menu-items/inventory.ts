import {
  DatabaseOutlined,
  ImportOutlined,
  UnorderedListOutlined,
  CheckSquareOutlined,
  AppstoreOutlined,
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
          url: '/inventory-receipts',
          icon: UnorderedListOutlined
        },
        {
          id: 'inventory-outbound-slip-list',
          title: 'menu.inventory.outbound-slip-list',
          type: 'item',
          url: '/inventory-issues',
          icon: UnorderedListOutlined
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
          url: '/sku',
          icon: UnorderedListOutlined
        },
        {
          id: 'inventory-stock-view',
          title: 'menu.inventory.stock-view',
          type: 'item',
          url: '/stock',
          icon: AppstoreOutlined
        },
        {
          id: 'inventory-count-slip-list',
          title: 'menu.inventory.count-slip-list',
          type: 'item',
          url: '/stocktakes',
          icon: UnorderedListOutlined
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
          url: '/transfers',
          icon: UnorderedListOutlined
        },
        {
          id: 'inventory-traceability',
          title: 'menu.inventory.traceability',
          type: 'item',
          url: '/traceability',
          icon: GlobalOutlined
        }
      ]
    }
  ]
};

export default inventory;
