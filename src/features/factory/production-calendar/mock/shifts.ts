// ==============================|| PRODUCTION SHIFTS MOCK DATA ||============================== //

import type { ProductionShift } from '../types';

/**
 * Mock data for production shifts
 * Used for development and testing
 */
export const mockShifts: ProductionShift[] = [
  {
    id: 'shift-001',
    batchId: 'batch-001',
    batchCode: 'LO-001',
    productionLineId: 'line-001',
    productionLineName: 'Dây chuyền 1',
    startTime: '2026-01-15T08:00:00Z',
    endTime: '2026-01-15T16:00:00Z',
    status: 'completed',
    notes: 'Ca sáng',
    createdAt: '2026-01-15T08:00:00Z',
    updatedAt: '2026-01-15T16:00:00Z'
  },
  {
    id: 'shift-002',
    batchId: 'batch-001',
    batchCode: 'LO-001',
    productionLineId: 'line-001',
    productionLineName: 'Dây chuyền 1',
    startTime: '2026-01-15T16:00:00Z',
    endTime: '2026-01-16T00:00:00Z',
    status: 'completed',
    notes: 'Ca chiều',
    createdAt: '2026-01-15T16:00:00Z',
    updatedAt: '2026-01-16T00:00:00Z'
  },
  {
    id: 'shift-003',
    batchId: 'batch-002',
    batchCode: 'LO-002',
    productionLineId: 'line-002',
    productionLineName: 'Dây chuyền 2',
    startTime: '2026-01-16T08:00:00Z',
    endTime: '2026-01-16T16:00:00Z',
    status: 'in-progress',
    notes: '',
    createdAt: '2026-01-16T08:00:00Z',
    updatedAt: '2026-01-16T08:00:00Z'
  },
  {
    id: 'shift-004',
    batchId: 'batch-001',
    batchCode: 'LO-001',
    productionLineId: 'line-001',
    productionLineName: 'Dây chuyền 1',
    startTime: '2026-01-16T08:00:00Z',
    endTime: '2026-01-16T16:00:00Z',
    status: 'completed',
    notes: 'Ca sáng',
    createdAt: '2026-01-16T08:00:00Z',
    updatedAt: '2026-01-16T16:00:00Z'
  },
  {
    id: 'shift-005',
    batchId: 'batch-001',
    batchCode: 'LO-001',
    productionLineId: 'line-001',
    productionLineName: 'Dây chuyền 1',
    startTime: '2026-01-16T16:00:00Z',
    endTime: '2026-01-17T00:00:00Z',
    status: 'completed',
    notes: 'Ca chiều',
    createdAt: '2026-01-16T16:00:00Z',
    updatedAt: '2026-01-17T00:00:00Z'
  },
  {
    id: 'shift-006',
    batchId: 'batch-003',
    batchCode: 'LO-003',
    productionLineId: 'line-002',
    productionLineName: 'Dây chuyền 2',
    startTime: '2026-01-20T08:00:00Z',
    endTime: '2026-01-20T16:00:00Z',
    status: 'scheduled',
    notes: 'Ca sáng',
    createdAt: '2026-01-19T10:00:00Z',
    updatedAt: '2026-01-19T10:00:00Z'
  },
  {
    id: 'shift-007',
    batchId: 'batch-003',
    batchCode: 'LO-003',
    productionLineId: 'line-002',
    productionLineName: 'Dây chuyền 2',
    startTime: '2026-01-20T16:00:00Z',
    endTime: '2026-01-21T00:00:00Z',
    status: 'scheduled',
    notes: 'Ca chiều',
    createdAt: '2026-01-19T10:00:00Z',
    updatedAt: '2026-01-19T10:00:00Z'
  },
  {
    id: 'shift-008',
    batchId: 'batch-006',
    batchCode: 'LO-006',
    productionLineId: 'line-001',
    productionLineName: 'Dây chuyền 1',
    startTime: '2026-01-18T08:00:00Z',
    endTime: '2026-01-18T16:00:00Z',
    status: 'completed',
    notes: 'Ca sáng',
    createdAt: '2026-01-18T08:00:00Z',
    updatedAt: '2026-01-18T16:00:00Z'
  },
  {
    id: 'shift-009',
    batchId: 'batch-006',
    batchCode: 'LO-006',
    productionLineId: 'line-001',
    productionLineName: 'Dây chuyền 1',
    startTime: '2026-01-18T16:00:00Z',
    endTime: '2026-01-19T00:00:00Z',
    status: 'completed',
    notes: 'Ca chiều',
    createdAt: '2026-01-18T16:00:00Z',
    updatedAt: '2026-01-19T00:00:00Z'
  },
  {
    id: 'shift-010',
    batchId: 'batch-006',
    batchCode: 'LO-006',
    productionLineId: 'line-003',
    productionLineName: 'Dây chuyền 3',
    startTime: '2026-01-19T08:00:00Z',
    endTime: '2026-01-19T16:00:00Z',
    status: 'in-progress',
    notes: 'Ca sáng',
    createdAt: '2026-01-19T08:00:00Z',
    updatedAt: '2026-01-19T08:00:00Z'
  },
  {
    id: 'shift-011',
    batchId: 'batch-006',
    batchCode: 'LO-006',
    productionLineId: 'line-003',
    productionLineName: 'Dây chuyền 3',
    startTime: '2026-01-19T16:00:00Z',
    endTime: '2026-01-20T00:00:00Z',
    status: 'scheduled',
    notes: 'Ca chiều',
    createdAt: '2026-01-19T10:00:00Z',
    updatedAt: '2026-01-19T10:00:00Z'
  },
  {
    id: 'shift-012',
    batchId: 'batch-007',
    batchCode: 'LO-007',
    productionLineId: 'line-002',
    productionLineName: 'Dây chuyền 2',
    startTime: '2026-01-12T08:00:00Z',
    endTime: '2026-01-12T16:00:00Z',
    status: 'completed',
    notes: 'Ca sáng',
    createdAt: '2026-01-12T08:00:00Z',
    updatedAt: '2026-01-12T16:00:00Z'
  },
  {
    id: 'shift-013',
    batchId: 'batch-007',
    batchCode: 'LO-007',
    productionLineId: 'line-002',
    productionLineName: 'Dây chuyền 2',
    startTime: '2026-01-12T16:00:00Z',
    endTime: '2026-01-13T00:00:00Z',
    status: 'completed',
    notes: 'Ca chiều',
    createdAt: '2026-01-12T16:00:00Z',
    updatedAt: '2026-01-13T00:00:00Z'
  },
  {
    id: 'shift-014',
    batchId: 'batch-008',
    batchCode: 'LO-008',
    productionLineId: 'line-001',
    productionLineName: 'Dây chuyền 1',
    startTime: '2026-01-22T08:00:00Z',
    endTime: '2026-01-22T16:00:00Z',
    status: 'in-progress',
    notes: 'Ca sáng',
    createdAt: '2026-01-22T08:00:00Z',
    updatedAt: '2026-01-22T08:00:00Z'
  },
  {
    id: 'shift-015',
    batchId: 'batch-008',
    batchCode: 'LO-008',
    productionLineId: 'line-001',
    productionLineName: 'Dây chuyền 1',
    startTime: '2026-01-22T16:00:00Z',
    endTime: '2026-01-23T00:00:00Z',
    status: 'scheduled',
    notes: 'Ca chiều',
    createdAt: '2026-01-22T10:00:00Z',
    updatedAt: '2026-01-22T10:00:00Z'
  },
  {
    id: 'shift-016',
    batchId: 'batch-008',
    batchCode: 'LO-008',
    productionLineId: 'line-002',
    productionLineName: 'Dây chuyền 2',
    startTime: '2026-01-23T08:00:00Z',
    endTime: '2026-01-23T16:00:00Z',
    status: 'scheduled',
    notes: 'Ca sáng',
    createdAt: '2026-01-22T10:00:00Z',
    updatedAt: '2026-01-22T10:00:00Z'
  },
  {
    id: 'shift-017',
    batchId: 'batch-009',
    batchCode: 'LO-009',
    productionLineId: 'line-003',
    productionLineName: 'Dây chuyền 3',
    startTime: '2026-01-25T08:00:00Z',
    endTime: '2026-01-25T16:00:00Z',
    status: 'scheduled',
    notes: 'Ca sáng',
    createdAt: '2026-01-24T14:00:00Z',
    updatedAt: '2026-01-24T14:00:00Z'
  },
  {
    id: 'shift-018',
    batchId: 'batch-009',
    batchCode: 'LO-009',
    productionLineId: 'line-003',
    productionLineName: 'Dây chuyền 3',
    startTime: '2026-01-25T16:00:00Z',
    endTime: '2026-01-26T00:00:00Z',
    status: 'scheduled',
    notes: 'Ca chiều',
    createdAt: '2026-01-24T14:00:00Z',
    updatedAt: '2026-01-24T14:00:00Z'
  },
  {
    id: 'shift-019',
    batchId: 'batch-009',
    batchCode: 'LO-009',
    productionLineId: 'line-001',
    productionLineName: 'Dây chuyền 1',
    startTime: '2026-01-26T08:00:00Z',
    endTime: '2026-01-26T16:00:00Z',
    status: 'scheduled',
    notes: 'Ca sáng',
    createdAt: '2026-01-24T14:00:00Z',
    updatedAt: '2026-01-24T14:00:00Z'
  },
  {
    id: 'shift-020',
    batchId: 'batch-002',
    batchCode: 'LO-002',
    productionLineId: 'line-002',
    productionLineName: 'Dây chuyền 2',
    startTime: '2026-01-17T08:00:00Z',
    endTime: '2026-01-17T16:00:00Z',
    status: 'completed',
    notes: 'Ca sáng',
    createdAt: '2026-01-17T08:00:00Z',
    updatedAt: '2026-01-17T16:00:00Z'
  },
  {
    id: 'shift-021',
    batchId: 'batch-002',
    batchCode: 'LO-002',
    productionLineId: 'line-002',
    productionLineName: 'Dây chuyền 2',
    startTime: '2026-01-17T16:00:00Z',
    endTime: '2026-01-18T00:00:00Z',
    status: 'completed',
    notes: 'Ca chiều',
    createdAt: '2026-01-17T16:00:00Z',
    updatedAt: '2026-01-18T00:00:00Z'
  },
  {
    id: 'shift-022',
    batchId: 'batch-011',
    batchCode: 'LO-011',
    productionLineId: 'line-001',
    productionLineName: 'Dây chuyền 1',
    startTime: '2026-01-02T08:00:00Z',
    endTime: '2026-01-02T16:00:00Z',
    status: 'completed',
    notes: 'Ca sáng',
    createdAt: '2026-01-02T08:00:00Z',
    updatedAt: '2026-01-02T16:00:00Z'
  },
  {
    id: 'shift-023',
    batchId: 'batch-011',
    batchCode: 'LO-011',
    productionLineId: 'line-001',
    productionLineName: 'Dây chuyền 1',
    startTime: '2026-01-02T16:00:00Z',
    endTime: '2026-01-03T00:00:00Z',
    status: 'completed',
    notes: 'Ca chiều',
    createdAt: '2026-01-02T16:00:00Z',
    updatedAt: '2026-01-03T00:00:00Z'
  },
  {
    id: 'shift-024',
    batchId: 'batch-011',
    batchCode: 'LO-011',
    productionLineId: 'line-002',
    productionLineName: 'Dây chuyền 2',
    startTime: '2026-01-03T08:00:00Z',
    endTime: '2026-01-03T16:00:00Z',
    status: 'completed',
    notes: 'Ca sáng',
    createdAt: '2026-01-03T08:00:00Z',
    updatedAt: '2026-01-03T16:00:00Z'
  },
  {
    id: 'shift-025',
    batchId: 'batch-012',
    batchCode: 'LO-012',
    productionLineId: 'line-003',
    productionLineName: 'Dây chuyền 3',
    startTime: '2026-01-03T08:00:00Z',
    endTime: '2026-01-03T16:00:00Z',
    status: 'completed',
    notes: 'Ca sáng',
    createdAt: '2026-01-03T08:00:00Z',
    updatedAt: '2026-01-03T16:00:00Z'
  },
  {
    id: 'shift-026',
    batchId: 'batch-012',
    batchCode: 'LO-012',
    productionLineId: 'line-003',
    productionLineName: 'Dây chuyền 3',
    startTime: '2026-01-03T16:00:00Z',
    endTime: '2026-01-04T00:00:00Z',
    status: 'completed',
    notes: 'Ca chiều',
    createdAt: '2026-01-03T16:00:00Z',
    updatedAt: '2026-01-04T00:00:00Z'
  },
  {
    id: 'shift-027',
    batchId: 'batch-013',
    batchCode: 'LO-013',
    productionLineId: 'line-001',
    productionLineName: 'Dây chuyền 1',
    startTime: '2026-01-06T08:00:00Z',
    endTime: '2026-01-06T16:00:00Z',
    status: 'in-progress',
    notes: 'Ca sáng',
    createdAt: '2026-01-06T08:00:00Z',
    updatedAt: '2026-01-06T08:00:00Z'
  },
  {
    id: 'shift-028',
    batchId: 'batch-013',
    batchCode: 'LO-013',
    productionLineId: 'line-001',
    productionLineName: 'Dây chuyền 1',
    startTime: '2026-01-06T16:00:00Z',
    endTime: '2026-01-07T00:00:00Z',
    status: 'completed',
    notes: 'Ca chiều',
    createdAt: '2026-01-06T16:00:00Z',
    updatedAt: '2026-01-07T00:00:00Z'
  },
  {
    id: 'shift-029',
    batchId: 'batch-013',
    batchCode: 'LO-013',
    productionLineId: 'line-002',
    productionLineName: 'Dây chuyền 2',
    startTime: '2026-01-07T08:00:00Z',
    endTime: '2026-01-07T16:00:00Z',
    status: 'completed',
    notes: 'Ca sáng',
    createdAt: '2026-01-07T08:00:00Z',
    updatedAt: '2026-01-07T16:00:00Z'
  },
  {
    id: 'shift-030',
    batchId: 'batch-014',
    batchCode: 'LO-014',
    productionLineId: 'line-001',
    productionLineName: 'Dây chuyền 1',
    startTime: '2026-01-26T08:00:00Z',
    endTime: '2026-01-26T16:00:00Z',
    status: 'scheduled',
    notes: 'Ca sáng',
    createdAt: '2026-01-25T14:00:00Z',
    updatedAt: '2026-01-25T14:00:00Z'
  },
  {
    id: 'shift-031',
    batchId: 'batch-014',
    batchCode: 'LO-014',
    productionLineId: 'line-001',
    productionLineName: 'Dây chuyền 1',
    startTime: '2026-01-26T16:00:00Z',
    endTime: '2026-01-27T00:00:00Z',
    status: 'scheduled',
    notes: 'Ca chiều',
    createdAt: '2026-01-25T14:00:00Z',
    updatedAt: '2026-01-25T14:00:00Z'
  },
  {
    id: 'shift-032',
    batchId: 'batch-014',
    batchCode: 'LO-014',
    productionLineId: 'line-002',
    productionLineName: 'Dây chuyền 2',
    startTime: '2026-01-27T08:00:00Z',
    endTime: '2026-01-27T16:00:00Z',
    status: 'scheduled',
    notes: 'Ca sáng',
    createdAt: '2026-01-25T14:00:00Z',
    updatedAt: '2026-01-25T14:00:00Z'
  },
  {
    id: 'shift-033',
    batchId: 'batch-005',
    batchCode: 'LO-005',
    productionLineId: 'line-003',
    productionLineName: 'Dây chuyền 3',
    startTime: '2026-01-01T08:00:00Z',
    endTime: '2026-01-01T16:00:00Z',
    status: 'completed',
    notes: 'Ca sáng',
    createdAt: '2026-01-01T08:00:00Z',
    updatedAt: '2026-01-01T16:00:00Z'
  },
  {
    id: 'shift-034',
    batchId: 'batch-005',
    batchCode: 'LO-005',
    productionLineId: 'line-003',
    productionLineName: 'Dây chuyền 3',
    startTime: '2026-01-01T16:00:00Z',
    endTime: '2026-01-02T00:00:00Z',
    status: 'completed',
    notes: 'Ca chiều',
    createdAt: '2026-01-01T16:00:00Z',
    updatedAt: '2026-01-02T00:00:00Z'
  }
];

/**
 * Get mock shifts
 */
export function getMockShifts(): ProductionShift[] {
  return mockShifts;
}

/**
 * Get mock shift by ID
 */
export function getMockShiftById(id: string): ProductionShift | undefined {
  return mockShifts.find((shift) => shift.id === id);
}
