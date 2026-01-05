// ==============================|| TRANSFER TRACEABILITY MOCK DATA ||============================== //

import type { TransferTraceability } from '../types/traceability';

/**
 * Mock Transfer Traceability data for development and testing
 */
export function getMockTransferTraceability(transferId: string, batchId?: string): TransferTraceability | null {
  // Mock data based on transfer ID and batch
  const today = new Date();
  const createDate = (daysAgo: number) => {
    const date = new Date(today);
    date.setDate(date.getDate() - daysAgo);
    return date;
  };

  // Mock traceability data
  const mockData: Record<string, TransferTraceability> = {
    '1': {
      id: 'trace-1',
      transferId: '1',
      transferCode: 'TC001',
      skuId: '1',
      skuCode: 'SKU001',
      skuName: 'Gỗ keo',
      batchId: '1',
      batchCode: 'Lô 001',
      originAreaId: 'area-1',
      originAreaName: 'Vùng trồng FSC A',
      harvestPlanId: 'hp-1',
      harvestPlanCode: 'KH-001',
      supplierId: 'supplier-1',
      supplierName: 'Nhà cung cấp Gỗ Xanh',
      productionBatchId: 'prod-1',
      productionBatchCode: 'Lô SX-001',
      warehouseHistory: [
        {
          date: createDate(30),
          warehouseName: 'Kho Nguyên liệu A',
          action: 'Nhập kho từ nhà cung cấp',
          quantity: 5000,
          unit: 'Kg'
        },
        {
          date: createDate(20),
          warehouseName: 'Kho Nguyên liệu A',
          action: 'Chuyển kho',
          quantity: 1000,
          unit: 'Kg'
        },
        {
          date: createDate(1),
          warehouseName: 'Kho Trung chuyển C',
          action: 'Nhận chuyển kho',
          quantity: 1000,
          unit: 'Kg'
        }
      ],
      certification: 'FSC',
      traceStatus: 'full',
      createdAt: createDate(30),
      updatedAt: createDate(1)
    },
    '2': {
      id: 'trace-2',
      transferId: '2',
      transferCode: 'TC002',
      skuId: '3',
      skuCode: 'SKU003',
      skuName: 'Ván ép',
      batchId: '2',
      batchCode: 'Lô 002',
      originAreaId: 'area-2',
      originAreaName: 'Vùng trồng PEFC B',
      supplierId: 'supplier-2',
      supplierName: 'Nhà cung cấp Gỗ Sạch',
      warehouseHistory: [
        {
          date: createDate(15),
          warehouseName: 'Kho Thành phẩm B',
          action: 'Nhập kho từ sản xuất',
          quantity: 200,
          unit: 'Tấn'
        },
        {
          date: createDate(3),
          warehouseName: 'Kho Thành phẩm B',
          action: 'Chuyển kho',
          quantity: 200,
          unit: 'Tấn'
        }
      ],
      certification: 'PEFC',
      traceStatus: 'full',
      createdAt: createDate(15),
      updatedAt: createDate(3)
    },
    '3': {
      id: 'trace-3',
      transferId: '3',
      transferCode: 'TC003',
      skuId: '1',
      skuCode: 'SKU001',
      skuName: 'Gỗ keo',
      batchId: '1',
      batchCode: 'Lô 001',
      originAreaId: undefined,
      originAreaName: undefined,
      warehouseHistory: [
        {
          date: createDate(10),
          warehouseName: 'Kho Nguyên liệu A',
          action: 'Nhập kho',
          quantity: 2000,
          unit: 'Kg'
        },
        {
          date: createDate(5),
          warehouseName: 'Kho Nguyên liệu A',
          action: 'Chuyển kho',
          quantity: 2000,
          unit: 'Kg'
        }
      ],
      certification: 'none',
      traceStatus: 'missing',
      createdAt: createDate(10),
      updatedAt: createDate(5)
    },
    '4': {
      id: 'trace-4',
      transferId: '4',
      transferCode: 'TC004',
      skuId: '3',
      skuCode: 'SKU003',
      skuName: 'Ván ép',
      batchId: '2',
      batchCode: 'Lô 002',
      originAreaId: 'area-2',
      originAreaName: 'Vùng trồng PEFC B',
      harvestPlanId: 'hp-2',
      harvestPlanCode: 'KH-002',
      supplierId: 'supplier-2',
      supplierName: 'Nhà cung cấp Gỗ Sạch',
      productionBatchId: 'prod-2',
      productionBatchCode: 'Lô SX-002',
      warehouseHistory: [
        {
          date: createDate(25),
          warehouseName: 'Kho Thành phẩm B',
          action: 'Nhập kho từ sản xuất',
          quantity: 150,
          unit: 'Tấn'
        },
        {
          date: createDate(7),
          warehouseName: 'Kho Trung chuyển C',
          action: 'Chuyển kho',
          quantity: 150,
          unit: 'Tấn'
        },
        {
          date: createDate(7),
          warehouseName: 'Kho Xuất khẩu D',
          action: 'Nhận chuyển kho',
          quantity: 150,
          unit: 'Tấn'
        }
      ],
      certification: 'PEFC',
      traceStatus: 'full',
      createdAt: createDate(25),
      updatedAt: createDate(7)
    },
    '5': {
      id: 'trace-5',
      transferId: '5',
      transferCode: 'TC005',
      skuId: '3',
      skuCode: 'SKU003',
      skuName: 'Ván ép',
      batchId: '2',
      batchCode: 'Lô 002',
      originAreaId: 'area-2',
      originAreaName: 'Vùng trồng PEFC B',
      supplierId: 'supplier-2',
      supplierName: 'Nhà cung cấp Gỗ Sạch',
      warehouseHistory: [
        {
          date: createDate(20),
          warehouseName: 'Kho Thành phẩm B',
          action: 'Nhập kho từ sản xuất',
          quantity: 50,
          unit: 'Tấn'
        },
        {
          date: createDate(10),
          warehouseName: 'Kho Thành phẩm B',
          action: 'Chuyển kho (Hủy)',
          quantity: 50,
          unit: 'Tấn'
        }
      ],
      certification: 'PEFC',
      traceStatus: 'full',
      createdAt: createDate(20),
      updatedAt: createDate(10)
    },
    '6': {
      id: 'trace-6',
      transferId: '6',
      transferCode: 'TC006',
      skuId: '2',
      skuCode: 'SKU002',
      skuName: 'Gỗ cao su',
      batchId: '1',
      batchCode: 'Lô 001',
      originAreaId: 'area-1',
      originAreaName: 'Vùng trồng FSC A',
      harvestPlanId: 'hp-1',
      harvestPlanCode: 'KH-001',
      supplierId: 'supplier-1',
      supplierName: 'Nhà cung cấp Gỗ Xanh',
      warehouseHistory: [
        {
          date: createDate(40),
          warehouseName: 'Kho Nguyên liệu A',
          action: 'Nhập kho từ nhà cung cấp',
          quantity: 3000,
          unit: 'Kg'
        },
        {
          date: createDate(30),
          warehouseName: 'Kho Nguyên liệu A',
          action: 'Xuất kho sản xuất',
          quantity: 2000,
          unit: 'Kg'
        },
        {
          date: createDate(12),
          warehouseName: 'Kho Nguyên liệu A',
          action: 'Chuyển kho',
          quantity: 800,
          unit: 'Kg'
        },
        {
          date: createDate(12),
          warehouseName: 'Kho Trung chuyển C',
          action: 'Nhận chuyển kho',
          quantity: 800,
          unit: 'Kg'
        }
      ],
      certification: 'FSC',
      traceStatus: 'full',
      createdAt: createDate(40),
      updatedAt: createDate(12)
    },
    '7': {
      id: 'trace-7',
      transferId: '7',
      transferCode: 'TC007',
      skuId: '3',
      skuCode: 'SKU003',
      skuName: 'Ván ép',
      batchId: '2',
      batchCode: 'Lô 002',
      originAreaId: 'area-2',
      originAreaName: 'Vùng trồng PEFC B',
      supplierId: 'supplier-2',
      supplierName: 'Nhà cung cấp Gỗ Sạch',
      warehouseHistory: [
        {
          date: createDate(30),
          warehouseName: 'Kho Xuất khẩu D',
          action: 'Nhập kho từ sản xuất',
          quantity: 200,
          unit: 'Tấn'
        },
        {
          date: createDate(20),
          warehouseName: 'Kho Xuất khẩu D',
          action: 'Xuất kho xuất khẩu',
          quantity: 125,
          unit: 'Tấn'
        },
        {
          date: createDate(14),
          warehouseName: 'Kho Xuất khẩu D',
          action: 'Chuyển kho',
          quantity: 75,
          unit: 'Tấn'
        }
      ],
      certification: 'PEFC',
      traceStatus: 'full',
      createdAt: createDate(30),
      updatedAt: createDate(14)
    },
    '8': {
      id: 'trace-8',
      transferId: '8',
      transferCode: 'TC008',
      skuId: '1',
      skuCode: 'SKU001',
      skuName: 'Gỗ keo',
      batchId: '1',
      batchCode: 'Lô 001',
      originAreaId: 'area-1',
      originAreaName: 'Vùng trồng FSC A',
      harvestPlanId: 'hp-1',
      harvestPlanCode: 'KH-001',
      supplierId: 'supplier-1',
      supplierName: 'Nhà cung cấp Gỗ Xanh',
      productionBatchId: 'prod-1',
      productionBatchCode: 'Lô SX-001',
      warehouseHistory: [
        {
          date: createDate(45),
          warehouseName: 'Kho Nguyên liệu A',
          action: 'Nhập kho từ nhà cung cấp',
          quantity: 5000,
          unit: 'Kg'
        },
        {
          date: createDate(30),
          warehouseName: 'Kho Nguyên liệu A',
          action: 'Chuyển kho',
          quantity: 2000,
          unit: 'Kg'
        },
        {
          date: createDate(30),
          warehouseName: 'Kho Trung chuyển C',
          action: 'Nhận chuyển kho',
          quantity: 2000,
          unit: 'Kg'
        },
        {
          date: createDate(20),
          warehouseName: 'Kho Trung chuyển C',
          action: 'Xuất kho',
          quantity: 500,
          unit: 'Kg'
        },
        {
          date: createDate(17),
          warehouseName: 'Kho Trung chuyển C',
          action: 'Chuyển kho',
          quantity: 1500,
          unit: 'Kg'
        },
        {
          date: createDate(17),
          warehouseName: 'Kho Nguyên liệu A',
          action: 'Nhận chuyển kho',
          quantity: 1500,
          unit: 'Kg'
        }
      ],
      certification: 'FSC',
      traceStatus: 'full',
      createdAt: createDate(45),
      updatedAt: createDate(17)
    },
    '9': {
      id: 'trace-9',
      transferId: '9',
      transferCode: 'TC009',
      skuId: '4',
      skuCode: 'SKU004',
      skuName: 'Ván ép loại 2',
      batchId: '3',
      batchCode: 'Lô 003',
      originAreaId: 'area-3',
      originAreaName: 'Vùng trồng FSC C',
      harvestPlanId: 'hp-3',
      harvestPlanCode: 'KH-003',
      supplierId: 'supplier-3',
      supplierName: 'Nhà cung cấp Gỗ Việt',
      productionBatchId: 'prod-3',
      productionBatchCode: 'Lô SX-003',
      warehouseHistory: [
        {
          date: createDate(35),
          warehouseName: 'Kho Thành phẩm B',
          action: 'Nhập kho từ sản xuất',
          quantity: 300,
          unit: 'Tấn'
        },
        {
          date: createDate(25),
          warehouseName: 'Kho Thành phẩm B',
          action: 'Xuất kho bán hàng',
          quantity: 180,
          unit: 'Tấn'
        },
        {
          date: createDate(19),
          warehouseName: 'Kho Thành phẩm B',
          action: 'Chuyển kho',
          quantity: 120,
          unit: 'Tấn'
        }
      ],
      certification: 'FSC',
      traceStatus: 'full',
      createdAt: createDate(35),
      updatedAt: createDate(19)
    },
    '10': {
      id: 'trace-10',
      transferId: '10',
      transferCode: 'TC010',
      skuId: '1',
      skuCode: 'SKU001',
      skuName: 'Gỗ keo',
      batchId: '1',
      batchCode: 'Lô 001',
      originAreaId: 'area-1',
      originAreaName: 'Vùng trồng FSC A',
      harvestPlanId: 'hp-1',
      harvestPlanCode: 'KH-001',
      supplierId: 'supplier-1',
      supplierName: 'Nhà cung cấp Gỗ Xanh',
      productionBatchId: 'prod-1',
      productionBatchCode: 'Lô SX-001',
      warehouseHistory: [
        {
          date: createDate(60),
          warehouseName: 'Kho Nguyên liệu A',
          action: 'Nhập kho từ nhà cung cấp',
          quantity: 10000,
          unit: 'Kg'
        },
        {
          date: createDate(50),
          warehouseName: 'Kho Nguyên liệu A',
          action: 'Xuất kho sản xuất',
          quantity: 5000,
          unit: 'Kg'
        },
        {
          date: createDate(40),
          warehouseName: 'Kho Nguyên liệu A',
          action: 'Chuyển kho',
          quantity: 2000,
          unit: 'Kg'
        },
        {
          date: createDate(21),
          warehouseName: 'Kho Nguyên liệu A',
          action: 'Chuyển kho',
          quantity: 3000,
          unit: 'Kg'
        },
        {
          date: createDate(21),
          warehouseName: 'Kho Thành phẩm B',
          action: 'Nhận chuyển kho',
          quantity: 3000,
          unit: 'Kg'
        }
      ],
      certification: 'FSC',
      traceStatus: 'full',
      createdAt: createDate(60),
      updatedAt: createDate(21)
    }
  };

  // If batchId is provided, try to find by batch
  if (batchId) {
    const found = Object.values(mockData).find((item) => item.batchId === batchId);
    if (found) return found;
  }

  // Otherwise, find by transfer ID
  return mockData[transferId] || null;
}

