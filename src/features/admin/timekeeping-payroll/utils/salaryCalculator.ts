// ==============================|| SALARY CALCULATOR UTILITY ||============================== //

import type { WorkHour } from '../types/index';

/**
 * Employee Salary Configuration
 * Cấu hình lương cho nhân viên
 */
export interface EmployeeSalaryConfig {
  employeeId: string;
  baseSalary: number; // Lương cơ bản (VNĐ/tháng)
  salaryCoefficient: number; // Hệ số lương
  hourlyRate: number; // Đơn giá giờ công thường (tính từ baseSalary / 176 giờ)
  overtimeRate: number; // Đơn giá giờ tăng ca (thường = hourlyRate * 1.5)
  deductionRate: number; // Tỷ lệ khấu trừ (BHXH, BHYT, BHTN) - thường là 10.5%
}

/**
 * Payroll Calculation Result
 * Kết quả tính lương
 */
export interface PayrollCalculationResult {
  employeeId: string;
  employeeCode: string;
  employeeName: string;
  period: string;
  regularHours: number;
  overtimeHours: number;
  totalHours: number;
  baseSalary: number; // Lương cơ bản theo hệ số
  overtimePay: number; // Lương tăng ca
  totalSalary: number; // Tổng lương
  deductions: number; // Các khoản khấu trừ
  netSalary: number; // Lương thực nhận
}

/**
 * Default salary configurations for employees
 * Mock data - TODO: Replace with API call
 */
export const EMPLOYEE_SALARY_CONFIGS: EmployeeSalaryConfig[] = [
  {
    employeeId: 'emp-1',
    baseSalary: 5000000,
    salaryCoefficient: 1.0,
    hourlyRate: 28409, // 5000000 / 176
    overtimeRate: 42614, // hourlyRate * 1.5
    deductionRate: 0.105 // 10.5%
  },
  {
    employeeId: 'emp-2',
    baseSalary: 4500000,
    salaryCoefficient: 0.9,
    hourlyRate: 25568, // 4500000 / 176
    overtimeRate: 38352, // hourlyRate * 1.5
    deductionRate: 0.105
  },
  {
    employeeId: 'emp-3',
    baseSalary: 4000000,
    salaryCoefficient: 0.8,
    hourlyRate: 22727, // 4000000 / 176
    overtimeRate: 34091, // hourlyRate * 1.5
    deductionRate: 0.105
  },
  {
    employeeId: 'emp-4',
    baseSalary: 4200000,
    salaryCoefficient: 0.84,
    hourlyRate: 23864, // 4200000 / 176
    overtimeRate: 35795, // hourlyRate * 1.5
    deductionRate: 0.105
  },
  {
    employeeId: 'emp-5',
    baseSalary: 4800000,
    salaryCoefficient: 0.96,
    hourlyRate: 27273, // 4800000 / 176
    overtimeRate: 40909, // hourlyRate * 1.5
    deductionRate: 0.105
  }
];

/**
 * Get salary config for an employee
 */
export const getEmployeeSalaryConfig = (employeeId: string): EmployeeSalaryConfig | undefined => {
  return EMPLOYEE_SALARY_CONFIGS.find((config) => config.employeeId === employeeId);
};

/**
 * Calculate payroll for an employee based on work hours
 * Tính lương cho nhân viên dựa trên giờ công
 */
export const calculatePayroll = (
  employeeId: string,
  employeeCode: string,
  employeeName: string,
  period: string,
  workHours: WorkHour[],
  salaryConfig?: EmployeeSalaryConfig
): PayrollCalculationResult | null => {
  // Get salary config
  const config = salaryConfig || getEmployeeSalaryConfig(employeeId);
  if (!config) {
    console.warn(`No salary config found for employee ${employeeId}`);
    return null;
  }

  // Filter work hours for the period and confirmed status
  const periodWorkHours = workHours.filter((hour) => {
    const hourDate = new Date(hour.workDate);
    const [month, year] = period.split('/');
    return (
      hour.employeeId === employeeId &&
      hour.status === 'confirmed' &&
      hourDate.getMonth() + 1 === parseInt(month, 10) &&
      hourDate.getFullYear() === parseInt(year, 10)
    );
  });

  // Calculate total hours
  const regularHours = periodWorkHours.reduce((sum, hour) => sum + hour.regularHours, 0);
  const overtimeHours = periodWorkHours.reduce((sum, hour) => sum + hour.overtimeHours, 0);
  const totalHours = regularHours + overtimeHours;

  // Calculate salary
  // Lương cơ bản = baseSalary * (regularHours / 176) - tính theo tỷ lệ giờ công thực tế
  const baseSalary = Math.round((config.baseSalary * regularHours) / 176);

  // Lương tăng ca = overtimeHours * overtimeRate
  const overtimePay = Math.round(overtimeHours * config.overtimeRate);

  // Tổng lương
  const totalSalary = baseSalary + overtimePay;

  // Khấu trừ = totalSalary * deductionRate
  const deductions = Math.round(totalSalary * config.deductionRate);

  // Lương thực nhận
  const netSalary = totalSalary - deductions;

  return {
    employeeId,
    employeeCode,
    employeeName,
    period,
    regularHours,
    overtimeHours,
    totalHours,
    baseSalary,
    overtimePay,
    totalSalary,
    deductions,
    netSalary
  };
};

/**
 * Calculate payroll for multiple employees
 * Tính lương cho nhiều nhân viên
 */
export const calculatePayrollsForPeriod = (
  period: string,
  workHours: WorkHour[],
  employeeIds: string[],
  employeeMap: Map<string, { code: string; name: string }>
): PayrollCalculationResult[] => {
  const results: PayrollCalculationResult[] = [];

  employeeIds.forEach((employeeId) => {
    const employee = employeeMap.get(employeeId);
    if (!employee) return;

    const result = calculatePayroll(employeeId, employee.code, employee.name, period, workHours);
    if (result) {
      results.push(result);
    }
  });

  return results;
};
