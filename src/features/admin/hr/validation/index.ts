// ==============================|| HR VALIDATION SCHEMA ||============================== //

import * as yup from 'yup';

import type { EmployeeFormData } from '../types/form';

/**
 * Validation schema for Employee form
 * Using Yup for schema validation
 */
export const employeeSchema = yup.object<EmployeeFormData>().shape({
  code: yup.string().required('Mã nhân sự là bắt buộc'),

  fullName: yup
    .string()
    .required('Họ & Tên là bắt buộc')
    .min(2, 'Họ & Tên phải có ít nhất 2 ký tự')
    .max(200, 'Họ & Tên không được quá 200 ký tự'),

  department: yup.string().oneOf(['production', 'warehouse', 'qc'], 'Bộ phận không hợp lệ').required('Bộ phận là bắt buộc'),

  position: yup
    .string()
    .required('Chức danh là bắt buộc')
    .min(2, 'Chức danh phải có ít nhất 2 ký tự')
    .max(200, 'Chức danh không được quá 200 ký tự'),

  contractType: yup
    .string()
    .oneOf(['probation', 'temporary', 'permanent'], 'Loại hợp đồng không hợp lệ')
    .required('Loại hợp đồng là bắt buộc'),

  effectiveDate: yup.date().required('Ngày hiệu lực là bắt buộc').nullable(),

  expiryDate: yup
    .date()
    .required('Ngày hết hạn là bắt buộc')
    .nullable()
    .min(yup.ref('effectiveDate'), 'Ngày hết hạn phải sau ngày hiệu lực'),

  status: yup.string().oneOf(['active', 'inactive'], 'Trạng thái không hợp lệ').required('Trạng thái là bắt buộc')
});

/**
 * Default values for Employee form
 */
export const employeeDefaultValues: EmployeeFormData = {
  code: '',
  fullName: '',
  department: 'production',
  position: '',
  contractType: 'probation',
  effectiveDate: undefined,
  expiryDate: undefined,
  status: 'active'
};

/**
 * Type inference from schema
 */
export type EmployeeSchemaType = yup.InferType<typeof employeeSchema>;
