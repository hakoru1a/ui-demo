// ==============================|| PAB MOCK DATA ||============================== //

import type { Pab } from '../types';

/**
 * Mock PAB data for development and testing
 */
export function getMockPabs(): Pab[] {
  return [
    {
      id: 'pab-001',
      code: 'PAB-2024-001',
      customerId: 'customer-001',
      customerName: 'Công ty A',
      productId: 'product-001',
      productName: 'Gỗ keo',
      quantity: 1000,
      unit: 'ton',
      expectedDeliveryDate: new Date('2024-12-31'),
      estimatedCost: 5000000000,
      estimatedTime: 30,
      margin: 15,
      notes: 'Giao hàng tại kho khách hàng',
      status: 'draft',
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-01-15')
    },
    {
      id: 'pab-002',
      code: 'PAB-2024-002',
      customerId: 'customer-002',
      customerName: 'Công ty B',
      productId: 'product-002',
      productName: 'Gỗ bạch đàn',
      quantity: 500,
      unit: 'ton',
      expectedDeliveryDate: new Date('2024-11-30'),
      estimatedCost: 2500000000,
      estimatedTime: 20,
      margin: 12,
      notes: '',
      status: 'pending-approval',
      approvalHistory: [
        {
          id: 'approval-001',
          approvalLayer: 'business',
          approverId: 'user-001',
          approverName: 'Nguyễn Văn A',
          decision: 'approved',
          approvalDate: new Date('2024-01-21')
        }
      ],
      createdAt: new Date('2024-01-20'),
      updatedAt: new Date('2024-01-20')
    },
    {
      id: 'pab-003',
      code: 'PAB-2024-003',
      customerId: 'customer-003',
      customerName: 'Công ty C',
      productId: 'product-003',
      productName: 'Gỗ thông',
      quantity: 800,
      unit: 'ton',
      expectedDeliveryDate: new Date('2025-01-15'),
      estimatedCost: 4000000000,
      estimatedTime: 25,
      margin: 18,
      notes: 'Yêu cầu chất lượng cao',
      status: 'approved',
      transactionStatus: 'negotiating',
      approvalHistory: [
        {
          id: 'approval-002',
          approvalLayer: 'business',
          approverId: 'user-001',
          approverName: 'Nguyễn Văn A',
          decision: 'approved',
          approvalDate: new Date('2024-01-22')
        },
        {
          id: 'approval-003',
          approvalLayer: 'finance',
          approverId: 'user-002',
          approverName: 'Trần Thị B',
          decision: 'approved',
          approvalDate: new Date('2024-01-23')
        },
        {
          id: 'approval-004',
          approvalLayer: 'management',
          approverId: 'user-003',
          approverName: 'Lê Văn C',
          decision: 'approved',
          approvalDate: new Date('2024-01-25')
        }
      ],
      createdAt: new Date('2024-01-10'),
      updatedAt: new Date('2024-01-25'),
      lastUpdate: new Date('2024-01-25')
    },
    {
      id: 'pab-004',
      code: 'PAB-2024-004',
      customerId: 'customer-004',
      customerName: 'Công ty D',
      productId: 'product-004',
      productName: 'Ván ép',
      quantity: 2000,
      unit: 'm3',
      expectedDeliveryDate: new Date('2024-10-31'),
      estimatedCost: 8000000000,
      estimatedTime: 45,
      margin: 10,
      notes: '',
      status: 'rejected',
      approvalHistory: [
        {
          id: 'approval-005',
          approvalLayer: 'business',
          approverId: 'user-001',
          approverName: 'Nguyễn Văn A',
          decision: 'approved',
          approvalDate: new Date('2024-01-15')
        },
        {
          id: 'approval-006',
          approvalLayer: 'finance',
          approverId: 'user-002',
          approverName: 'Trần Thị B',
          decision: 'rejected',
          comment: 'Chi phí quá cao, không phù hợp với ngân sách',
          approvalDate: new Date('2024-01-18')
        }
      ],
      createdAt: new Date('2024-01-05'),
      updatedAt: new Date('2024-01-18')
    },
    {
      id: 'pab-005',
      code: 'PAB-2024-005',
      customerId: 'customer-005',
      customerName: 'Công ty E',
      productId: 'product-005',
      productName: 'Bột giấy',
      quantity: 3000,
      unit: 'ton',
      expectedDeliveryDate: new Date('2025-02-28'),
      estimatedCost: 12000000000,
      estimatedTime: 60,
      margin: 20,
      notes: 'Đơn hàng lớn, cần xác nhận nguồn nguyên liệu',
      status: 'approved',
      transactionStatus: 'confirmed',
      contractRef: 'HD-2024-001',
      relatedOrderIds: ['order-001', 'order-002'],
      relatedOrderCodes: ['ORD-2024-001', 'ORD-2024-002'],
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-30'),
      lastUpdate: new Date('2024-01-30')
    }
  ];
}
