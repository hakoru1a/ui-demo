// ==============================|| SHIFT LOGS MOCK DATA ||============================== //

import type { ShiftLog } from '../types';

/**
 * Mock data for shift logs
 * Used for development and testing
 */
export const mockShiftLogs: ShiftLog[] = [
  {
    id: 'log-001',
    code: 'NK-001',
    batchId: 'batch-001',
    batchCode: 'LO-001',
    shiftId: 'shift-001',
    shiftTime: '08:00 - 16:00',
    workDate: '2026-01-15',
    outputQuantity: 1500,
    hasIncident: false,
    status: 'completed',
    notes: 'Ca sáng hoàn thành tốt',
    createdAt: '2026-01-15T16:00:00Z',
    updatedAt: '2026-01-15T16:00:00Z'
  },
  {
    id: 'log-002',
    code: 'NK-002',
    batchId: 'batch-001',
    batchCode: 'LO-001',
    shiftId: 'shift-002',
    shiftTime: '16:00 - 00:00',
    workDate: '2026-01-15',
    outputQuantity: 1450,
    hasIncident: true,
    status: 'completed',
    notes: 'Có sự cố nhỏ ở dây chuyền 1',
    createdAt: '2026-01-16T00:00:00Z',
    updatedAt: '2026-01-16T00:00:00Z'
  },
  {
    id: 'log-003',
    code: 'NK-003',
    batchId: 'batch-002',
    batchCode: 'LO-002',
    shiftId: 'shift-003',
    shiftTime: '08:00 - 16:00',
    workDate: '2026-01-16',
    outputQuantity: 1600,
    hasIncident: false,
    status: 'running',
    notes: '',
    createdAt: '2026-01-16T08:00:00Z',
    updatedAt: '2026-01-16T08:00:00Z'
  },
  {
    id: 'log-004',
    code: 'NK-004',
    batchId: 'batch-001',
    batchCode: 'LO-001',
    shiftId: 'shift-004',
    shiftTime: '08:00 - 16:00',
    workDate: '2026-01-16',
    outputQuantity: 1520,
    hasIncident: false,
    status: 'completed',
    notes: 'Ca sáng',
    createdAt: '2026-01-16T08:00:00Z',
    updatedAt: '2026-01-16T16:00:00Z'
  },
  {
    id: 'log-005',
    code: 'NK-005',
    batchId: 'batch-003',
    batchCode: 'LO-003',
    shiftId: 'shift-005',
    shiftTime: '16:00 - 00:00',
    workDate: '2026-01-16',
    outputQuantity: 0,
    hasIncident: false,
    status: 'running',
    notes: '',
    createdAt: '2026-01-16T16:00:00Z',
    updatedAt: '2026-01-16T16:00:00Z'
  }
];

/**
 * Get mock shift logs
 */
export function getMockShiftLogs(): ShiftLog[] {
  return mockShiftLogs;
}
