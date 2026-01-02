// ==============================|| BATCHES MOCK DATA ||============================== //

import type { Batch } from '../types';

/**
 * Mock data for batches
 * Used for development and testing
 */
export const mockBatches: Batch[] = [
  {
    id: 'batch-001',
    code: 'LO-001',
    productionOrderId: 'order-001',
    productionOrderCode: 'Lệnh SX-001',
    productId: 'product-001',
    productName: 'Sản phẩm A',
    plannedQuantity: 1000,
    actualQuantity: 850,
    startDate: '2024-01-15',
    endDate: '2024-01-20',
    status: 'in-progress',
    notes: 'Lô sản xuất đầu tiên',
    createdAt: '2024-01-15T08:00:00Z',
    updatedAt: '2024-01-18T10:30:00Z'
  },
  {
    id: 'batch-002',
    code: 'LO-002',
    productionOrderId: 'order-002',
    productionOrderCode: 'Lệnh SX-002',
    productId: 'product-002',
    productName: 'Sản phẩm B',
    plannedQuantity: 2000,
    actualQuantity: 2000,
    startDate: '2024-01-10',
    endDate: '2024-01-25',
    status: 'completed',
    notes: 'Hoàn thành đúng hạn',
    createdAt: '2024-01-10T08:00:00Z',
    updatedAt: '2024-01-25T17:00:00Z'
  },
  {
    id: 'batch-003',
    code: 'LO-003',
    productionOrderId: 'order-003',
    productionOrderCode: 'Lệnh SX-003',
    productId: 'material-001',
    productName: 'Nguyên liệu X',
    plannedQuantity: 500,
    actualQuantity: 0,
    startDate: '2024-01-20',
    endDate: undefined,
    status: 'in-progress',
    notes: '',
    createdAt: '2024-01-20T08:00:00Z',
    updatedAt: '2024-01-20T08:00:00Z'
  },
  {
    id: 'batch-004',
    code: 'LO-004',
    productionOrderId: 'order-001',
    productionOrderCode: 'Lệnh SX-001',
    productId: 'product-003',
    productName: 'Sản phẩm C',
    plannedQuantity: 1500,
    actualQuantity: 0,
    startDate: '2024-01-05',
    endDate: undefined,
    status: 'cancelled',
    notes: 'Hủy do thiếu nguyên liệu',
    createdAt: '2024-01-05T08:00:00Z',
    updatedAt: '2024-01-12T14:00:00Z'
  },
  {
    id: 'batch-005',
    code: 'LO-005',
    productionOrderId: 'order-004',
    productionOrderCode: 'Lệnh SX-004',
    productId: 'product-001',
    productName: 'Sản phẩm A',
    plannedQuantity: 3000,
    actualQuantity: 3000,
    startDate: '2024-01-01',
    endDate: '2024-01-15',
    status: 'completed',
    notes: 'Hoàn thành sớm',
    createdAt: '2024-01-01T08:00:00Z',
    updatedAt: '2024-01-15T16:00:00Z'
  }
];

/**
 * Get mock batch by ID
 */
export function getMockBatchById(id: string): Batch | undefined {
  return mockBatches.find((batch) => batch.id === id);
}

/**
 * Get all mock batches
 */
export function getMockBatches(): Batch[] {
  return mockBatches;
}
