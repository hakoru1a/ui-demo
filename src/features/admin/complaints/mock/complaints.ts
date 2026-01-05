// ==============================|| COMPLAINTS MOCK DATA ||============================== //

import type { Complaint } from '../types/entity';

/**
 * Mock Complaint data for development and testing
 */
export function getMockComplaints(): Complaint[] {
  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth();
  const currentDate = today.getDate();

  // Helper function to format date
  const formatDate = (year: number, month: number, date: number): string => {
    const d = new Date(year, month, date);
    return d.toISOString().split('T')[0];
  };

  return [
    {
      id: '1',
      code: 'KN001',
      sender: 'Nguyễn Văn A',
      relatedEmployeeId: '1',
      relatedEmployeeName: 'Nguyễn Văn A',
      type: 'labor',
      receivedDate: formatDate(currentYear, currentMonth, currentDate - 15),
      status: 'new',
      description: 'Khiếu nại về điều kiện làm việc',
      createdAt: formatDate(currentYear, currentMonth, currentDate - 15),
      updatedAt: formatDate(currentYear, currentMonth, currentDate - 15)
    },
    {
      id: '2',
      code: 'KN002',
      sender: 'Trần Thị B',
      relatedEmployeeId: '2',
      relatedEmployeeName: 'Trần Thị B',
      type: 'production',
      receivedDate: formatDate(currentYear, currentMonth, currentDate - 10),
      status: 'processing',
      description: 'Khiếu nại về chất lượng sản phẩm',
      createdAt: formatDate(currentYear, currentMonth, currentDate - 10),
      updatedAt: formatDate(currentYear, currentMonth, currentDate - 8)
    },
    {
      id: '3',
      code: 'KN003',
      sender: 'Lê Văn C',
      relatedEmployeeId: '3',
      relatedEmployeeName: 'Lê Văn C',
      type: 'safety',
      receivedDate: formatDate(currentYear, currentMonth, currentDate - 5),
      status: 'resolved',
      description: 'Khiếu nại về an toàn lao động',
      resolution: 'Đã xử lý và cải thiện điều kiện an toàn',
      createdAt: formatDate(currentYear, currentMonth, currentDate - 5),
      updatedAt: formatDate(currentYear, currentMonth, currentDate - 1)
    },
    {
      id: '4',
      code: 'KN004',
      sender: 'Phạm Thị D',
      type: 'labor',
      receivedDate: formatDate(currentYear, currentMonth, currentDate - 2),
      status: 'new',
      description: 'Khiếu nại về lương thưởng',
      createdAt: formatDate(currentYear, currentMonth, currentDate - 2),
      updatedAt: formatDate(currentYear, currentMonth, currentDate - 2)
    },
    {
      id: '5',
      code: 'KN005',
      sender: 'Hoàng Văn E',
      relatedEmployeeId: '4',
      relatedEmployeeName: 'Hoàng Văn E',
      type: 'production',
      receivedDate: formatDate(currentYear, currentMonth, currentDate),
      status: 'processing',
      description: 'Khiếu nại về quy trình sản xuất',
      createdAt: formatDate(currentYear, currentMonth, currentDate),
      updatedAt: formatDate(currentYear, currentMonth, currentDate + 1)
    },
    {
      id: '6',
      code: 'KN006',
      sender: 'Vũ Thị F',
      type: 'safety',
      receivedDate: formatDate(currentYear, currentMonth, currentDate + 3),
      status: 'resolved',
      description: 'Khiếu nại về thiết bị bảo hộ',
      resolution: 'Đã cung cấp thiết bị bảo hộ mới',
      createdAt: formatDate(currentYear, currentMonth, currentDate + 3),
      updatedAt: formatDate(currentYear, currentMonth, currentDate + 5)
    },
    {
      id: '7',
      code: 'KN007',
      sender: 'Đỗ Văn G',
      relatedEmployeeId: '5',
      relatedEmployeeName: 'Đỗ Văn G',
      type: 'labor',
      receivedDate: formatDate(currentYear, currentMonth, currentDate + 5),
      status: 'processing',
      description: 'Khiếu nại về giờ làm việc',
      createdAt: formatDate(currentYear, currentMonth, currentDate + 5),
      updatedAt: formatDate(currentYear, currentMonth, currentDate + 6)
    },
    {
      id: '8',
      code: 'KN008',
      sender: 'Bùi Thị H',
      type: 'production',
      receivedDate: formatDate(currentYear, currentMonth, currentDate + 7),
      status: 'processing',
      description: 'Khiếu nại về máy móc hỏng',
      createdAt: formatDate(currentYear, currentMonth, currentDate + 7),
      updatedAt: formatDate(currentYear, currentMonth, currentDate + 8)
    },
    {
      id: '9',
      code: 'KN009',
      sender: 'Lý Văn I',
      relatedEmployeeId: '6',
      relatedEmployeeName: 'Lý Văn I',
      type: 'safety',
      receivedDate: formatDate(currentYear, currentMonth, currentDate + 10),
      status: 'processing',
      description: 'Khiếu nại về thiếu thiết bị an toàn',
      createdAt: formatDate(currentYear, currentMonth, currentDate + 10),
      updatedAt: formatDate(currentYear, currentMonth, currentDate + 11)
    },
    {
      id: '10',
      code: 'KN010',
      sender: 'Trương Thị K',
      type: 'labor',
      receivedDate: formatDate(currentYear, currentMonth, currentDate + 12),
      status: 'processing',
      description: 'Khiếu nại về môi trường làm việc',
      createdAt: formatDate(currentYear, currentMonth, currentDate + 12),
      updatedAt: formatDate(currentYear, currentMonth, currentDate + 13)
    },
    {
      id: '11',
      code: 'KN011',
      sender: 'Ngô Văn L',
      relatedEmployeeId: '7',
      relatedEmployeeName: 'Ngô Văn L',
      type: 'production',
      receivedDate: formatDate(currentYear, currentMonth, currentDate + 15),
      status: 'processing',
      description: 'Khiếu nại về nguyên vật liệu',
      createdAt: formatDate(currentYear, currentMonth, currentDate + 15),
      updatedAt: formatDate(currentYear, currentMonth, currentDate + 16)
    },
    {
      id: '12',
      code: 'KN012',
      sender: 'Phan Thị M',
      type: 'safety',
      receivedDate: formatDate(currentYear, currentMonth, currentDate + 18),
      status: 'processing',
      description: 'Khiếu nại về an toàn vệ sinh lao động',
      createdAt: formatDate(currentYear, currentMonth, currentDate + 18),
      updatedAt: formatDate(currentYear, currentMonth, currentDate + 19)
    },
    {
      id: '13',
      code: 'KN013',
      sender: 'Võ Văn N',
      relatedEmployeeId: '8',
      relatedEmployeeName: 'Võ Văn N',
      type: 'labor',
      receivedDate: formatDate(currentYear, currentMonth + 1, 2),
      status: 'processing',
      description: 'Khiếu nại về chế độ phúc lợi',
      createdAt: formatDate(currentYear, currentMonth + 1, 2),
      updatedAt: formatDate(currentYear, currentMonth + 1, 3)
    },
    {
      id: '14',
      code: 'KN014',
      sender: 'Đinh Thị O',
      type: 'production',
      receivedDate: formatDate(currentYear, currentMonth + 1, 5),
      status: 'processing',
      description: 'Khiếu nại về quy trình kiểm tra',
      createdAt: formatDate(currentYear, currentMonth + 1, 5),
      updatedAt: formatDate(currentYear, currentMonth + 1, 6)
    },
    {
      id: '15',
      code: 'KN015',
      sender: 'Hồ Văn P',
      relatedEmployeeId: '9',
      relatedEmployeeName: 'Hồ Văn P',
      type: 'safety',
      receivedDate: formatDate(currentYear, currentMonth + 1, 8),
      status: 'processing',
      description: 'Khiếu nại về an toàn thiết bị',
      createdAt: formatDate(currentYear, currentMonth + 1, 8),
      updatedAt: formatDate(currentYear, currentMonth + 1, 9)
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
