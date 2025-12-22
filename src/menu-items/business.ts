import {
  ProjectOutlined,
  FileAddOutlined,
  CheckCircleOutlined,
  InfoCircleOutlined,
  BarChartOutlined,
  FileDoneOutlined,
  UnorderedListOutlined,
  FileTextOutlined,
  DollarOutlined,
  CreditCardOutlined,
  WalletOutlined,
  SafetyCertificateOutlined
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
          url: '/business/pab/create',
          icon: FileAddOutlined
        },
        {
          id: 'business-pab-approval',
          title: 'menu.business.pab-approval',
          type: 'item',
          url: '/business/pab/approval',
          icon: CheckCircleOutlined
        },
        {
          id: 'business-pab-transaction-status',
          title: 'menu.business.pab-transaction-status',
          type: 'item',
          url: '/business/pab/transaction-status',
          icon: InfoCircleOutlined
        },
        {
          id: 'business-pab-report',
          title: 'menu.business.pab-report',
          type: 'item',
          url: '/business/pab/report',
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
          url: '/business/contract/list',
          icon: UnorderedListOutlined
        },
        {
          id: 'business-contract-detail',
          title: 'menu.business.contract-detail',
          type: 'item',
          url: '/business/contract/detail',
          icon: FileTextOutlined
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
          url: '/business/payment/order-list',
          icon: UnorderedListOutlined
        },
        {
          id: 'business-payment-order-detail',
          title: 'menu.business.payment-order-detail',
          type: 'item',
          url: '/business/payment/order-detail',
          icon: CreditCardOutlined
        },
        {
          id: 'business-advance-slip-list',
          title: 'menu.business.advance-slip-list',
          type: 'item',
          url: '/business/payment/advance-slip-list',
          icon: WalletOutlined
        },
        {
          id: 'business-advance-approval',
          title: 'menu.business.advance-approval',
          type: 'item',
          url: '/business/payment/advance-approval',
          icon: SafetyCertificateOutlined
        }
      ]
    }
  ]
};

export default business;
