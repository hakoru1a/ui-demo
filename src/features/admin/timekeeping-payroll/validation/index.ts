// ==============================|| TIMEKEEPING PAYROLL VALIDATION SCHEMA ||============================== //

import * as yup from 'yup';

import type { WorkShiftFormData } from '../types/form';

/**
 * Validation schema for WorkShift form
 * Using Yup for schema validation
 */
export const workShiftSchema = yup.object<WorkShiftFormData>().shape({
  employeeId: yup.string().required('Nhân viên là bắt buộc'),
  employeeCode: yup.string(),
  employeeName: yup.string().required('Tên nhân viên là bắt buộc').min(2, 'Tên nhân viên phải có ít nhất 2 ký tự'),
  shiftType: yup.string().oneOf(['morning', 'afternoon', 'night', 'overtime'], 'Loại ca không hợp lệ').required('Loại ca là bắt buộc'),
  workDate: yup.date().required('Ngày làm việc là bắt buộc').nullable(),
  startTime: yup.date().required('Thời gian bắt đầu là bắt buộc').nullable(),
  endTime: yup
    .date()
    .required('Thời gian kết thúc là bắt buộc')
    .nullable()
    .min(yup.ref('startTime'), 'Thời gian kết thúc phải sau thời gian bắt đầu'),
  status: yup.string().oneOf(['pending', 'confirmed', 'locked'], 'Trạng thái không hợp lệ').required('Trạng thái là bắt buộc'),
  notes: yup.string().max(500, 'Ghi chú không được quá 500 ký tự')
});

/**
 * Default values for WorkShift form
 */
export const workShiftDefaultValues: WorkShiftFormData = {
  employeeId: '',
  employeeCode: '',
  employeeName: '',
  shiftType: 'morning',
  workDate: new Date(),
  startTime: new Date(),
  endTime: new Date(),
  status: 'pending',
  notes: ''
};

/**
 * Type inference from schema
 */
export type WorkShiftSchemaType = yup.InferType<typeof workShiftSchema>;
