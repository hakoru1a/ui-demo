// ==============================|| SKU MOCK DATA ||============================== //

import type { Sku } from '../types';

/**
 * Mock SKU data for development and testing
 */
export function getMockSkus(): Sku[] {
  return [
    {
      id: '1',
      code: 'SKU001',
      name: 'Gỗ keo',
      itemType: 'material',
      warehouseId: '1',
      warehouseName: 'Kho Nguyên liệu A',
      systemQuantity: 5000,
      reservedQuantity: 1000,
      availableQuantity: 4000,
      unit: 'Kg',
      stockStatus: 'in_stock',
      lastInventoryDate: new Date('2024-01-15'),
      notes: 'Nguyên liệu chính cho sản xuất',
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-15')
    },
    {
      id: '2',
      code: 'SKU002',
      name: 'Gỗ cao su',
      itemType: 'material',
      warehouseId: '1',
      warehouseName: 'Kho Nguyên liệu A',
      systemQuantity: 3000,
      reservedQuantity: 500,
      availableQuantity: 2500,
      unit: 'Kg',
      stockStatus: 'in_stock',
      lastInventoryDate: new Date('2024-01-10'),
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-10')
    },
    {
      id: '3',
      code: 'SKU003',
      name: 'Ván ép',
      itemType: 'finished',
      warehouseId: '2',
      warehouseName: 'Kho Thành phẩm B',
      systemQuantity: 1000,
      reservedQuantity: 200,
      availableQuantity: 800,
      unit: 'm3',
      stockStatus: 'in_stock',
      lastInventoryDate: new Date('2024-01-20'),
      notes: 'Thành phẩm xuất khẩu',
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-20')
    },
    {
      id: '4',
      code: 'SKU004',
      name: 'Gỗ dăm',
      itemType: 'finished',
      warehouseId: '2',
      warehouseName: 'Kho Thành phẩm B',
      systemQuantity: 0,
      reservedQuantity: 0,
      availableQuantity: 0,
      unit: 'Tấn',
      stockStatus: 'out_of_stock',
      lastInventoryDate: new Date('2024-01-05'),
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-05')
    },
    {
      id: '5',
      code: 'SKU005',
      name: 'Gỗ keo cao cấp',
      itemType: 'material',
      warehouseId: '3',
      warehouseName: 'Kho Trung chuyển C',
      systemQuantity: 2000,
      reservedQuantity: 0,
      availableQuantity: 2000,
      unit: 'Kg',
      stockStatus: 'in_stock',
      lastInventoryDate: new Date('2024-01-18'),
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-18')
    },
    {
      id: '6',
      code: 'SKU006',
      name: 'Ván ép loại 1',
      itemType: 'finished',
      warehouseId: '4',
      warehouseName: 'Kho Xuất khẩu D',
      systemQuantity: 500,
      reservedQuantity: 300,
      availableQuantity: 200,
      unit: 'm3',
      stockStatus: 'in_stock',
      lastInventoryDate: new Date('2024-01-22'),
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-22')
    }
  ];
}

/**
 * Get a single mock SKU by ID
 */
export function getMockSku(id: string): Sku | null {
  const skus = getMockSkus();
  return skus.find((sku) => sku.id === id) || null;
}
