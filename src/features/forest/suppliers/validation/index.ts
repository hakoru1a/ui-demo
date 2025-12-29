// ==============================|| SUPPLIER VALIDATION SCHEMA ||============================== //

import * as yup from 'yup';

import type { SupplierFormData } from '../types/form';

/**
 * Phone number validation regex (Vietnamese format)
 * Supports: 0xxxxxxxxx, +84xxxxxxxxx, 84xxxxxxxxx
 */
const phoneRegex = /^(\+84|84|0)(3|5|7|8|9)([0-9]{8})$/;

/**
 * Email validation regex
 */
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Validation schema for Supplier form
 * Using Yup for schema validation
 */
export const supplierSchema = yup.object<SupplierFormData>().shape({
  code: yup.string().required('Mã nhà cung cấp là bắt buộc'),

  name: yup
    .string()
    .required('Tên nhà cung cấp là bắt buộc')
    .min(2, 'Tên nhà cung cấp phải có ít nhất 2 ký tự')
    .max(200, 'Tên nhà cung cấp không được quá 200 ký tự'),

  type: yup.string().oneOf(['individual', 'business'], 'Loại nhà cung cấp không hợp lệ').required('Loại nhà cung cấp là bắt buộc'),

  representative: yup.string().when('type', {
    is: 'business',
    then: (schema) => schema.required('Người đại diện là bắt buộc khi loại nhà cung cấp là Doanh nghiệp'),
    otherwise: (schema) => schema.optional()
  }),

  phone: yup
    .string()
    .required('Số điện thoại là bắt buộc')
    .matches(phoneRegex, 'Số điện thoại không đúng định dạng (ví dụ: 0912345678, +84912345678)'),

  email: yup.string().optional().matches(emailRegex, 'Email không đúng định dạng'),

  address: yup.string().max(500, 'Địa chỉ không được quá 500 ký tự').optional(),

  region: yup.string().required('Khu vực cung cấp là bắt buộc'),

  status: yup.string().oneOf(['active', 'inactive'], 'Trạng thái không hợp lệ').required('Trạng thái là bắt buộc'),

  certificates: yup
    .array()
    .of(yup.string().oneOf(['FSC', 'PEFC']))
    .default([]),

  notes: yup.string().max(1000, 'Ghi chú không được quá 1000 ký tự').optional()
});

/**
 * Default values for Supplier form
 */
export const supplierDefaultValues: SupplierFormData = {
  code: '',
  name: '',
  type: 'individual',
  representative: undefined,
  phone: '',
  email: undefined,
  address: undefined,
  region: '',
  status: 'active',
  certificates: [],
  notes: ''
};

/**
 * Type inference from schema
 */
export type SupplierSchemaType = yup.InferType<typeof supplierSchema>;
