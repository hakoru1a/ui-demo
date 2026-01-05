// ==============================|| COMPLAINTS MOCK DATA ||============================== //

import type { Complaint } from '../types/entity';

/**
 * Mock Complaint data for development and testing
 */
export function getMockComplaints(): Complaint[] {
  return [
    {
      id: '1',
      code: 'KN001',
      sender: 'Nguyễn Văn A',
      relatedEmployeeId: '1',
      relatedEmployeeName: 'Nguyễn Văn A',
      type: 'labor',
      receivedDate: '2024-01-15',
      status: 'new',
      description: 'Khiếu nại về điều kiện làm việc',
      createdAt: '2024-01-15',
      updatedAt: '2024-01-15'
    },
    {
      id: '2',
      code: 'KN002',
      sender: 'Trần Thị B',
      relatedEmployeeId: '2',
      relatedEmployeeName: 'Trần Thị B',
      type: 'production',
      receivedDate: '2024-01-20',
      status: 'processing',
      description: 'Khiếu nại về chất lượng sản phẩm',
      createdAt: '2024-01-20',
      updatedAt: '2024-01-22'
    },
    {
      id: '3',
      code: 'KN003',
      sender: 'Lê Văn C',
      relatedEmployeeId: '3',
      relatedEmployeeName: 'Lê Văn C',
      type: 'safety',
      receivedDate: '2024-02-01',
      status: 'resolved',
      description: 'Khiếu nại về an toàn lao động',
      resolution: 'Đã xử lý và cải thiện điều kiện an toàn',
      createdAt: '2024-02-01',
      updatedAt: '2024-02-05'
    },
    {
      id: '4',
      code: 'KN004',
      sender: 'Phạm Thị D',
      type: 'labor',
      receivedDate: '2024-02-10',
      status: 'new',
      description: 'Khiếu nại về lương thưởng',
      createdAt: '2024-02-10',
      updatedAt: '2024-02-10'
    },
    {
      id: '5',
      code: 'KN005',
      sender: 'Hoàng Văn E',
      relatedEmployeeId: '4',
      relatedEmployeeName: 'Hoàng Văn E',
      type: 'production',
      receivedDate: '2024-02-15',
      status: 'processing',
      description: 'Khiếu nại về quy trình sản xuất',
      createdAt: '2024-02-15',
      updatedAt: '2024-02-18'
    },
    {
      id: '6',
      code: 'KN006',
      sender: 'Vũ Thị F',
      type: 'safety',
      receivedDate: '2024-03-01',
      status: 'resolved',
      description: 'Khiếu nại về thiết bị bảo hộ',
      resolution: 'Đã cung cấp thiết bị bảo hộ mới',
      createdAt: '2024-03-01',
      updatedAt: '2024-03-03'
    }
  ];
}

/**
 * Get a single mock complaint by ID
 */
export function getMockComplaint(id: string): Complaint | null {
  const complaints = getMockComplaints();
  return complaints.find((complaint) => complaint.id === id) || null;
}
