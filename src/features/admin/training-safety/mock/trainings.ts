// ==============================|| TRAINING & SAFETY MOCK DATA ||============================== //

import type { Training } from '../types/entity';

/**
 * Mock Training data for development and testing
 */
export function getMockTrainings(): Training[] {
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
      name: 'Đào tạo An toàn lao động cơ bản',
      type: 'safety',
      department: 'production',
      startDate: formatDate(currentYear, currentMonth, currentDate - 10),
      endDate: formatDate(currentYear, currentMonth, currentDate - 5),
      participantCount: 25,
      status: 'completed',
      createdAt: formatDate(currentYear, currentMonth, currentDate - 15),
      updatedAt: formatDate(currentYear, currentMonth, currentDate - 5)
    },
    {
      id: '2',
      name: 'Kỹ năng vận hành máy móc',
      type: 'skill',
      department: 'production',
      startDate: formatDate(currentYear, currentMonth, currentDate - 3),
      endDate: formatDate(currentYear, currentMonth, currentDate + 1),
      participantCount: 15,
      status: 'completed',
      createdAt: formatDate(currentYear, currentMonth, currentDate - 8),
      updatedAt: formatDate(currentYear, currentMonth, currentDate + 1)
    },
    {
      id: '3',
      name: 'An toàn khi làm việc với hóa chất',
      type: 'safety',
      department: 'qc',
      startDate: formatDate(currentYear, currentMonth, currentDate + 2),
      endDate: formatDate(currentYear, currentMonth, currentDate + 4),
      participantCount: 10,
      status: 'open',
      createdAt: formatDate(currentYear, currentMonth, currentDate - 7),
      updatedAt: formatDate(currentYear, currentMonth, currentDate - 7)
    },
    {
      id: '4',
      name: 'Kỹ năng quản lý kho',
      type: 'skill',
      department: 'warehouse',
      startDate: formatDate(currentYear, currentMonth, currentDate + 5),
      endDate: formatDate(currentYear, currentMonth, currentDate + 8),
      participantCount: 8,
      status: 'open',
      createdAt: formatDate(currentYear, currentMonth, currentDate - 5),
      updatedAt: formatDate(currentYear, currentMonth, currentDate - 5)
    },
    {
      id: '5',
      name: 'Đào tạo An toàn PCCC',
      type: 'safety',
      department: 'production',
      startDate: formatDate(currentYear, currentMonth, currentDate + 10),
      endDate: formatDate(currentYear, currentMonth, currentDate + 12),
      participantCount: 30,
      status: 'open',
      createdAt: formatDate(currentYear, currentMonth, currentDate - 3),
      updatedAt: formatDate(currentYear, currentMonth, currentDate - 3)
    },
    {
      id: '6',
      name: 'Kỹ năng giao tiếp và làm việc nhóm',
      type: 'skill',
      department: 'hr',
      startDate: formatDate(currentYear, currentMonth, currentDate + 15),
      endDate: formatDate(currentYear, currentMonth, currentDate + 17),
      participantCount: 20,
      status: 'open',
      createdAt: formatDate(currentYear, currentMonth, currentDate - 2),
      updatedAt: formatDate(currentYear, currentMonth, currentDate - 2)
    },
    {
      id: '7',
      name: 'An toàn điện',
      type: 'safety',
      department: 'production',
      startDate: formatDate(currentYear, currentMonth, currentDate + 20),
      endDate: formatDate(currentYear, currentMonth, currentDate + 22),
      participantCount: 18,
      status: 'open',
      createdAt: formatDate(currentYear, currentMonth, currentDate - 1),
      updatedAt: formatDate(currentYear, currentMonth, currentDate - 1)
    },
    {
      id: '8',
      name: 'Kỹ năng sử dụng phần mềm quản lý',
      type: 'skill',
      department: 'admin',
      startDate: formatDate(currentYear, currentMonth, currentDate - 7),
      endDate: formatDate(currentYear, currentMonth, currentDate - 5),
      participantCount: 12,
      status: 'completed',
      createdAt: formatDate(currentYear, currentMonth, currentDate - 12),
      updatedAt: formatDate(currentYear, currentMonth, currentDate - 5)
    },
    {
      id: '9',
      name: 'Đào tạo An toàn vận hành thiết bị',
      type: 'safety',
      department: 'production',
      startDate: formatDate(currentYear, currentMonth, currentDate + 25),
      endDate: formatDate(currentYear, currentMonth, currentDate + 27),
      participantCount: 22,
      status: 'open',
      createdAt: formatDate(currentYear, currentMonth, currentDate),
      updatedAt: formatDate(currentYear, currentMonth, currentDate)
    },
    {
      id: '10',
      name: 'Kỹ năng kiểm tra chất lượng',
      type: 'skill',
      department: 'qc',
      startDate: formatDate(currentYear, currentMonth, currentDate + 30),
      endDate: formatDate(currentYear, currentMonth, currentDate + 32),
      participantCount: 14,
      status: 'open',
      createdAt: formatDate(currentYear, currentMonth, currentDate + 1),
      updatedAt: formatDate(currentYear, currentMonth, currentDate + 1)
    },
    {
      id: '11',
      name: 'An toàn khi làm việc trên cao',
      type: 'safety',
      department: 'warehouse',
      startDate: formatDate(currentYear, currentMonth + 1, 5),
      endDate: formatDate(currentYear, currentMonth + 1, 7),
      participantCount: 16,
      status: 'open',
      createdAt: formatDate(currentYear, currentMonth, currentDate + 2),
      updatedAt: formatDate(currentYear, currentMonth, currentDate + 2)
    },
    {
      id: '12',
      name: 'Kỹ năng quản lý thời gian',
      type: 'skill',
      department: 'hr',
      startDate: formatDate(currentYear, currentMonth + 1, 10),
      endDate: formatDate(currentYear, currentMonth + 1, 12),
      participantCount: 25,
      status: 'open',
      createdAt: formatDate(currentYear, currentMonth, currentDate + 3),
      updatedAt: formatDate(currentYear, currentMonth, currentDate + 3)
    },
    {
      id: '13',
      name: 'Đào tạo An toàn hóa chất nguy hiểm',
      type: 'safety',
      department: 'qc',
      startDate: formatDate(currentYear, currentMonth + 1, 15),
      endDate: formatDate(currentYear, currentMonth + 1, 17),
      participantCount: 12,
      status: 'open',
      createdAt: formatDate(currentYear, currentMonth, currentDate + 4),
      updatedAt: formatDate(currentYear, currentMonth, currentDate + 4)
    },
    {
      id: '14',
      name: 'Kỹ năng báo cáo và ghi chép',
      type: 'skill',
      department: 'admin',
      startDate: formatDate(currentYear, currentMonth + 1, 20),
      endDate: formatDate(currentYear, currentMonth + 1, 22),
      participantCount: 18,
      status: 'open',
      createdAt: formatDate(currentYear, currentMonth, currentDate + 5),
      updatedAt: formatDate(currentYear, currentMonth, currentDate + 5)
    },
    {
      id: '15',
      name: 'An toàn máy móc công nghiệp',
      type: 'safety',
      department: 'production',
      startDate: formatDate(currentYear, currentMonth + 1, 25),
      endDate: formatDate(currentYear, currentMonth + 1, 27),
      participantCount: 28,
      status: 'open',
      createdAt: formatDate(currentYear, currentMonth, currentDate + 6),
      updatedAt: formatDate(currentYear, currentMonth, currentDate + 6)
    }
  ];
}

/**
 * Get a single mock training by ID
 */
export function getMockTraining(id: string): Training | null {
  const trainings = getMockTrainings();
  return trainings.find((training) => training.id === id) || null;
}
