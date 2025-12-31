// ==============================|| FLEET MOCK DATA ||============================== //

import type { Vehicle } from '../types';

export const mockVehicles: Vehicle[] = [
  {
    id: '1',
    licensePlate: '51A-12345',
    vehicleType: 'truck',
    maxLoad: 10,
    driverName: 'Nguyễn Văn A',
    driverPhone: '0901234567',
    driverLicenseNumber: 'GPLX-001',
    driverLicenseExpiry: new Date('2025-12-31'),
    vehicleStatus: 'ready',
    driverStatus: 'available',
    notes: 'Xe mới',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: '2',
    licensePlate: '51B-67890',
    vehicleType: 'container',
    maxLoad: 20,
    driverName: 'Trần Thị B',
    driverPhone: '0907654321',
    driverLicenseNumber: 'GPLX-002',
    driverLicenseExpiry: new Date('2025-06-30'),
    vehicleStatus: 'running',
    driverStatus: 'dispatched',
    notes: '',
    createdAt: new Date('2024-01-02'),
    updatedAt: new Date('2024-01-02')
  },
  {
    id: '3',
    licensePlate: '51C-11111',
    vehicleType: 'truck',
    maxLoad: 15,
    driverName: 'Lê Văn C',
    driverPhone: '0912345678',
    driverLicenseNumber: 'GPLX-003',
    driverLicenseExpiry: new Date('2024-12-31'),
    vehicleStatus: 'maintenance',
    driverStatus: 'available',
    notes: 'Đang bảo trì',
    createdAt: new Date('2024-01-03'),
    updatedAt: new Date('2024-01-03')
  }
];

export const getMockVehicles = () => mockVehicles;
