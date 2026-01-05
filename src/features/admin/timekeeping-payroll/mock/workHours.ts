// ==============================|| TIMEKEEPING MOCK DATA - WORK HOURS ||============================== //

import type { WorkHour } from '../types/index';

// Generate more work hours for January 2024 (01/2024) for payroll calculation
const generateWorkHours = (): WorkHour[] => {
  const hours: WorkHour[] = [];

  // Employee 1 (NV001) - January 2024
  for (let i = 0; i < 22; i++) {
    hours.push({
      id: `hour-emp1-${i + 1}`,
      employeeId: 'emp-1',
      employeeCode: 'NV001',
      employeeName: 'Nguyễn Văn A',
      workDate: `2024-01-${String(i + 1).padStart(2, '0')}`,
      regularHours: 8,
      overtimeHours: i % 5 === 0 ? 4 : 0, // Some days have overtime
      totalHours: i % 5 === 0 ? 12 : 8,
      status: 'confirmed',
      notes: i % 5 === 0 ? 'Có tăng ca' : undefined
    });
  }

  // Employee 2 (NV002) - January 2024
  for (let i = 0; i < 22; i++) {
    hours.push({
      id: `hour-emp2-${i + 1}`,
      employeeId: 'emp-2',
      employeeCode: 'NV002',
      employeeName: 'Trần Thị B',
      workDate: `2024-01-${String(i + 1).padStart(2, '0')}`,
      regularHours: 8,
      overtimeHours: 0,
      totalHours: 8,
      status: i < 20 ? 'confirmed' : 'pending'
    });
  }

  // Employee 3 (NV003) - January 2024
  for (let i = 0; i < 20; i++) {
    hours.push({
      id: `hour-emp3-${i + 1}`,
      employeeId: 'emp-3',
      employeeCode: 'NV003',
      employeeName: 'Lê Văn C',
      workDate: `2024-01-${String(i + 1).padStart(2, '0')}`,
      regularHours: 8,
      overtimeHours: i % 7 === 0 ? 2 : 0,
      totalHours: i % 7 === 0 ? 10 : 8,
      status: 'confirmed'
    });
  }

  // Employee 4 (NV004) - January 2024
  for (let i = 0; i < 23; i++) {
    hours.push({
      id: `hour-emp4-${i + 1}`,
      employeeId: 'emp-4',
      employeeCode: 'NV004',
      employeeName: 'Phạm Văn D',
      workDate: `2024-01-${String(i + 1).padStart(2, '0')}`,
      regularHours: 8,
      overtimeHours: i % 6 === 0 ? 4 : 0,
      totalHours: i % 6 === 0 ? 12 : 8,
      status: i < 18 ? 'confirmed' : 'pending'
    });
  }

  return hours;
};

export const mockWorkHours: WorkHour[] = generateWorkHours();
