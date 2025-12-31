// ==============================|| CUSTOMER VALIDATION SCHEMA ||============================== //

import * as yup from 'yup';

import type { CustomerFormData } from '../types/form';

/**
 * Email validation regex
 */
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Validation schema for Customer form
 * Using Yup for schema validation
 */
export const customerSchema = yup.object<CustomerFormData>().shape({
  code: yup.string().required('Mã khách hàng là bắt buộc'),

  companyName: yup
    .string()
    .required('Tên công ty là bắt buộc')
    .min(2, 'Tên công ty phải có ít nhất 2 ký tự')
    .max(200, 'Tên công ty không được quá 200 ký tự'),

  country: yup.string().required('Quốc gia là bắt buộc'),

  address: yup
    .string()
    .required('Địa chỉ là bắt buộc')
    .min(5, 'Địa chỉ phải có ít nhất 5 ký tự')
    .max(500, 'Địa chỉ không được quá 500 ký tự'),

  taxCode: yup.string().max(50, 'Mã thuế không được quá 50 ký tự').optional(),

  contactPerson: yup
    .string()
    .required('Người liên hệ là bắt buộc')
    .min(2, 'Người liên hệ phải có ít nhất 2 ký tự')
    .max(100, 'Người liên hệ không được quá 100 ký tự'),

  email: yup.string().required('Email là bắt buộc').matches(emailRegex, 'Email không đúng định dạng'),

  phone: yup.string().max(20, 'Số điện thoại không được quá 20 ký tự').optional(),

  currency: yup.string().required('Tiền tệ là bắt buộc'),

  paymentTerms: yup.string().oneOf(['TT', 'LC', 'DP', 'CAD', 'OA'], 'Điều khoản thanh toán không hợp lệ').optional(),

  creditLimit: yup.number().min(0, 'Hạn mức tín dụng phải lớn hơn hoặc bằng 0').typeError('Hạn mức tín dụng phải là số').optional(),

  status: yup.string().oneOf(['active', 'inactive'], 'Trạng thái không hợp lệ').required('Trạng thái là bắt buộc'),

  notes: yup.string().max(1000, 'Ghi chú không được quá 1000 ký tự').optional()
});

/**
 * Default values for Customer form
 */
export const customerDefaultValues: CustomerFormData = {
  code: '',
  companyName: '',
  country: '',
  address: '',
  taxCode: undefined,
  contactPerson: '',
  email: '',
  phone: undefined,
  currency: 'USD',
  paymentTerms: undefined,
  creditLimit: undefined,
  status: 'active',
  notes: ''
};

/**
 * Type inference from schema
 */
export type CustomerSchemaType = yup.InferType<typeof customerSchema>;
