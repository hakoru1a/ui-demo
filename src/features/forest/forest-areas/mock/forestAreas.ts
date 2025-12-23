// ==============================|| FOREST AREAS MOCK DATA ||============================== //

import type { ForestArea, Coordinates, ForestAreaBoundary } from '../types';

/**
 * Generate mock coordinates for a polygon boundary
 */
function generateBoundary(centerLat: number, centerLng: number, area: number): ForestAreaBoundary {
  // Simple square polygon approximation (for mock data)
  const sideLength = Math.sqrt(area * 10000); // Convert ha to m², then to side length
  const offset = sideLength / 111000; // Rough conversion: 1 degree ≈ 111km

  const coordinates: Coordinates[] = [
    { latitude: centerLat - offset, longitude: centerLng - offset },
    { latitude: centerLat - offset, longitude: centerLng + offset },
    { latitude: centerLat + offset, longitude: centerLng + offset },
    { latitude: centerLat + offset, longitude: centerLng - offset },
    { latitude: centerLat - offset, longitude: centerLng - offset } // Close polygon
  ];

  return {
    coordinates,
    center: { latitude: centerLat, longitude: centerLng },
    calculatedArea: area
  };
}

/**
 * Generate a unique code for forest area
 */
function generateCode(index: number): string {
  return `FA-${String(index + 1).padStart(4, '0')}`;
}

/**
 * Mock Forest Areas Data
 * This data is used for development and testing purposes
 */
