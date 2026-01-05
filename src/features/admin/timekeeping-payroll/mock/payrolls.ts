// ==============================|| PAYROLL MOCK DATA ||============================== //

import type { Payroll } from '../types/index';

export const mockPayrolls: Payroll[] = [
  {
    id: 'payroll-1',
    employeeId: 'emp-1',
    employeeCode: 'NV001',
    employeeName: 'Nguyễn Văn A',
    period: '01/2024',
    regularHours: 176,
    overtimeHours: 20,
    totalHours: 196,
    baseSalary: 5000000,
    overtimePay: 1000000,
    totalSalary: 6000000,
    deductions: 600000,
    netSalary: 5400000,
    status: 'paid',
    notes: 'Đã thanh toán'
  },
  {
    id: 'payroll-2',
    employeeId: 'emp-2',
    employeeCode: 'NV002',
    employeeName: 'Trần Thị B',
    period: '01/2024',
    regularHours: 176,
    overtimeHours: 0,
    totalHours: 176,
    baseSalary: 4500000,
    overtimePay: 0,
    totalSalary: 4500000,
    deductions: 450000,
    netSalary: 4050000,
    status: 'approved'
  },
  {
    id: 'payroll-3',
    employeeId: 'emp-3',
    employeeCode: 'NV003',
    employeeName: 'Lê Văn C',
    period: '01/2024',
    regularHours: 160,
    overtimeHours: 16,
    totalHours: 176,
    baseSalary: 4000000,
    overtimePay: 800000,
    totalSalary: 4800000,
    deductions: 480000,
    netSalary: 4320000,
    status: 'calculated'
  },
  {
    id: 'payroll-4',
    employeeId: 'emp-4',
    employeeCode: 'NV004',
    employeeName: 'Phạm Văn D',
    period: '01/2024',
    regularHours: 176,
    overtimeHours: 8,
    totalHours: 184,
    baseSalary: 4200000,
    overtimePay: 400000,
    totalSalary: 4600000,
    deductions: 460000,
    netSalary: 4140000,
    status: 'draft'
  }
];

export const getMockPayroll = (id: string): Payroll | undefined => {
  return mockPayrolls.find((p) => p.id === id);
};
