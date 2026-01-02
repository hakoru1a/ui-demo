// ==============================|| PRICE ENGINE MOCK DATA ||============================== //

import type { PriceTable } from '../types/entity';

/**
 * Generate a unique code for price table
 */
function generateCode(index: number): string {
  return `BG-${String(index + 1).padStart(3, '0')}`;
}

/**
 * Mock Price Tables Data
 * This data is used for development and testing purposes
 */
export const mockPriceTables: PriceTable[] = [
  {
    id: '1',
    code: generateCode(0),
    name: 'Bảng giá gỗ keo 2024',
    materialType: 'keo',
    basePrice: 5000,
    adjustmentFormula: 'Giá cơ bản + (Khối lượng * 100)',
    effectiveFrom: new Date('2024-01-01'),
    status: 'active',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: '2',
    code: generateCode(1),
    name: 'Bảng giá gỗ tràm 2024',
    materialType: 'tram',
    basePrice: 4500,
    adjustmentFormula: 'Giá cơ bản + (Khối lượng * 80)',
    effectiveFrom: new Date('2024-01-01'),
    status: 'active',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: '3',
    code: generateCode(2),
    name: 'Bảng giá gỗ keo 2023',
    materialType: 'keo',
    basePrice: 4800,
    adjustmentFormula: '',
    effectiveFrom: new Date('2023-01-01'),
    status: 'inactive',
    createdAt: new Date('2023-01-01'),
    updatedAt: new Date('2023-12-31')
  },
  {
    id: '4',
    code: generateCode(3),
    name: 'Bảng giá gỗ tràm 2023',
    materialType: 'tram',
    basePrice: 4200,
    adjustmentFormula: 'Giá cơ bản + (Khối lượng * 75)',
    effectiveFrom: new Date('2023-01-01'),
    status: 'inactive',
    createdAt: new Date('2023-01-01'),
    updatedAt: new Date('2023-12-31')
  },
  {
    id: '5',
    code: generateCode(4),
    name: 'Bảng giá gỗ keo 2025',
    materialType: 'keo',
    basePrice: 5200,
    adjustmentFormula: 'Giá cơ bản + (Khối lượng * 110)',
    effectiveFrom: new Date('2025-01-01'),
    status: 'active',
    createdAt: new Date('2024-12-01'),
    updatedAt: new Date('2024-12-01')
  },
  {
    id: '6',
    code: generateCode(5),
    name: 'Bảng giá gỗ tràm 2025',
    materialType: 'tram',
    basePrice: 4700,
    adjustmentFormula: 'Giá cơ bản + (Khối lượng * 85)',
    effectiveFrom: new Date('2025-01-01'),
    status: 'active',
    createdAt: new Date('2024-12-01'),
    updatedAt: new Date('2024-12-01')
  },
  {
    id: '7',
    code: generateCode(6),
    name: 'Bảng giá gỗ khác 2024',
    materialType: 'other',
    basePrice: 4000,
    adjustmentFormula: 'Giá cơ bản + (Khối lượng * 50)',
    effectiveFrom: new Date('2024-01-01'),
    status: 'active',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  }
];

/**
 * Get mock price tables (for development/testing)
 */
export function getMockPriceTables(): PriceTable[] {
  return mockPriceTables;
}

/**
 * Get a single mock price table by ID
 */
export function getMockPriceTableById(id: string): PriceTable | undefined {
  return mockPriceTables.find((table) => table.id === id);
}

/**
 * Get mock price tables by status
 */
export function getMockPriceTablesByStatus(status: 'active' | 'inactive'): PriceTable[] {
  return mockPriceTables.filter((table) => table.status === status);
}

/**
 * Get mock price tables by material type
 */
export function getMockPriceTablesByMaterialType(materialType: 'keo' | 'tram' | 'other'): PriceTable[] {
  return mockPriceTables.filter((table) => table.materialType === materialType);
}