export const mockForestAreas: ForestArea[] = [
  {
    id: '1',
    code: generateCode(0),
    name: 'Vùng trồng Keo Tây Nguyên 1',
    ownershipType: 'company',
    area: 125.5,
    province: 'Đắk Lắk',
    treeType: 'keo',
    plantingYear: 2020,
    status: 'active',
    certificates: ['FSC'],
    notes: 'Vùng trồng chính của công ty tại Tây Nguyên',
    boundary: generateBoundary(12.6768, 108.0477, 125.5),
    coordinates: { latitude: 12.6768, longitude: 108.0477 },
    createdAt: '2020-01-15T00:00:00Z',
    updatedAt: '2024-01-10T00:00:00Z'
  },
  {
    id: '2',
    code: generateCode(1),
    name: 'Vùng trồng Bạch đàn Bình Phước',
    ownershipType: 'company',
    area: 89.3,
    province: 'Bình Phước',
    treeType: 'bach-dan',
    plantingYear: 2019,
    status: 'active',
    certificates: ['FSC', 'PEFC'],
    notes: 'Vùng trồng có chứng chỉ kép FSC và PEFC',
    boundary: generateBoundary(11.8034, 106.5958, 89.3),
    coordinates: { latitude: 11.8034, longitude: 106.5958 },
    createdAt: '2019-03-20T00:00:00Z',
    updatedAt: '2024-02-15T00:00:00Z'
  },
  {
    id: '3',
    code: generateCode(2),
    name: 'Vùng trồng Keo Đối tác A',
    ownershipType: 'partner',
    ownerId: 'partner-001',
    ownerName: 'Công ty Đối tác A',
    area: 156.8,
    province: 'Gia Lai',
    treeType: 'keo',
    plantingYear: 2021,
    status: 'active',
    certificates: ['FSC'],
    notes: 'Hợp tác với đối tác lâu năm',
    boundary: generateBoundary(13.9838, 108.0005, 156.8),
    coordinates: { latitude: 13.9838, longitude: 108.0005 },
    createdAt: '2021-05-10T00:00:00Z',
    updatedAt: '2024-03-01T00:00:00Z'
  },
  {
    id: '4',
    code: generateCode(3),
    name: 'Vùng trồng Thông Lâm Đồng',
    ownershipType: 'company',
    area: 67.2,
    province: 'Lâm Đồng',
    treeType: 'thong',
    plantingYear: 2018,
    status: 'active',
    certificates: ['PEFC'],
    notes: 'Vùng trồng thông tại cao nguyên',
    boundary: generateBoundary(11.9404, 108.4583, 67.2),
    coordinates: { latitude: 11.9404, longitude: 108.4583 },
    createdAt: '2018-06-25T00:00:00Z',
    updatedAt: '2023-12-20T00:00:00Z'
  },
  {
    id: '5',
    code: generateCode(4),
    name: 'Vùng trồng Keo Đắk Nông',
    ownershipType: 'company',
    area: 203.7,
    province: 'Đắk Nông',
    treeType: 'keo',
    plantingYear: 2022,
    status: 'active',
    certificates: ['FSC', 'PEFC'],
    notes: 'Vùng trồng lớn nhất của công ty',
    boundary: generateBoundary(12.0042, 107.6907, 203.7),
    coordinates: { latitude: 12.0042, longitude: 107.6907 },
    createdAt: '2022-02-14T00:00:00Z',
    updatedAt: '2024-04-05T00:00:00Z'
  },
  {
    id: '6',
    code: generateCode(5),
    name: 'Vùng trồng Bạch đàn Đối tác B',
    ownershipType: 'partner',
    ownerId: 'partner-002',
    ownerName: 'Công ty Đối tác B',
    area: 94.6,
    province: 'Bình Phước',
    treeType: 'bach-dan',
    plantingYear: 2020,
    status: 'inactive',
    certificates: [],
    notes: 'Vùng trồng tạm ngưng do bảo trì',
    boundary: generateBoundary(11.8034, 106.5958, 94.6),
    coordinates: { latitude: 11.8034, longitude: 106.5958 },
    createdAt: '2020-08-30T00:00:00Z',
    updatedAt: '2024-01-20T00:00:00Z'
  },
  {
    id: '7',
    code: generateCode(6),
    name: 'Vùng trồng Keo Kon Tum',
    ownershipType: 'company',
    area: 142.1,
    province: 'Kon Tum',
    treeType: 'keo',
    plantingYear: 2021,
    status: 'active',
    certificates: ['FSC'],
    notes: 'Vùng trồng mới tại Kon Tum',
    boundary: generateBoundary(14.3545, 108.0076, 142.1),
    coordinates: { latitude: 14.3545, longitude: 108.0076 },
    createdAt: '2021-09-12T00:00:00Z',
    updatedAt: '2024-02-28T00:00:00Z'
  },
  {
    id: '8',
    code: generateCode(7),
    name: 'Vùng trồng Khác Đắk Lắk',
    ownershipType: 'company',
    area: 78.9,
    province: 'Đắk Lắk',
    treeType: 'other',
    plantingYear: 2019,
    status: 'active',
    certificates: ['PEFC'],
    notes: 'Vùng trồng cây khác',
    boundary: generateBoundary(12.6768, 108.0477, 78.9),
    coordinates: { latitude: 12.6768, longitude: 108.0477 },
    createdAt: '2019-11-05T00:00:00Z',
    updatedAt: '2023-11-15T00:00:00Z'
  },
  {
    id: '9',
    code: generateCode(8),
    name: 'Vùng trồng Bạch đàn Đối tác C',
    ownershipType: 'partner',
    ownerId: 'partner-003',
    ownerName: 'Công ty Đối tác C',
    area: 115.4,
    province: 'Gia Lai',
    treeType: 'bach-dan',
    plantingYear: 2022,
    status: 'active',
    certificates: ['FSC'],
    notes: 'Hợp tác mới với đối tác C',
    boundary: generateBoundary(13.9838, 108.0005, 115.4),
    coordinates: { latitude: 13.9838, longitude: 108.0005 },
    createdAt: '2022-07-18T00:00:00Z',
    updatedAt: '2024-03-10T00:00:00Z'
  },
  {
    id: '10',
    code: generateCode(9),
    name: 'Vùng trồng Keo Tây Nguyên 2',
    ownershipType: 'company',
    area: 98.5,
    province: 'Đắk Lắk',
    treeType: 'keo',
    plantingYear: 2023,
    status: 'active',
    certificates: ['FSC', 'PEFC'],
    notes: 'Vùng trồng mới nhất',
    boundary: generateBoundary(12.6768, 108.0477, 98.5),
    coordinates: { latitude: 12.6768, longitude: 108.0477 },
    createdAt: '2023-04-22T00:00:00Z',
    updatedAt: '2024-04-12T00:00:00Z'
  },
  {
    id: '11',
    code: generateCode(10),
    name: 'Vùng trồng Thông Lâm Đồng 2',
    ownershipType: 'company',
    area: 56.3,
    province: 'Lâm Đồng',
    treeType: 'thong',
    plantingYear: 2020,
    status: 'inactive',
    certificates: [],
    notes: 'Tạm ngưng để cải tạo đất',
    boundary: generateBoundary(11.9404, 108.4583, 56.3),
    coordinates: { latitude: 11.9404, longitude: 108.4583 },
    createdAt: '2020-10-08T00:00:00Z',
    updatedAt: '2024-02-01T00:00:00Z'
  },
  {
    id: '12',
    code: generateCode(11),
    name: 'Vùng trồng Keo Đối tác D',
    ownershipType: 'partner',
    ownerId: 'partner-004',
    ownerName: 'Công ty Đối tác D',
    area: 134.7,
    province: 'Đắk Nông',
    treeType: 'keo',
    plantingYear: 2021,
    status: 'active',
    certificates: ['PEFC'],
    notes: 'Đối tác chiến lược',
    boundary: generateBoundary(12.0042, 107.6907, 134.7),
    coordinates: { latitude: 12.0042, longitude: 107.6907 },
    createdAt: '2021-12-03T00:00:00Z',
    updatedAt: '2024-03-25T00:00:00Z'
  },
  {
    id: '13',
    code: generateCode(12),
    name: 'Vùng trồng Bạch đàn Bình Phước 2',
    ownershipType: 'company',
    area: 167.2,
    province: 'Bình Phước',
    treeType: 'bach-dan',
    plantingYear: 2019,
    status: 'active',
    certificates: ['FSC'],
    notes: 'Vùng trồng bạch đàn lớn',
    boundary: generateBoundary(11.8034, 106.5958, 167.2),
    coordinates: { latitude: 11.8034, longitude: 106.5958 },
    createdAt: '2019-07-14T00:00:00Z',
    updatedAt: '2024-01-30T00:00:00Z'
  },
  {
    id: '14',
    code: generateCode(13),
    name: 'Vùng trồng Keo Gia Lai',
    ownershipType: 'company',
    area: 112.8,
    province: 'Gia Lai',
    treeType: 'keo',
    plantingYear: 2022,
    status: 'active',
    certificates: ['FSC', 'PEFC'],
    notes: 'Vùng trồng tại Gia Lai',
    boundary: generateBoundary(13.9838, 108.0005, 112.8),
    coordinates: { latitude: 13.9838, longitude: 108.0005 },
    createdAt: '2022-03-19T00:00:00Z',
    updatedAt: '2024-04-08T00:00:00Z'
  },
  {
    id: '15',
    code: generateCode(14),
    name: 'Vùng trồng Khác Kon Tum',
    ownershipType: 'company',
    area: 45.6,
    province: 'Kon Tum',
    treeType: 'other',
    plantingYear: 2023,
    status: 'active',
    certificates: ['PEFC'],
    notes: 'Vùng trồng thử nghiệm',
    boundary: generateBoundary(14.3545, 108.0076, 45.6),
    coordinates: { latitude: 14.3545, longitude: 108.0076 },
    createdAt: '2023-08-25T00:00:00Z',
    updatedAt: '2024-04-15T00:00:00Z'
  }
];

/**
 * Get mock forest areas (for development/testing)
 */
export function getMockForestAreas(): ForestArea[] {
  return mockForestAreas;
}

/**
 * Get a single mock forest area by ID
 */
export function getMockForestAreaById(id: string): ForestArea | undefined {
  return mockForestAreas.find((area) => area.id === id);
}

/**
 * Get mock forest areas by status
 */
export function getMockForestAreasByStatus(status: 'active' | 'inactive'): ForestArea[] {
  return mockForestAreas.filter((area) => area.status === status);
}

/**
 * Get mock forest areas by ownership type
 */
export function getMockForestAreasByOwnership(ownershipType: 'company' | 'partner'): ForestArea[] {
  return mockForestAreas.filter((area) => area.ownershipType === ownershipType);
}
