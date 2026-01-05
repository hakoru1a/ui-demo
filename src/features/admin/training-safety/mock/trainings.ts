// ==============================|| TRAINING & SAFETY MOCK DATA ||============================== //

import type { Training } from '../types/entity';

/**
 * Mock Training data for development and testing
 */
export function getMockTrainings(): Training[] {
  return [
    {
      id: '1',
      name: 'Đào tạo An toàn lao động cơ bản',
      type: 'safety',
      department: 'production',
      startDate: '2024-01-15',
      endDate: '2024-01-20',
      participantCount: 25,
      status: 'completed',
      createdAt: '2024-01-10',
      updatedAt: '2024-01-20'
    },
    {
      id: '2',
      name: 'Kỹ năng vận hành máy móc',
      type: 'skill',
      department: 'production',
      startDate: '2024-02-01',
      endDate: '2024-02-05',
      participantCount: 15,
      status: 'completed',
      createdAt: '2024-01-25',
      updatedAt: '2024-02-05'
    },
    {
      id: '3',
      name: 'An toàn khi làm việc với hóa chất',
      type: 'safety',
      department: 'qc',
      startDate: '2024-03-10',
      endDate: '2024-03-12',
      participantCount: 10,
      status: 'open',
      createdAt: '2024-03-01',
      updatedAt: '2024-03-01'
    },
    {
      id: '4',
      name: 'Kỹ năng quản lý kho',
      type: 'skill',
      department: 'warehouse',
      startDate: '2024-03-15',
      endDate: '2024-03-18',
      participantCount: 8,
      status: 'open',
      createdAt: '2024-03-05',
      updatedAt: '2024-03-05'
    },
    {
      id: '5',
      name: 'Đào tạo An toàn PCCC',
      type: 'safety',
      department: 'production',
      startDate: '2024-02-20',
      endDate: '2024-02-22',
      participantCount: 30,
      status: 'cancelled',
      createdAt: '2024-02-15',
      updatedAt: '2024-02-19'
    },
    {
      id: '6',
      name: 'Kỹ năng giao tiếp và làm việc nhóm',
      type: 'skill',
      department: 'hr',
      startDate: '2024-04-01',
      endDate: '2024-04-03',
      participantCount: 20,
      status: 'open',
      createdAt: '2024-03-20',
      updatedAt: '2024-03-20'
    },
    {
      id: '7',
      name: 'An toàn điện',
      type: 'safety',
      department: 'production',
      startDate: '2024-04-10',
      endDate: '2024-04-12',
      participantCount: 18,
      status: 'open',
      createdAt: '2024-03-25',
      updatedAt: '2024-03-25'
    },
    {
      id: '8',
      name: 'Kỹ năng sử dụng phần mềm quản lý',
      type: 'skill',
      department: 'admin',
      startDate: '2024-03-25',
      endDate: '2024-03-27',
      participantCount: 12,
      status: 'completed',
      createdAt: '2024-03-15',
      updatedAt: '2024-03-27'
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
