// ==============================|| QUALITY INSPECTIONS MOCK DATA ||============================== //

import type { QualityInspection } from '../types';

/**
 * Mock data for quality inspections
 * Used for development and testing
 */
export const mockQualityInspections: QualityInspection[] = [
  {
    id: 'qc-001',
    code: 'QC-001',
    inspectionDate: '2026-01-20',
    productId: 'product-001',
    productName: 'Thành phẩm A',
    batchId: 'batch-001',
    batchCode: 'Lô SX-001',
    moisture: 10.5,
    impurity: 1.2,
    result: 'passed',
    inspectorId: 'inspector-001',
    inspectorName: 'Nguyễn Văn A',
    attachment: 'https://example.com/qc-001.pdf',
    notes: 'Đạt tiêu chuẩn',
    createdAt: '2026-01-20T08:00:00Z',
    updatedAt: '2026-01-20T08:30:00Z'
  },
  {
    id: 'qc-002',
    code: 'QC-002',
    inspectionDate: '2026-01-21',
    productId: 'product-002',
    productName: 'Thành phẩm B',
    batchId: 'batch-002',
    batchCode: 'Lô SX-002',
    moisture: 13.8,
    impurity: 2.5,
    result: 'failed',
    inspectorId: 'inspector-002',
    inspectorName: 'Trần Thị B',
    attachment: 'https://example.com/qc-002.pdf',
    notes: 'Vượt ngưỡng độ ẩm',
    createdAt: '2026-01-21T08:00:00Z',
    updatedAt: '2026-01-21T08:30:00Z'
  },
  {
    id: 'qc-003',
    code: 'QC-003',
    inspectionDate: '2026-01-22',
    productId: 'product-001',
    productName: 'Thành phẩm A',
    batchId: 'batch-003',
    batchCode: 'Lô SX-003',
    moisture: 11.2,
    impurity: 1.8,
    result: 'passed',
    inspectorId: 'inspector-003',
    inspectorName: 'Lê Văn C',
    attachment: undefined,
    notes: '',
    createdAt: '2026-01-22T08:00:00Z',
    updatedAt: '2026-01-22T08:30:00Z'
  },
  {
    id: 'qc-004',
    code: 'QC-004',
    inspectionDate: '2026-01-23',
    productId: 'product-003',
    productName: 'Thành phẩm C',
    batchId: 'batch-004',
    batchCode: 'Lô SX-004',
    moisture: 9.5,
    impurity: 0.8,
    result: 'passed',
    inspectorId: 'inspector-001',
    inspectorName: 'Nguyễn Văn A',
    attachment: 'https://example.com/qc-004.jpg',
    notes: 'Chất lượng tốt',
    createdAt: '2026-01-23T08:00:00Z',
    updatedAt: '2026-01-23T08:30:00Z'
  },
  {
    id: 'qc-005',
    code: 'QC-005',
    inspectionDate: '2026-01-24',
    productId: 'product-002',
    productName: 'Thành phẩm B',
    batchId: 'batch-005',
    batchCode: 'Lô SX-005',
    moisture: 14.2,
    impurity: 3.1,
    result: 'failed',
    inspectorId: 'inspector-004',
    inspectorName: 'Phạm Thị D',
    attachment: undefined,
    notes: 'Vượt ngưỡng cả độ ẩm và tạp chất',
    createdAt: '2026-01-24T08:00:00Z',
    updatedAt: '2026-01-24T08:30:00Z'
  },
  {
    id: 'qc-006',
    code: 'QC-006',
    inspectionDate: '2026-01-25',
    productId: 'product-004',
    productName: 'Thành phẩm D',
    batchId: 'batch-006',
    batchCode: 'Lô SX-006',
    moisture: 10.8,
    impurity: 1.5,
    result: 'passed',
    inspectorId: 'inspector-005',
    inspectorName: 'Hoàng Văn E',
    attachment: 'https://example.com/qc-006.pdf',
    notes: 'Đạt tiêu chuẩn',
    createdAt: '2026-01-25T08:00:00Z',
    updatedAt: '2026-01-25T08:30:00Z'
  },
  {
    id: 'qc-007',
    code: 'QC-007',
    inspectionDate: '2026-01-26',
    productId: 'product-001',
    productName: 'Thành phẩm A',
    batchId: 'batch-007',
    batchCode: 'Lô SX-007',
    moisture: 11.5,
    impurity: 1.9,
    result: 'passed',
    inspectorId: 'inspector-002',
    inspectorName: 'Trần Thị B',
    attachment: undefined,
    notes: '',
    createdAt: '2026-01-26T08:00:00Z',
    updatedAt: '2026-01-26T08:30:00Z'
  },
  {
    id: 'qc-008',
    code: 'QC-008',
    inspectionDate: '2026-01-27',
    productId: 'product-005',
    productName: 'Thành phẩm E',
    batchId: 'batch-008',
    batchCode: 'Lô SX-008',
    moisture: 12.8,
    impurity: 2.2,
    result: 'failed',
    inspectorId: 'inspector-003',
    inspectorName: 'Lê Văn C',
    attachment: 'https://example.com/qc-008.pdf',
    notes: 'Vượt ngưỡng độ ẩm',
    createdAt: '2026-01-27T08:00:00Z',
    updatedAt: '2026-01-27T08:30:00Z'
  }
];

/**
 * Get mock quality inspection by ID
 */
export function getMockQualityInspectionById(id: string): QualityInspection | undefined {
  return mockQualityInspections.find((inspection) => inspection.id === id);
}

/**
 * Get all mock quality inspections
 */
export function getMockQualityInspections(): QualityInspection[] {
  return mockQualityInspections;
}
