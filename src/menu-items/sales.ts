import {
  AccountBookOutlined,
  CalculatorOutlined,
  EnvironmentOutlined,
  FileTextOutlined,
  ShoppingOutlined,
  TeamOutlined,
  UnorderedListOutlined
} from '@ant-design/icons';

import { NavItemType } from 'types/menu';

const sales: NavItemType = {
  id: 'sales',
  title: 'menu.sales.management',
  type: 'group',
  icon: ShoppingOutlined,
  children: [
    {
      id: 'sales-order',
      title: 'menu.sales.order',
      type: 'collapse',
      icon: ShoppingOutlined,
      children: [
        {
          id: 'sales-export-order-list',
          title: 'menu.sales.export-order-list',
          type: 'item',
          url: '/sales/export-order/list',
          icon: UnorderedListOutlined
        },
        {
          id: 'sales-customer-crm',
          title: 'menu.sales.customer-crm',
          type: 'item',
          url: '/sales/customer/crm',
          icon: TeamOutlined
        }
      ]
    },
    {
      id: 'sales-export-documents',
      title: 'menu.sales.export-documents',
      type: 'collapse',
      icon: FileTextOutlined,
      children: [
        {
          id: 'sales-invoice-packing-list',
          title: 'menu.sales.invoice-packing-list',
          type: 'item',
          url: '/sales/documents/invoice-packing-list',
          icon: FileTextOutlined
        },
        {
          id: 'sales-shipment-tracking',
          title: 'menu.sales.shipment-tracking',
          type: 'item',
          url: '/sales/documents/shipment-tracking',
          icon: EnvironmentOutlined
        }
      ]
    },
    {
      id: 'sales-accounting',
      title: 'menu.sales.accounting',
      type: 'collapse',
      icon: CalculatorOutlined,
      children: [
        {
          id: 'sales-logistics-service-cost',
          title: 'menu.sales.logistics-service-cost',
          type: 'item',
          url: '/sales/accounting/logistics-service-cost',
          icon: AccountBookOutlined
        }
      ]
    }
  ]
};

export default sales;
