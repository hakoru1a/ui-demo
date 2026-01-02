// ==============================|| PARTNER VALIDATION SCHEMA ||============================== //

import * as yup from 'yup';

import type { PartnerFormData } from '../types/form';

/**
 * Phone number validation regex (Vietnamese format)
 * Supports: 0xxxxxxxxx, +84xxxxxxxxx, 84xxxxxxxxx
 */
const phoneRegex = /^(\+84|84|0)(3|5|7|8|9)([0-9]{8})$/;

/**
 * Validation schema for Partner form
 * Using Yup for schema validation
 */
export const partnerSchema = yup.object<PartnerFormData>().shape({
  code: yup.string().required('Mã khách hàng là bắt buộc'),

  name: yup
    .string()
    .required('Tên khách hàng là bắt buộc')
    .min(2, 'Tên khách hàng phải có ít nhất 2 ký tự')
    .max(200, 'Tên khách hàng không được quá 200 ký tự'),

  type: yup.string().oneOf(['individual', 'business'], 'Loại đối tượng không hợp lệ').required('Loại đối tượng là bắt buộc'),

  representative: yup.string().when('type', {
    is: 'business',
    then: (schema) => schema.required('Người đại diện là bắt buộc khi loại đối tượng là Doanh nghiệp'),
    otherwise: (schema) => schema.optional()
  }),

  phone: yup
    .string()
    .required('Số điện thoại là bắt buộc')
    .matches(phoneRegex, 'Số điện thoại không đúng định dạng (ví dụ: 0912345678, +84912345678)'),

  address: yup.string().max(500, 'Địa chỉ không được quá 500 ký tự').optional(),

  status: yup.string().oneOf(['active', 'inactive'], 'Trạng thái không hợp lệ').required('Trạng thái là bắt buộc'),

  notes: yup.string().max(1000, 'Ghi chú không được quá 1000 ký tự').optional()
});

/**
 * Default values for Partner form
 */
export const partnerDefaultValues: PartnerFormData = {
  code: '',
  name: '',
  type: 'individual',
  representative: undefined,
  phone: '',
  address: undefined,
  status: 'active',
  notes: ''
};

/**
 * Type inference from schema
 */
export type PartnerSchemaType = yup.InferType<typeof partnerSchema>;
