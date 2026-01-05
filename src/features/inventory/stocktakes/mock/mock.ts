// ==============================|| STOCKTAKE MOCK DATA ||============================== //

import type { Stocktake } from '../types';

/**
 * Mock Stocktake data for development and testing
 */
export function getMockStocktakes(): Stocktake[] {
  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth();

  // Helper to create date
  const createDate = (day: number, monthOffset: number = 0) => {
    const date = new Date(currentYear, currentMonth + monthOffset, day);
    return date;
  };

  return [
    // Tháng hiện tại - Tuần 1
    {
      id: '1',
      code: 'ST001',
      inventoryDate: createDate(1),
      warehouseId: '1',
      warehouseName: 'Kho Nguyên liệu A',
      skuCount: 2,
      totalDifference: 50,
      status: 'completed',
      items: [
        {
          id: '1-1',
          skuId: '1',
          skuCode: 'SKU001',
          skuName: 'Gỗ keo',
          systemQty: 5000,
          actualQty: 5050,
          difference: 50,
          reason: 'Nhập thêm từ đơn hàng chưa ghi nhận'
        },
        {
          id: '1-2',
          skuId: '2',
          skuCode: 'SKU002',
          skuName: 'Gỗ cao su',
          systemQty: 3000,
          actualQty: 3000,
          difference: 0
        }
      ],
      notes: 'Kiểm kê định kỳ đầu tháng',
      createdAt: createDate(1),
      updatedAt: createDate(1),
      createdBy: 'user1',
      updatedBy: 'user1'
    },
    {
      id: '2',
      code: 'ST002',
      inventoryDate: createDate(3),
      warehouseId: '2',
      warehouseName: 'Kho Thành phẩm B',
      skuCount: 1,
      totalDifference: -100,
      status: 'draft',
      items: [
        {
          id: '2-1',
          skuId: '3',
          skuCode: 'SKU003',
          skuName: 'Ván ép',
          systemQty: 1000,
          actualQty: 900,
          difference: -100,
          reason: 'Hao hụt trong quá trình bảo quản'
        }
      ],
      notes: 'Kiểm kê định kỳ - Chưa hoàn tất',
      createdAt: createDate(3),
      updatedAt: createDate(3),
      createdBy: 'user2',
      updatedBy: 'user2'
    },
    {
      id: '3',
      code: 'ST003',
      inventoryDate: createDate(5),
      warehouseId: '3',
      warehouseName: 'Kho Trung chuyển C',
      skuCount: 1,
      totalDifference: 0,
      status: 'completed',
      items: [
        {
          id: '3-1',
          skuId: '5',
          skuCode: 'SKU005',
          skuName: 'Gỗ keo cao cấp',
          systemQty: 2000,
          actualQty: 2000,
          difference: 0
        }
      ],
      notes: 'Kiểm kê định kỳ',
      createdAt: createDate(5),
      updatedAt: createDate(5),
      createdBy: 'user1',
      updatedBy: 'user1'
    },
    {
      id: '4',
      code: 'ST004',
      inventoryDate: createDate(7),
      warehouseId: '4',
      warehouseName: 'Kho Xuất khẩu D',
      skuCount: 1,
      totalDifference: 20,
      status: 'draft',
      items: [
        {
          id: '4-1',
          skuId: '6',
          skuCode: 'SKU006',
          skuName: 'Ván ép loại 1',
          systemQty: 500,
          actualQty: 520,
          difference: 20,
          reason: 'Nhập từ kho khác chưa ghi nhận'
        }
      ],
      notes: 'Kiểm kê định kỳ',
      createdAt: createDate(7),
      updatedAt: createDate(7),
      createdBy: 'user2',
      updatedBy: 'user2'
    },
    // Tuần 2
    {
      id: '5',
      code: 'ST005',
      inventoryDate: createDate(10),
      warehouseId: '1',
      warehouseName: 'Kho Nguyên liệu A',
      skuCount: 3,
      totalDifference: -30,
      status: 'completed',
      items: [
        {
          id: '5-1',
          skuId: '1',
          skuCode: 'SKU001',
          skuName: 'Gỗ keo',
          systemQty: 5050,
          actualQty: 5020,
          difference: -30,
          reason: 'Hao hụt tự nhiên'
        },
        {
          id: '5-2',
          skuId: '2',
          skuCode: 'SKU002',
          skuName: 'Gỗ cao su',
          systemQty: 3000,
          actualQty: 3000,
          difference: 0
        },
        {
          id: '5-3',
          skuId: '5',
          skuCode: 'SKU005',
          skuName: 'Gỗ keo cao cấp',
          systemQty: 2000,
          actualQty: 2000,
          difference: 0
        }
      ],
      notes: 'Kiểm kê định kỳ',
      createdAt: createDate(10),
      updatedAt: createDate(10),
      createdBy: 'user1',
      updatedBy: 'user1'
    },
    {
      id: '6',
      code: 'ST006',
      inventoryDate: createDate(12),
      warehouseId: '2',
      warehouseName: 'Kho Thành phẩm B',
      skuCount: 2,
      totalDifference: 150,
      status: 'completed',
      items: [
        {
          id: '6-1',
          skuId: '3',
          skuCode: 'SKU003',
          skuName: 'Ván ép',
          systemQty: 900,
          actualQty: 1050,
          difference: 150,
          reason: 'Nhập thêm từ đơn hàng'
        },
        {
          id: '6-2',
          skuId: '4',
          skuCode: 'SKU004',
          skuName: 'Ván ép loại 2',
          systemQty: 800,
          actualQty: 800,
          difference: 0
        }
      ],
      notes: 'Kiểm kê định kỳ',
      createdAt: createDate(12),
      updatedAt: createDate(12),
      createdBy: 'user1',
      updatedBy: 'user1'
    },
    {
      id: '7',
      code: 'ST007',
      inventoryDate: createDate(14),
      warehouseId: '3',
      warehouseName: 'Kho Trung chuyển C',
      skuCount: 1,
      totalDifference: -50,
      status: 'draft',
      items: [
        {
          id: '7-1',
          skuId: '5',
          skuCode: 'SKU005',
          skuName: 'Gỗ keo cao cấp',
          systemQty: 2000,
          actualQty: 1950,
          difference: -50,
          reason: 'Hao hụt vận chuyển'
        }
      ],
      notes: 'Kiểm kê định kỳ - Chưa hoàn tất',
      createdAt: createDate(14),
      updatedAt: createDate(14),
      createdBy: 'user2',
      updatedBy: 'user2'
    },
    // Tuần 3
    {
      id: '8',
      code: 'ST008',
      inventoryDate: createDate(17),
      warehouseId: '4',
      warehouseName: 'Kho Xuất khẩu D',
      skuCount: 2,
      totalDifference: 0,
      status: 'completed',
      items: [
        {
          id: '8-1',
          skuId: '6',
          skuCode: 'SKU006',
          skuName: 'Ván ép loại 1',
          systemQty: 520,
          actualQty: 520,
          difference: 0
        },
        {
          id: '8-2',
          skuId: '7',
          skuCode: 'SKU007',
          skuName: 'Gỗ thông',
          systemQty: 1500,
          actualQty: 1500,
          difference: 0
        }
      ],
      notes: 'Kiểm kê định kỳ',
      createdAt: createDate(17),
      updatedAt: createDate(17),
      createdBy: 'user1',
      updatedBy: 'user1'
    },
    {
      id: '9',
      code: 'ST009',
      inventoryDate: createDate(19),
      warehouseId: '1',
      warehouseName: 'Kho Nguyên liệu A',
      skuCount: 2,
      totalDifference: 75,
      status: 'completed',
      items: [
        {
          id: '9-1',
          skuId: '1',
          skuCode: 'SKU001',
          skuName: 'Gỗ keo',
          systemQty: 5020,
          actualQty: 5095,
          difference: 75,
          reason: 'Nhập thêm từ đơn hàng'
        },
        {
          id: '9-2',
          skuId: '2',
          skuCode: 'SKU002',
          skuName: 'Gỗ cao su',
          systemQty: 3000,
          actualQty: 3000,
          difference: 0
        }
      ],
      notes: 'Kiểm kê định kỳ',
      createdAt: createDate(19),
      updatedAt: createDate(19),
      createdBy: 'user1',
      updatedBy: 'user1'
    },
    {
      id: '10',
      code: 'ST010',
      inventoryDate: createDate(21),
      warehouseId: '2',
      warehouseName: 'Kho Thành phẩm B',
      skuCount: 1,
      totalDifference: -25,
      status: 'draft',
      items: [
        {
          id: '10-1',
          skuId: '3',
          skuCode: 'SKU003',
          skuName: 'Ván ép',
          systemQty: 1050,
          actualQty: 1025,
          difference: -25,
          reason: 'Hao hụt bảo quản'
        }
      ],
      notes: 'Kiểm kê định kỳ - Chưa hoàn tất',
      createdAt: createDate(21),
      updatedAt: createDate(21),
      createdBy: 'user2',
      updatedBy: 'user2'
    },
    {
      id: '11',
      code: 'ST011',
      inventoryDate: createDate(23),
      warehouseId: '3',
      warehouseName: 'Kho Trung chuyển C',
      skuCount: 3,
      totalDifference: 100,
      status: 'completed',
      items: [
        {
          id: '11-1',
          skuId: '5',
          skuCode: 'SKU005',
          skuName: 'Gỗ keo cao cấp',
          systemQty: 1950,
          actualQty: 2000,
          difference: 50,
          reason: 'Nhập từ kho khác'
        },
        {
          id: '11-2',
          skuId: '8',
          skuCode: 'SKU008',
          skuName: 'Gỗ bạch đàn',
          systemQty: 1200,
          actualQty: 1250,
          difference: 50,
          reason: 'Nhập từ kho khác'
        },
        {
          id: '11-3',
          skuId: '9',
          skuCode: 'SKU009',
          skuName: 'Gỗ sồi',
          systemQty: 800,
          actualQty: 800,
          difference: 0
        }
      ],
      notes: 'Kiểm kê định kỳ',
      createdAt: createDate(23),
      updatedAt: createDate(23),
      createdBy: 'user1',
      updatedBy: 'user1'
    },
    // Tuần 4
    {
      id: '12',
      code: 'ST012',
      inventoryDate: createDate(25),
      warehouseId: '4',
      warehouseName: 'Kho Xuất khẩu D',
      skuCount: 2,
      totalDifference: -40,
      status: 'completed',
      items: [
        {
          id: '12-1',
          skuId: '6',
          skuCode: 'SKU006',
          skuName: 'Ván ép loại 1',
          systemQty: 520,
          actualQty: 480,
          difference: -40,
          reason: 'Xuất kho chưa ghi nhận'
        },
        {
          id: '12-2',
          skuId: '7',
          skuCode: 'SKU007',
          skuName: 'Gỗ thông',
          systemQty: 1500,
          actualQty: 1500,
          difference: 0
        }
      ],
      notes: 'Kiểm kê định kỳ',
      createdAt: createDate(25),
      updatedAt: createDate(25),
      createdBy: 'user1',
      updatedBy: 'user1'
    },
    {
      id: '13',
      code: 'ST013',
      inventoryDate: createDate(27),
      warehouseId: '1',
      warehouseName: 'Kho Nguyên liệu A',
      skuCount: 1,
      totalDifference: 0,
      status: 'draft',
      items: [
        {
          id: '13-1',
          skuId: '1',
          skuCode: 'SKU001',
          skuName: 'Gỗ keo',
          systemQty: 5095,
          actualQty: 5095,
          difference: 0
        }
      ],
      notes: 'Kiểm kê định kỳ - Chưa hoàn tất',
      createdAt: createDate(27),
      updatedAt: createDate(27),
      createdBy: 'user2',
      updatedBy: 'user2'
    },
    {
      id: '14',
      code: 'ST014',
      inventoryDate: createDate(29),
      warehouseId: '2',
      warehouseName: 'Kho Thành phẩm B',
      skuCount: 2,
      totalDifference: 60,
      status: 'completed',
      items: [
        {
          id: '14-1',
          skuId: '3',
          skuCode: 'SKU003',
          skuName: 'Ván ép',
          systemQty: 1025,
          actualQty: 1085,
          difference: 60,
          reason: 'Nhập thêm từ đơn hàng'
        },
        {
          id: '14-2',
          skuId: '4',
          skuCode: 'SKU004',
          skuName: 'Ván ép loại 2',
          systemQty: 800,
          actualQty: 800,
          difference: 0
        }
      ],
      notes: 'Kiểm kê định kỳ',
      createdAt: createDate(29),
      updatedAt: createDate(29),
      createdBy: 'user1',
      updatedBy: 'user1'
    },
    // Tháng trước - để test
    {
      id: '15',
      code: 'ST015',
      inventoryDate: createDate(28, -1),
      warehouseId: '3',
      warehouseName: 'Kho Trung chuyển C',
      skuCount: 1,
      totalDifference: 0,
      status: 'completed',
      items: [
        {
          id: '15-1',
          skuId: '5',
          skuCode: 'SKU005',
          skuName: 'Gỗ keo cao cấp',
          systemQty: 2000,
          actualQty: 2000,
          difference: 0
        }
      ],
      notes: 'Kiểm kê định kỳ tháng trước',
      createdAt: createDate(28, -1),
      updatedAt: createDate(28, -1),
      createdBy: 'user1',
      updatedBy: 'user1'
    },
    // Tháng sau - để test
    {
      id: '16',
      code: 'ST016',
      inventoryDate: createDate(2, 1),
      warehouseId: '4',
      warehouseName: 'Kho Xuất khẩu D',
      skuCount: 1,
      totalDifference: 30,
      status: 'draft',
      items: [
        {
          id: '16-1',
          skuId: '6',
          skuCode: 'SKU006',
          skuName: 'Ván ép loại 1',
          systemQty: 480,
          actualQty: 510,
          difference: 30,
          reason: 'Nhập từ kho khác'
        }
      ],
      notes: 'Kiểm kê định kỳ tháng sau',
      createdAt: createDate(2, 1),
      updatedAt: createDate(2, 1),
      createdBy: 'user2',
      updatedBy: 'user2'
    },
    {
      id: '17',
      code: 'ST017',
      inventoryDate: createDate(5, 1),
      warehouseId: '1',
      warehouseName: 'Kho Nguyên liệu A',
      skuCount: 2,
      totalDifference: -20,
      status: 'completed',
      items: [
        {
          id: '17-1',
          skuId: '1',
          skuCode: 'SKU001',
          skuName: 'Gỗ keo',
          systemQty: 5095,
          actualQty: 5075,
          difference: -20,
          reason: 'Hao hụt tự nhiên'
        },
        {
          id: '17-2',
          skuId: '2',
          skuCode: 'SKU002',
          skuName: 'Gỗ cao su',
          systemQty: 3000,
          actualQty: 3000,
          difference: 0
        }
      ],
      notes: 'Kiểm kê định kỳ tháng sau',
      createdAt: createDate(5, 1),
      updatedAt: createDate(5, 1),
      createdBy: 'user1',
      updatedBy: 'user1'
    }
  ];
}

/**
 * Get a single mock stocktake by ID
 */
export function getMockStocktake(id: string): Stocktake | null {
  const stocktakes = getMockStocktakes();
  return stocktakes.find((stocktake) => stocktake.id === id) || null;
}
