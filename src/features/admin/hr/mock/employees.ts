// ==============================|| EMPLOYEES MOCK DATA ||============================== //

import type { Employee } from '../types';

/**
 * Mock Employee data for development and testing
 */
export function getMockEmployees(): Employee[] {
  const now = new Date();
  const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
  const sixtyDaysFromNow = new Date(now.getTime() + 60 * 24 * 60 * 60 * 1000);
  const oneYearAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
  const sixMonthsAgo = new Date(now.getTime() - 180 * 24 * 60 * 60 * 1000);

  return [
    {
      id: '1',
      code: 'NS001',
      fullName: 'Nguyễn Văn An',
      department: 'production',
      position: 'Công nhân sản xuất',
      contractType: 'permanent',
      effectiveDate: oneYearAgo.toISOString(),
      expiryDate: sixtyDaysFromNow.toISOString(),
      status: 'active',
      createdAt: oneYearAgo.toISOString(),
      updatedAt: oneYearAgo.toISOString()
    },
    {
      id: '2',
      code: 'NS002',
      fullName: 'Trần Thị Bình',
      department: 'warehouse',
      position: 'Nhân viên kho',
      contractType: 'temporary',
      effectiveDate: sixMonthsAgo.toISOString(),
      expiryDate: thirtyDaysFromNow.toISOString(), // Sắp hết hạn
      status: 'active',
      createdAt: sixMonthsAgo.toISOString(),
      updatedAt: sixMonthsAgo.toISOString()
    },
    {
      id: '3',
      code: 'NS003',
      fullName: 'Lê Văn Cường',
      department: 'qc',
      position: 'Nhân viên QC',
      contractType: 'probation',
      effectiveDate: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      expiryDate: new Date(now.getTime() + 60 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'active',
      createdAt: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: '4',
      code: 'NS004',
      fullName: 'Phạm Thị Dung',
      department: 'production',
      position: 'Tổ trưởng sản xuất',
      contractType: 'permanent',
      effectiveDate: oneYearAgo.toISOString(),
      expiryDate: new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'active',
      createdAt: oneYearAgo.toISOString(),
      updatedAt: oneYearAgo.toISOString()
    },
    {
      id: '5',
      code: 'NS005',
      fullName: 'Hoàng Văn Em',
      department: 'warehouse',
      position: 'Nhân viên kho',
      contractType: 'temporary',
      effectiveDate: sixMonthsAgo.toISOString(),
      expiryDate: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000).toISOString(), // Đã hết hạn
      status: 'inactive',
      createdAt: sixMonthsAgo.toISOString(),
      updatedAt: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: '6',
      code: 'NS006',
      fullName: 'Võ Thị Phương',
      department: 'qc',
      position: 'Trưởng phòng QC',
      contractType: 'permanent',
      effectiveDate: oneYearAgo.toISOString(),
      expiryDate: new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'active',
      createdAt: oneYearAgo.toISOString(),
      updatedAt: oneYearAgo.toISOString()
    },
    {
      id: '7',
      code: 'NS007',
      fullName: 'Đặng Văn Giang',
      department: 'production',
      position: 'Công nhân sản xuất',
      contractType: 'probation',
      effectiveDate: new Date(now.getTime() - 15 * 24 * 60 * 60 * 1000).toISOString(),
      expiryDate: new Date(now.getTime() + 15 * 24 * 60 * 60 * 1000).toISOString(), // Sắp hết hạn
      status: 'active',
      createdAt: new Date(now.getTime() - 15 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(now.getTime() - 15 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: '8',
      code: 'NS008',
      fullName: 'Bùi Thị Hoa',
      department: 'warehouse',
      position: 'Nhân viên kho',
      contractType: 'temporary',
      effectiveDate: sixMonthsAgo.toISOString(),
      expiryDate: new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'active',
      createdAt: sixMonthsAgo.toISOString(),
      updatedAt: sixMonthsAgo.toISOString()
    }
  ];
}

/**
 * Get a single mock employee by ID
 */
export function getMockEmployee(id: string): Employee | null {
  const employees = getMockEmployees();
  return employees.find((emp) => emp.id === id) || null;
}
