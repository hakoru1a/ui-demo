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
    startDate: '2026-01-15',
    endDate: '2026-01-20',
    status: 'in-progress',
    notes: 'Lô sản xuất đầu tiên',
    createdAt: '2026-01-15T08:00:00Z',
    updatedAt: '2026-01-18T10:30:00Z'
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
    startDate: '2026-01-10',
    endDate: '2026-01-25',
    status: 'completed',
    notes: 'Hoàn thành đúng hạn',
    createdAt: '2026-01-10T08:00:00Z',
    updatedAt: '2026-01-25T17:00:00Z'
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
    startDate: '2026-01-20',
    endDate: undefined,
    status: 'in-progress',
    notes: '',
    createdAt: '2026-01-20T08:00:00Z',
    updatedAt: '2026-01-20T08:00:00Z'
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
    startDate: '2026-01-05',
    endDate: undefined,
    status: 'cancelled',
    notes: 'Hủy do thiếu nguyên liệu',
    createdAt: '2026-01-05T08:00:00Z',
    updatedAt: '2026-01-12T14:00:00Z'
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
    startDate: '2026-01-01',
    endDate: '2026-01-15',
    status: 'completed',
    notes: 'Hoàn thành sớm',
    createdAt: '2026-01-01T08:00:00Z',
    updatedAt: '2026-01-15T16:00:00Z'
  },
  {
    id: 'batch-006',
    code: 'LO-006',
    productionOrderId: 'order-005',
    productionOrderCode: 'Lệnh SX-005',
    productId: 'product-002',
    productName: 'Sản phẩm B',
    plannedQuantity: 1500,
    actualQuantity: 1200,
    startDate: '2026-01-18',
    endDate: '2026-01-28',
    status: 'in-progress',
    notes: 'Đang sản xuất',
    createdAt: '2026-01-18T08:00:00Z',
    updatedAt: '2026-01-22T10:00:00Z'
  },
  {
    id: 'batch-007',
    code: 'LO-007',
    productionOrderId: 'order-003',
    productionOrderCode: 'Lệnh SX-003',
    productId: 'product-004',
    productName: 'Sản phẩm D',
    plannedQuantity: 800,
    actualQuantity: 800,
    startDate: '2026-01-12',
    endDate: '2026-01-18',
    status: 'completed',
    notes: 'Hoàn thành',
    createdAt: '2026-01-12T08:00:00Z',
    updatedAt: '2026-01-18T17:00:00Z'
  },
  {
    id: 'batch-008',
    code: 'LO-008',
    productionOrderId: 'order-006',
    productionOrderCode: 'Lệnh SX-006',
    productId: 'material-002',
    productName: 'Nguyên liệu Y',
    plannedQuantity: 600,
    actualQuantity: 450,
    startDate: '2026-01-22',
    endDate: undefined,
    status: 'in-progress',
    notes: '',
    createdAt: '2026-01-22T08:00:00Z',
    updatedAt: '2026-01-24T14:00:00Z'
  },
  {
    id: 'batch-009',
    code: 'LO-009',
    productionOrderId: 'order-007',
    productionOrderCode: 'Lệnh SX-007',
    productId: 'product-003',
    productName: 'Sản phẩm C',
    plannedQuantity: 2500,
    actualQuantity: 0,
    startDate: '2026-01-25',
    endDate: '2026-02-05',
    status: 'in-progress',
    notes: 'Lô mới',
    createdAt: '2026-01-25T08:00:00Z',
    updatedAt: '2026-01-25T08:00:00Z'
  },
  {
    id: 'batch-010',
    code: 'LO-010',
    productionOrderId: 'order-001',
    productionOrderCode: 'Lệnh SX-001',
    productId: 'product-005',
    productName: 'Sản phẩm E',
    plannedQuantity: 1800,
    actualQuantity: 0,
    startDate: '2026-01-08',
    endDate: undefined,
    status: 'cancelled',
    notes: 'Hủy do thay đổi kế hoạch',
    createdAt: '2026-01-08T08:00:00Z',
    updatedAt: '2026-01-10T15:00:00Z'
  },
  {
    id: 'batch-011',
    code: 'LO-011',
    productionOrderId: 'order-008',
    productionOrderCode: 'Lệnh SX-008',
    productId: 'product-001',
    productName: 'Sản phẩm A',
    plannedQuantity: 2200,
    actualQuantity: 1800,
    startDate: '2026-01-02',
    endDate: '2026-01-10',
    status: 'in-progress',
    notes: 'Đang sản xuất',
    createdAt: '2026-01-02T08:00:00Z',
    updatedAt: '2026-01-05T14:00:00Z'
  },
  {
    id: 'batch-012',
    code: 'LO-012',
    productionOrderId: 'order-009',
    productionOrderCode: 'Lệnh SX-009',
    productId: 'product-002',
    productName: 'Sản phẩm B',
    plannedQuantity: 1200,
    actualQuantity: 1200,
    startDate: '2026-01-03',
    endDate: '2026-01-09',
    status: 'completed',
    notes: 'Hoàn thành',
    createdAt: '2026-01-03T08:00:00Z',
    updatedAt: '2026-01-09T17:00:00Z'
  },
  {
    id: 'batch-013',
    code: 'LO-013',
    productionOrderId: 'order-010',
    productionOrderCode: 'Lệnh SX-010',
    productId: 'product-004',
    productName: 'Sản phẩm D',
    plannedQuantity: 900,
    actualQuantity: 750,
    startDate: '2026-01-06',
    endDate: '2026-01-14',
    status: 'in-progress',
    notes: '',
    createdAt: '2026-01-06T08:00:00Z',
    updatedAt: '2026-01-11T10:00:00Z'
  },
  {
    id: 'batch-014',
    code: 'LO-014',
    productionOrderId: 'order-011',
    productionOrderCode: 'Lệnh SX-011',
    productId: 'product-003',
    productName: 'Sản phẩm C',
    plannedQuantity: 1800,
    actualQuantity: 0,
    startDate: '2026-01-26',
    endDate: '2026-01-31',
    status: 'in-progress',
    notes: 'Lô cuối tháng',
    createdAt: '2026-01-26T08:00:00Z',
    updatedAt: '2026-01-26T08:00:00Z'
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
