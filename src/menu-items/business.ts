import {
  ProjectOutlined,
  FileAddOutlined,
  BarChartOutlined,
  FileDoneOutlined,
  UnorderedListOutlined,
  DollarOutlined,
  WalletOutlined
} from '@ant-design/icons';

import { NavItemType } from 'types/menu';

const business: NavItemType = {
  id: 'business',
  title: 'menu.business.management',
  type: 'group',
  icon: ProjectOutlined,
  children: [
    {
      id: 'business-pab',
      title: 'menu.business.pab',
      type: 'collapse',
      icon: FileAddOutlined,
      children: [
        {
          id: 'business-pab-create',
          title: 'menu.business.pab-create',
          type: 'item',
          url: '/pab',
          icon: FileAddOutlined
        },
        {
          id: 'business-pab-report',
          title: 'menu.business.pab-report',
          type: 'item',
          url: '/pab/reports',
          icon: BarChartOutlined
        }
      ]
    },
    {
      id: 'business-contract-price',
      title: 'menu.business.contract-price',
      type: 'collapse',
      icon: FileDoneOutlined,
      children: [
        {
          id: 'business-contract-list',
          title: 'menu.business.contract-list',
          type: 'item',
          url: '/contracts',
          icon: UnorderedListOutlined
        }
      ]
    },
    {
      id: 'business-purchase-payment',
      title: 'menu.business.purchase-payment',
      type: 'collapse',
      icon: DollarOutlined,
      children: [
        {
          id: 'business-payment-order-list',
          title: 'menu.business.payment-order-list',
          type: 'item',
          url: '/payments',
          icon: UnorderedListOutlined
        },
        {
          id: 'business-advance-slip-list',
          title: 'menu.business.advance-slip-list',
          type: 'item',
          url: '/advances',
          icon: WalletOutlined
        }
      ]
    }
  ]
};

export default business;
