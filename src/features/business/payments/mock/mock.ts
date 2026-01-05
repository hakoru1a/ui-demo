// ==============================|| PAYMENT ORDERS MOCK DATA ||============================== //

import type { PaymentOrder } from '../types';

/**
 * Mock Payment Order data for development and testing
 */
export function getMockPaymentOrders(): PaymentOrder[] {
  return [
    {
      id: '1',
      code: 'PO001',
      type: 'payment',
      partnerType: 'customer',
      partnerId: '1',
      partnerName: 'Khách hàng A',
      contractId: '1',
      contractCode: 'HD001',
      paymentAmount: 50000000,
      currency: 'VND',
      paymentMethod: 'transfer',
      paymentDate: new Date('2024-01-15'),
      description: 'Thanh toán hợp đồng HD001',
      status: 'draft',
      createdAt: new Date('2024-01-10'),
      updatedAt: new Date('2024-01-10')
    },
    {
      id: '2',
      code: 'PO002',
      type: 'expense',
      partnerType: 'supplier',
      partnerId: '3',
      partnerName: 'Nhà cung cấp C',
      paymentAmount: 30000000,
      currency: 'VND',
      paymentMethod: 'cash',
      paymentDate: new Date('2024-01-20'),
      description: 'Chi tiền mua nguyên liệu',
      status: 'pending',
      createdAt: new Date('2024-01-18'),
      updatedAt: new Date('2024-01-18')
    },
    {
      id: '3',
      code: 'PO003',
      type: 'payment',
      partnerType: 'customer',
      partnerId: '2',
      partnerName: 'Khách hàng B',
      contractId: '2',
      contractCode: 'HD002',
      paymentAmount: 75000000,
      currency: 'VND',
      paymentMethod: 'transfer',
      paymentDate: new Date('2024-01-25'),
      description: 'Thanh toán hợp đồng HD002',
      status: 'paid',
      createdAt: new Date('2024-01-20'),
      updatedAt: new Date('2024-01-25')
    },
    {
      id: '4',
      code: 'PO004',
      type: 'expense',
      partnerType: 'supplier',
      partnerId: '4',
      partnerName: 'Nhà cung cấp D',
      paymentAmount: 20000000,
      currency: 'VND',
      paymentMethod: 'cash',
      paymentDate: new Date('2024-01-22'),
      description: 'Chi tiền vận chuyển',
      status: 'draft',
      createdAt: new Date('2024-01-21'),
      updatedAt: new Date('2024-01-21')
    },
    {
      id: '5',
      code: 'PO005',
      type: 'payment',
      partnerType: 'customer',
      partnerId: '1',
      partnerName: 'Khách hàng A',
      contractId: '3',
      contractCode: 'HD003',
      paymentAmount: 100000000,
      currency: 'VND',
      paymentMethod: 'transfer',
      paymentDate: new Date('2024-01-30'),
      description: 'Thanh toán hợp đồng HD003',
      status: 'pending',
      createdAt: new Date('2024-01-25'),
      updatedAt: new Date('2024-01-25')
    }
  ];
}

/**
 * Get a single mock payment order by ID
 */
export function getMockPaymentOrder(id: string): PaymentOrder | null {
  const paymentOrders = getMockPaymentOrders();
  return paymentOrders.find((po) => po.id === id) || null;
}
