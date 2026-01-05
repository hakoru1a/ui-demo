// ==============================|| TIMEKEEPING MOCK DATA - SHIFTS ||============================== //

import type { WorkShift } from '../types/index';

export const mockShifts: WorkShift[] = [
  {
    id: 'shift-1',
    employeeId: 'emp-1',
    employeeCode: 'NV001',
    employeeName: 'Nguyễn Văn A',
    shiftType: 'morning',
    workDate: '2024-01-15',
    startTime: '2024-01-15T08:00:00',
    endTime: '2024-01-15T16:00:00',
    status: 'confirmed',
    notes: 'Ca sáng bình thường'
  },
  {
    id: 'shift-2',
    employeeId: 'emp-2',
    employeeCode: 'NV002',
    employeeName: 'Trần Thị B',
    shiftType: 'afternoon',
    workDate: '2024-01-15',
    startTime: '2024-01-15T13:00:00',
    endTime: '2024-01-15T21:00:00',
    status: 'confirmed',
    notes: 'Ca chiều'
  },
  {
    id: 'shift-3',
    employeeId: 'emp-3',
    employeeCode: 'NV003',
    employeeName: 'Lê Văn C',
    shiftType: 'night',
    workDate: '2024-01-15',
    startTime: '2024-01-15T22:00:00',
    endTime: '2024-01-16T06:00:00',
    status: 'pending',
    notes: 'Ca đêm'
  },
  {
    id: 'shift-4',
    employeeId: 'emp-1',
    employeeCode: 'NV001',
    employeeName: 'Nguyễn Văn A',
    shiftType: 'overtime',
    workDate: '2024-01-16',
    startTime: '2024-01-16T16:00:00',
    endTime: '2024-01-16T20:00:00',
    status: 'confirmed',
    notes: 'Tăng ca'
  },
  {
    id: 'shift-5',
    employeeId: 'emp-2',
    employeeCode: 'NV002',
    employeeName: 'Trần Thị B',
    shiftType: 'morning',
    workDate: '2024-01-16',
    startTime: '2024-01-16T08:00:00',
    endTime: '2024-01-16T16:00:00',
    status: 'confirmed'
  },
  {
    id: 'shift-6',
    employeeId: 'emp-4',
    employeeCode: 'NV004',
    employeeName: 'Phạm Văn D',
    shiftType: 'afternoon',
    workDate: '2024-01-16',
    startTime: '2024-01-16T13:00:00',
    endTime: '2024-01-16T21:00:00',
    status: 'pending'
  },
  {
    id: 'shift-7',
    employeeId: 'emp-1',
    employeeCode: 'NV001',
    employeeName: 'Nguyễn Văn A',
    shiftType: 'morning',
    workDate: '2024-01-17',
    startTime: '2024-01-17T08:00:00',
    endTime: '2024-01-17T16:00:00',
    status: 'confirmed'
  },
  {
    id: 'shift-8',
    employeeId: 'emp-3',
    employeeCode: 'NV003',
    employeeName: 'Lê Văn C',
    shiftType: 'night',
    workDate: '2024-01-17',
    startTime: '2024-01-17T22:00:00',
    endTime: '2024-01-18T06:00:00',
    status: 'confirmed'
  }
];