/**
 * Get traceability by transfer code
 */
export function getMockTransferTraceabilityByCode(transferCode: string): TransferTraceability | null {
  // Try to get by code directly from all available transfers
  const allTraceability = [
    getMockTransferTraceability('1'),
    getMockTransferTraceability('2'),
    getMockTransferTraceability('3'),
    getMockTransferTraceability('4'),
    getMockTransferTraceability('5'),
    getMockTransferTraceability('6'),
    getMockTransferTraceability('7'),
    getMockTransferTraceability('8'),
    getMockTransferTraceability('9'),
    getMockTransferTraceability('10')
  ].filter((item): item is TransferTraceability => item !== null);

  return allTraceability.find((item) => item.transferCode === transferCode) || null;
}

/**
 * Get all mock traceability data (for search/list purposes)
 */
export function getAllMockTransferTraceability(): TransferTraceability[] {
  return [
    getMockTransferTraceability('1'),
    getMockTransferTraceability('2'),
    getMockTransferTraceability('3'),
    getMockTransferTraceability('4'),
    getMockTransferTraceability('5'),
    getMockTransferTraceability('6'),
    getMockTransferTraceability('7'),
    getMockTransferTraceability('8'),
    getMockTransferTraceability('9'),
    getMockTransferTraceability('10')
  ].filter((item): item is TransferTraceability => item !== null);
}
