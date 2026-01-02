// ==============================|| WEIGH TICKETS MOCK DATA ||============================== //

import type { WeighTicket } from '../types';

/**
 * Generate mock weigh tickets for testing
 */
export function getMockWeighTickets(): WeighTicket[] {
  const mockTickets: WeighTicket[] = [
    {
      id: 'wt-001',
      code: 'WT-2024-001',
      vehiclePlate: '51A-12345',
      supplierId: 'supplier-001',
      supplierName: 'Công ty Cung cấp A',
      type: 'inbound',
      weightIn: 15000,
      weightOut: undefined,
      weightDifference: 0,
      unitPrice: 5000,
      estimatedAmount: 0,
      notes: 'Phiếu cân nhập hàng',
      status: 'active',
      weighedAt: new Date('2024-01-15T08:30:00'),
      createdAt: new Date('2024-01-15T08:30:00'),
      updatedAt: new Date('2024-01-15T08:30:00')
    },
    {
      id: 'wt-002',
      code: 'WT-2024-002',
      vehiclePlate: '51B-67890',
      supplierId: 'supplier-002',
      supplierName: 'Công ty Cung cấp B',
      type: 'outbound',
      weightIn: 15000,
      weightOut: 12000,
      weightDifference: -3000,
      unitPrice: 5000,
      estimatedAmount: 0,
      notes: 'Phiếu cân xuất hàng',
      status: 'active',
      weighedAt: new Date('2024-01-16T09:15:00'),
      createdAt: new Date('2024-01-16T09:15:00'),
      updatedAt: new Date('2024-01-16T09:15:00')
    },
    {
      id: 'wt-003',
      code: 'WT-2024-003',
      vehiclePlate: '51C-11111',
      supplierId: 'supplier-003',
      supplierName: 'Công ty Cung cấp C',
      type: 'inbound',
      weightIn: 20000,
      weightOut: undefined,
      weightDifference: 0,
      unitPrice: 5500,
      estimatedAmount: 0,
      notes: '',
      status: 'active',
      weighedAt: new Date('2024-01-17T10:00:00'),
      createdAt: new Date('2024-01-17T10:00:00'),
      updatedAt: new Date('2024-01-17T10:00:00')
    },
    {
      id: 'wt-004',
      code: 'WT-2024-004',
      vehiclePlate: '51D-22222',
      supplierId: 'supplier-001',
      supplierName: 'Công ty Cung cấp A',
      type: 'outbound',
      weightIn: 20000,
      weightOut: 18000,
      weightDifference: -2000,
      unitPrice: 5500,
      estimatedAmount: -11000000,
      notes: 'Xuất hàng cho khách hàng',
      status: 'active',
      weighedAt: new Date('2024-01-18T11:30:00'),
      createdAt: new Date('2024-01-18T11:30:00'),
      updatedAt: new Date('2024-01-18T11:30:00')
    },
    {
      id: 'wt-005',
      code: 'WT-2024-005',
      vehiclePlate: '51E-33333',
      supplierId: 'supplier-004',
      supplierName: 'Công ty Cung cấp D',
      type: 'inbound',
      weightIn: 18000,
      weightOut: undefined,
      weightDifference: 0,
      unitPrice: 5200,
      estimatedAmount: 0,
      notes: '',
      status: 'inactive',
      weighedAt: new Date('2024-01-19T14:00:00'),
      createdAt: new Date('2024-01-19T14:00:00'),
      updatedAt: new Date('2024-01-19T14:00:00')
    }
  ];

  return mockTickets;
}

export const mockWeighTickets = getMockWeighTickets();
