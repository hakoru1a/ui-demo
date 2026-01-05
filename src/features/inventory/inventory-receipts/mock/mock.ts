// ==============================|| INVENTORY RECEIPTS MOCK DATA ||============================== //

import type { InventoryReceipt } from '../types';

/**
 * Mock Inventory Receipt data for development and testing
 */
export function getMockInventoryReceipts(): InventoryReceipt[] {
  return [
    {
      id: '1',
      code: 'PN001',
      receiptDate: new Date('2024-01-10'),
      receiptType: 'material',
      warehouseId: '1',
      warehouseName: 'Kho Nguyên liệu A',
      productId: '1',
      productName: 'Gỗ keo',
      batchId: '1',
      batchCode: 'Lô 001',
      quantity: 1000,
      unit: 'Kg',
      totalWeight: 1000,
      source: 'purchase',
      status: 'draft',
      notes: 'Nhập từ nhà cung cấp ABC',
      createdAt: new Date('2024-01-10'),
      updatedAt: new Date('2024-01-10')
    },
    {
      id: '2',
      code: 'PN002',
      receiptDate: new Date('2024-01-15'),
      receiptType: 'finished',
      warehouseId: '2',
      warehouseName: 'Kho Thành phẩm B',
      productId: '3',
      productName: 'Ván ép',
      quantity: 500,
      unit: 'm3',
      totalWeight: 500,
      source: 'production',
      status: 'received',
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-01-16')
    },
    {
      id: '3',
      code: 'PN003',
      receiptDate: new Date('2024-01-18'),
      receiptType: 'material',
      warehouseId: '1',
      warehouseName: 'Kho Nguyên liệu A',
      productId: '2',
      productName: 'Gỗ cao su',
      batchId: '2',
      batchCode: 'Lô 002',
      quantity: 2000,
      unit: 'Kg',
      totalWeight: 2000,
      source: 'purchase',
      status: 'cancelled',
      notes: 'Hủy do không đủ điều kiện',
      createdAt: new Date('2024-01-18'),
      updatedAt: new Date('2024-01-19')
    },
    {
      id: '4',
      code: 'PN004',
      receiptDate: new Date('2024-01-20'),
      receiptType: 'finished',
      warehouseId: '2',
      warehouseName: 'Kho Thành phẩm B',
      productId: '4',
      productName: 'Gỗ dăm',
      quantity: 300,
      unit: 'Tấn',
      totalWeight: 300,
      source: 'production',
      status: 'draft',
      createdAt: new Date('2024-01-20'),
      updatedAt: new Date('2024-01-20')
    },
    {
      id: '5',
      code: 'PN005',
      receiptDate: new Date('2024-01-22'),
      receiptType: 'material',
      warehouseId: '3',
      warehouseName: 'Kho Trung chuyển C',
      productId: '1',
      productName: 'Gỗ keo',
      batchId: '3',
      batchCode: 'Lô 003',
      quantity: 1500,
      unit: 'Kg',
      totalWeight: 1500,
      source: 'purchase',
      status: 'received',
      createdAt: new Date('2024-01-22'),
      updatedAt: new Date('2024-01-23')
    }
  ];
}

/**
 * Get a single mock inventory receipt by ID
 */
export function getMockInventoryReceipt(id: string): InventoryReceipt | null {
  const receipts = getMockInventoryReceipts();
  return receipts.find((receipt) => receipt.id === id) || null;
}
