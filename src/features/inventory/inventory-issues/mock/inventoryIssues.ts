// ==============================|| INVENTORY ISSUES MOCK DATA ||============================== //

import dateHelper from 'utils/dateHelper';

import type { InventoryIssue } from '../types/index';

/**
 * Generate mock inventory issues for testing
 */
export function getMockInventoryIssues(): InventoryIssue[] {
  const issues: InventoryIssue[] = [];

  for (let i = 1; i <= 30; i++) {
    const issueDate = dateHelper.addDay(dateHelper.getToday(), -Math.floor(Math.random() * 30));
    const statuses: Array<'draft' | 'issued' | 'cancelled'> = ['draft', 'issued', 'cancelled'];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const issueTypes: Array<'warehouse' | 'port'> = ['warehouse', 'port'];
    const issueType = issueTypes[Math.floor(Math.random() * issueTypes.length)];

    const quantity = Math.floor(Math.random() * 50000) + 1000; // 1000-51000 kg

    issues.push({
      id: `issue-${i}`,
      code: `PX-2024-${String(i).padStart(3, '0')}`,
      issueDate: dateHelper.isValidDate(issueDate) ? (dateHelper.normalizeDateValue(issueDate)?.toDate() ?? new Date()) : new Date(),
      issueType,
      warehouseId: `wh-00${(i % 4) + 1}`,
      warehouseName: `Kho ${String.fromCharCode(65 + (i % 4))} - ${['Hà Nội', 'Hồ Chí Minh', 'Đà Nẵng', 'Cần Thơ'][i % 4]}`,
      destinationId: issueType === 'warehouse' ? `dest-wh-00${(i % 3) + 1}` : `port-00${(i % 3) + 1}`,
      destinationName: issueType === 'warehouse' ? `Kho nội bộ ${(i % 3) + 1}` : ['Cảng Hải Phòng', 'Cảng Sài Gòn', 'Cảng Đà Nẵng'][i % 3],
      destinationType: issueType === 'warehouse' ? 'warehouse' : 'port',
      customerId: i % 3 === 0 ? `cust-00${(i % 3) + 1}` : undefined,
      customerName: i % 3 === 0 ? `Công ty ${String.fromCharCode(65 + (i % 3))}` : undefined,
      productId: `prod-00${(i % 4) + 1}`,
      productName: ['Gỗ keo (kg)', 'Gỗ bạch đàn (kg)', 'Nguyên liệu A (kg)', 'Nguyên liệu B (kg)'][i % 4],
      batchId: i % 2 === 0 ? `batch-00${(i % 3) + 1}` : undefined,
      batchCode: i % 2 === 0 ? `Lô SX-2024-${String((i % 3) + 1).padStart(3, '0')}` : undefined,
      quantity,
      transportRef: i % 3 === 0 ? `Xe ${String.fromCharCode(65 + (i % 26))}-${Math.floor(Math.random() * 99999)}` : undefined,
      referenceDoc: i % 4 === 0 ? `/documents/reference-${i}.pdf` : undefined,
      status,
      notes: i % 5 === 0 ? `Ghi chú cho phiếu xuất ${i}` : undefined,
      createdAt: dateHelper.isValidDate(issueDate) ? (dateHelper.normalizeDateValue(issueDate)?.toDate() ?? new Date()) : new Date(),
      updatedAt: dateHelper.isValidDate(issueDate) ? (dateHelper.normalizeDateValue(issueDate)?.toDate() ?? new Date()) : new Date()
    });
  }

  return issues;
}
