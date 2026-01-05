// ==============================|| ADVANCES MOCK DATA ||============================== //

import type { Advance } from '../types';

/**
 * Mock Advance data for development and testing
 */
export function getMockAdvances(): Advance[] {
  return [
    {
      id: '1',
      code: 'TA001',
      requesterId: '1',
      requesterName: 'Nguyễn Văn A',
      requestedDate: new Date('2024-01-10'),
      requestedAmount: 5000000,
      purpose: 'Tạm ứng chi phí đi công tác',
      status: 'pending',
      createdAt: new Date('2024-01-10'),
      updatedAt: new Date('2024-01-10')
    },
    {
      id: '2',
      code: 'TA002',
      requesterId: '2',
      requesterName: 'Trần Thị B',
      requestedDate: new Date('2024-01-15'),
      requestedAmount: 3000000,
      purpose: 'Tạm ứng mua nguyên liệu',
      status: 'approved',
      approvalDecision: 'approve',
      approvalDate: new Date('2024-01-16'),
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-01-16')
    },
    {
      id: '3',
      code: 'TA003',
      requesterId: '3',
      requesterName: 'Lê Văn C',
      requestedDate: new Date('2024-01-18'),
      requestedAmount: 2000000,
      purpose: 'Tạm ứng chi phí vận chuyển',
      status: 'rejected',
      approvalDecision: 'reject',
      comment: 'Không đủ điều kiện tạm ứng',
      approvalDate: new Date('2024-01-19'),
      createdAt: new Date('2024-01-18'),
      updatedAt: new Date('2024-01-19')
    },
    {
      id: '4',
      code: 'TA004',
      requesterId: '4',
      requesterName: 'Phạm Thị D',
      requestedDate: new Date('2024-01-20'),
      requestedAmount: 10000000,
      purpose: 'Tạm ứng thanh toán hợp đồng',
      status: 'pending',
      createdAt: new Date('2024-01-20'),
      updatedAt: new Date('2024-01-20')
    },
    {
      id: '5',
      code: 'TA005',
      requesterId: '1',
      requesterName: 'Nguyễn Văn A',
      requestedDate: new Date('2024-01-22'),
      requestedAmount: 7500000,
      purpose: 'Tạm ứng chi phí sửa chữa',
      status: 'approved',
      approvalDecision: 'approve',
      approvalDate: new Date('2024-01-23'),
      createdAt: new Date('2024-01-22'),
      updatedAt: new Date('2024-01-23')
    }
  ];
}

/**
 * Get a single mock advance by ID
 */
export function getMockAdvance(id: string): Advance | null {
  const advances = getMockAdvances();
  return advances.find((advance) => advance.id === id) || null;
}
