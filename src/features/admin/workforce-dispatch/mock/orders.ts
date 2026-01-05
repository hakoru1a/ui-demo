// ==============================|| WORKFORCE DISPATCH ORDERS MOCK DATA ||============================== //

import type { WorkforceDispatchOrder } from '../types';

/**
 * Mock Workforce Dispatch Order data for development and testing
 */
export function getMockWorkforceDispatchOrders(): WorkforceDispatchOrder[] {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
  const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);

  return [
    {
      id: '1',
      code: 'LDP001',
      applicationDate: today.toISOString(),
      factoryId: 'factory-001',
      factoryName: 'Nhà máy A - Hà Nội',
      productionShiftId: 'shift-001',
      productionShiftName: 'Ca 1 - 08:00-16:00',
      departmentId: 'dept-001',
      departmentName: 'Sản xuất',
      personnel: [
        {
          id: 'p1',
          personnelId: '1',
          personnelCode: 'NS001',
          personnelName: 'Nguyễn Văn An',
          role: 'supervisor',
          note: 'Tổ trưởng ca 1'
        },
        {
          id: 'p2',
          personnelId: '2',
          personnelCode: 'NS002',
          personnelName: 'Trần Thị Bình',
          role: 'worker',
          note: ''
        },
        {
          id: 'p3',
          personnelId: '4',
          personnelCode: 'NS004',
          personnelName: 'Phạm Thị Dung',
          role: 'worker',
          note: ''
        }
      ],
      status: 'draft',
      createdAt: yesterday.toISOString(),
      updatedAt: yesterday.toISOString()
    },
    {
      id: '2',
      code: 'LDP002',
      applicationDate: today.toISOString(),
      factoryId: 'factory-002',
      factoryName: 'Nhà máy B - Hồ Chí Minh',
      productionShiftId: 'shift-002',
      productionShiftName: 'Ca 2 - 16:00-00:00',
      departmentId: 'dept-002',
      departmentName: 'Kho',
      personnel: [
        {
          id: 'p4',
          personnelId: '2',
          personnelCode: 'NS002',
          personnelName: 'Trần Thị Bình',
          role: 'supervisor',
          note: ''
        },
        {
          id: 'p5',
          personnelId: '8',
          personnelCode: 'NS008',
          personnelName: 'Bùi Thị Hoa',
          role: 'worker',
          note: ''
        }
      ],
      status: 'approved',
      createdAt: yesterday.toISOString(),
      updatedAt: yesterday.toISOString()
    },
    {
      id: '3',
      code: 'LDP003',
      applicationDate: tomorrow.toISOString(),
      factoryId: 'factory-001',
      factoryName: 'Nhà máy A - Hà Nội',
      productionShiftId: 'shift-003',
      productionShiftName: 'Ca 3 - 00:00-08:00',
      departmentId: 'dept-001',
      departmentName: 'Sản xuất',
      personnel: [
        {
          id: 'p6',
          personnelId: '1',
          personnelCode: 'NS001',
          personnelName: 'Nguyễn Văn An',
          role: 'supervisor',
          note: ''
        },
        {
          id: 'p7',
          personnelId: '7',
          personnelCode: 'NS007',
          personnelName: 'Đặng Văn Giang',
          role: 'worker',
          note: ''
        }
      ],
      status: 'applied',
      createdAt: yesterday.toISOString(),
      updatedAt: yesterday.toISOString()
    }
  ];
}

/**
 * Get a single mock workforce dispatch order by ID
 */
export function getMockWorkforceDispatchOrder(id: string): WorkforceDispatchOrder | null {
  const orders = getMockWorkforceDispatchOrders();
  return orders.find((order) => order.id === id) || null;
}
