// ==============================|| SHIFT PRODUCTION MOCK DATA ||============================== //

import type { ShiftProduction } from '../types';

/**
 * Mock data for shift production
 * Used for development and testing (Day view)
 */
export const mockProductions: ShiftProduction[] = [
  {
    id: 'prod-001',
    shiftId: 'shift-001',
    quantity: 850,
    unit: 'kg',
    recordedAt: '2026-01-15T16:00:00Z',
    notes: 'Sản lượng ca sáng'
  },
  {
    id: 'prod-002',
    shiftId: 'shift-002',
    quantity: 920,
    unit: 'kg',
    recordedAt: '2026-01-16T00:00:00Z',
    notes: 'Sản lượng ca chiều'
  },
  {
    id: 'prod-003',
    shiftId: 'shift-003',
    quantity: 750,
    unit: 'kg',
    recordedAt: '2026-01-16T16:00:00Z',
    notes: 'Sản lượng ca đang chạy'
  },
  {
    id: 'prod-004',
    shiftId: 'shift-004',
    quantity: 880,
    unit: 'kg',
    recordedAt: '2026-01-16T16:00:00Z',
    notes: 'Sản lượng ca sáng'
  },
  {
    id: 'prod-005',
    shiftId: 'shift-005',
    quantity: 950,
    unit: 'kg',
    recordedAt: '2026-01-17T00:00:00Z',
    notes: 'Sản lượng ca chiều'
  },
  {
    id: 'prod-006',
    shiftId: 'shift-008',
    quantity: 620,
    unit: 'kg',
    recordedAt: '2026-01-18T16:00:00Z',
    notes: 'Sản lượng ca sáng'
  },
  {
    id: 'prod-007',
    shiftId: 'shift-009',
    quantity: 680,
    unit: 'kg',
    recordedAt: '2026-01-19T00:00:00Z',
    notes: 'Sản lượng ca chiều'
  },
  {
    id: 'prod-008',
    shiftId: 'shift-010',
    quantity: 720,
    unit: 'kg',
    recordedAt: '2026-01-19T16:00:00Z',
    notes: 'Sản lượng ca sáng đang chạy'
  },
  {
    id: 'prod-009',
    shiftId: 'shift-012',
    quantity: 580,
    unit: 'kg',
    recordedAt: '2026-01-12T16:00:00Z',
    notes: 'Sản lượng ca sáng'
  },
  {
    id: 'prod-010',
    shiftId: 'shift-013',
    quantity: 640,
    unit: 'kg',
    recordedAt: '2026-01-13T00:00:00Z',
    notes: 'Sản lượng ca chiều'
  },
  {
    id: 'prod-011',
    shiftId: 'shift-014',
    quantity: 550,
    unit: 'kg',
    recordedAt: '2026-01-22T16:00:00Z',
    notes: 'Sản lượng ca sáng đang chạy'
  },
  {
    id: 'prod-012',
    shiftId: 'shift-020',
    quantity: 1100,
    unit: 'kg',
    recordedAt: '2026-01-17T16:00:00Z',
    notes: 'Sản lượng ca sáng'
  },
  {
    id: 'prod-013',
    shiftId: 'shift-021',
    quantity: 1150,
    unit: 'kg',
    recordedAt: '2026-01-18T00:00:00Z',
    notes: 'Sản lượng ca chiều'
  }
];

/**
 * Get mock productions
 */
export function getMockProductions(): ShiftProduction[] {
  return mockProductions;
}
