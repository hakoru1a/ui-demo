// ==============================|| TRANSFER MOCK DATA ||============================== //

import type { Transfer } from '../types';

/**
 * Mock Transfer data for development and testing
 */
export function getMockTransfers(): Transfer[] {
  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth();

  // Helper to create date
  const createDate = (day: number, monthOffset: number = 0) => {
    const date = new Date(currentYear, currentMonth + monthOffset, day);
    return date;
  };

  return [
    {
      id: '1',
      code: 'TC001',
      transferDate: createDate(1),
      sourceWarehouseId: '1',
      sourceWarehouseName: 'Kho Nguyên liệu A',
      destinationWarehouseId: '3',
      destinationWarehouseName: 'Kho Trung chuyển C',
      itemType: 'material',
      items: [
        {
          id: '1-1',
          skuId: '1',
          skuCode: 'SKU001',
          skuName: 'Gỗ keo',
          batchId: '1',
          batchCode: 'Lô 001',
          quantity: 1000,
          unit: 'Kg',
          weight: 1000
        },
        {
          id: '1-2',
          skuId: '2',
          skuCode: 'SKU002',
          skuName: 'Gỗ cao su',
          quantity: 500,
          unit: 'Kg',
          weight: 500
        }
      ],
      skuCount: 2,
      totalWeight: 1500,
      transportRef: 'Xe tải 01',
      status: 'transferred',
      notes: 'Chuyển kho định kỳ',
      createdAt: createDate(1),
      updatedAt: createDate(1)
    },
    {
      id: '2',
      code: 'TC002',
      transferDate: createDate(3),
      sourceWarehouseId: '2',
      sourceWarehouseName: 'Kho Thành phẩm B',
      destinationWarehouseId: '4',
      destinationWarehouseName: 'Kho Xuất khẩu D',
      itemType: 'finished',
      items: [
        {
          id: '2-1',
          skuId: '3',
          skuCode: 'SKU003',
          skuName: 'Ván ép',
          batchId: '2',
          batchCode: 'Lô 002',
          quantity: 200,
          unit: 'Tấn',
          weight: 200
        }
      ],
      skuCount: 1,
      totalWeight: 200,
      status: 'draft',
      notes: 'Chuyển kho - Chưa xác nhận',
      createdAt: createDate(3),
      updatedAt: createDate(3)
    },
    {
      id: '3',
      code: 'TC003',
      transferDate: createDate(5),
      sourceWarehouseId: '1',
      sourceWarehouseName: 'Kho Nguyên liệu A',
      destinationWarehouseId: '2',
      destinationWarehouseName: 'Kho Thành phẩm B',
      itemType: 'material',
      items: [
        {
          id: '3-1',
          skuId: '1',
          skuCode: 'SKU001',
          skuName: 'Gỗ keo',
          quantity: 2000,
          unit: 'Kg',
          weight: 2000
        }
      ],
      skuCount: 1,
      totalWeight: 2000,
      transportRef: 'Xe tải 02',
      status: 'transferred',
      notes: 'Chuyển kho phục vụ sản xuất',
      createdAt: createDate(5),
      updatedAt: createDate(5)
    },
    {
      id: '4',
      code: 'TC004',
      transferDate: createDate(7),
      sourceWarehouseId: '3',
      sourceWarehouseName: 'Kho Trung chuyển C',
      destinationWarehouseId: '4',
      destinationWarehouseName: 'Kho Xuất khẩu D',
      itemType: 'finished',
      items: [
        {
          id: '4-1',
          skuId: '3',
          skuCode: 'SKU003',
          skuName: 'Ván ép',
          quantity: 150,
          unit: 'Tấn',
          weight: 150
        },
        {
          id: '4-2',
          skuId: '4',
          skuCode: 'SKU004',
          skuName: 'Ván ép loại 2',
          batchId: '3',
          batchCode: 'Lô 003',
          quantity: 100,
          unit: 'Tấn',
          weight: 100
        }
      ],
      skuCount: 2,
      totalWeight: 250,
      status: 'draft',
      notes: 'Chuyển kho - Chưa xác nhận',
      createdAt: createDate(7),
      updatedAt: createDate(7)
    },
    {
      id: '5',
      code: 'TC005',
      transferDate: createDate(10),
      sourceWarehouseId: '2',
      sourceWarehouseName: 'Kho Thành phẩm B',
      destinationWarehouseId: '1',
      destinationWarehouseName: 'Kho Nguyên liệu A',
      itemType: 'finished',
      items: [
        {
          id: '5-1',
          skuId: '3',
          skuCode: 'SKU003',
          skuName: 'Ván ép',
          quantity: 50,
          unit: 'Tấn',
          weight: 50
        }
      ],
      skuCount: 1,
      totalWeight: 50,
      status: 'cancelled',
      notes: 'Hủy do không đủ điều kiện',
      createdAt: createDate(10),
      updatedAt: createDate(10)
    },
    {
      id: '6',
      code: 'TC006',
      transferDate: createDate(12),
      sourceWarehouseId: '1',
      sourceWarehouseName: 'Kho Nguyên liệu A',
      destinationWarehouseId: '3',
      destinationWarehouseName: 'Kho Trung chuyển C',
      itemType: 'material',
      items: [
        {
          id: '6-1',
          skuId: '2',
          skuCode: 'SKU002',
          skuName: 'Gỗ cao su',
          quantity: 800,
          unit: 'Kg',
          weight: 800
        }
      ],
      skuCount: 1,
      totalWeight: 800,
      transportRef: 'Xe tải 03',
      status: 'transferred',
      notes: 'Chuyển kho định kỳ',
      createdAt: createDate(12),
      updatedAt: createDate(12)
    },
    {
      id: '7',
      code: 'TC007',
      transferDate: createDate(14),
      sourceWarehouseId: '4',
      sourceWarehouseName: 'Kho Xuất khẩu D',
      destinationWarehouseId: '2',
      destinationWarehouseName: 'Kho Thành phẩm B',
      itemType: 'finished',
      items: [
        {
          id: '7-1',
          skuId: '3',
          skuCode: 'SKU003',
          skuName: 'Ván ép',
          quantity: 75,
          unit: 'Tấn',
          weight: 75
        }
      ],
      skuCount: 1,
      totalWeight: 75,
      status: 'draft',
      notes: 'Chuyển kho - Chưa xác nhận',
      createdAt: createDate(14),
      updatedAt: createDate(14)
    },
    {
      id: '8',
      code: 'TC008',
      transferDate: createDate(17),
      sourceWarehouseId: '3',
      sourceWarehouseName: 'Kho Trung chuyển C',
      destinationWarehouseId: '1',
      destinationWarehouseName: 'Kho Nguyên liệu A',
      itemType: 'material',
      items: [
        {
          id: '8-1',
          skuId: '1',
          skuCode: 'SKU001',
          skuName: 'Gỗ keo',
          batchId: '1',
          batchCode: 'Lô 001',
          quantity: 1500,
          unit: 'Kg',
          weight: 1500
        },
        {
          id: '8-2',
          skuId: '2',
          skuCode: 'SKU002',
          skuName: 'Gỗ cao su',
          quantity: 600,
          unit: 'Kg',
          weight: 600
        }
      ],
      skuCount: 2,
      totalWeight: 2100,
      transportRef: 'Xe tải 04',
      status: 'transferred',
      notes: 'Chuyển kho định kỳ',
      createdAt: createDate(17),
      updatedAt: createDate(17)
    },
    {
      id: '9',
      code: 'TC009',
      transferDate: createDate(19),
      sourceWarehouseId: '2',
      sourceWarehouseName: 'Kho Thành phẩm B',
      destinationWarehouseId: '4',
      destinationWarehouseName: 'Kho Xuất khẩu D',
      itemType: 'finished',
      items: [
        {
          id: '9-1',
          skuId: '4',
          skuCode: 'SKU004',
          skuName: 'Ván ép loại 2',
          quantity: 120,
          unit: 'Tấn',
          weight: 120
        }
      ],
      skuCount: 1,
      totalWeight: 120,
      status: 'draft',
      notes: 'Chuyển kho - Chưa xác nhận',
      createdAt: createDate(19),
      updatedAt: createDate(19)
    },
    {
      id: '10',
      code: 'TC010',
      transferDate: createDate(21),
      sourceWarehouseId: '1',
      sourceWarehouseName: 'Kho Nguyên liệu A',
      destinationWarehouseId: '2',
      destinationWarehouseName: 'Kho Thành phẩm B',
      itemType: 'material',
      items: [
        {
          id: '10-1',
          skuId: '1',
          skuCode: 'SKU001',
          skuName: 'Gỗ keo',
          quantity: 3000,
          unit: 'Kg',
          weight: 3000
        }
      ],
      skuCount: 1,
      totalWeight: 3000,
      transportRef: 'Xe tải 05',
      status: 'transferred',
      notes: 'Chuyển kho phục vụ sản xuất',
      createdAt: createDate(21),
      updatedAt: createDate(21)
    }
  ];
}

/**
 * Get a single mock transfer by ID
 */
export function getMockTransfer(id: string): Transfer | null {
  const transfers = getMockTransfers();
  return transfers.find((transfer) => transfer.id === id) || null;
}
